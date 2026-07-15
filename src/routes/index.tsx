import { createFileRoute, Link } from "@tanstack/react-router";
import { LandingNavbar } from "@/components/landing-navbar";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <LandingNavbar />
      <HeroSection />
      <ProblemSection />
      <WhatWeDoSection />
      <HowItWorksSection />
      <ResultsSection />
      <MissionSection />
      <ImpactSection />
      <FinalCTASection />
      <FooterSection />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reusable bits                                                        */
/* ------------------------------------------------------------------ */

function PrimaryButton({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      search={to === "/login" ? { mode: "signin" } : undefined}
      className="inline-flex items-center justify-center rounded-lg bg-institutional-700 px-6 py-3 text-sm font-semibold text-white hover:bg-institutional-800 transition-all duration-200 hover:shadow-lg hover:shadow-institutional-700/20"
    >
      {children}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-institutional-600 mb-4">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Hero                                                              */
/* ------------------------------------------------------------------ */

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/collector-hero.jpg"
          alt="A waste collector sorting recyclable materials at a community site, representing dignity in essential field work"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/65 to-navy-950/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-institutional-300 mb-6 animate-fade-in">
            Polis Systems
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.1] tracking-tight animate-fade-up">
            Making the invisible visible.
          </h1>
          <p
            className="mt-6 text-lg text-navy-100 leading-relaxed max-w-xl animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            Turning overlooked cleanup work into visible, verifiable impact for
            communities, field workers, and the institutions that support them.
          </p>
          <div
            className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <PrimaryButton to="/login">Log In</PrimaryButton>
            <Link
              to="/login"
              search={{ mode: "signup" }}
              className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block animate-fade-in"
        style={{ animationDelay: "0.6s" }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-white/50 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Problem                                                           */
/* ------------------------------------------------------------------ */

function ProblemSection() {
  return (
    <section id="about" className="py-20 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1">
            <SectionLabel>The Problem</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl text-navy-950 leading-tight tracking-tight">
              Essential work should not disappear into scattered messages and
              unseen effort.
            </h2>
            <p className="mt-6 text-lg text-navy-600 leading-relaxed">
              Cleanup work is often coordinated through calls, chats, and
              informal networks. The work happens, but the evidence,
              recognition, and operational visibility are often lost.
            </p>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/images/collector-problem.jpg"
                alt="Hands sorting through mixed waste materials, illustrating the informal and often undocumented nature of cleanup work"
                className="w-full h-[400px] lg:h-[520px] object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. What Polis Systems Does                                           */
/* ------------------------------------------------------------------ */

function WhatWeDoSection() {
  const pillars = [
    {
      number: "01",
      title: "Coordinate",
      description:
        "Organize cleanup tasks, responsibilities, and progress in one clear system.",
    },
    {
      number: "02",
      title: "Verify",
      description:
        "Turn photos, timestamps, locations, and task records into credible proof of work.",
    },
    {
      number: "03",
      title: "Recognize",
      description:
        "Create clearer visibility for the people and communities doing work that too often goes unseen.",
    },
  ];

  return (
    <section className="py-20 md:py-32 bg-navy-50">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <SectionLabel>What We Do</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl text-navy-950 leading-tight tracking-tight">
            Coordinate the work. Verify the outcome. Make the impact visible.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-navy-100 rounded-2xl overflow-hidden border border-navy-100">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="bg-white p-8 lg:p-10 flex flex-col gap-4 hover:bg-navy-50/50 transition-colors duration-300"
            >
              <span className="font-display text-2xl text-institutional-400 font-medium">
                {pillar.number}
              </span>
              <h3 className="font-display text-xl text-navy-950 font-medium">
                {pillar.title}
              </h3>
              <p className="text-navy-600 leading-relaxed text-[15px]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. How It Works                                                      */
/* ------------------------------------------------------------------ */

function HowItWorksSection() {
  const steps = [
    "Create a task",
    "Assign a collector",
    "Coordinate through WhatsApp",
    "Receive proof",
    "Review the work",
    "Measure the impact",
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <SectionLabel>How It Works</SectionLabel>
          <h2 className="font-display text-3xl sm:text-4xl text-navy-950 leading-tight tracking-tight mb-6">
            A simple workflow from task to verified impact.
          </h2>
          <p className="text-lg text-navy-600 leading-relaxed">
            Polis Systems combines a simple operations dashboard with a
            WhatsApp-first field workflow, reducing digital friction while
            improving accountability.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-2">
          {steps.map((step, i) => (
            <div
              key={step}
              className="relative flex flex-col items-center text-center"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-institutional-50 border border-institutional-100 text-institutional-700 font-semibold text-sm mb-3">
                {i + 1}
              </div>
              <p className="text-sm font-medium text-navy-800 leading-snug max-w-[140px]">
                {step}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-[55%] w-full h-px bg-navy-100" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Results / Visible Change                                          */
/* ------------------------------------------------------------------ */

function ResultsSection() {
  return (
    <section className="py-20 md:py-32 bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-institutional-300 mb-4">
            Results
          </p>
          <h2 className="font-display text-3xl sm:text-4xl text-white leading-tight tracking-tight">
            Visible work. Verifiable change.
          </h2>
          <p className="mt-6 text-lg text-navy-200 leading-relaxed">
            Polis Systems helps turn field activity into a clear record of what
            was done, where it happened, and what changed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          <div className="overflow-hidden rounded-2xl bg-navy-900">
            <img
              src="/images/before-after-1.jpg"
              alt="Before and after comparison showing a waste site before cleanup work was carried out"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="overflow-hidden rounded-2xl bg-navy-900">
            <img
              src="/images/before-after-2.jpg"
              alt="Before and after comparison showing the same site after cleanup work was completed"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Mission                                                           */
/* ------------------------------------------------------------------ */

function MissionSection() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Image — wider column */}
          <div className="lg:col-span-3">
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src="/images/collector-mission.jpg"
                alt="A field worker engaged in community cleanup work, representing dignity and inclusion in environmental labour"
                className="w-full h-[400px] lg:h-[560px] object-cover object-center"
              />
            </div>
          </div>

          {/* Text — narrower column */}
          <div className="lg:col-span-2">
            <SectionLabel>Our Mission</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl text-navy-950 leading-tight tracking-tight">
              Better systems should work for the people already doing the work.
            </h2>
            <p className="mt-6 text-lg text-navy-600 leading-relaxed">
              Polis Systems is designed around the realities of field work. It
              helps organizations coordinate more effectively without forcing
              workers into complicated software, while creating clearer records
              of contribution, progress, and impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Impact                                                            */
/* ------------------------------------------------------------------ */

function ImpactSection() {
  const impacts = [
    {
      title: "More visibility",
      description: "for field work and community contribution",
    },
    {
      title: "Better coordination",
      description: "across operators, organizations, and local teams",
    },
    {
      title: "Stronger evidence",
      description: "for decisions, reporting, and future investment",
    },
  ];

  return (
    <section id="impact" className="py-20 md:py-32 bg-institutional-50">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-navy-900/10">
              <img
                src="/images/collector-impact.jpg"
                alt="Community members participating in a collective environmental cleanup effort, showing the power of coordinated field work"
                className="w-full h-[400px] lg:h-[520px] object-cover object-center"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <SectionLabel>Impact</SectionLabel>
            <h2 className="font-display text-3xl sm:text-4xl text-navy-950 leading-tight tracking-tight mb-10">
              When work becomes visible, recognition and better decisions can
              follow.
            </h2>

            <div className="space-y-8">
              {impacts.map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-institutional-700 text-white flex items-center justify-center text-sm font-semibold">
                      {i + 1}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-lg text-navy-950 font-medium">
                      {item.title}
                    </h3>
                    <p className="text-navy-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Final CTA                                                         */
/* ------------------------------------------------------------------ */

function FinalCTASection() {
  return (
    <section className="py-24 md:py-36 bg-navy-950 relative overflow-hidden">
      {/* Subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-institutional-950 opacity-50" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 md:px-6 lg:px-8 text-center">
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
          Make the invisible visible.
        </h2>
        <p className="mt-6 text-lg text-navy-200 leading-relaxed max-w-xl mx-auto">
          Build clearer operations. Recognize the work. Measure what changes.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <PrimaryButton to="/login">Log In</PrimaryButton>
          <Link
            to="/login"
            search={{ mode: "signup" }}
            className="inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 backdrop-blur-sm px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                               */
/* ------------------------------------------------------------------ */

function FooterSection() {
  return (
    <footer className="bg-navy-950 border-t border-navy-800 py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-institutional-700 text-white font-bold text-xs">
              P
            </div>
            <span className="font-semibold text-white text-base tracking-tight">
              Polis Systems
            </span>
          </div>
          <p className="text-sm text-navy-400 text-center md:text-right">
            Making the invisible visible — for communities, field workers, and
            institutions.
          </p>
        </div>
      </div>
    </footer>
  );
}
