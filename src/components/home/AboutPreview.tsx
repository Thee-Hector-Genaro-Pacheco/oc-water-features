import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { companyData } from "@/data/company";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export const AboutPreview: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Illustration Box */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-gradient-to-br from-brand-900 via-navy-900 to-brand-950 p-8 text-white shadow-2xl overflow-hidden border border-brand-800">
              <div className="absolute top-0 right-0 w-48 h-48 bg-aqua-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4 mb-6">
                <div className="relative w-18 h-18 sm:w-20 sm:h-20 bg-white rounded-2xl p-2 shrink-0 shadow-lg">
                  <Image
                    src="/logos/OCWaterFeatLogo.png"
                    alt="OC Water Features Seal"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-aqua-400 uppercase tracking-widest block">
                    {companyData.serviceAreaTagline}
                  </span>
                  <h3 className="text-xl font-bold text-white">Family-Operated</h3>
                </div>
              </div>

              <blockquote className="italic text-slate-300 text-sm sm:text-base mb-6 border-l-2 border-aqua-400 pl-4">
                &ldquo;Water features bring peace and beauty to any property. We make sure yours flows reliably every single day.&rdquo;
              </blockquote>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="block font-bold text-white text-lg">30+</span>
                  <span className="text-slate-300">Years Industry Experience</span>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="block font-bold text-white text-lg">100%</span>
                  <span className="text-slate-300">Dedicated Care</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
              About OC Water Features
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
              Water Feature Expertise Backed by Industry Experience Since 1992
            </h2>

            {/* Exact Company Description */}
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
              {companyData.description}
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              From residential courtyard fountains to large HOA reflection ponds and commercial water walls, our technicians combine hands-on mechanical skill with a commitment to clean, safe, crystal-clear water.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-800">
                  Submersible & Centrifugal Pump Diagnostics
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-800">
                  Underground Plumbing & Basin Leak Isolation
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-800">
                  Customized Eco-Friendly Water Chemistry
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span className="text-sm font-semibold text-slate-800">
                  Emergency Mechanical & Leak Service
                </span>
              </div>
            </div>

            <div className="pt-4">
              <Button href="/about" variant="primary" size="md">
                Learn More About Our Family Team
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
