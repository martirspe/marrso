const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const p = await b.newPage({ reducedMotion: 'reduce' });
    for (const [label, width, mode, route] of [
      ['light', 1440, 'claro', '/'],
      ['dark', 1440, 'oscuro', '/'],
      ['mobile-light', 390, 'claro', '/'],
      ['mobile-dark', 360, 'oscuro', '/'],
      ['tablet', 768, 'claro', '/'],
      ['services', 1440, 'claro', '/servicios'],
      ['contact', 390, 'claro', '/contacto'],
    ]) {
      await p.setViewportSize({ width, height: 960 });
      await p.goto('http://127.0.0.1:4300' + route);
      await p.getByRole('button', { name: 'Tema ' + mode, exact: true }).click();
      await p.evaluate(() => document.fonts.ready);
      await p.evaluate(
        () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
      );
      await p.screenshot({ path: 'docs/qa/final-' + label + '.png', fullPage: true });
      if (width === 1440 && route === '/')
        await p.screenshot({ path: 'docs/qa/hero-' + label + '.png' });
    }
    console.log('Second-pass screenshots saved');
  } finally {
    await b.close();
  }
})();
