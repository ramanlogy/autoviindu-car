/* AutoViindu — fetch CMS content from API (live updates from admin) */
(function () {
  'use strict';

  const cache = {};

  async function load(key) {
    if (cache[key]) return cache[key];
    try {
      const r = await fetch('/api/site/' + key, { cache: 'no-store' });
      if (!r.ok) throw new Error('Failed');
      cache[key] = await r.json();
      return cache[key];
    } catch (e) {
      return null;
    }
  }

  function published(items) {
    if (!Array.isArray(items)) return [];
    return items.filter(function (i) { return i.published !== false; });
  }

  window.AVContent = {
    load: load,
    published: published,
    clearCache: function () { Object.keys(cache).forEach(function (k) { delete cache[k]; }); },
  };
})();
