FROM node:20-slim AS build

# Install necessary build dependencies
RUN apt-get update && apt-get install -y \
    curl git make gcc g++ python3 python3-pip \
    libtool automake autoconf unzip ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Install Yarn
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && apt-get install -y nodejs && \
    npm install -g yarn

# Set working directory
WORKDIR /app

# Copy package.json, yarn.lock, and install dependencies
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile --force

# Copy full source code
COPY . .

# Build the project
RUN make build

# Start a production server using serve
FROM node:20-slim AS prod

# Install serve for production static file serving
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy necessary build files from the build stage
COPY --from=build /app/libs /app/libs

# Expose the port
EXPOSE 8080

# Run the production server
CMD ["serve", "-s", "libs", "-l", "8080"]