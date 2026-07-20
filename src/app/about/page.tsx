import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { Award, ShieldCheck, HeartHandshake, Wrench } from "lucide-react";
import { companyData } from "@/data/company";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata: Metadata = constructMetadata({
  title: "About Us | Southern California Water Feature Specialists | Industry Experience Since 1992",
  description:
    "Learn about OC Water Features, a family-operated company with over 30 years of hands-on experience maintaining and repairing fountains, ponds, and waterfalls in Orange County.",
  canonical: "/about"
});

export default function AboutPage() {
  return (
    <>
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-brand-950 text-white py-16 sm:py-20 border-b border-navy-800">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-aqua-500/20 text-aqua-300 border border-aqua-500/30 mb-4">
              Family-Operated Craftsmanship
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              About OC Water Features
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Family-operated with industry experience dating back to 1992, dedicated to keeping Southern California&apos;s fountains, ponds, and water features pristine.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Story & Values */}
      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Our Southern California History & Mission
              </h2>

              <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
                {companyData.description}
              </p>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                For over three decades, we have witnessed how water features transform outdoor environments—from serene courtyard fountains to vibrant koi ponds and imposing commercial water walls. Because water systems combine hydraulics, electrical pumps, water chemistry, and structural masonry, proper care demands specialized hands-on expertise.
              </p>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                We believe in straightforward advice, transparent pricing, and treating every client&apos;s property with the same diligence we apply to our own.
              </p>

              <div className="p-4 rounded-xl bg-brand-50 border border-brand-100 space-y-2 text-sm text-brand-900">
                <div className="flex items-center gap-2 font-bold text-brand-700">
                  <ShieldCheck className="w-5 h-5 text-brand-600" aria-hidden="true" />
                  <span>Licensed & Insured Professional Standards</span>
                </div>
                <p className="text-xs text-slate-600 pl-7">
                  We specialize strictly in water feature maintenance, repair, and restoration, operating in full compliance with confirmed trade boundaries.
                </p>
              </div>
            </div>

            {/* Emblem & Stats */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-brand-900 via-navy-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-brand-800 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                  <div className="relative w-16 h-16 bg-white rounded-2xl p-2 shrink-0">
                    <Image
                      src="/logos/logo.png"
                      alt="OC Water Features Emblem"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">OC Water Features</h3>
                    <p className="text-xs text-aqua-300">Orange County & SoCal</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-aqua-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h4 className="text-sm font-bold text-white">30+ Years of Experience</h4>
                      <p className="text-xs text-slate-300">Continuous industry involvement since 1992.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <HeartHandshake className="w-5 h-5 text-aqua-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Family Operated</h4>
                      <p className="text-xs text-slate-300">Direct owner oversight and personal accountability.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Wrench className="w-5 h-5 text-aqua-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Comprehensive Care</h4>
                      <p className="text-xs text-slate-300">From monthly cleaning to major pump overhauls.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Core Values Section */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/80">
        <Container>
          <SectionHeading
            badge="Company Principles"
            title="What Drives Our Work Every Day"
            subtitle="Built on integrity, mechanical expertise, and honest communication."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {companyData.values.map((val, idx) => (
              <div
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 font-bold">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{val.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{val.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
