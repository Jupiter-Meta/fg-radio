FROM debian:bullseye-slim

# Set non-interactive mode
ENV DEBIAN_FRONTEND=noninteractive

# Create policy to prevent service auto-start during installation
RUN echo "#!/bin/sh\nexit 101" > /usr/sbin/policy-rc.d && chmod +x /usr/sbin/policy-rc.d

# Install prerequisites
RUN apt-get update && \
    apt-get install -y --no-install-recommends wget gnupg apt-transport-https ca-certificates \
    lsb-release curl procps sudo lua5.2 liblua5.2-0 liblua5.2-dev lua-filesystem \
    nginx openssl python3 python3-pip supervisor jq && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Add Prosody repository
RUN echo "deb http://packages.prosody.im/debian $(lsb_release -sc) main" | tee /etc/apt/sources.list.d/prosody.list && \
    wget https://prosody.im/files/prosody-debian-packages.key -O- | gpg --dearmor > /etc/apt/trusted.gpg.d/prosody.gpg

# Add Jitsi repository
RUN wget -qO - https://download.jitsi.org/jitsi-key.gpg.key | gpg --dearmor > /usr/share/keyrings/jitsi-keyring.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/jitsi-keyring.gpg] https://download.jitsi.org stable/" > /etc/apt/sources.list.d/jitsi-stable.list

# Preseed debconf answers
RUN echo "jitsi-meet-web-config    jitsi-meet/cert-choice    select  Generate a new self-signed certificate" | debconf-set-selections && \
    echo "jitsi-meet-web-config    jitsi-meet/hostname    string  localhost" | debconf-set-selections

# Update package lists
RUN apt-get update

# Install prosody first
RUN apt-get install -y --no-install-recommends prosody

# Create a valid prosody config file BEFORE installing jitsi-meet-prosody
RUN mkdir -p /etc/prosody/conf.avail/ && \
    echo '-- Prosody Configuration for Jitsi Meet' > /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo 'VirtualHost "localhost"' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '    authentication = "anonymous"' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '    ssl = {' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '        key = "/etc/prosody/certs/localhost.key";' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '        certificate = "/etc/prosody/certs/localhost.crt";' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '    }' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '    modules_enabled = {' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '        "bosh";' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '        "pubsub";' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '    }' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo 'VirtualHost "auth.localhost"' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '    authentication = "internal_plain"' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo 'Component "conference.localhost" "muc"' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '    storage = "memory"' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '    modules_enabled = {' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '        "ping";' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '    }' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '    admins = { "focus@auth.localhost" }' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo 'Component "jvb.localhost"' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '    component_secret = "jitsi"' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo 'Component "focus.localhost"' >> /etc/prosody/conf.avail/localhost.cfg.lua && \
    echo '    component_secret = "focus"' >> /etc/prosody/conf.avail/localhost.cfg.lua

# Create directory for prosody certs
RUN mkdir -p /etc/prosody/certs && \
    mkdir -p /etc/jitsi/jicofo && \
    mkdir -p /etc/jitsi/videobridge && \
    mkdir -p /etc/jitsi/meet

# Install Jitsi Web and Web Config
RUN apt-get install -y --no-install-recommends \
        jitsi-meet-web \
        jitsi-meet-web-config

# Now install jitsi-meet-prosody and the rest
RUN apt-get install -y --no-install-recommends \
        jitsi-meet-prosody \
        coturn \
        jitsi-meet-turnserver \
        jitsi-videobridge2 \
        jicofo || true

# Final attempt to fix any remaining package configurations
RUN dpkg --configure -a || true

# Clean up
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Environment variables for runtime configuration
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
ENV TZ=UTC

# Copy configuration files
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY config.sh /config.sh
RUN chmod +x /config.sh

# Create essential config directories with helpful defaults
RUN mkdir -p /config && \
    echo "Create this file during the build process to prevent errors" > /etc/jitsi/videobridge/config && \
    echo "Create this file during the build process to prevent errors" > /etc/jitsi/jicofo/config

# Expose ports (Note: Cloud Run only supports the HTTP port)
EXPOSE 8080 8443 4443 10000/udp

# Entry point
CMD ["/config.sh"]