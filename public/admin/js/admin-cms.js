/* AutoViindu Admin — CMS for news, reviews, events & blogs */
(function () {
  'use strict';

  const CMS_TABS = ['articles'];
  const TITLES = { articles: 'Articles & events' };
  const CRUMBS = { articles: 'News, reviews, events & guides — changes go live instantly' };

  let cmsSection = 'news';
  let cmsData = {};
  let editArticle = null;

  const $ = (id) => document.getElementById(id);
  const api = () => window.AdminAPI.api;
  const toast = (m, t) => window.AdminAPI.toast(m, t);

  const SECTIONS = [
    { id: 'news', label: 'News', key: 'news', list: 'items' },
    { id: 'reviews', label: 'Reviews', key: 'reviews', list: 'items' },
    { id: 'events-up', label: 'Upcoming events', key: 'events', list: 'upcoming' },
    { id: 'events-past', label: 'Past events', key: 'events', list: 'past' },
    { id: 'guides', label: 'Buying guides', key: 'blogs', list: 'guides' },
    { id: 'maintenance', label: 'Maintenance tips', key: 'blogs', list: 'maintenance' },
    { id: 'awards', label: 'Awards', key: 'blogs', list: 'awards' },
  ];

  function sectionMeta(id) {
    return SECTIONS.find(function (s) { return s.id === id; }) || SECTIONS[0];
  }

  function getList(section) {
    const meta = sectionMeta(section);
    const data = cmsData[meta.key] || {};
    return data[meta.list] || [];
  }

  function setList(section, list) {
    const meta = sectionMeta(section);
    if (!cmsData[meta.key]) cmsData[meta.key] = {};
    cmsData[meta.key][meta.list] = list;
  }

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function slugify(s) {
    return (s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  const origGo = window.go;
  window.go = function (tab) {
    const all = ['overview', 'leads', 'inventory', 'workspace', 'content', 'articles', 'brands', 'media', 'settings'];
    all.forEach(function (t) {
      const n = $('nav-' + t); if (n) n.classList.toggle('on', t === tab);
      const v = $('view-' + t); if (v) v.style.display = t === tab ? 'block' : 'none';
      const a = $('act-' + t); if (a) a.style.display = t === tab ? 'flex' : 'none';
    });
    const titles = Object.assign({
      overview: 'Dashboard', leads: 'Leads', inventory: 'Cars', workspace: 'Workspace',
      content: 'Site content', brands: 'Brands & budgets', media: 'Media library', settings: 'Settings',
    }, TITLES);
    const crumbs = Object.assign({
      overview: 'Overview & submissions', leads: 'Lead pipeline', inventory: 'New & used inventory',
      workspace: 'Team notices & tasks', content: 'Videos, services & homepage',
      brands: 'Brand pages and price tiers', media: 'Uploaded images', settings: 'Contact, SEO & business info',
    }, CRUMBS);
    if ($('tb-title')) $('tb-title').textContent = titles[tab] || tab;
    if ($('tb-crumb')) $('tb-crumb').textContent = crumbs[tab] || '';
    if (CMS_TABS.indexOf(tab) === -1 && origGo) origGo(tab);
    else {
      if (window.closeSb) window.closeSb();
      if (tab === 'articles') loadArticles();
    }
  };

  async function loadSiteKey(key) {
    const r = await api()('/api/admin/site/' + key);
    if (!r.ok) throw new Error('Failed to load ' + key);
    cmsData[key] = await r.json();
    return cmsData[key];
  }

  async function saveSiteKey(key) {
    const r = await api()('/api/admin/site/' + key, { method: 'POST', body: JSON.stringify(cmsData[key]) });
    if (!r.ok) throw new Error('Save failed');
    toast('Published — live on website', 'ok');
  }

  window.loadArticles = async function () {
    const panel = $('articles-panel');
    if (panel) panel.innerHTML = '<div class="empty">Loading content…</div>';
    try {
      await Promise.all([
        loadSiteKey('news').catch(function () { cmsData.news = { items: [], categories: [] }; }),
        loadSiteKey('reviews').catch(function () { cmsData.reviews = { items: [], categories: [] }; }),
        loadSiteKey('events').catch(function () { cmsData.events = { upcoming: [], past: [], categories: {} }; }),
        loadSiteKey('blogs').catch(function () { cmsData.blogs = { guides: [], maintenance: [], awards: [], categories: {} }; }),
      ]);
      renderArticlesPanel();
    } catch (e) {
      if (panel) panel.innerHTML = '<div class="empty">' + esc(e.message) + '</div>';
    }
  };

  window.setCmsSection = function (section, btn) {
    cmsSection = section;
    document.querySelectorAll('#cms-section-tabs .tab').forEach(function (t) { t.classList.remove('on'); });
    if (btn) btn.classList.add('on');
    renderArticlesPanel();
  };

  function renderArticlesPanel() {
    const panel = $('articles-panel');
    if (!panel) return;
    const meta = sectionMeta(cmsSection);
    const list = getList(cmsSection);
    const srch = ($('cms-srch') && $('cms-srch').value || '').toLowerCase();

    let filtered = list;
    if (srch) {
      filtered = list.filter(function (i) {
        return (i.title || '').toLowerCase().includes(srch) ||
          (i.excerpt || '').toLowerCase().includes(srch) ||
          (i.cat || '').toLowerCase().includes(srch);
      });
    }

    panel.innerHTML =
      '<div class="cms-toolbar">' +
      '<div class="tab-row" id="cms-section-tabs">' +
      SECTIONS.map(function (s) {
        return '<button class="tab' + (cmsSection === s.id ? ' on' : '') + '" onclick="setCmsSection(\'' + s.id + '\',this)">' + s.label +
          ' <span class="cms-count">' + (getList(s.id).length) + '</span></button>';
      }).join('') +
      '</div>' +
      '<div class="cms-toolbar-r">' +
      '<div class="srch"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
      '<input type="text" id="cms-srch" placeholder="Search…" value="' + esc(srch) + '" oninput="renderArticlesPanel()"></div>' +
      '<button class="btn btn-dark" onclick="openArticleEditor()">+ Add ' + meta.label.replace(/s$/, '') + '</button>' +
      '</div></div>' +
      '<p class="section-hint">Changes save instantly to the live website. Use clear titles, a short excerpt, and one paragraph per line in the body field.</p>' +
      '<div class="cms-list">' +
      (filtered.length ? filtered.map(function (item, idx) {
        const realIdx = list.indexOf(item);
        const pub = item.published !== false;
        return '<div class="cms-card' + (pub ? '' : ' draft') + '">' +
          '<div class="cms-card-thumb">' + (item.img ?
            '<img src="' + esc(item.img) + '" alt="">' :
            '<span class="cms-no-img">' + esc((item.icon || 'file-text').slice(0, 2)) + '</span>') +
          '</div>' +
          '<div class="cms-card-body">' +
          '<div class="cms-card-top"><span class="badge bg-n">' + esc(item.cat || 'General') + '</span>' +
          (pub ? '<span class="badge bg-g">Live</span>' : '<span class="badge bg-a">Draft</span>') +
          (item.rating ? '<span class="badge bg-b">★ ' + item.rating + '</span>' : '') +
          '</div>' +
          '<div class="cms-card-title">' + esc(item.title) + '</div>' +
          '<div class="cms-card-meta">' + esc(item.date || '') + (item.read ? ' · ' + esc(item.read) : '') + '</div>' +
          '<p class="cms-card-excerpt">' + esc((item.excerpt || '').slice(0, 120)) + '</p>' +
          '</div>' +
          '<div class="cms-card-actions">' +
          '<button class="ico-btn" title="Edit" onclick="openArticleEditor(' + realIdx + ')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>' +
          '<button class="ico-btn del" title="Delete" onclick="deleteArticle(' + realIdx + ')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg></button>' +
          '</div></div>';
      }).join('') : '<div class="empty">No articles yet. Click “Add” to create one.</div>') +
      '</div>';

    window.renderArticlesPanel = renderArticlesPanel;
  }

  window.openArticleEditor = function (idx) {
    const list = getList(cmsSection);
    const isNew = idx === undefined;
    const item = isNew ? blankArticle() : JSON.parse(JSON.stringify(list[idx]));
    editArticle = { section: cmsSection, idx: isNew ? -1 : idx, item: item };
    renderArticleDrawer();
    $('article-drawer').classList.add('on');
  };

  function blankArticle() {
    const base = {
      id: 'a' + Date.now(),
      cat: 'General',
      catKey: 'general',
      title: '',
      excerpt: '',
      date: new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      read: '3 min read',
      icon: 'file-text',
      img: '',
      photos: [],
      body: [''],
      published: true,
    };
    if (cmsSection === 'reviews') base.rating = 4.0;
    if (cmsSection.indexOf('events') === 0) {
      Object.assign(base, { venue: '', time: '10:00 AM – 5:00 PM', dnum: '01', dmon: 'JAN', status: cmsSection === 'events-past' ? 'done' : 'open' });
    }
    if (cmsSection === 'awards') {
      Object.assign(base, { winner: '', runnerUp: '' });
    }
    if (cmsSection === 'guides' || cmsSection === 'maintenance') {
      base.level = 'beginner';
    }
    return base;
  }

  function renderArticleDrawer() {
    const item = editArticle.item;
    const isReview = cmsSection === 'reviews';
    const isEvent = cmsSection.indexOf('events') === 0;
    const isAward = cmsSection === 'awards';
    const isGuide = cmsSection === 'guides' || cmsSection === 'maintenance';

    $('article-drawer-title').textContent = item.title || 'New article';
    $('article-drawer-sub').textContent = sectionMeta(cmsSection).label;

    let extra = '';
    if (isReview) {
      extra += field('Star rating (1–5)', 'a-rating', item.rating, 'number');
    }
    if (isEvent) {
      extra += field('Venue', 'a-venue', item.venue) +
        field('Time', 'a-time', item.time) +
        field('Day number', 'a-dnum', item.dnum) +
        field('Month label', 'a-dmon', item.dmon) +
        selectField('Status', 'a-status', item.status, ['open', 'closing', 'done']);
    }
    if (isAward) {
      extra += field('Winner', 'a-winner', item.winner) + field('Runner-up', 'a-runner', item.runnerUp);
    }
    if (isGuide) {
      extra += selectField('Level', 'a-level', item.level, ['beginner', 'intermediate', 'advanced']);
    }

    $('article-editor-panes').innerHTML =
      '<div class="form-grid">' +
      field('Title', 'a-title', item.title) +
      field('Category label', 'a-cat', item.cat) +
      field('Category key (for filters)', 'a-catkey', item.catKey) +
      field('Date shown', 'a-date', item.date) +
      field('Read time', 'a-read', item.read) +
      field('Icon name (Lucide)', 'a-icon', item.icon) +
      extra +
      '<div class="form-field full"><label class="form-lbl">Featured image URL (thumbnail)</label>' +
      '<div style="display:flex;gap:8px"><input class="form-inp" id="a-img" value="' + esc(item.img) + '" style="flex:1">' +
      '<button type="button" class="btn" onclick="document.getElementById(\'a-img-file\').click()">Upload</button></div>' +
      '<input type="file" id="a-img-file" accept="image/*" style="display:none" onchange="uploadArticleImage(this)">' +
      (item.img ? '<img src="' + esc(item.img) + '" class="cms-preview-img" alt="">' : '') +
      '</div>' +
      '<div class="form-field full"><label class="form-lbl">Photo gallery (shown on the article page)</label>' +
      '<div class="cms-gallery-grid">' +
      (item.photos || []).map(function (url, i) {
        return '<div class="cms-gallery-thumb"><img src="' + esc(url) + '" alt="">' +
          '<button type="button" class="cms-gallery-del" title="Remove" onclick="removeArticlePhoto(' + i + ')">&times;</button></div>';
      }).join('') +
      '</div>' +
      '<button type="button" class="btn" onclick="document.getElementById(\'a-photos-file\').click()">Add photos</button>' +
      '<input type="file" id="a-photos-file" accept="image/*" multiple style="display:none" onchange="addArticlePhotos(this)">' +
      '</div>' +
      '<div class="form-field full"><label class="form-lbl">Short excerpt (shown on cards)</label>' +
      '<textarea class="form-ta" id="a-excerpt" rows="3">' + esc(item.excerpt) + '</textarea></div>' +
      '<div class="form-field full"><label class="form-lbl">Article body — one paragraph per line</label>' +
      '<textarea class="form-ta" id="a-body" rows="8">' + esc((item.body || []).join('\n')) + '</textarea></div>' +
      '<div class="form-field"><label class="form-check"><input type="checkbox" id="a-published"' + (item.published !== false ? ' checked' : '') + '> Published (visible on website)</label></div>' +
      '</div>';
  }

  function field(lbl, id, val, type) {
    type = type || 'text';
    return '<div class="form-field"><label class="form-lbl">' + lbl + '</label><input class="form-inp" id="' + id + '" type="' + type + '" value="' + esc(val != null ? val : '') + '"></div>';
  }

  function selectField(lbl, id, val, opts) {
    return '<div class="form-field"><label class="form-lbl">' + lbl + '</label><select class="form-sel" id="' + id + '">' +
      opts.map(function (o) { return '<option value="' + o + '"' + (val === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') +
      '</select></div>';
  }

  window.uploadArticleImage = async function (input) {
    if (!input.files.length) return;
    const file = input.files[0];
    const b64 = await new Promise(function (res) { const r = new FileReader(); r.onload = function () { res(r.result); }; r.readAsDataURL(file); });
    try {
      const up = await api()('/api/admin/media/upload', { method: 'POST', body: JSON.stringify({ imageBase64: b64, filename: file.name }) });
      if (up.ok) {
        const d = await up.json();
        $('a-img').value = d.url;
        renderArticleDrawer();
        toast('Image uploaded', 'ok');
      }
    } catch (_) { toast('Upload failed', 'err'); }
    input.value = '';
  };

  window.addArticlePhotos = async function (input) {
    if (!input.files.length || !editArticle) return;
    const files = Array.prototype.slice.call(input.files);
    for (const file of files) {
      const b64 = await new Promise(function (res) { const r = new FileReader(); r.onload = function () { res(r.result); }; r.readAsDataURL(file); });
      try {
        const up = await api()('/api/admin/media/upload', { method: 'POST', body: JSON.stringify({ imageBase64: b64, filename: file.name }) });
        if (up.ok) {
          const d = await up.json();
          if (!editArticle.item.photos) editArticle.item.photos = [];
          editArticle.item.photos.push(d.url);
        }
      } catch (_) { toast('Upload failed: ' + file.name, 'err'); }
    }
    renderArticleDrawer();
    toast('Photos uploaded', 'ok');
    input.value = '';
  };

  window.removeArticlePhoto = function (idx) {
    if (!editArticle || !editArticle.item.photos) return;
    editArticle.item.photos.splice(idx, 1);
    renderArticleDrawer();
  };

  window.saveArticleEditor = async function () {
    if (!editArticle) return;
    const g = function (id) { const el = $(id); return el ? el.value : ''; };
    const gc = function (id) { const el = $(id); return el ? el.checked : false; };
    const item = editArticle.item;

    item.title = g('a-title').trim();
    item.cat = g('a-cat').trim() || 'General';
    item.catKey = g('a-catkey').trim() || slugify(item.cat);
    item.date = g('a-date').trim();
    item.read = g('a-read').trim() || '3 min read';
    item.icon = g('a-icon').trim() || 'file-text';
    item.img = g('a-img').trim();
    item.excerpt = g('a-excerpt').trim();
    item.body = g('a-body').split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
    item.published = gc('a-published');
    if (!item.body.length) item.body = [''];

    if (cmsSection === 'reviews') item.rating = parseFloat(g('a-rating')) || 4;
    if (cmsSection.indexOf('events') === 0) {
      item.venue = g('a-venue').trim();
      item.time = g('a-time').trim();
      item.dnum = g('a-dnum').trim();
      item.dmon = g('a-dmon').trim().toUpperCase();
      item.status = g('a-status');
    }
    if (cmsSection === 'awards') {
      item.winner = g('a-winner').trim();
      item.runnerUp = g('a-runner').trim();
    }
    if (cmsSection === 'guides' || cmsSection === 'maintenance') item.level = g('a-level');

    if (!item.title) { toast('Title is required', 'err'); return; }

    const list = getList(cmsSection).slice();
    if (editArticle.idx === -1) list.unshift(item);
    else list[editArticle.idx] = item;
    setList(cmsSection, list);

    try {
      await saveSiteKey(sectionMeta(cmsSection).key);
      closeArticleEditor();
      renderArticlesPanel();
    } catch (e) { toast(e.message, 'err'); }
  };

  window.deleteArticle = async function (idx) {
    const list = getList(cmsSection);
    if (!confirm('Delete “' + (list[idx].title || 'this item') + '”? This cannot be undone.')) return;
    list.splice(idx, 1);
    setList(cmsSection, list);
    try {
      await saveSiteKey(sectionMeta(cmsSection).key);
      renderArticlesPanel();
      toast('Deleted', 'ok');
    } catch (e) { toast(e.message, 'err'); }
  };

  window.closeArticleEditor = function () {
    $('article-drawer').classList.remove('on');
    editArticle = null;
  };

})();
