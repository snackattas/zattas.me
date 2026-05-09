FROM selenium/standalone-chromium:latest AS base

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY scripts/ ./scripts/

# ── JavaScript ────────────────────────────────────────────────────────────────
FROM node:lts AS javascript

# Cypress system dependencies for Debian/Linux
# https://docs.cypress.io/app/get-started/install-cypress#Linux-Prerequisites
RUN apt-get update && apt-get install -y --no-install-recommends \
    bash \
    libgtk-3-0 libgbm1 libasound2 libxss1 \
    libgconf-2-4 libnss3 libatk1.0-0 libatk-bridge2.0-0 \
    libcups2 libdrm2 libxcomposite1 libxdamage1 libxfixes3 \
    libxrandr2 libpango-1.0-0 libcairo2 \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -r seluser && useradd -r -g seluser -m seluser

WORKDIR /app
COPY scripts/ ./scripts/

COPY docker/javascript/package.json ./package.json
RUN npm install

ENV PLAYWRIGHT_BROWSERS_PATH=/home/seluser/playwright-browsers
RUN npx playwright install chromium chromium-headless-shell --with-deps

ENV NODE_PATH=/app/node_modules
COPY docker/javascript/entrypoint.sh /app/entrypoint.sh
COPY docker/javascript/cypress.config.js /app/docker/javascript/cypress.config.js
RUN chmod +x /app/entrypoint.sh

USER seluser
RUN /app/node_modules/.bin/cypress install

ENTRYPOINT ["/app/entrypoint.sh"]

# ── Python ────────────────────────────────────────────────────────────────────
FROM base AS python

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv && rm -rf /var/lib/apt/lists/*

RUN pip3 install --break-system-packages \
    selenium playwright vibium
RUN playwright install chromium

COPY docker/python/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER seluser
RUN vibium install
ENTRYPOINT ["/app/entrypoint.sh"]

# ── Java ──────────────────────────────────────────────────────────────────────
FROM base AS java

RUN apt-get update && apt-get install -y --no-install-recommends \
    default-jdk maven nodejs npm && rm -rf /var/lib/apt/lists/*

RUN npm install -g playwright vibium
RUN npx playwright install-deps chromium

COPY docker/java/pom.xml /app/docker/java/pom.xml
RUN mvn dependency:resolve -f /app/docker/java/pom.xml || true

COPY docker/java/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER seluser
RUN npx playwright install chromium
RUN vibium install
ENTRYPOINT ["/app/entrypoint.sh"]

# ── Ruby ──────────────────────────────────────────────────────────────────────
FROM ruby:latest AS ruby

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash curl nodejs npm && rm -rf /var/lib/apt/lists/*

RUN groupadd -r seluser && useradd -r -g seluser -m seluser

WORKDIR /app
COPY scripts/ ./scripts/

RUN gem install selenium-webdriver playwright-ruby-client:1.59.1
RUN npm install -g playwright@1.59.1
RUN npx playwright install-deps chromium chromium-headless-shell

COPY docker/ruby/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER seluser
RUN playwright install chromium chromium-headless-shell
ENTRYPOINT ["/app/entrypoint.sh"]
