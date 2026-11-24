type ContactEmail = {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
};

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!,
  );

export function contactEmailContent({ name, email, company, service, message }: ContactEmail) {
  const text = `Nueva consulta desde marrso.com/contacto\n\nServicio: ${service}\nNombre: ${name}\nCorreo: ${email}\nEmpresa: ${company || 'No indicada'}\n\nMensaje:\n${message}\n\nResponde directamente a este correo para contactar a ${name}.`;
  const detail = (label: string, value: string) => `
    <tr><td style="padding:13px 0;border-bottom:1px solid #e7e9e5;color:#59635d;font-size:13px;width:110px;vertical-align:top">${label}</td>
    <td style="padding:13px 0;border-bottom:1px solid #e7e9e5;color:#17221b;font-size:15px;font-weight:600;vertical-align:top;word-break:break-word">${value}</td></tr>`;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r\n?|\n/g, '<br>');
  const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nueva consulta web — MARRSO</title></head>
<body style="margin:0;padding:0;background:#f3f5f1;color:#17221b;font-family:Arial,Helvetica,sans-serif">
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;opacity:0;overflow:hidden">Nueva consulta sobre ${escapeHtml(service)} de ${safeName}.</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f5f1"><tr><td align="center" style="padding:32px 16px">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border:1px solid #e2e7df;border-radius:12px">
      <tr><td style="padding:28px 32px;background:#17221b;border-radius:12px 12px 0 0">
        <p style="margin:0;color:#d6ff80;font-size:17px;font-weight:800;letter-spacing:2px">MARRSO</p>
        <p style="margin:18px 0 6px;color:#d6ff80;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Formulario de contacto</p>
        <h1 style="margin:0;color:#ffffff;font-size:27px;line-height:1.25">Nueva consulta web</h1>
      </td></tr>
      <tr><td style="padding:30px 32px">
        <p style="margin:0 0 22px;color:#46524a;font-size:15px;line-height:1.6">Recibiste una consulta desde <strong>marrso.com/contacto</strong>. Estos son los datos enviados por la persona interesada.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
          ${detail('Servicio', escapeHtml(service))}
          ${detail('Nombre', safeName)}
          ${detail('Correo', `<a href="mailto:${safeEmail}" style="color:#1d5d3b;text-decoration:underline">${safeEmail}</a>`)}
          ${detail('Empresa', escapeHtml(company || 'No indicada'))}
        </table>
        <h2 style="margin:28px 0 12px;color:#17221b;font-size:17px">Mensaje</h2>
        <div style="padding:20px;background:#f6f8f3;border-left:4px solid #9bcd4f;border-radius:4px;color:#253229;font-size:15px;line-height:1.7;overflow-wrap:anywhere">${safeMessage}</div>
        <p style="margin:24px 0 0;color:#59635d;font-size:13px;line-height:1.6">Puedes responder directamente a este correo para contactar a ${safeName}.</p>
      </td></tr>
      <tr><td style="padding:18px 32px;border-top:1px solid #e7e9e5;color:#68736a;font-size:12px;line-height:1.5">Notificación interna de MARRSO · Enviada desde el formulario de contacto.</td></tr>
    </table>
  </td></tr></table>
</body></html>`;
  return { text, html };
}
