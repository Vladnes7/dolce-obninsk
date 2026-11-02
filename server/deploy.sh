#!/usr/bin/env bash
# Выкладка Dolce на VPS (ssh alias "sites"). Запуск: bash server/deploy.sh [путь к linux-sharp]
# Первый запуск ставит службу dolce и nginx-конфиг на порт 8081; чужие конфиги не трогает.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="$ROOT/site"
SHARP_LINUX="${1:-}"
DIST="$(mktemp -d)/app"
# VPN Влада роняет SSH на голый IP; через домен того же сервера проходит.
SSH_OPTS=(-o ConnectTimeout=20 -o HostName=ylk89.ru -o HostKeyAlias=37.77.106.12)
ssh() { command ssh "${SSH_OPTS[@]}" "$@"; }
scp() { command scp "${SSH_OPTS[@]}" "$@"; }

cd "$SITE"
npx next build
mkdir -p "$DIST"
cp -R .next/standalone/. "$DIST/"
mkdir -p "$DIST/.next" && cp -R .next/static "$DIST/.next/"
cp -R public "$DIST/"
# sharp под Linux x64: без него сервер не сожмёт картинки.
rm -rf "$DIST/node_modules/@img/"*darwin*
if [ -n "$SHARP_LINUX" ]; then
  cp -R "$SHARP_LINUX/node_modules/@img/sharp-linux-x64" "$SHARP_LINUX/node_modules/@img/sharp-libvips-linux-x64" "$DIST/node_modules/@img/"
fi

# Проверки до любых изменений на сервере.
ssh sites 'set -e
  node -e "const [a,b]=process.versions.node.split(\".\").map(Number); if (a<20||(a===20&&b<9)) {console.error(\"Node \"+process.version+\" < 20.9\"); process.exit(1)}"
  if ss -ltn | grep -q ":8081 " && ! [ -e /etc/nginx/sites-enabled/dolce ]; then echo "порт 8081 занят другим сайтом"; exit 1; fi
  if ss -ltn | grep -q "127.0.0.1:3110 " && ! systemctl is-active -q dolce; then echo "порт 3110 занят"; exit 1; fi
  mkdir -p /var/www/dolce/app'

rsync -az --delete -e "ssh ${SSH_OPTS[*]}" "$DIST/" sites:/var/www/dolce/app/
scp -q "$ROOT/server/dolce.service" sites:/etc/systemd/system/dolce.service
scp -q "$ROOT/server/nginx-dolce.conf" sites:/etc/nginx/sites-available/dolce

ssh sites 'set -e
  chown -R www-data:www-data /var/www/dolce
  ln -sfn /etc/nginx/sites-available/dolce /etc/nginx/sites-enabled/dolce
  # Конфиг с ошибкой убираем сразу: работающие сайты не перезагружаются.
  if ! nginx -t 2>/dev/null; then rm -f /etc/nginx/sites-enabled/dolce; nginx -t; exit 1; fi
  systemctl daemon-reload
  systemctl enable -q dolce
  systemctl restart dolce
  systemctl reload nginx
  if command -v ufw >/dev/null && ufw status | grep -q "Status: active"; then ufw allow 8081/tcp >/dev/null; fi
  sleep 2
  curl -s -o /dev/null -w "page %{http_code}\n" http://127.0.0.1:8081/
  curl -s -o /dev/null -w "img %{http_code} %{content_type}\n" -H "Accept: image/webp" "http://127.0.0.1:8081/_next/image?url=%2Fimg%2Fhero.jpg&w=1080&q=75"'
echo "Готово: http://37.77.106.12:8081"
