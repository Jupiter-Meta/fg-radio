FROM node:20-slim AS build

# Install required system packages
RUN apt-get update && apt-get install -y \
    curl git make gcc g++ python3 python3-pip \
    libtool automake autoconf unzip ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency files and install with npm
COPY package*.json ./
RUN npm install --force

# Copy the rest of the app
COPY . .

# Build using Makefile
RUN make build

# --------------------------------
# Production stage
FROM node:20-slim AS prod

# Install static file server
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built files from build stage
COPY --from=build /app/libs /app/libs

# Expose the production port
EXPOSE 8080

# Serve the built site
CMD ["serve", "-s", "libs", "-l", "8080"]