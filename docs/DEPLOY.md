# Despliegue de MARRSO en producción

Esta guía publica el sitio Angular SSR en `marrso.com` y `www.marrso.com`. Docker Compose expone la aplicación solo en `127.0.0.1:${WEB_PORT}`; nginx del VPS sirve el dominio y Certbot gestiona HTTPS. El formulario usa Amazon SES en `us-east-1`.

## 1. Preparar el VPS

- Requisitos: Git, Docker con Compose, nginx, `curl`, Certbot y el complemento `python3-certbot-nginx`. El usuario de despliegue debe poder ejecutar Docker y `sudo` para nginx y Certbot.
- Configurar los registros A/AAAA de `marrso.com` y `www.marrso.com` hacia el VPS. Abrir los puertos 80 y 443. Comprobar que el puerto local `8090` está libre; si no, elegir otro `WEB_PORT`.
- Clonar este repositorio en un directorio persistente del VPS. El script se ejecuta desde cualquier ruta, pero asume que el repositorio y `.env` están presentes.
- Comprobar que el servidor puede acceder a AWS SES por HTTPS (puerto 443).

## 2. Preparar variables privadas

El `.env` local ya contiene la clave IAM limitada al remitente `contacto@marrso.com`. Se ignora en Git. Transfiérelo al directorio raíz del repositorio en el VPS por un canal seguro y restringe su lectura al usuario de despliegue:

```bash
chmod 600 .env
```

Si se prepara un entorno desde cero, partir de `.env.production.example` y completar `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `SES_CONFIGURATION_SET`, `CERTBOT_EMAIL` y `WEB_PORT`. No colocar claves en `public/`, en la imagen Docker ni en Git. El contenedor recibe `.env` mediante `docker-compose.yml`.

`CONTACT_TO_EMAIL` debe ser un buzón atendido. `CONTACT_FROM_EMAIL` debe usar el dominio verificado. `SES_CONFIGURATION_SET=marrso-prod-contact` habilita los eventos de entrega y reputación.

## 3. Validar antes de publicar

En el repositorio local:

```bash
npm ci
npm run typecheck
npm run test:unit
npm run build
```

En el VPS, antes del primer despliegue:

```bash
docker compose config --quiet
nginx -t
```

Confirmar en SES que la identidad `marrso.com` está verificada, DKIM y MAIL FROM tienen estado `SUCCESS`, y la cuenta permite envíos de producción. Confirmar por correo la suscripción SNS de `marrso-prod-email-alerts`; si figura `PendingConfirmation`, las alertas no llegarán. La operación de Terraform se describe en [infra/terraform/README.md](../infra/terraform/README.md).

## 4. Publicar

En el VPS, desde el repositorio:

```bash
bash scripts/deploy.sh
```

Para una actualización posterior desde la rama configurada en ese clon:

```bash
bash scripts/deploy.sh --pull
```

El script valida variables, construye la imagen, inicia el contenedor, espera una respuesta local en `/contacto`, crea el vhost nginx si falta, recarga nginx y solicita o renueva el certificado TLS. `--skip-tls` omite Certbot cuando se prepara una primera publicación sin DNS listo. Si el vhost ya existe, el script no lo sobrescribe: revisar su `proxy_pass` cuando se cambie `WEB_PORT`.

## 5. Verificar y operar

```bash
curl -I https://marrso.com/
curl -I https://marrso.com/contacto
docker compose ps
docker compose logs --tail=100 app
```

Abrir el sitio en escritorio y móvil. Enviar una consulta real desde el formulario y confirmar que llega a `CONTACT_TO_EMAIL`, que `Reply-To` apunta al correo del visitante y que no aparecen errores de SES. El endpoint limita intentos y no debe registrar datos personales en los logs. Revisar las alarmas `marrso-prod-ses-bounce-rate` y `marrso-prod-ses-complaint-rate` y la suscripción SNS confirmada.

Para revertir una publicación fallida, volver al commit anterior en el clon del VPS y ejecutar `bash scripts/deploy.sh` de nuevo. Preservar `.env` y la configuración DNS. Registrar el commit desplegado para poder repetir el rollback. Si se sospecha que la clave IAM se expuso, crear una nueva, actualizar `.env` en el VPS, comprobar el envío y desactivar la anterior.
