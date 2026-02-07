"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

function AnimatedGridBg() {
  const blobsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = blobsRef.current;
    if (!container) return;

    const blobs = container.querySelectorAll(".glow-blob");
    const anims: gsap.core.Tween[] = [];

    blobs.forEach((blob) => {
      const tween = gsap.to(blob, {
        x: () => gsap.utils.random(-120, 120),
        y: () => gsap.utils.random(-120, 120),
        duration: () => gsap.utils.random(6, 10),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      anims.push(tween);
    });

    return () => {
      anims.forEach((a) => a.kill());
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--acc) 0.5px, transparent 0.5px)",
          backgroundSize: "32px 32px",
          opacity: 0.06,
        }}
      />

      {/* Floating glow blobs */}
      <div ref={blobsRef}>
        <div
          className="glow-blob absolute left-1/4 top-1/4 h-64 w-64 rounded-full"
          style={{
            background: "var(--acc)",
            opacity: 0.04,
            filter: "blur(80px)",
          }}
        />
        <div
          className="glow-blob absolute right-1/4 top-1/2 h-48 w-48 rounded-full"
          style={{
            background: "var(--acc)",
            opacity: 0.03,
            filter: "blur(60px)",
          }}
        />
        <div
          className="glow-blob absolute bottom-1/4 left-1/2 h-56 w-56 rounded-full"
          style={{
            background: "var(--acc)",
            opacity: 0.035,
            filter: "blur(70px)",
          }}
        />
      </div>

      {/* Edge fading */}
      <div className="absolute inset-0" style={{
        background: "radial-gradient(ellipse at center, transparent 50%, var(--bg) 100%)",
      }} />
    </div>
  );
}

export { AnimatedGridBg };
