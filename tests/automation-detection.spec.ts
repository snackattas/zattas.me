import { describe, it, expect, vi, beforeEach } from "vitest";
import { detectAutomationTool } from "@/components/AutomationFun/AutomationDetector";

const mockDetect = vi.fn().mockResolvedValue({ bot: false });

vi.mock("@fingerprintjs/botd", () => ({
  load: vi.fn().mockResolvedValue({ detect: mockDetect }),
}));

beforeEach(() => {
  mockDetect.mockResolvedValue({ bot: false });
  delete window.__vibiumClock;
  delete window.Cypress;
  for (const key of Object.keys(window)) {
    if (key.startsWith("cdc_")) {
      delete (window as unknown as Record<string, unknown>)[key];
    }
  }
});

describe("detectAutomationTool", () => {
  describe("not detected", () => {
    it("returns null when no automation signals are present", async () => {
      expect(await detectAutomationTool()).toBeNull();
    });
  });

  describe("vibium", () => {
    it("returns vibium when __vibiumClock is set", async () => {
      window.__vibiumClock = {};
      expect(await detectAutomationTool()).toBe("vibium");
    });

    it("takes priority over Cypress when both globals are present", async () => {
      window.__vibiumClock = {};
      window.Cypress = {};
      expect(await detectAutomationTool()).toBe("vibium");
    });
  });

  describe("cypress", () => {
    it("returns cypress when window.Cypress is set", async () => {
      window.Cypress = {};
      expect(await detectAutomationTool()).toBe("cypress");
    });
  });

  describe("selenium", () => {
    it("returns selenium when BotD detects a bot and a cdc_ key is present", async () => {
      mockDetect.mockResolvedValue({ bot: true });
      // enumerable: true required so the key appears in `for...in` iteration
      Object.defineProperty(window, "cdc_test", { value: true, configurable: true, enumerable: true });
      expect(await detectAutomationTool()).toBe("selenium");
    });
  });

  describe("playwright", () => {
    it("returns playwright when BotD detects a bot but no cdc_ key is present", async () => {
      mockDetect.mockResolvedValue({ bot: true });
      expect(await detectAutomationTool()).toBe("playwright");
    });
  });
});
