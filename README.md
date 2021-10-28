# cnaas-nac-front

Frontend for CNaaS NAC

## Local development

1. Set env vars `NAC_API_URL` and `AUTH_API_URL`.
3. Run without Docker:
    - `npm run start`
2. Or run with dockerized nginx:
    - In `docker/front/config/supervisord_app.conf`, set `autorestart=false`
    - Start container: `cd docker && docker-compose up`
    - Build changes locally and copy to container: `./build`
