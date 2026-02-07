"use client";

import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  splitBy?: "words" | "chars";
  trigger?: "load" | "scroll";
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

function TextReveal({
  children,
  splitBy = "words",
  trigger = "scroll",
  delay = 0,
  as: Tag = "div",
  className,
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const spans = el.querySelectorAll(".tr-unit");
    if (!spans.length) return;

    gsap.set(spans, { opacity: 0, y: 20 });

    const anim = gsap.to(spans, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: splitBy === "chars" ? 0.02 : 0.06,
      ease: "power2.out",
      delay,
      scrollTrigger:
        trigger === "scroll"
          ? {
              trigger: el,
              start: "top 85%",
              once: true,
            }
          : undefined,
    });

    return () => {
      anim.kill();
    };
  }, [children, splitBy, trigger, delay]);

  const units =
    splitBy === "chars" ? children.split("") : children.split(/(\s+)/);

  return (
    // @ts-expect-error - dynamic tag
    <Tag ref={containerRef} className={className} aria-label={children}>
      {units.map((unit, i) => {
        if (/^\s+$/.test(unit)) {
          return <span key={i}>&nbsp;</span>;
        }
        return (
          <span
            key={i}
            className="tr-unit inline-block"
            style={{ opacity: 0 }}
            aria-hidden="true"
          >
            {unit}
          </span>
        );
      })}
    </Tag>
  );
}

export { TextReveal };
