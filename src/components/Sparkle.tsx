"use client";

import { useEffect, useRef } from "react";

type SparkleMode = "inline" | "fullscreen";

const COLORS = ["#e8500a", "#d4a017", "#2e9e4f", "#2176ae", "#7b3fa0", "#c0334d", "#fff"];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function spawnSparkle(rect: DOMRect | null, mode: SparkleMode) {
  const el = document.createElement("span");
  const size = randomBetween(4, 9);
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]!;
  const shape = Math.random() > 0.5 ? "50%" : "0%";

  let x: number, y: number;
  if (mode === "fullscreen" || !rect) {
    x = randomBetween(0, window.innerWidth);
    y = randomBetween(0, window.innerHeight);
  } else {
    x = randomBetween(rect.left, rect.right);
    y = randomBetween(rect.top, rect.bottom);
  }

  const dx = randomBetween(-30, 30);
  const dy = randomBetween(-50, -10);
  const duration = randomBetween(600, 1100);

  el.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border-radius: ${shape};
    pointer-events: none;
    z-index: 9999;
    opacity: 1;
    transform: translate(0, 0) scale(1);
    transition: transform ${duration}ms ease-out, opacity ${duration}ms ease-out;
  `;

  document.body.appendChild(el);
  el.getBoundingClientRect();
  el.style.transform = `translate(${dx}px, ${dy}px) scale(0)`;
  el.style.opacity = "0";
  setTimeout(() => el.remove(), duration);
}

export function Sparkle({ mode }: { mode: SparkleMode }) {
  const anchorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rate = mode === "fullscreen" ? 80 : 250;
    const count = mode === "fullscreen" ? 3 : 1;

    const interval = setInterval(() => {
      const rect = mode === "inline" && anchorRef.current
        ? anchorRef.current.getBoundingClientRect()
        : null;
      for (let i = 0; i < count; i++) spawnSparkle(rect, mode);
    }, rate);

    return () => clearInterval(interval);
  }, [mode]);

  if (mode === "fullscreen") return null;

  return <span ref={anchorRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}
