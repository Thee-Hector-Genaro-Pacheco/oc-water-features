import React from "react";
import Image from "next/image";
import { Phone, ShieldCheck, Award, ArrowRight } from "lucide-react";
import { companyData } from "@/data/company";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-brand-950 text-white py-16 sm:py-24 lg:py-32">
      {/* Background Decorative SVG Water Wave Effects */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#008080_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-aqua-500/15 blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Main Hero Copy Column */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            {/* Experience Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-aqua-500/10 border border-aqua-500/30 text-aqua-300 text-xs sm:text-sm font-semibold tracking-wide uppercase">
              <Award className="w-4 h-4 text-aqua-400" aria-hidden="true" />
              <span>Industry Experience Since 1992</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
              Professional Water Feature Maintenance & Repair
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {companyData.shortDescription}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button href="/request-estimate" variant="accent" size="lg" className="w-full sm:w-auto">
                <span>Request a Free Estimate</span>
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>

              <Button
                href={companyData.phoneRaw}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                <Phone className="w-5 h-5 mr-2 text-aqua-400" aria-hidden="true" />
                <span>Call Now: {companyData.phonePlaceholder}</span>
              </Button>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <ShieldCheck className="w-4 h-4 text-aqua-400 shrink-0" aria-hidden="true" />
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <ShieldCheck className="w-4 h-4 text-aqua-400 shrink-0" aria-hidden="true" />
                <span>Res & Commercial</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center justify-center lg:justify-start gap-2">
                <ShieldCheck className="w-4 h-4 text-aqua-400 shrink-0" aria-hidden="true" />
                <span>Free Consultation</span>
              </div>
            </div>
          </div>

          {/* Right Visual Graphic Banner / Stylized Feature Box */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl bg-gradient-to-tr from-brand-900/90 to-slate-900/90 p-6 sm:p-8 border border-white/15 shadow-2xl backdrop-blur-xl">
              {/* Top Card Banner Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="relative w-14 h-14 bg-white rounded-xl p-2 shrink-0 shadow-md">
                  <Image
                    src="/logos/logo.png"
                    alt="OC Water Features Emblem"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    Southern California Water Experts
                  </h2>
                  <p className="text-xs text-aqua-300 font-medium">
                    Fountains • Ponds • Waterfalls • Pumps
                  </p>
                </div>
              </div>

              {/* Feature Highlights Grid inside Visual Card */}
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-aqua-500/20 text-aqua-300 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-bold text-sm">30+</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">30+ Years Industry Experience</h3>
                    <p className="text-xs text-slate-300">Hands-on knowledge dating back to 1992</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-300 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-bold text-sm">100%</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Family-Operated Standards</h3>
                    <p className="text-xs text-slate-300">Personalized care for every customer</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="font-bold text-sm">⚡</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Fast Diagnostic Response</h3>
                    <p className="text-xs text-slate-300">Prompt troubleshooting for leaks & pump failures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
