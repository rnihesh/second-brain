import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
          <FileText className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-foreground">
            Terms of Service
          </h1>
        </div>

        <p className="mb-4 text-sm text-muted">
          Last updated: February 8, 2026
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-muted">
          {/* Acceptance */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Second Brain (&quot;the Service&quot;), you
              agree to be bound by these Terms of Service (&quot;Terms&quot;).
              If you do not agree to these Terms, you may not access or use the
              Service. These Terms constitute a legally binding agreement
              between you and Second Brain.
            </p>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              2. Description of Service
            </h2>
            <p>
              Second Brain is an AI-powered knowledge management application
              that allows users to capture, organize, and query their personal
              knowledge base. The Service includes features such as note-taking,
              file uploads, AI-powered summarization and tagging, natural
              language querying, knowledge graph visualization, and a public
              API.
            </p>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              3. Account Registration
            </h2>
            <p className="mb-3">
              To use certain features of the Service, you must create an
              account. When creating an account, you agree to:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>
                Accept responsibility for all activities under your account
              </li>
              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              4. Acceptable Use
            </h2>
            <p className="mb-3">You agree not to use the Service to:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Upload, store, or share any content that is illegal, harmful,
                threatening, abusive, or otherwise objectionable
              </li>
              <li>
                Violate any applicable laws, regulations, or third-party rights
              </li>
              <li>
                Attempt to gain unauthorized access to the Service or its
                systems
              </li>
              <li>
                Interfere with or disrupt the Service or servers connected to
                the Service
              </li>
              <li>
                Use the Service for any commercial purpose without our prior
                written consent
              </li>
              <li>Upload malware, viruses, or other malicious code</li>
              <li>
                Scrape, mine, or extract data from the Service without
                permission
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              5. Intellectual Property
            </h2>
            <p>
              You retain all ownership rights to the content you upload to
              Second Brain. By using the Service, you grant us a limited,
              non-exclusive license to process, store, and display your content
              solely for the purpose of providing the Service to you. We do not
              claim any ownership over your content. The Service itself,
              including its design, code, and branding, is the intellectual
              property of Second Brain.
            </p>
          </section>

          {/* AI-Generated Content */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              6. AI-Generated Content
            </h2>
            <p>
              The Service uses AI to generate summaries, tags, and answers to
              your queries. While we strive for accuracy, AI-generated content
              may contain errors, inaccuracies, or incomplete information. You
              acknowledge that AI-generated content is provided &quot;as
              is&quot; and should be reviewed before relying on it for important
              decisions. We are not liable for any errors or omissions in
              AI-generated content.
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              7. Privacy
            </h2>
            <p>
              Your use of the Service is also governed by our{" "}
              <Link
                href="/privacy"
                className="text-accent underline hover:text-accent-hover"
              >
                Privacy Policy
              </Link>
              , which describes how we collect, use, and protect your personal
              information. By using the Service, you consent to the collection
              and use of your information as described in the Privacy Policy.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              8. Third-Party Services
            </h2>
            <p>
              The Service integrates with third-party services including Google
              (for authentication), OpenAI, and Google Gemini (for AI features).
              Your use of these integrations is subject to the respective terms
              and privacy policies of these third-party providers. We are not
              responsible for the practices or content of third-party services.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              9. Limitation of Liability
            </h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SECOND BRAIN SHALL NOT BE
              LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS
              OF PROFITS, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN
              CONNECTION WITH YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL
              NOT EXCEED THE AMOUNT YOU HAVE PAID US IN THE TWELVE MONTHS
              PRECEDING THE CLAIM.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              10. Termination
            </h2>
            <p>
              We may suspend or terminate your access to the Service at any
              time, with or without cause, and with or without notice. You may
              terminate your account at any time by contacting us. Upon
              termination, your right to use the Service ceases immediately. We
              will delete your data in accordance with our Privacy Policy.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              11. Changes to These Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. We will
              notify you of material changes by posting the updated Terms on
              this page and updating the &quot;Last updated&quot; date. Your
              continued use of the Service after changes are posted constitutes
              your acceptance of the updated Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              12. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              applicable laws, without regard to conflict of law principles. Any
              disputes arising from these Terms or the Service shall be resolved
              through good-faith negotiation. If negotiation fails, disputes
              shall be submitted to binding arbitration.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              13. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at:{" "}
              <a
                href="mailto:legal@niheshr.com"
                className="text-accent underline hover:text-accent-hover"
              >
                legal@niheshr.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-sm text-dim">
          <Link href="/privacy" className="text-accent hover:text-accent-hover">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
