# Despliegue en producción

Esta guía parte de un VPS sin copia de MARRSO y termina con `https://marrso.com` operativo. Angular SSR corre en Docker y escucha solo en `127.0.0.1:8090` del VPS; nginx publica el dominio por HTTPS. Amazon SES envía las consultas del formulario.

## 1. Entrar y preparar el VPS

Desde tu equipo:

```bash
ssh usuario@IP_DEL_VPS
```

El VPS necesita Git, Docker con Compose, nginx, curl, Certbot y `python3-certbot-nginx`. El usuario de despliegue debe poder ejecutar `docker compose` y `sudo`. Compruébalo en el VPS:

```bash
git --version
docker --version
docker compose version
nginx -v
certbot --version
curl --version
```

Configura los registros A de `marrso.com` y `www.marrso.com` hacia la IP pública del VPS. Si existen registros AAAA, deben apuntar a un IPv6 funcional del mismo VPS; elimina los obsoletos. Abre los puertos 80 y 443. Comprueba que el puerto local 8090 esté libre; si no, elige otro `WEB_PORT`. Certbot necesita que ambos dominios resuelvan y que el puerto 80 sea accesible desde Internet.

## 2. Clonar desde Git

En el VPS:

```bash
sudo mkdir -p /opt/marrso
sudo chown "$USER":"$USER" /opt/marrso
cd /opt/marrso
git clone https://github.com/martirspe/marrso.git .
git switch main
git status --short
git rev-parse --short HEAD
```

El repositorio debe quedar en `main` y sin cambios locales. Si el repositorio requiere autenticación, configura el acceso Git del usuario del VPS antes de clonar. Conservar `.git` permite actualizar y revertir por commit.

## 3. Copiar el `.env` privado

El `.env` preparado en tu equipo contiene la clave IAM limitada al envío SES y se ignora en Git. Desde una terminal **en tu equipo**, situada en la raíz del repositorio local:

```bash
scp .env usuario@IP_DEL_VPS:/opt/marrso/.env
```

Vuelve a la sesión SSH:

```bash
cd /opt/marrso
chmod 600 .env
docker compose config --quiet
```

El archivo `.env` debe pertenecer al usuario que ejecuta `docker compose` (por ejemplo, `devops`) y tener permisos `600`. Si se copió con `sudo` y quedó a nombre de `root`, corrige la propiedad con `sudo chown "$USER:$USER" .env` antes de ejecutar el despliegue sin `sudo`.

Si necesitas recrearlo, copia `.env.production.example` a `.env` y completa `WEB_PORT`, `AWS_REGION`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `SES_CONFIGURATION_SET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` y `CERTBOT_EMAIL`. Usa `SES_CONFIGURATION_SET=marrso-prod-contact`, `CONTACT_FROM_EMAIL=notificaciones@marrso.com` y `CONTACT_TO_EMAIL=contacto@marrso.com`. El destinatario debe ser un buzón atendido. Antes de cambiar el remitente en el VPS, aplica Terraform con `from_email=notificaciones@marrso.com`: la política IAM limita el envío a esa dirección. No pongas credenciales en `public/`, archivos versionados, argumentos de comandos ni mensajes de chat.

## 4. Comprobar SES y DNS de correo

En SES `us-east-1`, la identidad `marrso.com`, DKIM y MAIL FROM deben estar verificados y el acceso de producción habilitado. Los tres CNAME DKIM, MX y SPF de `bounce.marrso.com`, y el único DMARC del dominio se administran fuera del módulo SES de MARRSO. La operación de la infraestructura se describe en [infra/terraform/README.md](../infra/terraform/README.md).

Confirma desde `contacto@marrso.com` la suscripción al tópico SNS `marrso-prod-email-alerts`. Si AWS muestra `PendingConfirmation`, el formulario puede enviar, pero las alertas no llegarán por correo.

## 5. Primer despliegue

En el VPS:

```bash
cd /opt/marrso
bash scripts/deploy.sh
```

El script valida `.env`, construye la imagen, inicia Docker Compose y espera a que el healthcheck de `/healthz` indique que la aplicación está lista. Después crea el vhost nginx si falta, prueba y recarga nginx, y solicita el certificado para `marrso.com` y `www.marrso.com`. La aplicación solo escucha en loopback mediante `WEB_PORT` (8090 por defecto).

Antes de desplegar puedes ejecutar `bash scripts/deploy.sh --check` para verificar Docker, `.env` y Compose sin cambiar los servicios. `--skip-nginx` despliega solo el contenedor; `--skip-tls` configura nginx sin solicitar un certificado. Al igual que en los otros proyectos del VPS, `--pull` exige un árbol de Git limpio y usa `git pull --ff-only`.

Si DNS aún no apunta al VPS, prepara el contenedor y nginx con `bash scripts/deploy.sh --skip-tls`; ejecuta después `bash scripts/deploy.sh` cuando ambos nombres resuelvan y el puerto 80 sea accesible. El script no reescribe un vhost existente: si cambias `WEB_PORT`, actualiza también su `proxy_pass`.

## 6. Verificar el resultado

En el VPS:

```bash
docker compose ps
curl -fsS -H 'Host: marrso.com' http://127.0.0.1:8090/healthz >/dev/null
curl -I https://marrso.com/
curl -I https://www.marrso.com/contacto
sudo nginx -t
sudo certbot certificates
docker compose logs --tail=100 app
```

Sustituye `8090` si cambiaste `WEB_PORT`. Comprueba las páginas en escritorio y móvil. Envía una consulta real desde `/contacto`: debe llegar a `CONTACT_TO_EMAIL` y permitir responder a la dirección del visitante. Revisa las alarmas `marrso-prod-ses-bounce-rate` y `marrso-prod-ses-complaint-rate`, y la suscripción SNS confirmada. No imprimas el contenido de `.env` en logs ni tickets.

## 7. Actualizar y revertir

Anota el commit desplegado. En el VPS:

```bash
cd /opt/marrso
git rev-parse --short HEAD
bash scripts/deploy.sh --pull
git rev-parse --short HEAD
```

`--pull` hace `git pull --ff-only` de `main` y vuelve a construir. Mantén `.env` fuera de Git. Si falla la publicación, vuelve temporalmente al commit anterior anotado:

```bash
cd /opt/marrso
git switch --detach COMMIT_ANTERIOR
bash scripts/deploy.sh
```

Cuando la incidencia esté corregida, vuelve a `main` y despliega:

```bash
git switch main
bash scripts/deploy.sh --pull
```

## 8. Diagnóstico rápido

| Síntoma                                | Comprobación                                                                                      |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `git clone` solicita acceso o falla    | Revisa los permisos del repositorio y las credenciales Git del usuario del VPS.                   |
| `docker compose config` falla          | Revisa que `.env` exista en `/opt/marrso` y sus variables requeridas.                             |
| El health check local falla            | Revisa `docker compose ps`, `docker compose logs --tail=100 app` y que `WEB_PORT` esté libre.     |
| Certbot no emite                       | Comprueba A/AAAA de ambos nombres y acceso público al puerto 80; repite `bash scripts/deploy.sh`. |
| HTTPS muestra otro sitio o certificado | Comprueba el vhost `marrso.com`, su `server_name`, el certificado y nginx.                        |
| El formulario responde con error       | Comprueba región, remitente, destinatario, conjunto SES, credenciales e identidad verificada.     |
| No llegan alertas                      | Comprueba que la suscripción SNS no figure `PendingConfirmation`.                                 |

Si se sospecha exposición de la clave IAM, crea una nueva, actualiza `.env` en el VPS, comprueba el envío y desactiva la anterior.
