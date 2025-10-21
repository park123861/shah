(function(){
  const KEY = 'designSettings';
  const TRANSITION_CLASS = 'theme-transition';
  const DEFAULT_ANIM_MS = 900;

  function applyTheme(s, animate = true) {
    if (!s) return;
    // set CSS vars / font / background
    if (s.primary) document.documentElement.style.setProperty('--primary', s.primary);
    if (s.accent) document.documentElement.style.setProperty('--accent', s.accent);
    if (s.font) document.body.style.fontFamily = s.font;
    if (s.bg) document.documentElement.style.setProperty('--bg', s.bg);

    // add theme class if provided (optional)
    if (s.theme) {
      document.documentElement.classList.remove('theme-space','theme-neon','theme-ocean','theme-sunset','theme-min');
      document.documentElement.classList.add(s.theme);
    }

    // animate: add transition class and a per-animation class
    if (animate && s.animation) {
      const animClass = 'anim-' + s.animation;
      document.documentElement.classList.add(TRANSITION_CLASS, animClass);
      // force reflow so animation triggers reliably
      void document.documentElement.offsetWidth;
      // remove anim class after timeout
      setTimeout(() => {
        document.documentElement.classList.remove(animClass);
        // keep transition class for smoother subsequent changes briefly, then remove
        setTimeout(() => document.documentElement.classList.remove(TRANSITION_CLASS), 420);
      }, s.animation === 'flip' ? 1100 : DEFAULT_ANIM_MS);
    }
  }

  function loadAndApply(animate = true) {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      applyTheme(s, animate);
    } catch (e) { console.error('theme load error', e); }
  }

  // apply on load
  document.addEventListener('DOMContentLoaded', () => loadAndApply(true));

  // listen for explicit dispatch from designs page in same tab
  window.addEventListener('designThemeApplied', (ev) => applyTheme(ev.detail, true));

  // storage event for other tabs/windows: re-apply when designSettings changes
  window.addEventListener('storage', (e) => {
    if (e.key === KEY || e.key === (KEY + ':updatedAt')) {
      loadAndApply(true);
    }
  });
})();