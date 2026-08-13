import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { Award, ShieldCheck, HeartHandshake, Wrench, Phone } from "lucide-react";
import { companyData } from "@/data/company";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ContactCTA } from "@/components/home/ContactCTA";
import { PhoneCallLink } from "@/components/ui/PhoneCallLink";

export const metadata: Metadata = constructMetadata({
  title: "About Us | Orange & Los Angeles County Water Feature Specialists",
  description:
    "Learn about OC Water Features, serving Orange and Los Angeles Counties. CPO-certified custom water feature specialists with industry experience dating back to 1992.",
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
              {companyData.credentialsTagline}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              About OC Water Features
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              {companyData.serviceAreaTagline}. Dedicated to creating, repairing, restoring, and servicing custom residential and commercial water features.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Verified Story & Credentials */}
      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                About OC Water Features
              </h2>

              <p className="text-base sm:text-lg text-slate-800 font-medium leading-relaxed">
                OC Water Features proudly serves residential and commercial clients throughout Orange County and Los Angeles County, specializing in the creation, repair, restoration, maintenance, and servicing of custom water features.
              </p>

              <p className="text-slate-700 leading-relaxed text-base">
                Our technicians bring industry experience dating back to 1992, and we&rsquo;ve built a reputation for delivering dependable workmanship, honest service, and lasting customer relationships. From decorative fountains and ponds to large-scale commercial installations, our experienced team is committed to providing tailored solutions that meet the unique needs of every property.
              </p>

              <p className="text-slate-700 leading-relaxed text-base">
                As a CPO-certified team, we take pride in maintaining high standards of professionalism, safety, and quality. Our dedication to exceptional service has resulted in a large percentage of our business coming from repeat customers and referrals.
              </p>

              <p className="text-slate-700 leading-relaxed text-base">
                Whether you require routine maintenance, system upgrades, equipment repairs, or a complete restoration, we welcome the opportunity to earn your trust and deliver the level of service your water feature deserves.
              </p>

              <div className="p-6 rounded-2xl bg-brand-50 border border-brand-100 space-y-3">
                <p className="font-bold text-slate-900 text-base">
                  Contact us today to schedule your free initial consultation.
                </p>
                <PhoneCallLink
                  locationLabel="about-page-cta"
                  className="inline-flex items-center gap-2 font-black text-brand-700 text-xl hover:text-brand-800 transition-colors"
                >
                  <Phone className="w-5 h-5 text-brand-600" aria-hidden="true" />
                  <span>{companyData.phoneDisplay}</span>
                </PhoneCallLink>
              </div>
            </div>

            {/* Emblem & Credentials Box */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-br from-brand-900 via-navy-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-brand-800 space-y-6">
                <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 bg-white rounded-2xl p-2 shrink-0 shadow-md">
                    <Image
                      src="/logos/OCWaterFeatLogo.png"
                      alt="OC Water Features Emblem"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">OC Water Features</h3>
                    <p className="text-xs text-aqua-300">Los Angeles & Orange County</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-aqua-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{companyData.serviceAreaTagline}</h4>
                      <p className="text-xs text-slate-300">Industry experience dating back to 1992.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-aqua-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{companyData.credentialsTagline}</h4>
                      <p className="text-xs text-slate-300">Certified Pool & Spa Operator safety and standards.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <HeartHandshake className="w-5 h-5 text-aqua-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Repeat Customers & Referrals</h4>
                      <p className="text-xs text-slate-300">Built on honest service and lasting relationships.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Wrench className="w-5 h-5 text-aqua-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Creation, Maintenance & Repair</h4>
                      <p className="text-xs text-slate-300">From routine cleaning to complete restorations.</p>
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
