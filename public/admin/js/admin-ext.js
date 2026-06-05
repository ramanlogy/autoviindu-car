/* AutoViindu Admin — extended modules */
(function () {
  'use strict';

  const EXTRA = ['content', 'brands', 'media', 'settings'];
  const TITLES = {
    content: 'Site content',
    brands: 'Brands & budgets',
    media: 'Media library',
    settings: 'Settings',
  };
  const CRUMBS = {
    content: 'Videos, services & charging map',
    brands: 'Brand pages and price tiers',
    media: 'Uploaded images',
    settings: 'Contact, SEO & business info',
  };

  let siteData = {};
  let contentTab = 'videos';
  let analytics = null;

  const $ = (id) => document.getElementById(id);
  const api = window.AdminAPI ? window.AdminAPI.api : async () => { throw new Error('Admin API not ready'); };
  const toast = window.AdminAPI ? window.AdminAPI.toast : (m) => alert(m);

  const origGo = window.go;
  window.go = function (tab) {
    const all = ['overview', 'leads', 'inventory', 'workspace'].concat(EXTRA);
    all.forEach((t) => {
      const n = $('nav-' + t); if (n) n.classList.toggle('on', t === tab);
      const v = $('view-' + t); if (v) v.style.display = t === tab ? 'block' : 'none';
      const a = $('act-' + t); if (a) a.style.display = t === tab ? 'flex' : 'none';
    });
    const titles = Object.assign({ overview: 'Dashboard', leads: 'Leads', inventory: 'Cars', workspace: 'Workspace' }, TITLES);
    const crumbs = Object.assign({
      overview: 'Overview & submissions',
      leads: 'Lead pipeline',
      inventory: 'New & used inventory',
      workspace: 'Team notices & tasks',
    }, CRUMBS);
    if ($('tb-title')) $('tb-title').textContent = titles[tab] || tab;
    if ($('tb-crumb')) $('tb-crumb').textContent = crumbs[tab] || '';
    if (EXTRA.indexOf(tab) === -1 && origGo) origGo(tab);
    else {
      if (window.closeSb) window.closeSb();
      if (tab === 'content') loadContent();
      if (tab === 'brands') loadBrands();
      if (tab === 'media') loadMedia();
      if (tab === 'settings') loadSettings();
    }
  };

  async function loadSiteKey(key) {
    const r = await api('/api/admin/site/' + key);
    if (!r.ok) throw new Error('Failed to load ' + key);
    siteData[key] = await r.json();
    return siteData[key];
  }

  async function saveSiteKey(key, data) {
    const r = await api('/api/admin/site/' + key, { method: 'POST', body: JSON.stringify(data) });
    if (!r.ok) throw new Error('Save failed');
    siteData[key] = data;
    toast('Saved', 'ok');
  }

  /* ── Analytics on overview ── */
  window.loadAnalytics = async function () {
    try {
      const r = await api('/api/admin/analytics');
      if (!r.ok) return;
      analytics = await r.json();
      const el = $('insights-panel');
      if (!el) return;
      const brands = (analytics.topBrands || []).map(([b, n]) => '<span class="inv-chip"><strong>' + n + '</strong> ' + b + '</span>').join('');
      el.innerHTML =
        '<div class="card" style="margin-bottom:16px"><div class="card-head"><div class="card-title">Inventory insights</div></div>' +
        '<div style="padding:14px 16px">' +
        '<div class="inv-stats" style="margin-bottom:12px">' +
        '<div class="inv-chip"><strong>' + analytics.totalNew + '</strong> new listings</div>' +
        '<div class="inv-chip"><strong>' + analytics.totalUsed + '</strong> used listings</div>' +
        '<div class="inv-chip"><strong>' + analytics.totalEV + '</strong> electric</div>' +
        '<div class="inv-chip"><strong>' + analytics.leadsLast7Days + '</strong> leads (7 days)</div>' +
        '</div>' +
        '<div style="font-size:11px;font-weight:600;color:var(--text-3);text-transform:uppercase;margin-bottom:8px">Top brands</div>' +
        '<div class="inv-stats">' + (brands || '<span class="inv-chip">No data</span>') + '</div>' +
        '</div></div>';
    } catch (_) {}
  };

  const origFetch = window.fetchData;
  window.fetchData = async function () {
    await origFetch();
    loadAnalytics();
  };

  /* ── Settings ── */
  async function loadSettings() {
    const s = await loadSiteKey('settings');
    const box = $('settings-form');
    if (!box) return;
    box.innerHTML =
      '<div class="form-grid">' +
      field('Business name', 's-name', s.businessName) +
      field('Phone', 's-phone', s.phone) +
      field('WhatsApp', 's-wa', s.whatsapp) +
      field('Email', 's-email', s.email) +
      field('Address', 's-address', s.address) +
      field('Business hours', 's-hours', s.hours) +
      field('Tagline', 's-tagline', s.tagline) +
      field('Facebook URL', 's-fb', (s.social || {}).facebook) +
      field('Instagram URL', 's-ig', (s.social || {}).instagram) +
      field('YouTube URL', 's-yt', (s.social || {}).youtube) +
      field('Default EMI rate (%)', 's-emi-rate', (s.emi || {}).defaultRate, 'number') +
      field('Default tenure (months)', 's-emi-tenure', (s.emi || {}).defaultTenure, 'number') +
      '<div class="form-field full"><label class="form-lbl">SEO title</label><input class="form-inp" id="s-seo-title" value="' + esc((s.seo || {}).defaultTitle || '') + '"></div>' +
      '<div class="form-field full"><label class="form-lbl">SEO description</label><textarea class="form-ta" id="s-seo-desc" rows="3">' + esc((s.seo || {}).defaultDescription || '') + '</textarea></div>' +
      '</div>' +
      '<div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">' +
      '<button class="btn btn-green" onclick="saveSettings()">Save settings</button>' +
      '<button class="btn" onclick="regenSitemap()">Regenerate sitemap</button>' +
      '</div>';
  }

  window.saveSettings = async function () {
    const g = (id) => ($(id) && $(id).value) || '';
    const data = {
      businessName: g('s-name'),
      phone: g('s-phone'),
      whatsapp: g('s-wa'),
      email: g('s-email'),
      address: g('s-address'),
      hours: g('s-hours'),
      tagline: g('s-tagline'),
      social: { facebook: g('s-fb'), instagram: g('s-ig'), youtube: g('s-yt') },
      emi: { defaultRate: parseFloat(g('s-emi-rate')) || 9.5, defaultTenure: parseInt(g('s-emi-tenure'), 10) || 60 },
      seo: { defaultTitle: g('s-seo-title'), defaultDescription: g('s-seo-desc') },
    };
    try { await saveSiteKey('settings', data); } catch (e) { toast(e.message, 'err'); }
  };

  window.regenSitemap = async function () {
    try {
      const r = await api('/api/admin/sitemap/regenerate', { method: 'POST' });
      const d = await r.json();
      toast(r.ok ? 'Sitemap updated (' + d.urlCount + ' URLs)' : 'Failed', r.ok ? 'ok' : 'err');
    } catch (e) { toast(e.message, 'err'); }
  };

  /* ── Content (videos, services, charging, homepage) ── */
  window.setContentTab = function (tab, btn) {
    contentTab = tab;
    document.querySelectorAll('#content-tabs .tab').forEach((t) => t.classList.remove('on'));
    if (btn) btn.classList.add('on');
    renderContentPanel();
  };

  window.loadContent = loadContent;

  async function loadContent() {
    await Promise.all([
      loadSiteKey('videos').catch(() => {}),
      loadSiteKey('services').catch(() => {}),
      loadSiteKey('charging-stations').catch(() => {}),
      loadSiteKey('homepage').catch(() => {}),
    ]);
    renderContentPanel();
  }

  function renderContentPanel() {
    const panel = $('content-panel');
    if (!panel) return;
    if (contentTab === 'videos') panel.innerHTML = renderVideosEditor();
    else if (contentTab === 'services') panel.innerHTML = renderServicesEditor();
    else if (contentTab === 'charging') panel.innerHTML = renderChargingEditor();
    else if (contentTab === 'homepage') panel.innerHTML = renderHomepageEditor();
  }

  function renderVideosEditor() {
    const items = (siteData.videos && siteData.videos.items) || [];
    return '<div class="card-head" style="border:none;padding:0 0 12px"><div class="card-title">YouTube videos</div>' +
      '<button class="btn btn-dark" onclick="addVideo()">+ Add video</button></div>' +
      '<div class="content-list">' + items.map((v, i) =>
        '<div class="content-row">' +
        '<div class="form-grid" style="flex:1">' +
        field('', 'v-id-' + i, v.id) +
        field('', 'v-title-' + i, v.title) +
        field('', 'v-brand-' + i, v.brand) +
        field('', 'v-cat-' + i, v.category) +
        field('', 'v-dur-' + i, v.duration) +
        field('', 'v-views-' + i, v.views) +
        '</div>' +
        '<button class="ico-btn del" onclick="removeVideo(' + i + ')">×</button></div>'
      ).join('') + '</div>' +
      '<button class="btn btn-green" style="margin-top:14px" onclick="saveVideos()">Save videos</button>';
  }

  window.addVideo = function () {
    if (!siteData.videos) siteData.videos = { items: [] };
    siteData.videos.items.push({ id: '', title: '', sub: '', brand: '', duration: '', views: '', category: 'Reviews', thumb: '', featured: false });
    renderContentPanel();
  };
  window.removeVideo = function (i) { siteData.videos.items.splice(i, 1); renderContentPanel(); };
  window.saveVideos = async function () {
    const items = (siteData.videos.items || []).map((_, i) => ({
      id: val('v-id-' + i), title: val('v-title-' + i), sub: '', brand: val('v-brand-' + i),
      category: val('v-cat-' + i), duration: val('v-dur-' + i), views: val('v-views-' + i), thumb: '', featured: i === 0,
    }));
    try { await saveSiteKey('videos', { items }); renderContentPanel(); } catch (e) { toast(e.message, 'err'); }
  };

  function renderServicesEditor() {
    const cats = (siteData.services && siteData.services.categories) || [];
    return '<p class="section-hint">Service categories shown on the Services page. One service per line in the list field.</p>' +
      cats.map((c, i) =>
        '<div class="content-block">' +
        '<div class="form-grid">' +
        field('Category name', 'svc-name-' + i, c.name) +
        field('Icon', 'svc-icon-' + i, c.icon) +
        field('Color', 'svc-color-' + i, c.color) +
        '<div class="form-field full"><label class="form-lbl">Services (one per line)</label><textarea class="form-ta" id="svc-items-' + i + '" rows="4">' + esc((c.items || []).join('\n')) + '</textarea></div>' +
        '</div></div>'
      ).join('') +
      '<button class="btn btn-green" style="margin-top:14px" onclick="saveServices()">Save services</button>';
  }

  window.saveServices = async function () {
    const cats = (siteData.services.categories || []).map((c, i) => ({
      id: c.id || slugify(val('svc-name-' + i)),
      name: val('svc-name-' + i),
      icon: val('svc-icon-' + i),
      color: val('svc-color-' + i),
      bg: c.bg || '#f5f5f5',
      items: (val('svc-items-' + i) || '').split('\n').map((s) => s.trim()).filter(Boolean),
    }));
    try { await saveSiteKey('services', { categories: cats }); } catch (e) { toast(e.message, 'err'); }
  };

  function renderChargingEditor() {
    const stations = (siteData['charging-stations'] && siteData['charging-stations'].stations) || [];
    return '<div class="card-head" style="border:none;padding:0 0 12px"><div class="card-title">EV charging stations (' + stations.length + ')</div>' +
      '<button class="btn btn-dark" onclick="addStation()">+ Add station</button></div>' +
      '<div class="t-wrap"><table><thead><tr><th>Name</th><th>City</th><th>Operator</th><th>Status</th><th></th></tr></thead><tbody>' +
      stations.map((s, i) =>
        '<tr><td><input class="form-inp" id="st-name-' + i + '" value="' + esc(s.name) + '"></td>' +
        '<td><input class="form-inp" id="st-city-' + i + '" value="' + esc(s.city) + '"></td>' +
        '<td><input class="form-inp" id="st-op-' + i + '" value="' + esc(s.operator) + '"></td>' +
        '<td><select class="form-sel" id="st-status-' + i + '"><option value="available"' + (s.status === 'available' ? ' selected' : '') + '>Available</option><option value="busy"' + (s.status === 'busy' ? ' selected' : '') + '>Busy</option><option value="offline"' + (s.status === 'offline' ? ' selected' : '') + '>Offline</option></select></td>' +
        '<td><button class="ico-btn del" onclick="removeStation(' + i + ')">×</button></td></tr>'
      ).join('') + '</tbody></table></div>' +
      '<button class="btn btn-green" style="margin-top:14px" onclick="saveStations()">Save stations</button>';
  }

  window.addStation = function () {
    if (!siteData['charging-stations']) siteData['charging-stations'] = { stations: [] };
    siteData['charging-stations'].stations.push({
      id: Date.now(), name: 'New Station', operator: 'NEA', city: 'Kathmandu',
      address: '', lat: 27.7, lng: 85.3, power: 60, guns: 2, plugs: ['CCS2'],
      type: 'DC Fast', status: 'available', hours: '00:00–24:00', rate: 17,
    });
    renderContentPanel();
  };
  window.removeStation = function (i) { siteData['charging-stations'].stations.splice(i, 1); renderContentPanel(); };
  window.saveStations = async function () {
    const stations = (siteData['charging-stations'].stations || []).map((s, i) => Object.assign({}, s, {
      name: val('st-name-' + i), city: val('st-city-' + i), operator: val('st-op-' + i), status: val('st-status-' + i),
    }));
    try { await saveSiteKey('charging-stations', { stations }); renderContentPanel(); } catch (e) { toast(e.message, 'err'); }
  };

  function renderHomepageEditor() {
    const hp = siteData.homepage || {};
    const slides = hp.heroSlides || [];
    const searches = (hp.popularSearches || []).join('\n');
    return '<p class="section-hint">Hero carousel slides and popular search chips on the homepage.</p>' +
      slides.map((sl, i) =>
        '<div class="content-block"><div class="form-grid">' +
        field('Title', 'hp-title-' + i, sl.title) +
        field('Badge', 'hp-badge-' + i, sl.badge) +
        field('Car slug (link)', 'hp-slug-' + i, sl.slug) +
        field('Background image URL', 'hp-bg-' + i, sl.bg) +
        '<div class="form-field full"><label class="form-lbl">Subtitle</label><textarea class="form-ta" id="hp-sub-' + i + '" rows="2">' + esc(sl.sub || '') + '</textarea></div>' +
        field('Offer label', 'hp-ol-' + i, sl.offerLabel) +
        field('Offer value', 'hp-ov-' + i, sl.offerVal) +
        '</div><button class="btn btn-ghost btn-red" style="margin-top:8px" onclick="removeHeroSlide(' + i + ')">Remove slide</button></div>'
      ).join('') +
      '<button class="btn" style="margin:10px 0" onclick="addHeroSlide()">+ Add slide</button>' +
      '<div class="form-field"><label class="form-lbl">Popular searches (one per line)</label><textarea class="form-ta" id="hp-searches" rows="4">' + esc(searches) + '</textarea></div>' +
      '<button class="btn btn-green" onclick="saveHomepage()">Save homepage</button>';
  }

  window.addHeroSlide = function () {
    if (!siteData.homepage) siteData.homepage = { heroSlides: [], popularSearches: [], events: [] };
    siteData.homepage.heroSlides.push({ title: '', badge: '', sub: '', bg: '', offerLabel: '', offerVal: '', slug: '' });
    renderContentPanel();
  };
  window.removeHeroSlide = function (i) { siteData.homepage.heroSlides.splice(i, 1); renderContentPanel(); };
  window.saveHomepage = async function () {
    const slides = (siteData.homepage.heroSlides || []).map((_, i) => ({
      title: val('hp-title-' + i), badge: val('hp-badge-' + i), slug: val('hp-slug-' + i),
      bg: val('hp-bg-' + i), sub: val('hp-sub-' + i), offerLabel: val('hp-ol-' + i), offerVal: val('hp-ov-' + i),
    }));
    const popularSearches = (val('hp-searches') || '').split('\n').map((s) => s.trim()).filter(Boolean);
    try { await saveSiteKey('homepage', { heroSlides: slides, popularSearches, events: siteData.homepage.events || [] }); } catch (e) { toast(e.message, 'err'); }
  };

  /* ── Brands & budgets ── */
  async function loadBrands() {
    await Promise.all([loadSiteKey('brands').catch(() => {}), loadSiteKey('budget-tiers').catch(() => {})]);
    renderBrandsPanel();
  }

  function renderBrandsPanel() {
    const panel = $('brands-panel');
    if (!panel) return;
    const brands = (siteData.brands && siteData.brands.items) || [];
    const tiers = (siteData['budget-tiers'] && siteData['budget-tiers'].items) || [];
    panel.innerHTML =
      '<div class="ws-grid">' +
      '<div class="card"><div class="card-head"><div class="card-title">Brands (' + brands.length + ')</div></div>' +
      '<div class="t-wrap" style="max-height:420px;overflow-y:auto"><table><thead><tr><th>Brand</th><th>Slug</th><th>Tagline</th></tr></thead><tbody>' +
      brands.map((b, i) => '<tr><td class="c-bold">' + esc(b.name) + '</td><td class="c-mono">' + esc(b.slug) + '</td><td class="c-dim">' + esc((b.tagline || '').slice(0, 40)) + '</td></tr>').join('') +
      '</tbody></table></div>' +
      '<p class="section-hint" style="padding:12px 16px">Brand pages use <code>brands-db.js</code>. Edit full brand copy in that file or add entries via JSON export/import later.</p></div>' +
      '<div class="card"><div class="card-head"><div class="card-title">Budget tiers (' + tiers.length + ')</div></div>' +
      '<div style="padding:14px">' + tiers.map((t, i) =>
        '<div class="content-block" style="margin-bottom:10px"><div class="form-grid">' +
        field('Label', 'bt-label-' + i, t.label) +
        field('Slug', 'bt-slug-' + i, t.slug) +
        field('Min price', 'bt-min-' + i, t.min, 'number') +
        field('Max price', 'bt-max-' + i, t.max === Infinity ? '' : t.max, 'number') +
        field('Hero text', 'bt-hero-' + i, t.heroText) +
        '</div></div>'
      ).join('') +
      '<button class="btn btn-green" onclick="saveBudgetTiers()">Save budget tiers</button></div></div></div>';
  }

  window.saveBudgetTiers = async function () {
    const tiers = (siteData['budget-tiers'].items || []).map((t, i) => ({
      slug: val('bt-slug-' + i),
      label: val('bt-label-' + i),
      shortLabel: val('bt-label-' + i).replace(/Rs\.?\s*/g, '').slice(0, 12),
      min: parseInt(val('bt-min-' + i), 10) || 0,
      max: parseInt(val('bt-max-' + i), 10) || 999999999,
      heroText: val('bt-hero-' + i),
      targetBuyer: t.targetBuyer || '',
      emoji: t.emoji || '⭐',
      color: t.color || '#1A6B2A',
      bgColor: t.bgColor || '#EEF7F0',
    }));
    try {
      await saveSiteKey('budget-tiers', { items: tiers });
      await api('/api/admin/publish-budget-tiers', { method: 'POST', body: JSON.stringify(tiers) }).catch(() => {});
      toast('Budget tiers saved', 'ok');
    } catch (e) { toast(e.message, 'err'); }
  };

  /* ── Media library ── */
  async function loadMedia() {
    const grid = $('media-grid');
    if (!grid) return;
    grid.innerHTML = '<div class="empty">Loading…</div>';
    try {
      const r = await api('/api/admin/media');
      const files = await r.json();
      if (!files.length) { grid.innerHTML = '<div class="empty">No uploads yet. Add images when editing cars.</div>'; return; }
      grid.innerHTML = files.map((f) =>
        '<div class="media-tile">' +
        '<img src="' + f.url + '" alt="" loading="lazy">' +
        '<div class="media-tile-foot">' +
        '<span class="c-mono" style="font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="' + f.name + '">' + f.name + '</span>' +
        '<div style="display:flex;gap:4px">' +
        '<button class="ico-btn" title="Copy URL" onclick="navigator.clipboard.writeText(\'' + f.url + '\');toast(\'Copied\',\'ok\')">⎘</button>' +
        '<button class="ico-btn del" onclick="deleteMedia(\'' + f.name + '\')">×</button>' +
        '</div></div></div>'
      ).join('');
    } catch (e) { grid.innerHTML = '<div class="empty">' + e.message + '</div>'; }
  }

  window.deleteMedia = async function (name) {
    if (!confirm('Delete ' + name + '?')) return;
    try {
      await api('/api/admin/media/' + encodeURIComponent(name), { method: 'DELETE' });
      toast('Deleted', 'ok');
      loadMedia();
    } catch (e) { toast(e.message, 'err'); }
  };

  /* ── Lead enhancements ── */
  window.saveLeadNote = async function (idx) {
    const notes = window.AdminAPI.leadNotes || {};
    const inp = $('lead-note-' + idx);
    if (inp) notes[idx] = inp.value;
    window.AdminAPI.leadNotes = notes;
    if (window.AdminAPI.saveMeta) await window.AdminAPI.saveMeta();
    toast('Note saved', 'ok');
  };

  window.deleteLead = async function (idx) {
    if (!confirm('Delete this submission permanently?')) return;
    try {
      const r = await api('/api/forms/responses/' + idx, { method: 'DELETE' });
      if (r.ok) { toast('Deleted', 'ok'); fetchData(); closeModal(); }
      else toast('Delete failed', 'err');
    } catch (e) { toast(e.message, 'err'); }
  };

  /* ── Helpers ── */
  function field(lbl, id, val, type) {
    type = type || 'text';
    const label = lbl ? '<label class="form-lbl">' + lbl + '</label>' : '';
    return '<div class="form-field">' + label + '<input class="form-inp" id="' + id + '" type="' + type + '" value="' + esc(val != null ? val : '') + '"></div>';
  }
  function val(id) { const el = $(id); return el ? (el.value || '') : ''; }
  function esc(s) { return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }
  function slugify(s) { return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

})();
