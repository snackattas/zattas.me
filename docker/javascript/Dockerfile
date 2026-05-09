FROM node:24-alpine

# Install chromium, chromedriver, and xvfb for display
RUN apk add --no-cache \
    chromium \
    chromium-chromedriver \
    curl \
    bash \
    xvfb

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Set Playwright to install browsers to /app (persisted in image)
ENV PLAYWRIGHT_BROWSERS_PATH=/app/playwright-browsers

# Install Playwright browsers
RUN npx playwright install chromium && \
    test -d /app/playwright-browsers && echo "✓ Playwright browsers installed" || echo "⚠ Warning: Playwright browsers may not be installed"

# Set up Chrome to run in headless mode by default
ENV CHROME_BIN=/usr/bin/chromium-browser
ENV NODE_PATH=/app/node_modules

# Copy scripts and test harnesses from the repo
COPY scripts/ ./scripts/
COPY docker/javascript/entrypoint.sh /app/entrypoint.sh
COPY docker/javascript/cypress.config.js /app/docker/javascript/cypress.config.js

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
