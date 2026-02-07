"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollTimelineProps {
  children: React.ReactNode[];
  className?: string;
}

function ScrollTimeline({ children, className }: ScrollTimelineProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;
    if (!section || !track || !progress) return;

    const cards = track.querySelectorAll(".st-card");
    const totalScroll = track.scrollWidth - section.offsetWidth;

    // Horizontal scroll
    const tween = gsap.to(track, {
      x: -totalScroll,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${totalScroll}`,
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          gsap.set(progress, { scaleX: self.progress });
        },
      },
    });

    // Card entrance
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0.3, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: card,
            containerAnimation: tween,
            start: "left 80%",
            end: "left 40%",
            scrub: 1,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === section) t.kill();
      });
      tween.kill();
    };
  }, [isMobile, children]);

  // Mobile: vertical stack
  if (isMobile) {
    return (
      <div className={className}>
        <div className="space-y-6">
          {children.map((child, i) => (
            <div key={i}>{child}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className || ""}`}>
      {/* Progress bar */}
      <div className="absolute left-0 top-0 z-10 h-0.5 w-full bg-border">
        <div
          ref={progressRef}
          className="h-full w-full origin-left bg-accent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <div ref={trackRef} className="flex items-center gap-8 px-8 py-16" style={{ width: "max-content" }}>
        {children.map((child, i) => (
          <div key={i} className="st-card w-[350px] shrink-0 md:w-[400px]">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

export { ScrollTimeline };
