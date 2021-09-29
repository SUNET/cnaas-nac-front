# cnaas-nac-front

Frontend for CNaaS NAC

## Local development

Set env vars `NAC_API_URL` and `AUTH_API_URL`.

In `docker/front/config/supervisord_app.conf`, set `autorestart=false` and start the container.

Build changes locally and copy to container:

```
npm run build &&
docker exec docker_cnaas_front_1 sh -c "rm /opt/cnaas/static/*" &&
docker cp dist/. docker_cnaas_front_1:/opt/cnaas/static &&
docker exec docker_cnaas_front_1 nginx -s reload
```
