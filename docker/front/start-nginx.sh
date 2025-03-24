#!/bin/sh

sed -e "s|^\(.*proxy_pass \)CNAAS_API_URL;$|\1$CNAAS_API_URL;|" \
    -e "s|^\(.*proxy_pass \)CNAAS_AUTH_URL;$|\1$CNAAS_AUTH_URL;|" \
    < /etc/nginx/sites-available/nginx_app.conf > /tmp/nginx_app.conf.new \
    && cat /tmp/nginx_app.conf.new > /etc/nginx/sites-available/nginx_app.conf

sed -e "s|^\(.*API_URL=\)CNAAS_FRONT_URL$|\1$CNAAS_FRONT_URL|" \
  < /opt/cnaas/.env > /tmp/.env \
  && cat /tmp/.env > /opt/cnaas/cnaas-nac-front/.env

cd /opt/cnaas/cnaas-nac-front
npm run-script build
cp dist/* /opt/cnaas/static

if [ ! -f /opt/cnaas/certs/cnaasfront_combined.crt ]; then
  echo "WARNING: no cert found, using snakeoil cert"
  cp /etc/nginx/conf.d/snakeoil.crt /opt/cnaas/certs/cnaasfront_combined.crt
  cp /etc/nginx/conf.d/snakeoil.key /opt/cnaas/certs/cnaasfront.key
fi

chown root:root /opt/cnaas/certs/cnaasfront.key
chmod 600 /opt/cnaas/certs/cnaasfront.key

/usr/sbin/nginx -g "daemon off;"
