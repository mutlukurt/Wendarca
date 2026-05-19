"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

export function MouseGlowBackground() {
  const glowRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(() => {
        glowRef.current?.style.setProperty("--x", `${event.clientX}px`);
        glowRef.current?.style.setProperty("--y", `${event.clientY}px`);
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-[0.28]" />
      <div
        ref={glowRef}
        className="absolute inset-0 opacity-80"
        style={{
          "--x": "50vw",
          "--y": "12vh",
          background:
            "radial-gradient(520px circle at var(--x) var(--y), rgba(251, 77, 39, 0.16), rgba(251, 77, 39, 0.05) 34%, transparent 68%)",
        } as CSSProperties}
      />
    </div>
  );
}
