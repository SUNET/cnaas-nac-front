#!/bin/sh

sed -e "s|^\(.*proxy_pass \)NAC_API_URL;$|\1$NAC_API_URL;|" \
    -e "s|^\(.*proxy_pass \)AUTH_API_URL;$|\1$AUTH_API_URL;|" \
  < /etc/nginx/sites-available/nginx_app.conf > /tmp/nginx_app.conf.new \
  && cat /tmp/nginx_app.conf.new > /etc/nginx/sites-available/nginx_app.conf

sed -e "s|^\(.*NAC_API_URL=\)NAC_API_URL$|\1$NAC_API_URL|" \
  < /opt/cnaas/.env > /tmp/.env \
  && cat /tmp/.env > /opt/cnaas/cnaas-nac-front/.env

cd /opt/cnaas/cnaas-nac-front
npm run-script build
cp dist/* /opt/cnaas/static

if [ ! -f /opt/cnaas/certs/nginx_cert.pem ]; then
  echo "WARNING: No cert found, using snakeoil (self-signed) certificate and key."
  cp /opt/cnaas/certs/snakeoil_cert.pem /opt/cnaas/certs/nginx_cert.pem
  cp /opt/cnaas/certs/snakeoil_key.pem /opt/cnaas/certs/nginx_key.pem
fi

/usr/sbin/nginx -g "daemon off;"
