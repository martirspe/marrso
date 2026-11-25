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
  const replyHref = `mailto:${encodeURIComponent(email)}`;
  const safeMessage = escapeHtml(message).replace(/\r\n?|\n/g, '<br>');
  const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nueva consulta web — MARRSO</title></head>
<body style="margin:0;padding:0;background:#f1f2ef;color:#1b1c1a;font-family:Arial,Helvetica,sans-serif">
  <div style="display:none;font-size:1px;line-height:1px;max-height:0;opacity:0;overflow:hidden">Nueva consulta sobre ${escapeHtml(service)} de ${safeName}.</div>
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f1f2ef"><tr><td align="center" style="padding:32px 12px">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;background:#ffffff;border:1px solid #e2e4df;border-radius:10px">
      <tr><td style="padding:28px 36px 34px;background:#1b1c1a;border-radius:10px 10px 0 0">
        <img src="https://marrso.com/logos/email/logo-marrso-white.png" width="150" height="29" alt="MARRSO" style="display:block;width:150px;height:29px;border:0;color:#ffffff;font-size:18px;font-weight:700;letter-spacing:2px">
        <div style="height:1px;background:#444740;margin:26px 0 28px;line-height:1px;font-size:1px">&nbsp;</div>
        <p style="margin:0 0 10px;color:#c5f46b;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Nueva oportunidad · Formulario web</p>
        <h1 style="margin:0;color:#ffffff;font-size:30px;font-weight:700;line-height:1.25">Una nueva consulta<br>para MARRSO.</h1>
        <p style="margin:14px 0 0;color:#c9cdc5;font-size:14px;line-height:1.6">${safeName} quiere conversar sobre un proyecto.</p>
      </td></tr>
      <tr><td style="padding:31px 36px 35px">
        <p style="margin:0 0 8px;color:#6a7068;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase">Servicio de interés</p>
        <p style="margin:0 0 27px;color:#1b1c1a;font-size:20px;font-weight:700;line-height:1.4">${escapeHtml(service)}</p>
        <h2 style="margin:0 0 6px;color:#1b1c1a;font-size:16px;font-weight:700">Datos de contacto</h2>
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse">
          ${detail('Nombre', safeName)}
          ${detail('Correo', `<a href="${replyHref}" style="color:#365520;text-decoration:underline">${safeEmail}</a>`)}
          ${detail('Empresa', escapeHtml(company || 'No indicada'))}
        </table>
        <h2 style="margin:29px 0 12px;color:#1b1c1a;font-size:16px;font-weight:700">Mensaje del proyecto</h2>
        <div style="padding:22px;background:#f5f6f2;border-left:3px solid #addb5a;color:#30352e;font-size:15px;line-height:1.7;overflow-wrap:anywhere">${safeMessage}</div>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:27px"><tr><td bgcolor="#1b1c1a" style="border-radius:5px"><a href="${replyHref}" style="display:inline-block;padding:14px 22px;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none">Responder consulta</a></td></tr></table>
        <p style="margin:17px 0 0;color:#697068;font-size:12px;line-height:1.6">También puedes responder directamente a este correo: el destinatario de la respuesta ya es ${safeEmail}.</p>
      </td></tr>
      <tr><td style="padding:23px 36px;border-top:1px solid #e9ebe6;background:#fafbf8;border-radius:0 0 10px 10px">
        <img src="https://marrso.com/logos/email/logo-marrso-black.png" width="100" height="19" alt="MARRSO" style="display:block;width:100px;height:19px;border:0;color:#1b1c1a;font-size:13px;font-weight:700;letter-spacing:2px">
        <p style="margin:12px 0 0;color:#757b73;font-size:11px;line-height:1.6">Notificación interna generada desde marrso.com/contacto.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
  return { text, html };
}
