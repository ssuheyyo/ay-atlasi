/* Ay Atlası: GitHub Pages için yerel veri katmanı. Sunucuya kişisel kayıt göndermez. */
(() => {
  const KEY = 'ay-atlasi-v1';
  const OLD_KEY = 'lunara-defter-v1';
  function read() {
    try { const data = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem(OLD_KEY) || 'null'); if (data && Array.isArray(data.items) && data.settings) return data; } catch (_) {}
    return { items: [], settings: { theme: 'red', motion: true } };
  }
  function write(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch (_) { throw Error('Tarayıcı depolama alanı dolu veya kapalı. Ayarlardan yedek alıp yer aç.'); }
  }
  window.localApi = async (path, body) => {
    const db = read();
    if (path === 'items') return { items: db.items.filter(x => !x.deleted) };
    if (path === 'settings') {
      if (body) { Object.assign(db.settings, body); write(db); }
      return { settings: { ...db.settings } };
    }
    if (path === 'item') {
      if (!body || !body.kind || typeof body.data !== 'object') throw Error('Geçersiz kayıt');
      const item = { id: body.id || crypto.randomUUID(), kind: body.kind, data: body.data, updated: Date.now() / 1000, deleted: false };
      const index = db.items.findIndex(x => x.id === item.id);
      if (index < 0) db.items.push(item); else db.items[index] = item;
      write(db); return { item };
    }
    if (path === 'delete') {
      const item = db.items.find(x => x.id === body?.id);
      if (item) { item.deleted = true; item.updated = Date.now() / 1000; write(db); }
      return { ok: true };
    }
    if (path === 'export') return { format: 'ay-atlasi-1', exported: new Date().toISOString(), ...db };
    if (path === 'import') {
      if (!['ay-atlasi-1', 'lunara-defter-1', 'piksel-defter-1'].includes(body?.format) || !Array.isArray(body.items)) throw Error('Desteklenmeyen yedek dosyası');
      let merged = 0;
      for (const item of body.items) {
        if (!item || typeof item.id !== 'string' || typeof item.kind !== 'string' || typeof item.data !== 'object') continue;
        const index = db.items.findIndex(x => x.id === item.id);
        if (index < 0) { db.items.push(item); merged++; }
        else if ((item.updated || 0) > (db.items[index].updated || 0)) { db.items[index] = item; merged++; }
      }
      if (body.settings && typeof body.settings === 'object') Object.assign(db.settings, body.settings);
      write(db); return { merged };
    }
    throw Error('Bilinmeyen işlem: ' + path);
  };
})();
