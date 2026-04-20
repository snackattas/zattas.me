"use client";

import { useEffect, useRef, useState } from "react";

import { HeaderMedia } from "@/components/HeaderMedia";
import { Nav } from "@/components/Nav";
import type { NavSection } from "@/lib/sections";

export function CollapsingHeader({ sections }: { sections: NavSection[] }) {
  const [collapsed, setCollapsed] = useState(false);
  const lastYRef = useRef(0);
  const lastToggleAtRef = useRef(0);

  useEffect(() => {
    let raf = 0;

    const COLLAPSE_AT_Y = 140;
    const EXPAND_AT_Y = 60;
    const TOGGLE_COOLDOWN_MS = 350;

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;

        const y = window.scrollY;
        const lastY = lastYRef.current;
        const isScrollingDown = y > lastY;
        const isScrollingUp = y < lastY;

        lastYRef.current = y;

        const now = Date.now();
        if (now - lastToggleAtRef.current < TOGGLE_COOLDOWN_MS) return;

        setCollapsed((prev) => {
          if (!prev && isScrollingDown && y > COLLAPSE_AT_Y) {
            lastToggleAtRef.current = now;
            return true;
          }

          if (prev && isScrollingUp && y <= EXPAND_AT_Y) {
            lastToggleAtRef.current = now;
            return false;
          }

          return prev;
        });
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <HeaderMedia
      className={
        "sticky top-0 z-20 transition-[height] duration-300 ease-out"
      }
      heightClassName={
        collapsed ? "h-16" : "h-56 md:h-72"
      }
      overlay={
        <div
          className={
            collapsed
              ? "bg-black/15"
              : "bg-transparent"
          }
        >
          <Nav
            sections={sections}
            variant="overlay"
            overlayMode={collapsed ? "collapsed" : "expanded"}
          />
        </div>
      }
    />
  );
}
