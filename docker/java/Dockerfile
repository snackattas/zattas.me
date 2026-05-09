FROM eclipse-temurin:21-alpine

# Install chromium, chromedriver, and build tools
RUN apk add --no-cache \
    chromium \
    chromium-chromedriver \
    curl \
    bash \
    maven \
    git

WORKDIR /app

# Set up Chrome to run in headless mode
ENV CHROME_BIN=/usr/bin/chromium-browser

# Copy scripts and test harnesses from the repo
COPY scripts/ ./scripts/
COPY docker/java/entrypoint.sh /app/entrypoint.sh
COPY docker/java/pom.xml /app/docker/java/pom.xml
COPY pom.xml ./pom.xml

RUN chmod +x /app/entrypoint.sh

# Pre-download Maven dependencies (optional, speeds up builds)
RUN mvn dependency:resolve 2>/dev/null || true

# Install Playwright browsers
RUN mvn exec:java -Dexec.mainClass="com.microsoft.playwright.CLI" -Dexec.args="install chromium" 2>/dev/null || true

ENTRYPOINT ["/app/entrypoint.sh"]
