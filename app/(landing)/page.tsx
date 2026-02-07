"use client";

import React from "react";
import Link from "next/link";
import {
  Brain,
  Database,
  Sparkles,
  Globe,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { StaggerChildren } from "@/components/animations/stagger-children";

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
    description: "Add notes, paste links, or upload files. Tag and categorize as you go.",
  },
  {
    number: "02",
    title: "Enrich",
    description: "AI auto-summarizes, tags, and builds connections between your knowledge items.",
  },
  {
    number: "03",
    title: "Query",
    description: "Ask natural language questions. Get answers sourced from your own knowledge base.",
  },
];

const techStack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS v4",
  "Prisma",
  "NextAuth",
  "Framer Motion",
  "OpenAI / Gemini",
  "React Flow",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 text-center">
          {/* Badge */}
          <FadeIn>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-muted">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              AI-Powered Knowledge Management
            </div>
          </FadeIn>

          {/* Title */}
          <FadeIn delay={0.1}>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
              Your{" "}
              <span className="text-accent">
                Second Brain
              </span>
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.2}>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              Capture everything you learn. Let AI organize, summarize, and
              connect your knowledge. Query your brain with natural language.
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.3}>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Link
                href="/auth/signup"
                className="group inline-flex h-12 items-center gap-2 rounded-xl bg-accent px-8 text-base font-semibold text-background transition-colors hover:bg-accent-hover"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border bg-surface px-8 text-base font-medium text-foreground transition-colors hover:border-border-hover hover:text-accent"
              >
                Dashboard
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32">
        <div className="mx-auto max-w-6xl px-4">
          <FadeIn>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                Everything you need to build your knowledge
              </h2>
              <p className="mx-auto max-w-xl text-muted">
                A complete system for capturing, enriching, and querying your
                personal knowledge base.
              </p>
            </div>
          </FadeIn>

          <StaggerChildren className="grid gap-6 md:grid-cols-3" staggerDelay={0.15}>
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-border-hover"
              >
                <div className="mb-5 inline-flex rounded-xl bg-accent/10 p-3">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* How it works */}
      <section className="relative py-32">
        <div className="mx-auto max-w-4xl px-4">
          <FadeIn>
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                How it works
              </h2>
              <p className="mx-auto max-w-xl text-muted">
                Three simple steps to build an AI-enhanced knowledge base.
              </p>
            </div>
          </FadeIn>

          <div className="relative">
            {/* Connecting line - solid, single color */}
            <div className="absolute left-8 top-0 hidden h-full w-px bg-accent/20 md:left-1/2 md:block" />

            <StaggerChildren className="space-y-12" staggerDelay={0.2}>
              {steps.map((step, idx) => (
                <div
                  key={step.number}
                  className={`relative flex items-center gap-8 ${
                    idx % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Number circle */}
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-background text-xl font-bold text-accent md:mx-auto">
                    {step.number}
                  </div>
                  {/* Content */}
                  <div
                    className={`flex-1 rounded-xl border border-border bg-surface p-6 ${
                      idx % 2 === 1 ? "md:text-right" : ""
                    }`}
                  >
                    <h3 className="mb-2 text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted">{step.description}</p>
                  </div>
                </div>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <FadeIn>
            <h2 className="mb-8 text-2xl font-bold text-foreground">Built with modern tech</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted transition-colors hover:border-accent/30 hover:text-accent"
                >
                  {tech}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <FadeIn>
            <div className="rounded-2xl border border-border bg-surface p-12 md:p-16">
              <Brain className="mx-auto mb-6 h-12 w-12 text-accent" />
              <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                Ready to build your second brain?
              </h2>
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
            </div>
          </FadeIn>
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
              href="/auth/signin"
              className="text-sm text-dim transition-colors hover:text-foreground"
            >
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
