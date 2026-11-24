#!/usr/bin/env bash
# Deploy MARRSO on the shared VPS.
# Usage: bash scripts/deploy.sh [--pull] [--check] [--skip-nginx] [--skip-tls]
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

PULL=false
CHECK=false
SKIP_NGINX=false
SKIP_TLS=false
for arg in "$@"; do
  case "$arg" in
    --pull) PULL=true ;;
    --check) CHECK=true ;;
    --skip-nginx) SKIP_NGINX=true ;;
    --skip-tls) SKIP_TLS=true ;;
    -h|--help)
      echo 'Usage: bash scripts/deploy.sh [--pull] [--check] [--skip-nginx] [--skip-tls]'
      exit 0 ;;
    *) echo "Unknown option: $arg" >&2; exit 1 ;;
  esac
done

command -v docker >/dev/null || { echo 'Docker not found.' >&2; exit 1; }
docker compose version >/dev/null || { echo 'Docker Compose v2 not found.' >&2; exit 1; }
docker info >/dev/null || { echo 'Docker daemon unavailable.' >&2; exit 1; }
command -v curl >/dev/null || { echo 'curl not found.' >&2; exit 1; }
[[ -f .env ]] || { echo 'Missing .env — copy .env.production.example and configure it.' >&2; exit 1; }

read_env() {
  grep -m1 "^$1=" .env | cut -d= -f2- | tr -d '\r' || true
}

WEB_PORT="$(read_env WEB_PORT)"
WEB_PORT="${WEB_PORT:-8090}"
[[ "$WEB_PORT" =~ ^[0-9]+$ ]] && (( WEB_PORT >= 1 && WEB_PORT <= 65535 )) || {
  echo 'WEB_PORT must be a valid TCP port.' >&2; exit 1;
}
for key in AWS_REGION CONTACT_FROM_EMAIL CONTACT_TO_EMAIL; do
  [[ -n "$(read_env "$key")" ]] || { echo "Missing $key" >&2; exit 1; }
done
[[ "$(read_env CONTACT_FROM_EMAIL)" == *@marrso.com ]] || {
  echo 'CONTACT_FROM_EMAIL must use marrso.com.' >&2; exit 1;
}

if "$PULL"; then
  [[ -z "$(git status --porcelain)" ]] || {
    echo 'Working tree is not clean — commit or stash before --pull.' >&2; exit 1;
  }
  git pull --ff-only
fi

docker compose config --quiet
if "$CHECK"; then
  echo 'Preflight OK: Docker, .env and Compose configuration are valid.'
  exit 0
fi

docker compose build app
docker compose up -d --no-build --wait --wait-timeout 180 --remove-orphans app
curl -fsS -H 'Host: marrso.com' "http://127.0.0.1:${WEB_PORT}/healthz" >/dev/null

if "$SKIP_NGINX"; then
  echo 'MARRSO container healthy; host nginx and TLS skipped.'
  exit 0
fi

command -v nginx >/dev/null || { echo 'nginx not found.' >&2; exit 1; }
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
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
  }
  add_header X-Content-Type-Options "nosniff" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOF
fi
[[ -e /etc/nginx/sites-enabled/marrso.conf ]] ||
  sudo ln -s "$VHOST" /etc/nginx/sites-enabled/marrso.conf
sudo nginx -t
sudo systemctl reload nginx

if ! "$SKIP_TLS"; then
  command -v certbot >/dev/null || { echo 'Certbot not found.' >&2; exit 1; }
  CERTBOT_EMAIL="$(read_env CERTBOT_EMAIL)"
  [[ -n "$CERTBOT_EMAIL" ]] || { echo 'Missing CERTBOT_EMAIL.' >&2; exit 1; }
  sudo certbot --nginx --non-interactive --agree-tos --keep-until-expiring --redirect \
    -m "$CERTBOT_EMAIL" -d marrso.com -d www.marrso.com
fi

echo 'MARRSO deploy complete. Verify HTTPS and send a real test consultation.'
