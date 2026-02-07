"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Brain,
  Database,
  Sparkles,
  Globe,
  ArrowRight,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { GsapProvider } from "@/components/animations/gsap-provider";
import { TextReveal } from "@/components/animations/text-reveal";
import { ParallaxCard } from "@/components/animations/parallax-card";
import { ScrollTimeline } from "@/components/animations/scroll-timeline";
import { AnimatedGridBg } from "@/components/animations/animated-grid-bg";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Database,
    title: "Capture & Store",
    description:
      "Save notes, links, and insights in one place. Supports markdown, file uploads, and URL bookmarking with automatic metadata extraction.",
  },
  {
    icon: Sparkles,
    title: "AI Intelligence",
    description:
      "Auto-summarize content, generate tags, and query your entire knowledge base with natural language. Powered by pluggable AI providers.",
  },
  {
    icon: Globe,
    title: "Public API",
    description:
      "Expose your brain as an API. Embed a search widget on your site, let others query your knowledge, or integrate with external tools.",
  },
];

const steps = [
  {
    number: "01",
    title: "Capture",
    description:
      "Add notes, paste links, or upload files. Tag and categorize as you go.",
  },
  {
    number: "02",
    title: "Enrich",
    description:
      "AI auto-summarizes, tags, and builds connections between your knowledge items.",
  },
  {
    number: "03",
    title: "Query",
    description:
      "Ask natural language questions. Get answers sourced from your own knowledge base.",
  },
];

const techStack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "Prisma",
  "NextAuth",
  "GSAP",
  "OpenAI / Gemini",
  "React Flow",
];

export default function LandingPage() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const techBadgesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Badge scale-in
    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)", delay: 0.1 }
      );
    }

    // CTA buttons stagger
    if (ctaRef.current) {
      const buttons = ctaRef.current.querySelectorAll("a");
      gsap.fromTo(
        buttons,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power2.out", delay: 0.6 }
      );
    }
  }, []);

  // Tech badges scroll-triggered entrance
  useEffect(() => {
    if (!techBadgesRef.current) return;
    const badges = techBadgesRef.current.querySelectorAll(".tech-badge");

    gsap.fromTo(
      badges,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.06,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: techBadgesRef.current,
          start: "top 85%",
          once: true,
        },
      }
    );
  }, []);

  return (
    <GsapProvider>
      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="relative">
          <AnimatedGridBg />
          <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 text-center">
            {/* Badge */}
            <div ref={badgeRef} style={{ opacity: 0 }}>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-muted">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                AI-Powered Knowledge Management
              </div>
            </div>

            {/* Title */}
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
              <TextReveal splitBy="words" trigger="load" delay={0.2} as="span">
                Your
              </TextReveal>{" "}
              <TextReveal
                splitBy="chars"
                trigger="load"
                delay={0.35}
                as="span"
                className="text-accent"
              >
                Second Brain
              </TextReveal>
            </h1>

            {/* Subtitle */}
            <TextReveal
              splitBy="words"
              trigger="load"
              delay={0.5}
              as="p"
              className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
            >
              Capture everything you learn. Let AI organize, summarize, and connect your knowledge. Query your brain with natural language.
            </TextReveal>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/auth/signup"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-8 text-base font-semibold text-background transition-colors hover:bg-accent-hover"
                style={{ opacity: 0 }}
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-8 text-base font-medium text-foreground transition-colors hover:border-border-hover hover:text-accent"
                style={{ opacity: 0 }}
              >
                Dashboard
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <ChevronDown className="h-5 w-5 text-muted animate-bounce-down" />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative py-32">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center">
              <TextReveal
                splitBy="words"
                trigger="scroll"
                as="h2"
                className="mb-4 text-3xl font-bold text-foreground sm:text-4xl"
              >
                Everything you need to build your knowledge
              </TextReveal>
              <TextReveal
                splitBy="words"
                trigger="scroll"
                delay={0.1}
                as="p"
                className="mx-auto max-w-xl text-muted"
              >
                A complete system for capturing, enriching, and querying your personal knowledge base.
              </TextReveal>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, i) => (
                <ParallaxCard
                  key={feature.title}
                  depth={0.5 + i * 0.3}
                  index={i}
                  className="rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-accent/30"
                >
                  <div className="mb-5 inline-flex rounded-xl bg-accent/10 p-3 ring-1 ring-accent/20">
                    <feature.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {feature.description}
                  </p>
                </ParallaxCard>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative py-32">
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center">
              <TextReveal
                splitBy="words"
                trigger="scroll"
                as="h2"
                className="mb-4 text-3xl font-bold text-foreground sm:text-4xl"
              >
                How it works
              </TextReveal>
              <TextReveal
                splitBy="words"
                trigger="scroll"
                delay={0.1}
                as="p"
                className="mx-auto max-w-xl text-muted"
              >
                Three simple steps to build an AI-enhanced knowledge base.
              </TextReveal>
            </div>

            <ScrollTimeline>
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-2xl border border-border bg-surface p-8"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-background text-lg font-bold text-accent">
                    {step.number}
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              ))}
            </ScrollTimeline>
          </div>
        </section>

        {/* Tech stack */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <TextReveal
              splitBy="words"
              trigger="scroll"
              as="h2"
              className="mb-8 text-2xl font-bold text-foreground"
            >
              Built with modern tech
            </TextReveal>
            <div ref={techBadgesRef} className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="tech-badge rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors hover:border-accent/30 hover:text-accent"
                  style={{ opacity: 0 }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-32">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <ParallaxCard depth={0.3} className="rounded-2xl border border-accent/10 bg-surface p-12 md:p-16">
              <Brain className="mx-auto mb-6 h-12 w-12 text-accent" />
              <TextReveal
                splitBy="words"
                trigger="scroll"
                as="h2"
                className="mb-4 text-3xl font-bold text-foreground sm:text-4xl"
              >
                Ready to build your second brain?
              </TextReveal>
              <p className="mx-auto mb-8 max-w-lg text-muted">
                Start capturing knowledge today and let AI help you make sense
                of it all.
              </p>
              <Link
                href="/auth/signup"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-8 text-base font-semibold text-background transition-colors hover:bg-accent-hover"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </ParallaxCard>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
            <div className="flex items-center gap-2 text-muted">
              <Brain className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Second Brain</span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="/docs"
                className="text-sm text-dim transition-colors hover:text-foreground"
              >
                Docs
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-dim transition-colors hover:text-foreground"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-dim transition-colors hover:text-foreground"
              >
                Terms
              </Link>
              <Link
                href="/auth/signin"
                className="text-sm text-dim transition-colors hover:text-foreground"
              >
                Sign In
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </GsapProvider>
  );
}
