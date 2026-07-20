import React from "react";
import { Metadata } from "next";
import { servicesData } from "@/data/services";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata: Metadata = constructMetadata({
  title: "Water Feature Services | Fountain, Pond & Pump Maintenance SoCal",
  description:
    "Explore our complete range of water feature services: fountain repair, pond cleaning, leak detection, pump replacement, commercial maintenance, and water feature restoration.",
  canonical: "/services"
});

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-brand-950 text-white py-16 sm:py-20 border-b border-navy-800">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-aqua-500/20 text-aqua-300 border border-aqua-500/30 mb-4">
              Comprehensive Water Feature Solutions
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Our Professional Services
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Family-operated water feature specialists providing expert maintenance, rapid diagnostics, precision repair, and restoration across Southern California with industry experience since 1992.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-slate-50">
        <Container>
          <SectionHeading
            badge="Full Service Catalog"
            title="Tailored Maintenance & Repair Programs"
            subtitle="Click on any service below to review detailed process steps, common issue diagnostics, and benefits."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {servicesData.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
