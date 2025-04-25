# Start with the official Jitsi Meet web image
FROM jitsi/web:stable

# Set environment variables
ENV PUBLIC_URL=https://your-cloud-run-url.run.app
ENV XMPP_DOMAIN=meet.jitsi
ENV XMPP_BOSH_URL_BASE=http://xmpp.meet.jitsi:5280
ENV JICOFO_AUTH_USER=focus
ENV JVB_BREWERY_MUC=jvbbrewery
ENV JIGASI_BREWERY_MUC=jigasibrewery
ENV JIBRI_BREWERY_MUC=jibribrewery
ENV JIGASI_SIP_URI=test@example.com
ENV JVB_TCP_HARVESTER_DISABLED=true
ENV JVB_AUTH_USER=jvb
ENV JIBRI_PENDING_TIMEOUT=90
ENV JIBRI_XMPP_USER=jibri
ENV JIBRI_RECORDER_USER=recorder
ENV ENABLE_AUTH=0
ENV ENABLE_GUESTS=0
ENV ENABLE_HTTP_REDIRECT=0
ENV TZ=UTC

# Use the PORT environment variable from Cloud Run
ENV HTTP_PORT=8080
ENV HTTPS_PORT=8443

# Make the startup script executable
RUN chmod +x /init

# Port that will be used by Cloud Run
EXPOSE 8080

# Command to run when container starts
CMD ["/init"]
