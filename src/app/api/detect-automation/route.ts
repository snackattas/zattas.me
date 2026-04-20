import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/utils/logger';

export const dynamic = 'force-dynamic';

interface AutomationDetectionResult {
  detected: boolean;
  tool: 'playwright' | 'selenium' | null;
  indicators: string[];
}

export async function GET(request: NextRequest) {
  const headers = request.headers;
  const indicators: string[] = [];
  let tool: 'playwright' | 'selenium' | null = null;

  // Get common headers
  const userAgent = headers.get('user-agent') || '';
  const acceptLanguage = headers.get('accept-language');
  const secChUa = headers.get('sec-ch-ua');
  const acceptEncoding = headers.get('accept-encoding') || '';

  // Debug logging
  logger.debug('[detect-automation] All headers received:');
  headers.forEach((value, key) => {
    logger.debug(`  ${key}: ${value}`);
  });

  // Check for Playwright indicators
  // Playwright Firefox is missing "zstd" compression in accept-encoding
  const isFirefox = userAgent.includes('Firefox');
  if (isFirefox && !acceptEncoding.includes('zstd')) {
    indicators.push('Firefox missing zstd compression (Playwright indicator)');
    tool = 'playwright';
  }

  // Check for missing Accept-Language header
  if (!acceptLanguage) {
    indicators.push('Missing Accept-Language header');
  }

  // Check for HeadlessChrome in sec-ch-ua headers
  if (secChUa?.includes('HeadlessChrome')) {
    indicators.push('HeadlessChrome in sec-ch-ua');
    tool = 'playwright';
  }

  // Check user agent for headless indicators
  if (userAgent.includes('HeadlessChrome')) {
    indicators.push('HeadlessChrome in user-agent');
    tool = 'playwright';
  }

  // Check for Selenium WebDriver indicators
  // Selenium typically sets proper headers but may have other indicators
  if (userAgent.includes('Selenium')) {
    indicators.push('Selenium in user-agent');
    tool = 'selenium';
  }

  // Firefox with Marionette (used by Selenium and Playwright)
  if (userAgent.includes('Firefox') && !acceptLanguage) {
    indicators.push('Firefox with missing Accept-Language (possible automation)');
    // Don't set tool yet, could be either
  }

  // Check for missing or suspicious sec-ch-ua headers
  if (!secChUa && userAgent.includes('Chrome')) {
    indicators.push('Chrome user-agent but missing sec-ch-ua headers');
  }

  const detected = indicators.length > 0;

  const result: AutomationDetectionResult = {
    detected,
    tool,
    indicators,
  };

  logger.debug('[detect-automation] Detection result:', result);

  return NextResponse.json(result);
}
