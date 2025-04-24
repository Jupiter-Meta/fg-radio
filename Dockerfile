FROM node:20-slim AS build

# Install dependencies needed to build Jitsi Meet
RUN apt-get update && apt-get install -y \
    curl git make gcc g++ python3 python3-pip \
    libtool automake autoconf unzip ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency manifests and install
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile --force

# Copy full source
COPY . .

# Build
RUN make build

# -----------------
# Production stage
FROM node:20-slim AS prod

# Install static server
RUN npm install -g serve

# Working directory
WORKDIR /app

# Copy build output only
COPY --from=build /app/libs /app/libs

# Expose production port
EXPOSE 8080

# Serve built frontend
CMD ["serve", "-s", "libs", "-l", "8080"]