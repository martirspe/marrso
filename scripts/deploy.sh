#!/usr/bin/env bash
# Deploy on the shared VPS. Usage: bash scripts/deploy.sh [--pull] [--skip-tls]
set -euo pipefail
cd "$(dirname "$0")/.."

PULL=false
SKIP_TLS=false
for arg in "$@"; do
  case "$arg" in
    --pull) PULL=true ;;
    --skip-tls) SKIP_TLS=true ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done
command -v docker >/dev/null
command -v curl >/dev/null
command -v nginx >/dev/null
test -f .env || { echo 'Copy .env.production.example to .env and configure it.' >&2; exit 1; }
if "$PULL"; then git pull --ff-only; fi

set -a
# shellcheck disable=SC1091
source .env
set +a
WEB_PORT="${WEB_PORT:-8090}"
[[ "$WEB_PORT" =~ ^[0-9]+$ ]] || { echo 'Invalid WEB_PORT' >&2; exit 1; }
for key in AWS_REGION CONTACT_FROM_EMAIL CONTACT_TO_EMAIL; do
  [[ -n "${!key:-}" ]] || { echo "Missing $key" >&2; exit 1; }
done
[[ "$CONTACT_FROM_EMAIL" == *@marrso.com ]] || { echo 'CONTACT_FROM_EMAIL must use marrso.com' >&2; exit 1; }
docker compose config --quiet
docker compose up -d --build --remove-orphans
for i in $(seq 1 30); do
  if curl -fsS -H 'Host: marrso.com' "http://127.0.0.1:${WEB_PORT}/contacto" >/dev/null; then break; fi
  if [[ "$i" == 30 ]]; then echo 'Web health check failed' >&2; exit 1; fi
  sleep 2
done

VHOST=/etc/nginx/sites-available/marrso.conf
if [[ ! -f "$VHOST" ]]; then
  sudo tee "$VHOST" >/dev/null <<EOF
server {
  listen 80;
  server_name marrso.com www.marrso.com;
  location / {
    proxy_pass http://127.0.0.1:${WEB_PORT};
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header X-Forwarded-For \$remote_addr;
  }
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF
  sudo ln -s "$VHOST" /etc/nginx/sites-enabled/marrso.conf
fi
sudo nginx -t
sudo systemctl reload nginx
if ! "$SKIP_TLS"; then
  command -v certbot >/dev/null || { echo 'Install certbot and python3-certbot-nginx to issue TLS.' >&2; exit 1; }
  [[ -n "${CERTBOT_EMAIL:-}" ]] || { echo 'Missing CERTBOT_EMAIL' >&2; exit 1; }
  sudo certbot --nginx --non-interactive --agree-tos --keep-until-expiring --redirect -m "$CERTBOT_EMAIL" -d marrso.com -d www.marrso.com
fi
echo 'MARRSO deploy complete. Verify HTTPS and send a real test consultation.'
