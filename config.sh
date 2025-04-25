#!/bin/bash

set -e

# Generate self-signed SSL certificates if needed
if [ ! -f /etc/jitsi/meet/$XMPP_DOMAIN.crt ]; then
    echo "Generating self-signed SSL certificate for $XMPP_DOMAIN"
    mkdir -p /etc/jitsi/meet
    openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=$XMPP_DOMAIN" \
        -keyout /etc/jitsi/meet/$XMPP_DOMAIN.key \
        -out /etc/jitsi/meet/$XMPP_DOMAIN.crt
fi

# Configure Jitsi Meet
cat > /etc/jitsi/meet/$XMPP_DOMAIN-config.js << EOF
var config = {
    hosts: {
        domain: '$XMPP_DOMAIN',
        muc: 'conference.$XMPP_DOMAIN',
        focus: 'focus.$XMPP_DOMAIN',
    },
    bosh: '/http-bind',
    enableWelcomePage: true,
    enableClosePage: false,
    disableSimulcast: false,
    startAudioOnly: false,
    startAudioMuted: 10,
    startWithVideoMuted: true,
    p2p: {
        enabled: true,
        stunServers: [
            { urls: 'stun:meet-jit-si-turnrelay.jitsi.net:443' }
        ],
        preferH264: true
    },
    analytics: {},
    brandingDataUrl: '',
    deploymentInfo: {},
};
EOF

# Configure nginx
cat > /etc/nginx/sites-available/default << EOF
server {
    listen $HTTP_PORT;
    listen [::]:$HTTP_PORT;
    server_name $XMPP_DOMAIN;

    location / {
        root /usr/share/jitsi-meet;
        index index.html;
        error_page 404 /static/404.html;
        
        location ~ ^/([a-zA-Z0-9=\?]+)$ {
            try_files /index.html /index.html;
        }
        
        location /config.js {
            alias /etc/jitsi/meet/$XMPP_DOMAIN-config.js;
        }
        
        location /http-bind {
            proxy_pass http://localhost:5280/http-bind;
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_set_header Host $http_host;
        }
    }
}

server {
    listen $HTTPS_PORT ssl;
    listen [::]:$HTTPS_PORT ssl;
    server_name $XMPP_DOMAIN;

    ssl_certificate /etc/jitsi/meet/$XMPP_DOMAIN.crt;
    ssl_certificate_key /etc/jitsi/meet/$XMPP_DOMAIN.key;
    
    location / {
        root /usr/share/jitsi-meet;
        index index.html;
        error_page 404 /static/404.html;
        
        location ~ ^/([a-zA-Z0-9=\?]+)$ {
            try_files /index.html /index.html;
        }
        
        location /config.js {
            alias /etc/jitsi/meet/$XMPP_DOMAIN-config.js;
        }
        
        location /http-bind {
            proxy_pass http://localhost:5280/http-bind;
            proxy_set_header X-Forwarded-For $remote_addr;
            proxy_set_header Host $http_host;
        }
    }
}
EOF

mkdir -p /etc/prosody/conf.d/
# Configure prosody
cat > /etc/prosody/conf.avail/$XMPP_DOMAIN.cfg.lua << EOF
plugin_paths = { "/usr/share/jitsi-meet/prosody-plugins/" }

-- domain mapper options, must at least have domain base set to use the mapper
muc_mapper_domain_base = "$XMPP_DOMAIN";

turncredentials_secret = "fgr.superj.app";

turncredentials = {
  { type = "stun", host = "meet-jit-si-turnrelay.jitsi.net", port = "443" },
  { type = "turn", host = "meet-jit-si-turnrelay.jitsi.net", port = "443", transport = "tcp" }
};

VirtualHost "$XMPP_DOMAIN"
    ssl = {
        key = "/etc/jitsi/meet/$XMPP_DOMAIN.key";
        certificate = "/etc/jitsi/meet/$XMPP_DOMAIN.crt";
    }
    authentication = "anonymous"
    modules_enabled = {
        "bosh";
        "pubsub";
        "ping";
        "turncredentials";
        "conference_duration";
        "muc_domain_mapper";
        "presence_identity";
    }
    c2s_require_encryption = false

VirtualHost "auth.$XMPP_DOMAIN"
    ssl = {
        key = "/etc/jitsi/meet/$XMPP_DOMAIN.key";
        certificate = "/etc/jitsi/meet/$XMPP_DOMAIN.crt";
    }
    authentication = "internal_plain"

Component "conference.$XMPP_DOMAIN" "muc"
    storage = "memory"
    modules_enabled = {
        "muc_meeting_id";
        "muc_domain_mapper";
    }
    admins = { "focus@auth.$XMPP_DOMAIN" }
    muc_room_locking = false
    muc_room_default_public_jids = true

Component "jvb.$XMPP_DOMAIN"
    component_secret = "fgr.superj.app"

Component "focus.$XMPP_DOMAIN"
    component_secret = "fgr.superj.app"
EOF

mkdir -p /etc/prosody/conf.d/

# Enable the Prosody configuration
ln -sf /etc/prosody/conf.avail/$XMPP_DOMAIN.cfg.lua /etc/prosody/conf.d/

# Create the Prosody user
prosodyctl register focus auth.$XMPP_DOMAIN fgr.superj.app
prosodyctl register jvb auth.$XMPP_DOMAIN fgr.superj.app

# Configure Jicofo
cat > /etc/jitsi/jicofo/config << EOF
# Jicofo HOCON configuration
jicofo {
  bridge {
    brewery-jid = "$JVB_BREWERY_MUC@internal.auth.$XMPP_DOMAIN"
  }
  xmpp {
    client {
      credentials {
        username = "focus"
        password = "fgr.superj.app"
      }
    }
  }
}
EOF

# Configure JVB
cat > /etc/jitsi/videobridge/config << EOF
# Jitsi Videobridge HOCON configuration
videobridge {
  apis {
    xmpp-client {
      configs {
        xmpp-server-1 {
          hostname="$XMPP_SERVER"
          domain="auth.$XMPP_DOMAIN"
          username="jvb"
          password="fgr.superj.app"
          muc_jids="$JVB_BREWERY_MUC@internal.auth.$XMPP_DOMAIN"
          muc_nickname="$(hostname)"
        }
      }
    }
  }
}
EOF

# Make nginx use the updated configuration
nginx -t && nginx -s reload

# Start all services with supervisord
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
