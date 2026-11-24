import { describe, expect, it } from 'vitest';
import { contactEmailContent } from './contact-email';

describe('contactEmailContent', () => {
  it('includes all form details in both versions and escapes user HTML', () => {
    const content = contactEmailContent({
      name: 'Ana <script>alert(1)</script>',
      email: 'ana@example.com',
      company: '',
      service: 'Diseño y desarrollo web',
      message: 'Primera línea\n<img src=x onerror=alert(1)>',
    });

    expect(content.text).toContain('Empresa: No indicada');
    expect(content.text).toContain('Primera línea\n<img src=x onerror=alert(1)>');
    expect(content.html).toContain('mailto:ana%40example.com');
    expect(content.html).toContain('cid:marrso-logo-white');
    expect(content.html).toContain('cid:marrso-logo-black');
    expect(content.html).toContain('Primera línea<br>&lt;img');
    expect(content.html).not.toContain('<script>');
    expect(content.html).not.toContain('<img src=x');
  });
});
