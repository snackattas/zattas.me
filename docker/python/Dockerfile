FROM python:3.13

# Install chromium and chromedriver
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    chromium-chromedriver \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python test dependencies
RUN pip install --no-cache-dir \
    selenium \
    playwright \
    vibium

# Install Playwright browsers (chromium)
RUN python -m playwright install chromium

# Set up Chrome to run in headless mode
ENV CHROME_BIN=/usr/bin/chromium-browser

# Copy scripts and test harnesses from the repo
COPY scripts/ ./scripts/
COPY docker/python/entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
