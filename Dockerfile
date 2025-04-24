
FROM node:20

# Set working directory.
WORKDIR /app

# Install dependencies
COPY package*.json ./


# RUN npm cache clean --force
# RUN rm -rf node_modules package-lock.json
RUN npm install --force

# Copy app source code
COPY . .


#website URL : https://superj.app 
#branch name : superj_prod


# ENV NODE_ENV=production

# ENV SERVER=production


# ENV API_URL=https://api.superj.app/v2

# ENV CAPTCHA_TOKEN=6Ld_2gsqAAAAAKLxbssanVUk0DHp3rB-S840ZeWH

# ENV ENCRYPTION_KEY=d1e22b3dabc47e6921a8c92d4a28c7a5
# # prod gtag key
# ENV IRCTC_GOOGLE_ANALYTICS_TAG=G-Y60193FS64

# #developement gtag key
# # ENV IRCTC_GOOGLE_ANALYTICS_TAG=G-Y60193FS64
# ENV THIRD_PARTY_ENCRYPTION_KEY=2b7e151628aed2a6abf7158809cf4f3c
# ENV MIXPANEL_TOKEN = ca4113b876ea9ade5832223d0742bd76
# ENV X_ID = fffbfg

# #ReCAPTCHA KEYS
# ENV RECAPTCHA_SITE_KEY=6LdIQvoqAAAAAGHImP8hX5H30x0zJvsRSeIPkLIC
# ENV RECAPTCHA_SECRET_KEY=6LdIQvoqAAAAAPjSPUcFEaZDLIeXUpGXdNbCAXfQ


# Build the Next.js app
RUN make build


# Expose the port Next.js is running on 

EXPOSE 8080

# Command to run the Next.js app
CMD ["npm", "start"]
