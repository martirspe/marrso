const { chromium } = require('playwright');
const { expect } = require('@playwright/test');
(async () => {
  const b = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const p = await b.newPage({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
    p.on('pageerror', (e) => console.log('ERROR', e.message));
    await p.goto('http://127.0.0.1:4401');
    for (const mode of ['claro', 'oscuro']) {
      const button = p.getByRole('button', { name: 'Tema ' + mode, exact: true });
      await button.click();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await p.evaluate(() => document.fonts.ready);
      await p.locator('.desktop a.nav-link').first().hover();
      await p.screenshot({ path: 'docs/qa/header-' + mode + '.png' });
      await p.getByRole('button', { name: 'Ecosistema', exact: true }).click();
      await p.screenshot({ path: 'docs/qa/header-menu-' + mode + '.png' });
      await p.keyboard.press('Escape');
      await p.evaluate(() => window.scrollTo(0, 1200));
      await expect(p.getByRole('button', { name: 'Volver arriba' })).toBeVisible();
      await p.screenshot({ path: 'docs/qa/floating-' + mode + '.png' });
      await p.getByRole('button', { name: 'Volver arriba' }).click();
      await expect.poll(() => p.evaluate(() => window.scrollY)).toBe(0);
    }
    await p.setViewportSize({ width: 360, height: 800 });
    await p.screenshot({ path: 'docs/qa/header-mobile.png' });
    await p.getByRole('button', { name: 'Menú', exact: true }).click();
    await p.screenshot({ path: 'docs/qa/header-mobile-menu.png' });
    await p.keyboard.press('Escape');
    await p.evaluate(() => {
      const hero = document.querySelector('.hero');
      window.scrollTo(0, hero.getBoundingClientRect().bottom + window.scrollY);
    });
    await expect(p.getByRole('button', { name: 'Volver arriba' })).toBeVisible();
    await p.screenshot({ path: 'docs/qa/floating-mobile.png' });
    console.log('Headers captured');
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
