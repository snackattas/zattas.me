FROM selenium/standalone-chromium:latest AS base

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY scripts/ ./scripts/

# ── JavaScript ────────────────────────────────────────────────────────────────
FROM node:lts AS javascript

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY scripts/ ./scripts/

COPY docker/javascript/package.json ./package.json
RUN npm install

RUN /app/node_modules/.bin/cypress install

ENV PLAYWRIGHT_BROWSERS_PATH=/app/playwright-browsers
RUN npx playwright install chromium --with-deps

ENV NODE_PATH=/app/node_modules
COPY docker/javascript/entrypoint.sh /app/entrypoint.sh
COPY docker/javascript/cypress.config.js /app/docker/javascript/cypress.config.js
RUN chmod +x /app/entrypoint.sh
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
ENTRYPOINT ["/app/entrypoint.sh"]

# ── Java ──────────────────────────────────────────────────────────────────────
FROM base AS java

RUN apt-get update && apt-get install -y --no-install-recommends \
    default-jdk maven && rm -rf /var/lib/apt/lists/*

COPY docker/java/pom.xml /app/docker/java/pom.xml
RUN mvn dependency:resolve -f /app/docker/java/pom.xml || true

COPY docker/java/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]

# ── Ruby ──────────────────────────────────────────────────────────────────────
FROM ruby:latest AS ruby

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    bash curl nodejs npm && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY scripts/ ./scripts/

RUN gem install selenium-webdriver playwright-ruby-client
RUN npm install -g playwright
RUN npx playwright install chromium --with-deps

COPY docker/ruby/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
