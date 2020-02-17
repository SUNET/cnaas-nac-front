FROM debian:buster

# Create directories
RUN mkdir -p /opt/cnaas
RUN mkdir /etc/cnaas-nac-front

# Setup script
COPY cnaas-setup.sh /opt/cnaas/cnaas-setup.sh
RUN /opt/cnaas/cnaas-setup.sh

# Start venv
RUN python3 -m venv /opt/cnaas/venv
WORKDIR /opt/cnaas/venv/
RUN sh ./bin/activate

COPY config/uwsgi.ini /opt/cnaas/venv/cnaas-nac-front/
COPY config/supervisord_app.conf /etc/supervisor/conf.d
COPY config/nginx_app.conf /etc/nginx/sites-available/
COPY cert/* /etc/nginx/conf.d/

# Give nginx some special treatment
RUN unlink /etc/nginx/sites-enabled/default
RUN ln -s /etc/nginx/sites-available/nginx_app.conf /etc/nginx/sites-enabled/default

# Expose 1443
EXPOSE 1443

ENTRYPOINT "supervisord"
