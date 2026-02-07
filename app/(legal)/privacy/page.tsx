import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mb-12 flex items-center gap-3">
          <Shield className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
        </div>

        <p className="mb-4 text-sm text-muted">
          Last updated: February 8, 2026
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-muted">
          {/* Introduction */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              1. Introduction
            </h2>
            <p>
              Welcome to Second Brain (&quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;). This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our
              AI-powered knowledge management application. Please read this
              policy carefully. By accessing or using Second Brain, you agree to
              the terms of this Privacy Policy.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              2. Information We Collect
            </h2>
            <p className="mb-3">
              We collect information in the following ways:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">
                  Account Information:
                </strong>{" "}
                When you create an account, we collect your name, email address,
                and profile picture (if provided through OAuth).
              </li>
              <li>
                <strong className="text-foreground">User Content:</strong>{" "}
                Notes, links, file uploads, and other knowledge items you store
                in your Second Brain.
              </li>
              <li>
                <strong className="text-foreground">Usage Data:</strong>{" "}
                Information about how you interact with the application,
                including pages visited, features used, and timestamps.
              </li>
              <li>
                <strong className="text-foreground">Device Information:</strong>{" "}
                Browser type, operating system, and device identifiers collected
                automatically.
              </li>
            </ul>
          </section>

          {/* Google OAuth Data */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              3. Google OAuth Data
            </h2>
            <p className="mb-3">
              When you sign in using Google OAuth, we access the following
              information from your Google account:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Your name and email address</li>
              <li>Your profile picture</li>
            </ul>
            <p className="mt-3">
              We do not access your Google Drive, Gmail, contacts, or any other
              Google services data. We only use the information necessary to
              create and manage your account. Our use of Google user data
              complies with the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:text-accent-hover"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              4. How We Use Your Information
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                To provide, maintain, and improve Second Brain&apos;s features
                and services
              </li>
              <li>To authenticate your identity and manage your account</li>
              <li>To process and store your knowledge items securely</li>
              <li>
                To provide AI-powered features such as summarization, tagging,
                and natural language queries
              </li>
              <li>To communicate with you about service updates and changes</li>
              <li>To ensure the security and integrity of our platform</li>
            </ul>
          </section>

          {/* AI Processing */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              5. AI Processing
            </h2>
            <p>
              Second Brain uses third-party AI providers (such as OpenAI and
              Google Gemini) to process your content for summarization, tagging,
              and natural language queries. When you use AI features, relevant
              portions of your content are sent to these providers for
              processing. These providers process data according to their own
              privacy policies and do not retain your data for training purposes
              beyond what is necessary to provide the service.
            </p>
          </section>

          {/* Data Storage & Security */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              6. Data Storage &amp; Security
            </h2>
            <p>
              Your data is stored securely using industry-standard practices. We
              use encrypted connections (SSL/TLS) for all data transmission.
              Your knowledge base is stored in PostgreSQL databases hosted on
              Neon, which provides enterprise-grade security and encryption at
              rest. We implement appropriate technical and organizational
              measures to protect your personal data against unauthorized
              access, alteration, or destruction.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              7. Your Rights
            </h2>
            <p className="mb-3">
              Depending on your location, you may have the following rights
              regarding your personal data:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">Access:</strong> Request a
                copy of the personal data we hold about you
              </li>
              <li>
                <strong className="text-foreground">Rectification:</strong>{" "}
                Request correction of inaccurate personal data
              </li>
              <li>
                <strong className="text-foreground">Erasure:</strong> Request
                deletion of your personal data
              </li>
              <li>
                <strong className="text-foreground">Portability:</strong>{" "}
                Request export of your data in a machine-readable format
              </li>
              <li>
                <strong className="text-foreground">Restriction:</strong>{" "}
                Request limitation of processing of your personal data
              </li>
              <li>
                <strong className="text-foreground">Objection:</strong> Object
                to processing of your personal data
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact us using the
              information provided below.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              8. Data Retention
            </h2>
            <p>
              We retain your personal data for as long as your account is active
              or as needed to provide you services. When you delete your
              account, we will delete your personal data and knowledge base
              content within 30 days, except where we are required to retain
              data for legal or compliance purposes.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              9. Third-Party Services
            </h2>
            <p>
              Second Brain integrates with or relies on the following
              third-party services:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">Google OAuth:</strong> For
                authentication
              </li>
              <li>
                <strong className="text-foreground">
                  OpenAI / Google Gemini:
                </strong>{" "}
                For AI processing features
              </li>
              <li>
                <strong className="text-foreground">Neon:</strong> For database
                hosting
              </li>
              <li>
                <strong className="text-foreground">Vercel:</strong> For
                application hosting
              </li>
            </ul>
            <p className="mt-3">
              Each of these services has its own privacy policy governing the
              use of your data.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              10. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the &quot;Last updated&quot; date. Your
              continued use of Second Brain after changes are posted constitutes
              your acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              11. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:{" "}
              <a
                href="mailto:privacy@niheshr.com"
                className="text-accent underline hover:text-accent-hover"
              >
                privacy@niheshr.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-sm text-dim">
          <Link href="/terms" className="text-accent hover:text-accent-hover">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
