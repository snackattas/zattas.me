"use client";

import { useEffect } from "react";

export function ClientInteractions() {
  useEffect(() => {
    // ── Custom cursor ──────────────────────────────────────────────────────
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (!dot || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px)`;
    };
    document.addEventListener("mousemove", onMouseMove);

    let rafId: number;
    const animCursor = () => {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      rafId = requestAnimationFrame(animCursor);
    };
    animCursor();

    const hoverTargets = document.querySelectorAll("a, button, .tilt-card, .social-link");
    const addHover = () => ring.classList.add("hovered");
    const rmvHover = () => ring.classList.remove("hovered");
    hoverTargets.forEach(el => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", rmvHover);
    });

    // ── Scroll reveal ──────────────────────────────────────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el, i) => {
      (el as HTMLElement).style.transitionDelay = `${(i % 4) * 0.06}s`;
      observer.observe(el);
    });

    // ── Card tilt ──────────────────────────────────────────────────────────
    const tiltCards = document.querySelectorAll<HTMLElement>(".tilt-card");
    const onTiltMove = function (this: HTMLElement, e: Event) {
      const me = e as MouseEvent;
      const r = this.getBoundingClientRect();
      const x = (me.clientX - r.left) / r.width - 0.5;
      const y = (me.clientY - r.top) / r.height - 0.5;
      this.style.transform = `perspective(700px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(6px)`;
      this.style.zIndex = "2";
    };
    const onTiltLeave = function (this: HTMLElement) {
      this.style.transform = "";
      this.style.zIndex = "";
    };
    tiltCards.forEach(card => {
      card.addEventListener("mousemove", onTiltMove);
      card.addEventListener("mouseleave", onTiltLeave);
    });

    // ── Konami code ────────────────────────────────────────────────────────
    const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let kIdx = 0;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === KONAMI[kIdx]) {
        kIdx++;
        if (kIdx === KONAMI.length) {
          kIdx = 0;
          document.body.classList.add("konami-active");
          const toast = document.getElementById("konami-toast");
          if (toast) {
            toast.classList.add("show");
            setTimeout(() => {
              toast.classList.remove("show");
              document.body.classList.remove("konami-active");
            }, 20000);
          }
        }
      } else {
        kIdx = 0;
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(rafId);
      observer.disconnect();
      tiltCards.forEach(card => {
        card.removeEventListener("mousemove", onTiltMove);
        card.removeEventListener("mouseleave", onTiltLeave);
      });
      hoverTargets.forEach(el => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", rmvHover);
      });
    };
  }, []);

  return null;
}
