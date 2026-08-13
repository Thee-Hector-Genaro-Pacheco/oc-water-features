import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { servicesData } from "@/data/services";
import { projectsData } from "@/data/projects";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PhoneCallLink } from "@/components/ui/PhoneCallLink";
import { ContactCTA } from "@/components/home/ContactCTA";
import { CheckCircle2, AlertTriangle, ShieldCheck, Phone, MapPin } from "lucide-react";
import { companyData } from "@/data/company";

const service = servicesData.find((s) => s.slug === "fountain-maintenance")!;
const relatedProject = projectsData.find((p) => p.id === "residential-courtyard-fountain-maintenance");

export const metadata: Metadata = constructMetadata({
  title: `${service.title} | Orange County Fountain Cleaning & Care`,
  description: service.shortDescription,
  canonical: `/services/${service.slug}`
});

export default function FountainMaintenancePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-brand-950 text-white py-16 sm:py-20 border-b border-navy-800">
        <Container>
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs text-aqua-400 font-semibold uppercase tracking-wider mb-4">
              <Link href="/services" className="hover:underline">Services</Link>
              <span>/</span>
              <span>{service.title}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {service.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              {service.fullDescription}
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-12">
              {/* Featured Project Real Image Banner */}
              {relatedProject && (
                <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-xl space-y-0">
                  <div className="relative aspect-[16/9] w-full bg-slate-950">
                    <Image
                      src={relatedProject.image}
                      alt={relatedProject.imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 768px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-aqua-300 mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{relatedProject.location}</span>
                      </div>
                      <h3 className="text-lg font-bold">{relatedProject.title}</h3>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/90 text-xs text-slate-300 italic border-t border-slate-700/80">
                    📷 <strong>Recent Project:</strong> {relatedProject.caption}
                  </div>
                </div>
              )}

              {/* Key Benefits */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Service Benefits</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.benefits.map((benefit, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-slate-800 text-sm font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Process Steps */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Our Maintenance Workflow</h2>
                <div className="space-y-4">
                  {service.processSteps.map((step, idx) => (
                    <div key={idx} className="p-5 rounded-xl border border-slate-200/80 bg-white flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{step.title}</h3>
                        <p className="text-slate-600 text-sm mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Issues Solved */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Common Issues We Prevent</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.commonIssues.map((issue, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-slate-800 text-sm">{issue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar CTA Widget */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 bg-navy-900 text-white p-6 sm:p-8 rounded-2xl border border-navy-800 shadow-xl space-y-6">
                <div className="flex items-center gap-2 text-xs font-bold text-aqua-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>Free Initial Consultation</span>
                </div>

                <h3 className="text-xl font-bold text-white leading-snug">
                  Need Professional Fountain Maintenance?
                </h3>

                <p className="text-xs sm:text-sm text-slate-300">
                  Our family-operated team has provided decades of reliable water feature care in Orange County.
                </p>

                <div className="space-y-3">
                  <Button href="/request-estimate" variant="accent" size="md" className="w-full justify-center">
                    Request Free Estimate
                  </Button>

                  <PhoneCallLink
                    locationLabel="sidebar-fountain-maintenance"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10"
                  >
                    <Phone className="w-4 h-4 text-aqua-400" aria-hidden="true" />
                    <span>Call {companyData.phoneDisplay}</span>
                  </PhoneCallLink>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <ContactCTA />
    </>
  );
}
