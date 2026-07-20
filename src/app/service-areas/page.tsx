import React from "react";
import { Metadata } from "next";
import { MapPin, CheckCircle2 } from "lucide-react";
import { serviceAreasData } from "@/data/serviceAreas";
import { companyData } from "@/data/company";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata: Metadata = constructMetadata({
  title: "Service Areas | Orange County Water Feature Maintenance & Repair",
  description:
    "Discover the Southern California communities served by OC Water Features, including Irvine, Newport Beach, Huntington Beach, Laguna Beach, Anaheim, and surrounding areas.",
  canonical: "/service-areas"
});

export default function ServiceAreasPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-brand-950 text-white py-16 sm:py-20 border-b border-navy-800">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-aqua-500/20 text-aqua-300 border border-aqua-500/30 mb-4">
              Local Coverage
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Orange County Service Areas
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              We proudly provide residential and commercial water feature maintenance, pump repair, pond cleaning, and leak detection throughout Southern California.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-slate-50">
        <Container>
          <SectionHeading
            badge="Cities Served"
            title="Our Primary Orange County Communities"
            subtitle="Don't see your city listed? Contact us—we service all surrounding Southern California neighborhoods."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceAreasData.map((city, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-brand-600 shrink-0" aria-hidden="true" />
                    <h3 className="text-xl font-bold text-slate-900">{city.name}</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-4">
                    {city.county}
                  </span>

                  <div className="border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Popular Services:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {city.popularServices.map((svc, sIdx) => (
                        <li key={sIdx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-aqua-600 shrink-0" aria-hidden="true" />
                          <span>{svc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-brand-600">
                  <span>Fast Local Response</span>
                  <a href={companyData.phoneRaw} className="hover:underline">
                    Call Local Team
                  </a>
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
