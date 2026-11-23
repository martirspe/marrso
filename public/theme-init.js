/* Blocking, same-origin bootstrap: runs before styles and Angular hydration. */
(() => {
  let preference = 'system';
  try {
    const saved = localStorage.getItem('marrso-appearance');
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {
    /* Storage may be unavailable; system remains usable. */
  }
  const dark =
    preference === 'dark' ||
    (preference === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.dataset['appearance'] = preference;
})();
