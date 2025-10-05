FROM node:18-bullseye

# Install system dependencies including Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set Puppeteer to use system Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set Node.js memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

EXPOSE 3001

CMD ["npm", "start"]
