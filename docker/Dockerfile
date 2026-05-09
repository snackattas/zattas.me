FROM selenium/standalone-chromium:latest AS base

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl bash && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY scripts/ ./scripts/

# ── JavaScript ────────────────────────────────────────────────────────────────
FROM base AS javascript

RUN apt-get update && apt-get install -y --no-install-recommends \
    nodejs npm && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

ENV PLAYWRIGHT_BROWSERS_PATH=/app/playwright-browsers
RUN npx playwright install chromium

ENV NODE_PATH=/app/node_modules
COPY docker/javascript/entrypoint.sh /app/entrypoint.sh
COPY docker/javascript/cypress.config.js /app/docker/javascript/cypress.config.js
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]

# ── Python ────────────────────────────────────────────────────────────────────
FROM base AS python

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv && rm -rf /var/lib/apt/lists/*

RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"

RUN uv pip install --system --break-system-packages \
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
FROM base AS ruby

RUN apt-get update && apt-get install -y --no-install-recommends \
    ruby ruby-dev build-essential && rm -rf /var/lib/apt/lists/*

RUN gem install selenium-webdriver playwright-ruby-client
RUN playwright install chromium

COPY docker/ruby/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
