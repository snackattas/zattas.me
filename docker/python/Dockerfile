FROM mcr.microsoft.com/playwright:latest

# Install Python and pip (should already have Python from Playwright image)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv
RUN curl -LsSf https://astral.sh/uv/install.sh | sh

ENV PATH="/root/.local/bin:$PATH"

# Use uv to install test dependencies
RUN uv pip install --system --break-system-packages \
    selenium \
    vibium

WORKDIR /app

# Copy scripts and test harnesses from the repo
COPY scripts/ ./scripts/
COPY docker/python/entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
