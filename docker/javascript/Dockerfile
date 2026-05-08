FROM node:24-alpine

# Install chromium and chromedriver
RUN apk add --no-cache \
    chromium \
    chromium-chromedriver \
    curl \
    bash

WORKDIR /app

# Install test dependencies globally
RUN npm install -g \
    selenium-webdriver \
    playwright

# Set up Chrome to run in headless mode by default
ENV CHROME_BIN=/usr/bin/chromium-browser

# Copy scripts and test harnesses from the repo
COPY scripts/ ./scripts/
COPY docker/javascript/entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
