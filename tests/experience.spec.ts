import { test, expect, type Page } from '@playwright/test';

async function selectTheme(page: Page, label: string) {
  const value = ({ claro: 'light', oscuro: 'dark', sistema: 'system' } as Record<string, string>)[
    label
  ];
  const button = page.locator('app-theme-switcher button');
  await expect(button).toBeEnabled();
  for (let i = 0; i < 3 && (await button.getAttribute('data-theme-preference')) !== value; i++) {
    const previous = await button.getAttribute('data-theme-preference');
    await button.click();
    await expect(button).not.toHaveAttribute('data-theme-preference', previous!);
  }
  await expect(button).toHaveAttribute('data-theme-preference', value);
}

const widths = [360, 390, 768, 1024, 1280, 1440, 1920];
const routes = [
  '/',
  '/ecosistema',
  '/servicios',
  '/nosotros',
  '/proyectos',
  '/contacto',
  '/privacidad',
  '/terminos',
];
test('responsive, all routes and both palettes', async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const mode of ['claro', 'oscuro']) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 960 });
      for (const route of routes) {
        await page.goto(route);
        await selectTheme(page, mode);
        await expect(page.locator('h1')).toHaveCount(1);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        );
        expect(overflow, `${mode} ${width} ${route} horizontal overflow`).toBe(false);
      }
    }
  }
  expect(errors).toEqual([]);
});

test('appearance persists, respects explicit selection and follows system changes', async ({
  page,
  context,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass('dark');
  await selectTheme(page, 'claro');
  await page.reload();
  await expect(page.locator('html')).not.toHaveClass('dark');
  await expect(page.locator('app-theme-switcher button')).toHaveAttribute(
    'data-theme-preference',
    'light',
  );
  await selectTheme(page, 'sistema');
  await expect(page.locator('html')).toHaveClass('dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).not.toHaveClass('dark');
  const other = await context.newPage();
  await other.goto('/');
  await selectTheme(other, 'oscuro');
  await expect(page.locator('html')).toHaveClass('dark');
  await other.close();
});

test('keyboard navigation and product interactions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByText('Saltar al contenido principal')).toBeFocused();
  await page.getByRole('button', { name: 'Ecosistema', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Ecosistema', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Deportivo', exact: true }).click();
  await expect(page.locator('.chat-result')).toContainText('deportivo');
  await page.locator('.search-prompt').click();
  await expect(page.locator('.property-grid h4')).toContainText('interpretada');
  await page.locator('.layer-list button').nth(2).click();
  await expect(page.locator('.layer-detail h3')).toContainText('Inteligencia conectada');
  await page.locator('summary').first().click();
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Menú', exact: false }).click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mobile-menu')).toBeHidden();
  expect(await page.locator('.geometry').evaluate((el) => getComputedStyle(el).animationName)).toBe(
    'none',
  );
});

test('contact validation and download remain functional', async ({ page }) => {
  await page.goto('/contacto');
  await page.getByRole('button', { name: 'Descargar resumen del proyecto' }).click();
  await expect(page.getByRole('status')).toContainText('Revisa los campos');
  await page.locator('[formcontrolname="name"]').fill('Prueba de interfaz');
  await page.locator('[formcontrolname="email"]').fill('qa@example.com');
  await page
    .locator('[formcontrolname="service"]')
    .selectOption({ label: 'Ingeniería de software' });
  await page
    .locator('[formcontrolname="message"]')
    .fill('Prueba local de un proyecto de software empresarial.');
  await page.locator('[formcontrolname="privacy"]').check();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Descargar resumen del proyecto' }).click();
  expect((await downloadPromise).suggestedFilename()).toBe('consulta-marrso.txt');
});

test('theme bootstrap works before Angular and when storage is blocked', async ({ browser }) => {
  for (const blocked of [false, true]) {
    const context = await browser.newContext({ colorScheme: 'dark' });
    const page = await context.newPage();
    if (blocked)
      await page.addInitScript(() =>
        Object.defineProperty(window, 'localStorage', {
          get() {
            throw new Error('blocked');
          },
        }),
      );
    await page.route(/main(?:-[^/]+)?\.js/, (route) => route.abort());
    await page.goto('/');
    await expect(page.locator('html')).toHaveClass('dark');
    await context.close();
  }
});

test('semantic text and controls meet contrast targets in both themes', async ({ page }) => {
  await page.goto('/');
  for (const mode of ['claro', 'oscuro']) {
    await selectTheme(page, mode);
    const ratios = await page.evaluate(() => {
      const s = getComputedStyle(document.documentElement);
      const luminance = (token: string) => {
        const hex = s.getPropertyValue(token).trim().slice(1);
        const rgb = [0, 2, 4]
          .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
          .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
        return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
      };
      const ratio = (a: string, b: string) => {
        const x = luminance(a),
          y = luminance(b);
        return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
      };
      return ['--background', '--surface', '--surface-elevated']
        .flatMap((bg) =>
          ['--foreground', '--muted-foreground', '--accent', '--indigo', '--destructive'].map(
            (fg) => ({ pair: fg + '/' + bg, value: ratio(fg, bg), min: 4.5 }),
          ),
        )
        .concat([
          { pair: 'primary', value: ratio('--primary', '--primary-foreground'), min: 4.5 },
          { pair: 'input', value: ratio('--input', '--background'), min: 3 },
        ]);
    });
    for (const item of ratios)
      expect(item.value, `${mode} ${item.pair}`).toBeGreaterThanOrEqual(item.min);
  }
});

test('back to top preserves the floating stack and returns focus to content', async ({ page }) => {
  for (const width of [360, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    for (const route of ['/', '/servicios']) {
      await page.goto(route);
      await expect(page.locator('app-theme-switcher button')).toBeEnabled();
      const top = page.locator('.back-top');
      const whatsapp = page.getByRole('link', { name: /Escribir a MARRSO por WhatsApp/ });
      await expect(top).toBeHidden();
      const initial = await whatsapp.boundingBox();
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect(top).toBeVisible();
      expect(await whatsapp.boundingBox()).toEqual(initial);
      const rect = await top.boundingBox();
      expect(rect!.y + rect!.height).toBeLessThan(initial!.y);
      await top.focus();
      await page.keyboard.press('Enter');
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await expect(top).toBeHidden();
      await expect(page.locator('main')).toBeFocused();
    }
  }
});

test('header logos, disclosure dismissal and WhatsApp destination', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto('/');
  for (const [theme, logo] of [
    ['claro', 'black'],
    ['oscuro', 'white'],
  ]) {
    await selectTheme(page, theme);
    await expect(page.locator(`header .brand img[src$="${logo}.svg"]`)).toBeVisible();
    expect(
      await page
        .locator(`header .brand img[src$="${logo}.svg"]`)
        .evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0),
    ).toBe(true);
  }
  await page.getByRole('button', { name: 'Ecosistema', exact: true }).click();
  await expect(page.locator('#ecosystem-menu')).toBeVisible();
  // Click outside the disclosure independently of the headline's line wrapping.
  const menuBounds = await page.locator('#ecosystem-menu').boundingBox();
  expect(menuBounds).not.toBeNull();
  await page.mouse.click(20, menuBounds!.y + menuBounds!.height + 20);
  await expect(page.locator('#ecosystem-menu')).toHaveCount(0);
  await page.getByRole('button', { name: 'Ecosistema', exact: true }).click();
  await page.locator('#ecosystem-menu a').filter({ hasText: 'Aloja Cloud' }).click();
  await expect(page).toHaveURL(/ecosistema#aloja/);
  await expect(page.locator('#ecosystem-menu')).toHaveCount(0);
  const whatsapp = page.getByRole('link', { name: /Escribir a MARRSO por WhatsApp/ });
  await expect(whatsapp).toHaveAttribute('href', 'https://wa.me/51957049957');
  await expect(whatsapp).toHaveAttribute('target', '_blank');
  // Check the destination without sending a message or opening the external service.
  await page.setViewportSize({ width: 360, height: 800 });
  await page.getByRole('button', { name: 'Menú', exact: true }).click();
  await expect(page.locator('#mobile-menu')).toBeVisible();
  await page.locator('#mobile-menu a').filter({ hasText: 'Servicios' }).click();
  await expect(page.locator('#mobile-menu')).toBeHidden();
  await expect(page).toHaveURL(/servicios/);
  const rect = await whatsapp.boundingBox();
  expect(rect).not.toBeNull();
  expect(rect!.x + rect!.width).toBeLessThanOrEqual(360);
  expect(rect!.y + rect!.height).toBeLessThanOrEqual(800);
});
