FROM debian:bullseye-slim

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install basic utilities and dependencies
RUN apt-get update && \
    apt-get install -y curl gnupg apt-transport-https ca-certificates wget supervisor \
    nginx openssl sudo lua5.2 liblua5.2-0 liblua5.2-dev \
    procps python3 python3-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Add Jitsi repository
RUN wget -qO - https://download.jitsi.org/jitsi-key.gpg.key | gpg --dearmor > /usr/share/keyrings/jitsi-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/jitsi-keyring.gpg] https://download.jitsi.org stable/" > /etc/apt/sources.list.d/jitsi-stable.list

# Install Jitsi components
RUN apt-get update && \
    apt-get install -y jitsi-meet-web jitsi-meet-prosody jitsi-meet-turnserver \
                       jitsi-meet-web-config jitsi-videobridge2 jicofo && \
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
