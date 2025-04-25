FROM debian:bullseye-slim

ENV DEBIAN_FRONTEND=noninteractive

# Preseed debconf answers for jitsi-meet-web-config
RUN echo "jitsi-meet-web-config    jitsi-meet/cert-choice    select  Generate a new self-signed certificate" | debconf-set-selections && \
    echo "jitsi-meet-web-config    jitsi-meet/hostname    string  localhost" | debconf-set-selections

# Add Prosody and Jitsi repositories as needed...

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        jitsi-meet-web \
        prosody \
        jitsi-meet-prosody \
        jitsi-meet-turnserver \
        jitsi-meet-web-config \
        jitsi-videobridge2 \
        jicofo && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Setup environment variables
ENV XMPP_DOMAIN=meet.jitsi
ENV XMPP_SERVER=localhost
ENV JICOFO_AUTH_DOMAIN=auth.meet.jitsi
ENV JVB_AUTH_DOMAIN=auth.meet.jitsi
ENV JVB_BREWERY_MUC=jvbbrewery
ENV JIBRI_BREWERY_MUC=jibribrewery
ENV JIGASI_BREWERY_MUC=jigasibrewery
ENV JIGASI_SIP_URI=jitsi-meet-public
ENV JICOFO_AUTH_USER=focus
ENV JVB_AUTH_USER=jvb
ENV PUBLIC_URL=https://fgr.superj.app
ENV ENABLE_AUTH=0
ENV ENABLE_GUESTS=1
ENV ENABLE_TRANSCRIPTIONS=0
ENV ENABLE_LETSENCRYPT=0
ENV LETSENCRYPT_DOMAIN=fgr.superj.app
ENV LETSENCRYPT_EMAIL=admin@superj.app
ENV HTTP_PORT=8080
ENV HTTPS_PORT=8443

# Configure supervisor to run all services
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Configuration script
COPY config.sh /config.sh
RUN chmod +x /config.sh

# Expose needed ports
EXPOSE 8080 8443 4443 10000/udp

# Entry point
CMD ["/config.sh"]
