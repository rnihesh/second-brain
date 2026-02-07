"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxCardProps {
  children: React.ReactNode;
  depth?: number;
  index?: number;
  className?: string;
}

function ParallaxCard({
  children,
  depth = 1,
  index = 0,
  className,
}: ParallaxCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    // Entrance animation
    const entrance = gsap.fromTo(
      el,
      { y: 60, opacity: 0, scale: 0.97 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        delay: index * 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      }
    );

    // Subtle parallax on continued scroll
    const parallax = gsap.to(el, {
      y: -15 * depth,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });

    return () => {
      entrance.kill();
      parallax.kill();
    };
  }, [depth, index]);

  return (
    <div ref={cardRef} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

export { ParallaxCard };
