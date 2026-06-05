/* AutoViindu Admin */
(function () {
  'use strict';

  const TABS = ['overview', 'leads', 'inventory', 'workspace'];
  const TITLES = { overview: 'Dashboard', leads: 'Leads', inventory: 'Cars', workspace: 'Workspace' };
  const CRUMBS = {
    overview: 'Overview & submissions',
    leads: 'Lead pipeline',
    inventory: 'New & used inventory',
    workspace: 'Team notices & tasks',
  };

  let allData = [];
  let leadStatuses = {};
  let leadFlags = {};
  let leadNotes = {};
  let carAvail = {};
  let teamData = { notices: [], todos: [] };
  let newCars = [];
  let usedCars = [];
  let dirty = false;
  let leadsFilter = 'all';
  let invView = 'grid';
  let invType = 'new';
  let editCtx = null; // { type, idx, isNew }

  const $ = (id) => document.getElementById(id);
  const tok = () => localStorage.getItem('adminToken');

  function toast(msg, type) {
    const wrap = $('toast-wrap') || (() => {
      const d = document.createElement('div');
      d.id = 'toast-wrap';
      d.className = 'toast-wrap';
      document.body.appendChild(d);
      return d;
    })();
    const t = document.createElement('div');
    t.className = 'toast' + (type === 'ok' ? ' ok' : type === 'err' ? ' err' : '');
    t.textContent = msg;
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  async function api(path, opts) {
    opts = opts || {};
    const headers = Object.assign({ Authorization: 'Bearer ' + tok() }, opts.headers || {});
    if (opts.body && !(opts.body instanceof FormData)) headers['Content-Type'] = 'application/json';
    const r = await fetch(path, Object.assign({}, opts, { headers }));
    if (r.status === 401) { localStorage.removeItem('adminToken'); location.href = '/login'; throw new Error('Session expired'); }
    return r;
  }

  function slugify(s) {
    return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function fmtRs(n) {
    if (!n || isNaN(n)) return '—';
    if (n >= 1e7) return 'Rs. ' + (n / 1e7).toFixed(2) + ' Cr';
    return 'Rs. ' + (n / 1e6).toFixed(2) + ' L';
  }

  function markDirty(v) {
    dirty = v !== false;
    const pill = $('unsaved-pill');
    if (pill) pill.classList.toggle('show', dirty);
  }

  function openSb() { $('sidebar').classList.add('open'); $('sbOverlay').classList.add('open'); }
  function closeSb() { $('sidebar').classList.remove('open'); $('sbOverlay').classList.remove('open'); }

  window.go = function (tab) {
    TABS.forEach((t) => {
      const n = $('nav-' + t); if (n) n.classList.toggle('on', t === tab);
      const v = $('view-' + t); if (v) v.style.display = t === tab ? 'block' : 'none';
      const a = $('act-' + t); if (a) a.style.display = t === tab ? 'flex' : 'none';
    });
    $('tb-title').textContent = TITLES[tab];
    $('tb-crumb').textContent = CRUMBS[tab];
    if (tab === 'inventory') renderInv();
    if (tab === 'workspace') renderWs();
    if (tab === 'leads') renderLeads();
    closeSb();
  };

  async function saveMeta() {
    try {
      await api('/api/admin/meta', {
        method: 'POST',
        body: JSON.stringify({ leadStatuses, leadFlags, leadNotes, carAvail }),
      });
    } catch (_) {}
  }

  async function loadInventory() {
    const [nr, ur] = await Promise.all([
      api('/api/admin/inventory'),
      api('/api/admin/inventory/used'),
    ]);
    if (nr.ok) newCars = await nr.json();
    if (ur.ok) usedCars = await ur.json();
    window.CARS_DB = newCars;
    window.USED_CARS_DB = usedCars;
    markDirty(false);
  }

  window.fetchData = async function () {
    if (!tok()) { location.href = '/login'; return; }
    try {
      const r = await api('/api/forms/responses');
      if (!r.ok) throw new Error('Server ' + r.status);
      allData = await r.json();
      if (!Array.isArray(allData)) allData = [];
      allData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      try {
        const mr = await api('/api/admin/meta');
        if (mr.ok) {
          const meta = await mr.json();
          leadStatuses = meta.leadStatuses || {};
          leadFlags = meta.leadFlags || {};
          leadNotes = meta.leadNotes || {};
          carAvail = meta.carAvail || {};
        }
      } catch (_) {
        const sv = localStorage.getItem('av_ls'); if (sv) leadStatuses = JSON.parse(sv);
        const sf = localStorage.getItem('av_lf'); if (sf) leadFlags = JSON.parse(sf);
        const sa = localStorage.getItem('av_ca'); if (sa) carAvail = JSON.parse(sa);
      }

      await loadInventory();

      try {
        const tr = await api('/api/admin/team');
        if (tr.ok) teamData = await tr.json();
      } catch (_) {}

      updateStats();
      renderTable();
      updatePipeline();
      renderInvStats();
    } catch (err) {
      const tb = $('t-body');
      if (tb) tb.innerHTML = '<tr><td colspan="8"><div class="empty">Failed to load: ' + err.message + '</div></td></tr>';
    }
  };

  function updateStats() {
    const ins = allData.filter((d) => d.formId === 'ins').length;
    const fin = allData.filter((d) => d.formId === 'fin').length;
    const svc = allData.filter((d) => !['ins', 'fin', 'partForm'].includes(d.formId)).length;
    [['st-total', allData.length], ['st-ins', ins], ['st-fin', fin], ['st-svc', svc]].forEach(([id, v]) => {
      const el = $(id); if (el) el.textContent = v;
    });
    const sbT = $('sb-total'); if (sbT) sbT.textContent = allData.length;
    const sbL = $('sb-leads'); if (sbL) sbL.textContent = allData.length;
  }

  function updatePipeline() {
    const s = { new: 0, contacted: 0, qualified: 0, closed: 0 };
    allData.forEach((_, i) => { const st = leadStatuses[i] || 'new'; s[st] = (s[st] || 0) + 1; });
    Object.keys(s).forEach((k) => { const el = $('pp-' + k); if (el) el.textContent = s[k]; });
  }

  window.saveLeadStatus = function (idx, status) {
    leadStatuses[idx] = status;
    saveMeta();
    localStorage.setItem('av_ls', JSON.stringify(leadStatuses));
    updatePipeline();
    ['ls-', 'lls-'].forEach((pfx) => {
      const el = $(pfx + idx);
      if (el) el.className = 'ls s-' + status;
    });
  };

  window.toggleFlag = function (idx) {
    leadFlags[idx] = !leadFlags[idx];
    saveMeta();
    localStorage.setItem('av_lf', JSON.stringify(leadFlags));
    ['flag-', 'lflag-'].forEach((pfx) => {
      const el = $(pfx + idx);
      if (el) {
        el.classList.toggle('on', leadFlags[idx]);
        const svg = el.querySelector('svg');
        if (svg) svg.setAttribute('fill', leadFlags[idx] ? 'currentColor' : 'none');
      }
    });
  };

  window.toggleFlagL = function (idx) { window.toggleFlag(idx); renderLeads(); };

  function badge(formId) {
    if (formId === 'ins') return '<span class="badge bg-b">Insurance</span>';
    if (formId === 'fin') return '<span class="badge bg-a">Finance</span>';
    if (formId === 'partForm') return '<span class="badge bg-g">Parts</span>';
    return '<span class="badge bg-p">Service</span>';
  }

  function initials(name) {
    if (!name || name === '-') return '?';
    return name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  }

  function parseRow(row) {
    let name = '-', contact = '-', main = '-';
    Object.keys(row).forEach((k) => {
      const kl = k.toLowerCase(), v = String(row[k] || '').trim();
      if (!v) return;
      if (name === '-' && kl.includes('name')) name = v;
      if (contact === '-' && (kl.includes('phone') || kl.includes('mobile') || kl.includes('email'))) contact = v;
      if (main === '-' && (kl.includes('brand') || kl.includes('model') || kl.includes('service') || kl.includes('vehicle'))) main = v;
    });
    return { name, contact, main };
  }

  window.renderTable = function () {
    const filter = $('tf') ? $('tf').value : 'all';
    const srch = ($('srch') && $('srch').value || '').toLowerCase();
    let data = allData.filter((d) => {
      if (filter === 'service') return !['ins', 'fin', 'partForm'].includes(d.formId);
      return filter === 'all' || d.formId === filter;
    });
    if (srch) data = data.filter((d) => {
      const p = parseRow(d);
      return p.name.toLowerCase().includes(srch) || p.contact.toLowerCase().includes(srch) || JSON.stringify(d).toLowerCase().includes(srch);
    });
    const cnt = $('ov-cnt'); if (cnt) cnt.textContent = data.length + ' entries';
    const tbody = $('t-body'); if (!tbody) return;
    if (!data.length) { tbody.innerHTML = '<tr><td colspan="8"><div class="empty">No submissions found.</div></td></tr>'; return; }
    tbody.innerHTML = data.map((row) => {
      const idx = allData.indexOf(row);
      const dt = row.timestamp ? new Date(row.timestamp) : null;
      const ds = dt ? dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '–';
      const ts = dt ? dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : '';
      const { name, contact, main } = parseRow(row);
      const st = leadStatuses[idx] || 'new';
      const fl = leadFlags[idx] || false;
      const ms = main.length > 32 ? main.slice(0, 32) + '…' : main;
      return '<tr onclick="openModal(' + idx + ')">' +
        '<td><div class="c-mono">' + ds + '</div><div style="font-size:11px;color:var(--text-3)">' + ts + '</div></td>' +
        '<td>' + badge(row.formId) + '</td>' +
        '<td><div style="display:flex;align-items:center;gap:7px"><div class="avatar">' + initials(name) + '</div><span class="c-bold">' + name + '</span></div></td>' +
        '<td class="c-dim">' + contact + '</td>' +
        '<td class="c-dim" style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + ms + '</td>' +
        '<td onclick="event.stopPropagation()"><select id="ls-' + idx + '" class="ls s-' + st + '" onchange="saveLeadStatus(' + idx + ',this.value)">' +
        ['new', 'contacted', 'qualified', 'closed'].map((v) => '<option value="' + v + '"' + (st === v ? ' selected' : '') + '>' + v.charAt(0).toUpperCase() + v.slice(1) + '</option>').join('') +
        '</select></td>' +
        '<td onclick="event.stopPropagation()"><button id="flag-' + idx + '" class="flag-btn' + (fl ? ' on' : '') + '" onclick="toggleFlag(' + idx + ')"><svg viewBox="0 0 24 24" fill="' + (fl ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg></button></td>' +
        '<td onclick="event.stopPropagation()"><button class="btn" style="padding:4px 9px;font-size:12px" onclick="openModal(' + idx + ')">View</button></td></tr>';
    }).join('');
  };

  window.setLeadFilter = function (f, btn) {
    leadsFilter = f;
    document.querySelectorAll('#view-leads .tab').forEach((t) => t.classList.remove('on'));
    btn.classList.add('on');
    renderLeads();
  };

  function renderLeads() {
    const data = allData.filter((_, i) => leadsFilter === 'all' || (leadStatuses[i] || 'new') === leadsFilter);
    const cnt = $('leads-cnt'); if (cnt) cnt.textContent = data.length + ' leads';
    const tbody = $('leads-body'); if (!tbody) return;
    if (!data.length) { tbody.innerHTML = '<tr><td colspan="8"><div class="empty">No leads in this stage.</div></td></tr>'; return; }
    tbody.innerHTML = data.map((row) => {
      const idx = allData.indexOf(row);
      const dt = row.timestamp ? new Date(row.timestamp) : null;
      const ds = dt ? dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '–';
      const { name, contact, main } = parseRow(row);
      const st = leadStatuses[idx] || 'new';
      const fl = leadFlags[idx] || false;
      return '<tr onclick="openModal(' + idx + ')">' +
        '<td class="c-mono">' + ds + '</td>' +
        '<td><div style="display:flex;align-items:center;gap:7px"><div class="avatar">' + initials(name) + '</div><span class="c-bold">' + name + '</span></div></td>' +
        '<td class="c-dim">' + contact + '</td>' +
        '<td class="c-dim">' + main + '</td>' +
        '<td>' + badge(row.formId) + '</td>' +
        '<td onclick="event.stopPropagation()"><select id="lls-' + idx + '" class="ls s-' + st + '" onchange="saveLeadStatus(' + idx + ',this.value);renderLeads()">' +
        ['new', 'contacted', 'qualified', 'closed'].map((v) => '<option value="' + v + '"' + (st === v ? ' selected' : '') + '>' + v.charAt(0).toUpperCase() + v.slice(1) + '</option>').join('') +
        '</select></td>' +
        '<td onclick="event.stopPropagation()"><button id="lflag-' + idx + '" class="flag-btn' + (fl ? ' on' : '') + '" onclick="toggleFlagL(' + idx + ')"><svg viewBox="0 0 24 24" fill="' + (fl ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg></button></td>' +
        '<td onclick="event.stopPropagation()"><button class="btn" style="padding:4px 9px;font-size:12px" onclick="openModal(' + idx + ')">View</button></td></tr>';
    }).join('');
  }

  window.openModal = function (idx) {
    const row = allData[idx];
    const { name, contact } = parseRow(row);
    $('m-title').textContent = name !== '-' ? name : 'Submission';
    $('m-sub').textContent = row.timestamp ? new Date(row.timestamp).toLocaleString() : 'Details';
    const skip = ['formId', 'timestamp'];
    const fields = Object.entries(row).filter(([k]) => !skip.includes(k))
      .map(([k, v]) => '<div class="kv"><div class="kv-k">' + k + '</div><div class="kv-v">' + (v || '–') + '</div></div>').join('');
    const note = leadNotes[idx] || '';
    $('m-body').innerHTML = (fields || '<p class="empty">No fields.</p>') +
      '<div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">' +
      '<label class="form-lbl">Internal note</label>' +
      '<textarea class="form-ta" id="lead-note-' + idx + '" rows="3" placeholder="Add a note for your team…">' + String(note).replace(/</g, '&lt;') + '</textarea>' +
      '<button class="btn" style="margin-top:8px" onclick="saveLeadNote(' + idx + ')">Save note</button></div>';
    let foot = '';
    if (contact.match(/\d{7,}/)) foot += '<a href="tel:' + contact + '" class="btn btn-green" style="text-decoration:none">Call</a>';
    if (contact.includes('@')) foot += '<a href="mailto:' + contact + '" class="btn" style="text-decoration:none">Email</a>';
    foot += '<button class="btn btn-red" onclick="deleteLead(' + idx + ')">Delete</button>';
    $('m-foot').innerHTML = foot;
    $('m-detail').classList.add('on');
  };
  window.closeModal = function () { $('m-detail').classList.remove('on'); };

  window.exportCSV = function () {
    if (!allData.length) { toast('No data to export', 'err'); return; }
    const keys = [...new Set(allData.flatMap((r) => Object.keys(r)))];
    const rows = [keys.join(','), ...allData.map((r) => keys.map((k) => '"' + String(r[k] || '').replace(/"/g, '""') + '"').join(','))];
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([rows.join('\n')], { type: 'text/csv' }));
    a.download = 'autoviindu-leads.csv';
    a.click();
  };

  async function saveTeam() {
    try { await api('/api/admin/team', { method: 'POST', body: JSON.stringify(teamData) }); } catch (_) {}
    renderWs();
  }

  function renderWs() {
    const nl = $('notices-list');
    if (nl) nl.innerHTML = [...(teamData.notices || [])].reverse().map((n) =>
      '<div class="notice"><div class="n-meta"><span class="n-author">' + (n.author || 'Admin') + '</span><span class="n-date">' +
      new Date(n.date).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) +
      '</span></div><div class="n-text">' + n.text + '</div></div>'
    ).join('') || '<p class="empty">No notices yet.</p>';

    const ta = $('todos-active'), td = $('todos-done');
    const todos = teamData.todos || [];
    if (ta) ta.innerHTML = todos.filter((t) => !t.completed).map((t) =>
      '<div class="todo"><input type="checkbox" onclick="toggleTodo(' + t.id + ')"><span>' + t.text + '</span>' +
      '<button class="ico-btn del" onclick="delTodo(' + t.id + ')">×</button></div>'
    ).join('') || '<p class="empty">No active tasks.</p>';
    if (td) td.innerHTML = todos.filter((t) => t.completed).map((t) =>
      '<div class="todo done"><input type="checkbox" checked onclick="toggleTodo(' + t.id + ')"><span>' + t.text + '</span>' +
      '<button class="ico-btn del" onclick="delTodo(' + t.id + ')">×</button></div>'
    ).join('') || '<p class="empty">None completed.</p>';
  }

  window.postNotice = function () {
    const i = $('notice-inp'); if (!i || !i.value.trim()) return;
    (teamData.notices = teamData.notices || []).push({ id: Date.now(), text: i.value.trim(), date: new Date().toISOString(), author: 'Admin' });
    i.value = ''; saveTeam();
  };
  window.addTodo = function () {
    const i = $('todo-inp'); if (!i || !i.value.trim()) return;
    (teamData.todos = teamData.todos || []).push({ id: Date.now(), text: i.value.trim(), completed: false });
    i.value = ''; saveTeam();
  };
  window.toggleTodo = function (id) {
    const t = (teamData.todos || []).find((x) => x.id === id);
    if (t) { t.completed = !t.completed; saveTeam(); }
  };
  window.delTodo = function (id) {
    teamData.todos = (teamData.todos || []).filter((t) => t.id !== id);
    saveTeam();
  };

  /* ── INVENTORY ── */
  function getDb(type) { return type === 'new' ? newCars : usedCars; }

  function renderInvStats() {
    const el = $('inv-stats');
    if (!el) return;
    const brands = new Set(newCars.map((c) => c.brand)).size;
    const ev = newCars.filter((c) => c.isEV || (c.type || '').toLowerCase().includes('electric')).length;
    el.innerHTML =
      '<div class="inv-chip"><strong>' + newCars.length + '</strong> new cars</div>' +
      '<div class="inv-chip"><strong>' + usedCars.length + '</strong> used cars</div>' +
      '<div class="inv-chip"><strong>' + brands + '</strong> brands</div>' +
      '<div class="inv-chip"><strong>' + ev + '</strong> electric</div>';
  }

  function getFilteredCars() {
    const db = getDb(invType);
    const q = ($('inv-srch') && $('inv-srch').value || '').toLowerCase().trim();
    const brand = $('inv-brand') ? $('inv-brand').value : 'all';
    const fuel = $('inv-fuel') ? $('inv-fuel').value : 'all';
    const body = $('inv-body') ? $('inv-body').value : 'all';
    const sort = $('inv-sort') ? $('inv-sort').value : 'name';

    let list = db.slice();
    if (q) list = list.filter((c) => (c.brand + ' ' + c.model + ' ' + (c.slug || '')).toLowerCase().includes(q));
    if (brand !== 'all') list = list.filter((c) => c.brand === brand);
    if (fuel !== 'all') list = list.filter((c) => (c.type || '').toLowerCase() === fuel.toLowerCase());
    if (body !== 'all' && invType === 'new') list = list.filter((c) => (c.body || c.bodyType || '').toLowerCase() === body.toLowerCase());

    if (sort === 'name') list.sort((a, b) => (a.brand + a.model).localeCompare(b.brand + b.model));
    else if (sort === 'price-asc') list.sort((a, b) => carPrice(a) - carPrice(b));
    else if (sort === 'price-desc') list.sort((a, b) => carPrice(b) - carPrice(a));
    else if (sort === 'year') list.sort((a, b) => (b.year || 0) - (a.year || 0));
    return list;
  }

  function carPrice(c) {
    if (invType === 'used') return c.priceNum || 0;
    return (c.variants && c.variants[0] && c.variants[0].price) || 0;
  }

  function carImg(c) {
    const img = (c.images && c.images[0]) || c.img || '';
    return img.startsWith('http') || img.startsWith('/') ? img : '/' + img.replace(/^\//, '');
  }

  function populateBrandFilter() {
    const sel = $('inv-brand');
    if (!sel) return;
    const db = getDb(invType);
    const brands = [...new Set(db.map((c) => c.brand).filter(Boolean))].sort();
    const cur = sel.value;
    sel.innerHTML = '<option value="all">All brands</option>' + brands.map((b) => '<option value="' + b + '">' + b + '</option>').join('');
    if (brands.includes(cur)) sel.value = cur;
  }

  window.setInvType = function (type, btn) {
    invType = type;
    document.querySelectorAll('#inv-type-tabs .tab').forEach((t) => t.classList.remove('on'));
    if (btn) btn.classList.add('on');
    populateBrandFilter();
    renderInv();
  };

  window.setInvView = function (view) {
    invView = view;
    document.querySelectorAll('.view-toggle button').forEach((b) => b.classList.toggle('on', b.dataset.view === view));
    renderInv();
  };

  window.cycleAvail = function (idx, type) {
    const key = type + '-' + idx;
    const s = ['available', 'reserved', 'sold'];
    carAvail[key] = s[(s.indexOf(carAvail[key] || 'available') + 1) % 3];
    saveMeta();
    localStorage.setItem('av_ca', JSON.stringify(carAvail));
    renderInv();
  };

  function renderInv() {
    populateBrandFilter();
    const list = getFilteredCars();
    const db = getDb(invType);
    const cnt = $('inv-cnt'); if (cnt) cnt.textContent = list.length + ' car' + (list.length === 1 ? '' : 's');

    const grid = $('inv-grid');
    const table = $('inv-table-wrap');
    if (invView === 'grid') {
      if (grid) { grid.style.display = 'grid'; grid.innerHTML = renderInvGrid(list, db); }
      if (table) table.style.display = 'none';
    } else {
      if (grid) grid.style.display = 'none';
      if (table) { table.style.display = 'block'; $('inv-body').innerHTML = renderInvTable(list, db); }
    }
  }

  function availBadge(idx, type) {
    const key = type + '-' + idx;
    const av = carAvail[key] || 'available';
    const dot = av === 'available' ? 'd-g' : av === 'reserved' ? 'd-a' : 'd-r';
    return '<span class="avail av-' + av + '" onclick="cycleAvail(' + idx + ',\'' + type + '\')"><span class="dot ' + dot + '"></span>' + av.charAt(0).toUpperCase() + av.slice(1) + '</span>';
  }

  function renderInvGrid(list, db) {
    if (!list.length) return '<div class="empty" style="grid-column:1/-1">No cars match your filters.</div>';
    return list.map((car) => {
      const i = db.indexOf(car);
      const img = carImg(car);
      const price = invType === 'new' ? fmtRs(carPrice(car)) : (car.price || fmtRs(car.priceNum));
      const badges = [];
      if (car.isEV) badges.push('<span class="badge bg-g">EV</span>');
      if (car.isFeatured) badges.push('<span class="badge bg-b">Featured</span>');
      if (car.badge) badges.push('<span class="badge bg-p">' + car.badge + '</span>');
      return '<div class="inv-card">' +
        '<div class="inv-card-img">' + (img ? '<img src="' + img + '" alt="" loading="lazy">' : '<span class="no-img">No image</span>') +
        '<div class="inv-card-badges">' + badges.join('') + '</div></div>' +
        '<div class="inv-card-body"><div class="inv-card-name">' + car.brand + ' ' + car.model + '</div>' +
        '<div class="inv-card-meta">' + (car.year || '—') + ' · ' + (car.type || '—') + (invType === 'new' ? ' · ' + (car.body || car.bodyType || '—') : '') + '</div>' +
        '<div class="inv-card-price">' + price + '</div></div>' +
        '<div class="inv-card-foot">' + availBadge(i, invType) +
        '<div class="inv-card-actions">' +
        '<button class="ico-btn" title="Edit" onclick="openCarEditor(' + i + ',\'' + invType + '\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>' +
        '<button class="ico-btn" title="View on site" onclick="window.open(\'/#car/' + (car.slug || '') + '\',\'_blank\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></button>' +
        '<button class="ico-btn del" title="Delete" onclick="delCar(' + i + ',\'' + invType + '\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></button>' +
        '</div></div></div>';
    }).join('');
  }

  function renderInvTable(list, db) {
    if (!list.length) return '<tr><td colspan="7"><div class="empty">No cars match your filters.</div></td></tr>';
    return list.map((car) => {
      const i = db.indexOf(car);
      const price = invType === 'new' ? fmtRs(carPrice(car)) : (car.price || fmtRs(car.priceNum));
      return '<tr>' +
        '<td class="c-mono">#' + (car.id || i + 1) + '</td>' +
        '<td><span class="c-bold">' + car.brand + ' ' + car.model + '</span><div style="font-size:11px;color:var(--text-3)">' + (car.slug || '') + '</div></td>' +
        '<td>' + (car.year || '—') + '</td>' +
        '<td><span class="badge bg-n">' + (car.type || '—') + '</span></td>' +
        '<td class="c-mono">' + price + '</td>' +
        '<td>' + availBadge(i, invType) + '</td>' +
        '<td><div style="display:flex;gap:4px">' +
        '<button class="ico-btn" onclick="openCarEditor(' + i + ',\'' + invType + '\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>' +
        '<button class="ico-btn del" onclick="delCar(' + i + ',\'' + invType + '\')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></button>' +
        '</div></td></tr>';
    }).join('');
  }

  window.delCar = function (idx, type) {
    if (!confirm('Delete ' + getDb(type)[idx].brand + ' ' + getDb(type)[idx].model + '?')) return;
    getDb(type).splice(idx, 1);
    markDirty(true);
    renderInv();
    renderInvStats();
    toast('Car removed — publish to update site', 'ok');
  };

  window.openAddCar = function (type) {
    invType = type || invType;
    const blank = type === 'new' ? {
      id: Date.now() % 100000,
      slug: '', brand: '', brandSlug: '', model: '', year: new Date().getFullYear(),
      type: 'Petrol', bodyType: 'suv', body: 'SUV', badge: '', budgetTier: 'Under 50L',
      isEV: false, isNew: true, isFeatured: false, isBestSeller: false,
      tagline: '', rating: 4, reviews: 0, expertScore: 7, overview: '',
      images: [], colors: [], variants: [{ name: 'Base', slug: 'base', price: 0, label: 'Base', transmission: 'MT', fuel: 'Petrol', features: [], specs: {} }],
      specs: {}, pros: [], cons: [],
    } : {
      id: 'u' + Date.now(), brand: '', model: '', year: new Date().getFullYear(),
      km: '', type: 'Petrol', body: 'SUV', priceNum: 0, price: 'Rs. 0L',
      variant: '', transmission: 'Manual', owners: 1, color: '', location: 'Kathmandu',
      rating: 4, reviews: 0, certified: false, img: '', images: [], overview: '',
      highlights: [], specs: {}, tags: [], features: [],
    };
    const db = getDb(type);
    db.unshift(blank);
    editCtx = { type, idx: 0, isNew: true };
    markDirty(true);
    openCarEditor(0, type);
  };

  window.openCarEditor = function (idx, type) {
    editCtx = { type, idx, isNew: false };
    const car = getDb(type)[idx];
    if (!car) return;

    $('drawer-title').textContent = (car.brand || 'New') + ' ' + (car.model || 'Car');
    $('drawer-sub').textContent = type === 'new' ? 'New car listing' : 'Used car listing';

    const specsTab = $('tab-specs');
    if (specsTab) specsTab.style.display = type === 'new' ? '' : 'none';

    if (type === 'new') renderNewEditor(car);
    else renderUsedEditor(car);

    $('car-drawer').classList.add('on');
    setEditorTab('basics');
  };

  window.deleteEditingCar = function () {
    if (!editCtx) return;
    delCar(editCtx.idx, editCtx.type);
    closeCarEditor();
  };

  function setEditorTab(tab) {
    document.querySelectorAll('.drawer-tab').forEach((t) => t.classList.toggle('on', t.dataset.tab === tab));
    document.querySelectorAll('.editor-pane').forEach((p) => p.classList.toggle('on', p.dataset.pane === tab));
  }
  window.setEditorTab = setEditorTab;

  function renderNewEditor(car) {
  $('editor-panes').innerHTML =
    '<div class="editor-pane on" data-pane="basics"><div class="form-grid">' +
    field('Brand', 'e-brand', car.brand) +
    field('Model', 'e-model', car.model) +
    field('Slug (URL)', 'e-slug', car.slug) +
    field('Year', 'e-year', car.year, 'number') +
    selectField('Fuel type', 'e-type', car.type, ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG']) +
    selectField('Body', 'e-body', car.body || car.bodyType, ['SUV', 'Sedan', 'Hatchback', 'MPV', 'Pickup', 'Coupe', 'Crossover']) +
    field('Tagline', 'e-tagline', car.tagline) +
    field('Budget tier', 'e-tier', car.budgetTier) +
    '<div class="form-grid" style="margin-top:12px">' +
    checkField('Electric (EV)', 'e-ev', car.isEV) +
    checkField('Featured', 'e-feat', car.isFeatured) +
    checkField('Best seller', 'e-best', car.isBestSeller) +
  '</div></div></div>' +

    '<div class="editor-pane" data-pane="pricing">' +
    '<p style="font-size:12px;color:var(--text-3);margin-bottom:10px">Base variant price is shown on the site. Add more variants as needed.</p>' +
    '<div id="variant-list">' + renderVariants(car.variants || []) + '</div>' +
    '<button type="button" class="btn" style="margin-top:10px" onclick="addVariant()">+ Add variant</button></div>' +

    '<div class="editor-pane" data-pane="media">' +
    '<div class="img-upload" onclick="document.getElementById(\'e-img-file\').click()">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>' +
    '<p>Click to upload image</p></div>' +
    '<input type="file" id="e-img-file" accept="image/*" multiple style="display:none" onchange="uploadImages(this)">' +
    '<div class="img-grid" id="e-img-grid">' + renderImgGrid(car.images || []) + '</div></div>' +

    '<div class="editor-pane" data-pane="specs">' +
    field('Expert score (1–10)', 'e-score', car.expertScore, 'number') +
    field('User rating', 'e-rating', car.rating, 'number') +
    field('Review count', 'e-reviews', car.reviews, 'number') +
    '<div style="margin-top:14px"><label class="form-lbl">Car specs (key → value)</label><div id="spec-list">' + renderSpecs(car.specs || {}) + '</div>' +
    '<button type="button" class="btn" style="margin-top:8px" onclick="addSpecRow()">+ Add spec</button></div></div>' +

    '<div class="editor-pane" data-pane="content">' +
    '<div class="form-field"><label class="form-lbl">Overview</label><textarea class="form-ta" id="e-overview" rows="5">' + esc(car.overview || '') + '</textarea></div>' +
    '<div class="form-field" style="margin-top:12px"><label class="form-lbl">Pros (one per line)</label><textarea class="form-ta" id="e-pros" rows="3">' + esc((car.pros || []).join('\n')) + '</textarea></div>' +
    '<div class="form-field" style="margin-top:12px"><label class="form-lbl">Cons (one per line)</label><textarea class="form-ta" id="e-cons" rows="3">' + esc((car.cons || []).join('\n')) + '</textarea></div></div>';
  }

  function renderUsedEditor(car) {
    $('editor-panes').innerHTML =
      '<div class="editor-pane on" data-pane="basics"><div class="form-grid">' +
      field('Brand', 'e-brand', car.brand) +
      field('Model', 'e-model', car.model) +
      field('Year', 'e-year', car.year, 'number') +
      field('Kilometers', 'e-km', car.km) +
      selectField('Fuel', 'e-type', car.type, ['Petrol', 'Diesel', 'Hybrid', 'Electric']) +
      field('Body', 'e-body', car.body) +
      field('Variant', 'e-variant', car.variant) +
      field('Transmission', 'e-trans', car.transmission) +
      field('Owners', 'e-owners', car.owners, 'number') +
      field('Color', 'e-color', car.color) +
      field('Location', 'e-loc', car.location) +
      checkField('Certified', 'e-cert', car.certified) +
      '</div></div>' +

      '<div class="editor-pane" data-pane="pricing"><div class="form-grid">' +
      field('Price (number)', 'e-pricenum', car.priceNum, 'number') +
      field('Display price', 'e-price', car.price) +
      field('EMI estimate', 'e-emi', car.emiEst, 'number') +
      '</div></div>' +

      '<div class="editor-pane" data-pane="media">' +
      '<div class="img-upload" onclick="document.getElementById(\'e-img-file\').click()">' +
      '<p>Upload photos</p></div>' +
      '<input type="file" id="e-img-file" accept="image/*" multiple style="display:none" onchange="uploadImages(this)">' +
      '<div class="img-grid" id="e-img-grid">' + renderImgGrid(car.images || (car.img ? [car.img] : [])) + '</div></div>' +

      '<div class="editor-pane" data-pane="content">' +
      '<div class="form-field"><label class="form-lbl">Overview</label><textarea class="form-ta" id="e-overview" rows="5">' + esc(car.overview || '') + '</textarea></div>' +
      '<div class="form-field" style="margin-top:12px"><label class="form-lbl">Highlights (one per line)</label><textarea class="form-ta" id="e-highlights" rows="4">' + esc((car.highlights || []).join('\n')) + '</textarea></div>' +
      '</div>';
  }

  function field(lbl, id, val, type) {
    type = type || 'text';
    return '<div class="form-field"><label class="form-lbl">' + lbl + '</label><input class="form-inp" id="' + id + '" type="' + type + '" value="' + esc(val != null ? val : '') + '"></div>';
  }
  function selectField(lbl, id, val, opts) {
    return '<div class="form-field"><label class="form-lbl">' + lbl + '</label><select class="form-sel" id="' + id + '">' +
      opts.map((o) => '<option value="' + o + '"' + (val === o ? ' selected' : '') + '>' + o + '</option>').join('') + '</select></div>';
  }
  function checkField(lbl, id, val) {
    return '<label class="form-check"><input type="checkbox" id="' + id + '"' + (val ? ' checked' : '') + '> ' + lbl + '</label>';
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  function renderVariants(variants) {
    return variants.map((v, i) =>
      '<div class="variant-row" data-vi="' + i + '">' +
      '<div class="form-field"><label class="form-lbl">Name</label><input class="form-inp v-name" value="' + esc(v.name || '') + '"></div>' +
      '<div class="form-field"><label class="form-lbl">Price (NPR)</label><input class="form-inp v-price" type="number" value="' + (v.price || 0) + '"></div>' +
      '<div class="form-field"><label class="form-lbl">Transmission</label><input class="form-inp v-trans" value="' + esc(v.transmission || '') + '"></div>' +
      '<button type="button" class="ico-btn del" onclick="removeVariant(' + i + ')">×</button></div>'
    ).join('');
  }

  window.addVariant = function () {
    const car = getDb(editCtx.type)[editCtx.idx];
    if (!car.variants) car.variants = [];
    car.variants.push({ name: 'Variant', slug: 'variant', price: 0, transmission: 'MT', fuel: 'Petrol', features: [], specs: {} });
    $('variant-list').innerHTML = renderVariants(car.variants);
  };
  window.removeVariant = function (i) {
    const car = getDb(editCtx.type)[editCtx.idx];
    car.variants.splice(i, 1);
    $('variant-list').innerHTML = renderVariants(car.variants || []);
  };

  function renderSpecs(specs) {
    const entries = Object.entries(specs || {});
    if (!entries.length) entries.push(['Power', ''], ['Torque', ''], ['Fuel Efficiency', '']);
    return entries.map(([k, v], i) =>
      '<div class="spec-row" data-si="' + i + '">' +
      '<input class="form-inp s-key" value="' + esc(k) + '" placeholder="Spec name">' +
      '<input class="form-inp s-val" value="' + esc(v) + '" placeholder="Value">' +
      '<button type="button" class="ico-btn del" onclick="this.parentElement.remove()">×</button></div>'
    ).join('');
  }
  window.addSpecRow = function () {
    const list = $('spec-list');
    const div = document.createElement('div');
    div.className = 'spec-row';
    div.innerHTML = '<input class="form-inp s-key" placeholder="Spec name"><input class="form-inp s-val" placeholder="Value"><button type="button" class="ico-btn del" onclick="this.parentElement.remove()">×</button>';
    list.appendChild(div);
  };

  function renderImgGrid(images) {
    return (images || []).map((url, i) =>
      '<div class="img-tile"><img src="' + (url.startsWith('/') ? url : '/' + url.replace(/^\//, '')) + '" alt="">' +
      '<button type="button" class="img-tile-rm" onclick="removeImg(' + i + ')">×</button></div>'
    ).join('');
  }

  window.removeImg = function (i) {
    const car = getDb(editCtx.type)[editCtx.idx];
    if (!car.images) car.images = [];
    car.images.splice(i, 1);
    if (editCtx.type === 'used') car.img = car.images[0] || '';
    $('e-img-grid').innerHTML = renderImgGrid(car.images);
  };

  window.uploadImages = async function (input) {
    if (!input.files.length) return;
    const car = getDb(editCtx.type)[editCtx.idx];
    if (!car.images) car.images = [];
    for (const file of input.files) {
      const b64 = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file); });
      try {
        const up = await api('/api/admin/upload-image', {
          method: 'POST',
          body: JSON.stringify({ imageBase64: b64, filename: file.name }),
        });
        if (up.ok) {
          const d = await up.json();
          car.images.push(d.url);
        }
      } catch (_) { toast('Upload failed', 'err'); }
    }
    if (editCtx.type === 'used') car.img = car.images[0] || '';
    $('e-img-grid').innerHTML = renderImgGrid(car.images);
    input.value = '';
    markDirty(true);
  };

  window.saveCarEditor = function () {
    if (!editCtx) return;
    const car = getDb(editCtx.type)[editCtx.idx];
    const g = (id) => { const el = $(id); return el ? el.value : ''; };
    const gc = (id) => { const el = $(id); return el ? el.checked : false; };

    if (editCtx.type === 'new') {
      car.brand = g('e-brand').trim();
      car.model = g('e-model').trim();
      car.slug = g('e-slug').trim() || slugify(car.brand + '-' + car.model);
      car.brandSlug = slugify(car.brand);
      car.year = parseInt(g('e-year')) || new Date().getFullYear();
      car.type = g('e-type');
      car.body = g('e-body');
      car.bodyType = (car.body || '').toLowerCase();
      car.tagline = g('e-tagline');
      car.budgetTier = g('e-tier');
      car.isEV = gc('e-ev');
      car.isFeatured = gc('e-feat');
      car.isBestSeller = gc('e-best');
      car.expertScore = parseFloat(g('e-score')) || 7;
      car.rating = parseFloat(g('e-rating')) || 4;
      car.reviews = parseInt(g('e-reviews')) || 0;
      const ov = $('e-overview');
      car.overview = ov ? ov.value : '';

      const pros = g('e-pros');
      const cons = g('e-cons');
      car.pros = pros ? pros.split('\n').map((s) => s.trim()).filter(Boolean) : [];
      car.cons = cons ? cons.split('\n').map((s) => s.trim()).filter(Boolean) : [];

      car.variants = [];
      document.querySelectorAll('.variant-row').forEach((row) => {
        const name = row.querySelector('.v-name').value;
        car.variants.push({
          name: name,
          slug: slugify(name),
          price: parseInt(row.querySelector('.v-price').value) || 0,
          transmission: row.querySelector('.v-trans').value,
          fuel: car.type || 'Petrol',
          label: 'Variant',
          features: [],
          specs: {},
        });
      });
      if (!car.variants.length) {
        car.variants.push({ name: 'Base', slug: 'base', price: 0, transmission: 'MT', fuel: car.type || 'Petrol', label: 'Base', features: [], specs: {} });
      }

      car.specs = {};
      document.querySelectorAll('.spec-row').forEach((row) => {
        const k = row.querySelector('.s-key').value.trim();
        const v = row.querySelector('.s-val').value.trim();
        if (k) car.specs[k] = v;
      });
    } else {
      car.brand = g('e-brand').trim();
      car.model = g('e-model').trim();
      car.year = parseInt(g('e-year')) || new Date().getFullYear();
      car.km = g('e-km');
      car.type = g('e-type');
      car.body = g('e-body');
      car.variant = g('e-variant');
      car.transmission = g('e-trans');
      car.owners = parseInt(g('e-owners')) || 1;
      car.color = g('e-color');
      car.location = g('e-loc');
      car.certified = gc('e-cert');
      car.priceNum = parseInt(g('e-pricenum')) || 0;
      car.price = g('e-price') || fmtRs(car.priceNum);
      car.emiEst = parseInt(g('e-emi')) || 0;
      const ov = $('e-overview');
      car.overview = ov ? ov.value : '';
      const hl = g('e-highlights');
      car.highlights = hl ? hl.split('\n').map((s) => s.trim()).filter(Boolean) : [];
    }

    markDirty(true);
    closeCarEditor();
    renderInv();
    renderInvStats();
    toast('Saved locally — hit Publish to update the live site', 'ok');
  };

  window.closeCarEditor = function () {
    $('car-drawer').classList.remove('on');
    editCtx = null;
  };

  window.publishInv = async function (which) {
    const btn = $('publish-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Publishing…'; }
    try {
      const jobs = [];
      if (!which || which === 'new' || which === 'all') {
        jobs.push(api('/api/admin/inventory', { method: 'POST', body: JSON.stringify(newCars) }));
      }
      if (!which || which === 'used' || which === 'all') {
        jobs.push(api('/api/admin/inventory/used', { method: 'POST', body: JSON.stringify(usedCars) }));
      }
      const results = await Promise.all(jobs);
      if (results.every((r) => r.ok)) {
        markDirty(false);
        toast('Published — live site updated', 'ok');
        window.CARS_DB = newCars;
        window.USED_CARS_DB = usedCars;
      } else toast('Publish failed', 'err');
    } catch (e) { toast(e.message, 'err'); }
    if (btn) { btn.disabled = false; btn.textContent = 'Publish changes'; }
  };

  window.openSb = openSb;
  window.closeSb = closeSb;
  window.renderInv = renderInv;
  window.renderLeads = renderLeads;

  window.AdminAPI = {
    api, toast, $, saveMeta,
    get leadNotes() { return leadNotes; },
    set leadNotes(v) { leadNotes = v; },
    get newCars() { return newCars; },
    get usedCars() { return usedCars; },
  };

  if (!tok()) location.href = '/login';
  else fetchData();
})();
