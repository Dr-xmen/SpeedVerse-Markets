// notif-popup.js — Persistent announcement popup for SpeedVerse user pages
// Call initNotifPopup(db, userId) after auth resolves on any user page.

(function () {
  const STYLE = `
    #svnp-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      z-index: 99999; display: flex; align-items: center; justify-content: center;
      padding: 20px; animation: svnpFadeIn .2s ease;
    }
    @keyframes svnpFadeIn  { from { opacity: 0 } to { opacity: 1 } }
    @keyframes svnpSlideUp { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
    #svnp-box {
      background: #111318; border-radius: 16px; width: 100%; max-width: 480px;
      box-shadow: 0 24px 64px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.07);
      animation: svnpSlideUp .25s ease; overflow: hidden;
    }
    #svnp-header {
      display: flex; align-items: center; gap: 12px;
      padding: 18px 22px; border-bottom: 1px solid rgba(255,255,255,.07);
    }
    #svnp-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
    #svnp-title { font-size: 16px; font-weight: 700; flex: 1; color: #eaecef; font-family: inherit; }
    #svnp-close {
      background: none; border: none; font-size: 20px; color: #666;
      cursor: pointer; padding: 0 2px; line-height: 1;
    }
    #svnp-close:hover { color: #eaecef; }
    #svnp-body {
      padding: 20px 22px; font-size: 14px; line-height: 1.7;
      color: #adb4c0; word-break: break-word; white-space: pre-wrap;
    }
    #svnp-footer { padding: 12px 22px 20px; display: flex; justify-content: flex-end; gap: 10px; }
    #svnp-btn {
      height: 40px; padding: 0 24px; border: none; border-radius: 8px;
      font-size: 14px; font-weight: 600; cursor: pointer; color: #fff;
    }
    #svnp-btn:hover { filter: brightness(1.1); }
    body.light #svnp-box    { background: #fff; box-shadow: 0 24px 64px rgba(0,0,0,.18); }
    body.light #svnp-header { border-color: #e0e3e8; }
    body.light #svnp-title  { color: #111; }
    body.light #svnp-close  { color: #999; }
    body.light #svnp-close:hover { color: #111; }
    body.light #svnp-body   { color: #444; }
  `;

  const TYPE_CONFIG = {
    info:    { color: '#2196f3', label: 'Info' },
    warning: { color: '#f5a623', label: 'Warning' },
    success: { color: '#0ecb81', label: 'Success' },
    urgent:  { color: '#e60023', label: 'Urgent' },
  };

  function _injectStyles() {
    if (document.getElementById('svnp-styles')) return;
    const s = document.createElement('style');
    s.id = 'svnp-styles';
    s.textContent = STYLE;
    document.head.appendChild(s);
  }

  function _removePopup() {
    const el = document.getElementById('svnp-overlay');
    if (el) el.remove();
  }

  function _showPopup(notif) {
    _removePopup();
    _injectStyles();
    const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.info;
    const overlay = document.createElement('div');
    overlay.id = 'svnp-overlay';
    overlay.innerHTML = `
      <div id="svnp-box">
        <div id="svnp-header">
          <div id="svnp-dot" style="background:${cfg.color};box-shadow:0 0 8px ${cfg.color}88;"></div>
          <div id="svnp-title">${String(notif.title || 'Notice').replace(/</g, '&lt;')}</div>
          <button id="svnp-close" onclick="document.getElementById('svnp-overlay').remove()" title="Dismiss">&#x2715;</button>
        </div>
        <div id="svnp-body">${String(notif.message || '').replace(/</g, '&lt;')}</div>
        <div id="svnp-footer">
          <button id="svnp-btn" style="background:${cfg.color};" onclick="document.getElementById('svnp-overlay').remove()">Got it</button>
        </div>
      </div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  // Public API — call after auth resolves on every user page
  window.initNotifPopup = async function (db, userId) {
    if (!db || !userId) return;
    try {
      const { data, error } = await db
        .from('notifications')
        .select('id, title, message, type, enabled')
        .eq('user_id', userId)
        .eq('enabled', true)
        .not('announcement_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1);
      if (error) { console.warn('[notif-popup]', error.message); return; }
      if (data?.length) _showPopup(data[0]);
    } catch (_) {}
  };
})();
