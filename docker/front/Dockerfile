FROM debian:bookworm
ENV DEBIAN_FRONTEND noninteractive

# Create directories
RUN mkdir -p /opt/cnaas
RUN mkdir /opt/cnaas/certs/
RUN mkdir /opt/cnaas/static
RUN mkdir /opt/cnaas/static/styles

# Setup script
COPY setup.sh /opt/cnaas/setup.sh
RUN /opt/cnaas/setup.sh

# Prepare for supervisord, uwsgi, ngninx
COPY config/supervisord_app.conf /etc/supervisor/supervisord.conf
COPY config/nginx_app.conf /etc/nginx/sites-available/
COPY config/nginx.conf /etc/nginx/
COPY config/example.env /opt/cnaas/.env
COPY cert/*.pem /opt/cnaas/certs/
COPY index.html /opt/cnaas/static/
COPY styles/* /opt/cnaas/static/styles/
COPY start-nginx.sh /opt/cnaas/

# Give nginx some special treatment
RUN unlink /etc/nginx/sites-enabled/default
RUN ln -s /etc/nginx/sites-available/nginx_app.conf /etc/nginx/sites-enabled/default

# Expose HTTPS
EXPOSE 4443

ENTRYPOINT supervisord -c /etc/supervisor/supervisord.conf

