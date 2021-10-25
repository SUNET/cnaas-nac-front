# cnaas-nac-front

Frontend for CNaaS NAC

## Local development

Set env vars `NAC_API_URL` and `AUTH_API_URL`.

In `docker/front/config/supervisord_app.conf`, set `autorestart=false` and start the container.

Build changes locally and copy to container: `./build`
