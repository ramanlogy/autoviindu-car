/* AutoViindu Admin — "Sections": curate the cars shown in Best Sellers, the
   homepage rows, the 8 New Cars category carousels, Upcoming Cars and the
   "Popular Cars" detail-page sidebar. Saves one SiteContent row: curated-sections.
   The public site reads it via /api/site/curated-sections (window.CURATED). */
(function () {
  'use strict';

  var KEY = 'curated-sections';
  var $ = function (id) { return document.getElementById(id); };
  var api = function () { return window.AdminAPI.api; };
  var toast = function (m, t) { return window.AdminAPI.toast(m, t); };

  var data = null;         // the curated-sections object (edited in place)
  var inventory = [];      // [{ slug, brand, model, year, img }]
  var subTab = 'bestsellers';

  var OTHER_TABS = ['overview', 'leads', 'inventory', 'workspace', 'content', 'articles', 'brands', 'media', 'settings'];
  var SUBTABS = [
    ['bestsellers', 'Best Sellers'],
    ['homepage', 'Homepage rows'],
    ['explore', 'New Cars categories'],
    ['upcoming', 'Upcoming'],
    ['popular', 'Popular sidebar'],
  ];

  var EXPLORE_HINTS = {
    trending: 'Auto: cars with the most reviews first.',
    budget: 'Auto: cars priced Rs. 40 Lakh or under.',
    hatchback: 'Auto: cars with body type Hatchback.',
    suv: 'Auto: cars with body type SUV.',
    luxury: 'Auto: cars priced Rs. 80 Lakh or above.',
    electric: 'Auto: cars with fuel type Electric.',
    hybrid: 'Auto: cars with fuel type Hybrid.',
    upcoming: 'Cars come from the Upcoming tab.',
  };

  function imgSrc(u) {
    u = String(u || '');
    if (!u) return '';
    if (/^(https?:)?\/\//.test(u) || u.charAt(0) === '/' || u.indexOf('data:') === 0) return u;
    return '/' + u;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---- path helpers: read/write nested values in `data` by "a.b.0.c" ---- */
  function getPath(path) {
    var parts = String(path).split('.');
    var o = data;
    for (var i = 0; i < parts.length; i++) {
      if (o == null) return undefined;
      o = o[parts[i]];
    }
    return o;
  }
  function setPath(path, val) {
    var parts = String(path).split('.');
    var o = data;
    for (var i = 0; i < parts.length - 1; i++) {
      var k = parts[i];
      if (o[k] == null) o[k] = /^\d+$/.test(parts[i + 1]) ? [] : {};
      o = o[k];
    }
    o[parts[parts.length - 1]] = val;
  }

  /* ---- default shapes ---- */
  function ensureShape(d) {
    if (!d.bestsellers || typeof d.bestsellers !== 'object') d.bestsellers = { title: '', sub: '', rows: [] };
    if (!Array.isArray(d.bestsellers.rows)) d.bestsellers.rows = [];
    if (!d.popularSidebar || typeof d.popularSidebar !== 'object') d.popularSidebar = { mode: 'auto', slugs: [] };
    if (!Array.isArray(d.popularSidebar.slugs)) d.popularSidebar.slugs = [];
    if (!d.upcoming || typeof d.upcoming !== 'object') d.upcoming = { title: '', sub: '', rows: [] };
    if (!Array.isArray(d.upcoming.rows)) d.upcoming.rows = [];
    if (!d.home || typeof d.home !== 'object') d.home = {};
    ['newCars', 'peopleBuying'].forEach(function (k) {
      if (!d.home[k] || typeof d.home[k] !== 'object') d.home[k] = { title: '', eyebrow: '', sub: '', mode: 'auto', slugs: [] };
      if (!Array.isArray(d.home[k].slugs)) d.home[k].slugs = [];
    });
    if (!Array.isArray(d.explore) || !d.explore.length) {
      d.explore = ['trending', 'budget', 'hatchback', 'suv', 'luxury', 'electric', 'hybrid', 'upcoming'].map(function (id) {
        return { id: id, mode: 'auto', enabled: true, slugs: [], type: id === 'upcoming' ? 'upcoming' : undefined };
      });
    }
    d.explore.forEach(function (e) { if (!Array.isArray(e.slugs)) e.slugs = []; });
  }

  function blankBestseller() { return { slug: null, brand: '', model: '', units: '', tag: '', why: '' }; }
  function blankUpcoming() {
    return { brand: '', model: '', slug: '', status: 'Expected Soon', statusCls: 'expect', price: 'TBD', body: 'SUV', fuel: 'Electric', img: '', eta: 'TBD' };
  }

  /* ---- navigation: hook into the shared go() chain ---- */
  var prevGo = window.go;
  window.go = function (tab) {
    var isS = tab === 'sections';
    var nav = $('nav-sections'); if (nav) nav.classList.toggle('on', isS);
    var view = $('view-sections'); if (view) view.style.display = isS ? 'block' : 'none';
    if (!isS) { if (prevGo) prevGo(tab); return; }

    OTHER_TABS.forEach(function (t) {
      var n = $('nav-' + t); if (n) n.classList.remove('on');
      var v = $('view-' + t); if (v) v.style.display = 'none';
      var a = $('act-' + t); if (a) a.style.display = 'none';
    });
    if ($('tb-title')) $('tb-title').textContent = 'Sections';
    if ($('tb-crumb')) $('tb-crumb').textContent = 'Curated car lists — no code required';
    if (window.closeSb) window.closeSb();
    loadSections();
  };

  async function loadSections() {
    var panel = $('sections-panel');
    if (panel) panel.innerHTML = '<div class="empty">Loading sections…</div>';
    try {
      var r = await api()('/api/admin/site/' + KEY);
      data = r.ok ? await r.json() : {};
    } catch (e) { data = {}; }
    if (!data || typeof data !== 'object') data = {};
    ensureShape(data);

    if (!inventory.length) {
      try {
        var ir = await api()('/api/admin/inventory');
        if (ir.ok) {
          var raw = await ir.json();
          inventory = raw.map(function (c) {
            return {
              slug: c.slug, brand: c.brand, model: c.model, year: c.year,
              img: (Array.isArray(c.images) && c.images[0]) || c.thumb || '',
            };
          }).sort(function (a, b) {
            return (a.brand + ' ' + a.model).toLowerCase().localeCompare((b.brand + ' ' + b.model).toLowerCase());
          });
        }
      } catch (e) { /* picker still works with free-text */ }
    }
    render();
  }

  function carBySlug(slug) {
    for (var i = 0; i < inventory.length; i++) if (inventory[i].slug === slug) return inventory[i];
    return null;
  }
  function carLabel(slug) {
    var c = carBySlug(slug);
    return c ? (c.brand + ' ' + c.model + (c.year ? ' (' + c.year + ')' : '')) : (slug || 'Unknown car');
  }

  /* ---- small builders ---- */
  function txt(label, path, opts) {
    opts = opts || {};
    return '<label class="form-field' + (opts.full ? ' full' : '') + '">' +
      '<span class="form-lbl">' + esc(label) + '</span>' +
      '<input class="form-inp" type="' + (opts.type || 'text') + '" value="' + esc(getPath(path)) + '"' +
      ' oninput="AVSections.setVal(\'' + path + '\', this.value' + (opts.type === 'number' ? ', true' : '') + ')"' +
      (opts.placeholder ? ' placeholder="' + esc(opts.placeholder) + '"' : '') + '></label>';
  }
  function area(label, path) {
    return '<label class="form-field full"><span class="form-lbl">' + esc(label) + '</span>' +
      '<textarea class="form-ta" rows="2" oninput="AVSections.setVal(\'' + path + '\', this.value)">' + esc(getPath(path)) + '</textarea></label>';
  }
  function modeRadio(path) {
    var v = getPath(path) === 'manual' ? 'manual' : 'auto';
    return '<div class="form-field"><span class="form-lbl">Which cars?</span><div style="display:flex;gap:14px;padding-top:4px">' +
      '<label style="display:flex;gap:5px;align-items:center;font-size:13px"><input type="radio" name="m-' + path.replace(/\./g, '-') + '" ' + (v === 'auto' ? 'checked' : '') + ' onchange="AVSections.setMode(\'' + path + '\',\'auto\')"> Automatic</label>' +
      '<label style="display:flex;gap:5px;align-items:center;font-size:13px"><input type="radio" name="m-' + path.replace(/\./g, '-') + '" ' + (v === 'manual' ? 'checked' : '') + ' onchange="AVSections.setMode(\'' + path + '\',\'manual\')"> Hand-pick</label>' +
      '</div></div>';
  }

  function carOptions() {
    return '<option value="">Choose a car…</option>' + inventory.map(function (c) {
      return '<option value="' + esc(c.slug) + '">' + esc(c.brand + ' ' + c.model + (c.year ? ' (' + c.year + ')' : '')) + '</option>';
    }).join('');
  }

  /* Reorderable hand-picked list bound to an array-of-slugs at `path`. */
  function carPicker(path) {
    var slugs = getPath(path) || [];
    var pid = 'pick-' + path.replace(/\./g, '-');
    var rows = slugs.map(function (slug, i) {
      var c = carBySlug(slug);
      return '<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border:1px solid var(--border);border-radius:6px;margin-bottom:6px;background:#fff">' +
        (c && c.img ? '<img src="' + esc(imgSrc(c.img)) + '" style="width:44px;height:30px;object-fit:cover;border-radius:4px">' : '<span style="width:44px;height:30px;border-radius:4px;background:var(--bg);display:inline-block"></span>') +
        '<span style="flex:1;font-size:13px;font-weight:600">' + (i + 1) + '. ' + esc(carLabel(slug)) + (c ? '' : ' <span style="color:var(--red);font-weight:400">(not in catalogue)</span>') + '</span>' +
        '<button class="ico-btn" title="Move up" onclick="AVSections.move(\'' + path + '\',' + i + ',-1)">&uarr;</button>' +
        '<button class="ico-btn" title="Move down" onclick="AVSections.move(\'' + path + '\',' + i + ',1)">&darr;</button>' +
        '<button class="ico-btn del" title="Remove" onclick="AVSections.removeAt(\'' + path + '\',' + i + ')">&times;</button>' +
        '</div>';
    }).join('');
    return '<div style="margin-top:8px">' +
      (rows || '<div class="section-hint" style="margin:0 0 8px">No cars picked yet — the section will be empty until you add some.</div>') +
      '<div style="display:flex;gap:8px;margin-top:4px">' +
      '<select class="form-sel" id="' + pid + '" style="flex:1">' + carOptions() + '</select>' +
      '<button class="btn btn-dark" onclick="AVSections.addSlug(\'' + path + '\',\'' + pid + '\')">Add car</button>' +
      '</div></div>';
  }

  /* ---- panels ---- */
  function render() {
    var panel = $('sections-panel');
    if (!panel) return;
    var body =
      '<div class="tab-row" style="margin-bottom:14px">' +
      SUBTABS.map(function (s) {
        return '<button class="tab' + (subTab === s[0] ? ' on' : '') + '" onclick="AVSections.tab(\'' + s[0] + '\')">' + s[1] + '</button>';
      }).join('') +
      '<button class="btn btn-green" style="margin-left:auto" onclick="AVSections.save()">Publish changes</button>' +
      '</div>' +
      '<div class="card" style="padding:18px">' + panelFor(subTab) + '</div>';
    panel.innerHTML = body;
  }

  function panelFor(t) {
    if (t === 'bestsellers') return bestsellersPanel();
    if (t === 'homepage') return homepagePanel();
    if (t === 'explore') return explorePanel();
    if (t === 'upcoming') return upcomingPanel();
    if (t === 'popular') return popularPanel();
    return '';
  }

  function bestsellersPanel() {
    var rows = data.bestsellers.rows.map(function (r, i) {
      return '<div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:10px;background:var(--bg)">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">' +
        '<strong style="font-size:13px">#' + (i + 1) + '</strong>' +
        '<span style="flex:1;font-size:12.5px;color:var(--text-2)">' + esc(r.brand || '') + ' ' + esc(r.model || '') + '</span>' +
        '<button class="ico-btn" title="Move up" onclick="AVSections.move(\'bestsellers.rows\',' + i + ',-1)">&uarr;</button>' +
        '<button class="ico-btn" title="Move down" onclick="AVSections.move(\'bestsellers.rows\',' + i + ',1)">&darr;</button>' +
        '<button class="ico-btn del" title="Remove" onclick="AVSections.removeAt(\'bestsellers.rows\',' + i + ')">&times;</button>' +
        '</div>' +
        '<div class="form-grid">' +
        '<label class="form-field"><span class="form-lbl">Link to catalogue car (optional)</span>' +
        '<select class="form-sel" onchange="AVSections.setRowCar(\'bestsellers.rows.' + i + '\', this.value)">' +
        '<option value="">— not linked —</option>' +
        inventory.map(function (c) {
          return '<option value="' + esc(c.slug) + '"' + (c.slug === r.slug ? ' selected' : '') + '>' + esc(c.brand + ' ' + c.model) + '</option>';
        }).join('') +
        '</select></label>' +
        txt('Brand', 'bestsellers.rows.' + i + '.brand') +
        txt('Model', 'bestsellers.rows.' + i + '.model') +
        txt('Units sold', 'bestsellers.rows.' + i + '.units', { type: 'number' }) +
        txt('Tag badge', 'bestsellers.rows.' + i + '.tag', { placeholder: 'e.g. #1 Overall' }) +
        txt('Why it sells (one line)', 'bestsellers.rows.' + i + '.why', { full: true }) +
        '</div></div>';
    }).join('');
    return '<p class="section-hint">Drives the <strong>Best Sellers</strong> page and the automatic "Popular Cars" sidebar. Order here = rank. Rows without a catalogue link still show, but are not clickable.</p>' +
      '<div class="form-grid">' + txt('Page title', 'bestsellers.title', { full: true }) + area('Intro text', 'bestsellers.sub') + '</div>' +
      '<div style="margin-top:14px">' + rows + '</div>' +
      '<button class="btn" onclick="AVSections.addRow(\'bestsellers.rows\',\'bestseller\')">+ Add row</button>';
  }

  function homeBlock(key, heading) {
    var base = 'home.' + key;
    var manual = getPath(base + '.mode') === 'manual';
    return '<div style="border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:12px">' +
      '<div style="font-size:13px;font-weight:700;margin-bottom:10px">' + esc(heading) + '</div>' +
      '<div class="form-grid">' +
      txt('Heading', base + '.title') +
      txt('Small label above (optional)', base + '.eyebrow') +
      area('Sub text (optional)', base + '.sub') +
      modeRadio(base + '.mode') +
      '</div>' +
      (manual ? carPicker(base + '.slugs') : '<div class="section-hint" style="margin:8px 0 0">Automatic — the site fills this row itself.</div>') +
      '</div>';
  }
  function homepagePanel() {
    return '<p class="section-hint">The two car rows on the homepage. Switch either to "Hand-pick" to choose exact cars and their order.</p>' +
      homeBlock('newCars', 'Row 1 — "You might like"') +
      homeBlock('peopleBuying', 'Row 2 — "New cars people are buying"');
  }

  function explorePanel() {
    var items = data.explore.map(function (e, i) {
      var isUp = e.type === 'upcoming' || e.id === 'upcoming';
      var manual = e.mode === 'manual';
      var base = 'explore.' + i;
      return '<div style="border:1px solid var(--border);border-radius:8px;padding:14px;margin-bottom:12px' + (e.enabled === false ? ';opacity:.55' : '') + '">' +
        '<label style="display:flex;gap:6px;align-items:center;font-size:13px;font-weight:700;margin-bottom:10px">' +
        '<input type="checkbox" ' + (e.enabled === false ? '' : 'checked') + ' onchange="AVSections.setEnabled(' + i + ', this.checked)"> ' +
        'Show this section' + '</label>' +
        '<div class="form-grid">' +
        txt('Heading', base + '.title') +
        txt('Small label above', base + '.eyebrow') +
        area('Sub text', base + '.sub') +
        (isUp ? '' : modeRadio(base + '.mode')) +
        '</div>' +
        '<div class="section-hint" style="margin:8px 0 0">' + esc(EXPLORE_HINTS[e.id] || '') + '</div>' +
        (!isUp && manual ? carPicker(base + '.slugs') : '') +
        '</div>';
    }).join('');
    return '<p class="section-hint">The category carousels on the <strong>New Cars</strong> page. Rename them, hide them, reorder them by editing this list, or hand-pick the cars in each.</p>' + items;
  }

  function upcomingPanel() {
    var rows = data.upcoming.rows.map(function (r, i) {
      var b = 'upcoming.rows.' + i;
      return '<div style="border:1px solid var(--border);border-radius:8px;padding:12px;margin-bottom:10px;background:var(--bg)">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">' +
        '<strong style="font-size:13px;flex:1">' + esc(r.brand || '') + ' ' + esc(r.model || 'New upcoming car') + '</strong>' +
        '<button class="ico-btn" onclick="AVSections.move(\'upcoming.rows\',' + i + ',-1)">&uarr;</button>' +
        '<button class="ico-btn" onclick="AVSections.move(\'upcoming.rows\',' + i + ',1)">&darr;</button>' +
        '<button class="ico-btn del" onclick="AVSections.removeAt(\'upcoming.rows\',' + i + ')">&times;</button>' +
        '</div>' +
        '<div class="form-grid">' +
        txt('Brand', b + '.brand') +
        txt('Model', b + '.model') +
        txt('Catalogue slug (optional — makes it clickable)', b + '.slug', { full: true }) +
        txt('Status label', b + '.status', { placeholder: 'e.g. Launching Soon' }) +
        '<label class="form-field"><span class="form-lbl">Status colour</span>' +
        '<select class="form-sel" onchange="AVSections.setVal(\'' + b + '.statusCls\', this.value)">' +
        ['launch|Green (launching)', 'expect|Amber (expected)', 'expo|Purple (expo)'].map(function (o) {
          var p = o.split('|');
          return '<option value="' + p[0] + '"' + (r.statusCls === p[0] ? ' selected' : '') + '>' + p[1] + '</option>';
        }).join('') +
        '</select></label>' +
        txt('Expected price', b + '.price') +
        txt('Body type', b + '.body') +
        txt('Fuel', b + '.fuel') +
        txt('ETA', b + '.eta') +
        '<label class="form-field full"><span class="form-lbl">Image URL</span>' +
        '<span style="display:flex;gap:8px"><input class="form-inp" style="flex:1" value="' + esc(r.img) + '" oninput="AVSections.setVal(\'' + b + '.img\', this.value)">' +
        '<button type="button" class="btn" onclick="this.nextElementSibling.click()">Upload</button>' +
        '<input type="file" accept="image/*" style="display:none" onchange="AVSections.uploadImg(\'' + b + '.img\', this)"></span>' +
        (r.img ? '<img src="' + esc(imgSrc(r.img)) + '" style="margin-top:6px;max-width:160px;border-radius:6px">' : '') +
        '</label>' +
        '</div></div>';
    }).join('');
    return '<p class="section-hint">The <strong>Upcoming Cars</strong> page, the homepage "Upcoming Cars" row and the "Upcoming" carousel on the New Cars page all read this list.</p>' +
      '<div class="form-grid">' + txt('Page title', 'upcoming.title', { full: true }) + area('Intro text', 'upcoming.sub') + '</div>' +
      '<div style="margin-top:14px">' + rows + '</div>' +
      '<button class="btn" onclick="AVSections.addRow(\'upcoming.rows\',\'upcoming\')">+ Add upcoming car</button>';
  }

  function popularPanel() {
    var manual = data.popularSidebar.mode === 'manual';
    return '<p class="section-hint">The "Popular Cars" box in the sidebar of every new-car detail page. <strong>Automatic</strong> = the first 6 catalogue cars from your Best Sellers list. The car currently being viewed is always skipped.</p>' +
      '<div class="form-grid">' + modeRadio('popularSidebar.mode') + '</div>' +
      (manual ? carPicker('popularSidebar.slugs') : '');
  }

  /* ---- public actions ---- */
  window.AVSections = {
    tab: function (t) { subTab = t; render(); },
    setVal: function (path, val, num) { setPath(path, num ? (val === '' ? '' : Number(val)) : val); },
    setMode: function (path, m) { setPath(path, m); render(); },
    setEnabled: function (i, on) { data.explore[i].enabled = on; render(); },
    setRowCar: function (rowPath, slug) {
      var row = getPath(rowPath);
      if (!row) return;
      row.slug = slug || null;
      var c = carBySlug(slug);
      if (c) { row.brand = c.brand; row.model = c.model; }
      render();
    },
    move: function (path, i, dir) {
      var arr = getPath(path);
      if (!Array.isArray(arr)) return;
      var j = i + dir;
      if (j < 0 || j >= arr.length) return;
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
      render();
    },
    removeAt: function (path, i) {
      var arr = getPath(path);
      if (Array.isArray(arr)) arr.splice(i, 1);
      render();
    },
    addRow: function (path, kind) {
      var arr = getPath(path);
      if (!Array.isArray(arr)) { setPath(path, []); arr = getPath(path); }
      arr.push(kind === 'upcoming' ? blankUpcoming() : blankBestseller());
      render();
    },
    addSlug: function (path, selId) {
      var sel = $(selId);
      if (!sel || !sel.value) return;
      var arr = getPath(path);
      if (!Array.isArray(arr)) { setPath(path, []); arr = getPath(path); }
      if (arr.indexOf(sel.value) === -1) arr.push(sel.value);
      render();
    },
    uploadImg: async function (path, input) {
      if (!input.files || !input.files.length) return;
      var file = input.files[0];
      var b64 = await new Promise(function (res) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.readAsDataURL(file); });
      try {
        var up = await api()('/api/admin/media/upload', { method: 'POST', body: JSON.stringify({ imageBase64: b64, filename: file.name }) });
        if (up.ok) { var d = await up.json(); setPath(path, d.url); render(); toast('Image uploaded', 'ok'); }
        else toast('Upload failed', 'err');
      } catch (e) { toast('Upload failed', 'err'); }
      input.value = '';
    },
    save: async function () {
      try {
        var r = await api()('/api/admin/site/' + KEY, { method: 'POST', body: JSON.stringify(data) });
        if (!r.ok) throw new Error('Save failed (' + r.status + ')');
        toast('Published — live on website', 'ok');
      } catch (e) { toast(e.message, 'err'); }
    },
  };
})();
