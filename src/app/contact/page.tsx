import React from "react";
import { Metadata } from "next";
import { Phone, Mail, MapPin, ShieldCheck, FileText } from "lucide-react";
import { companyData } from "@/data/company";
import { constructMetadata } from "@/lib/metadata";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { PhoneCallLink } from "@/components/ui/PhoneCallLink";
import { EmailLink } from "@/components/ui/EmailLink";

export const metadata: Metadata = constructMetadata({
  title: "Contact Us | OC Water Features Southern California",
  description:
    `Get in touch with OC Water Features. Call ${companyData.phoneDisplay} or request a free estimate for fountain maintenance, pond cleaning, pump repair, and leak detection.`,
  canonical: "/contact"
});

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-brand-950 text-white py-16 sm:py-20 border-b border-navy-800">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-aqua-500/20 text-aqua-300 border border-aqua-500/30 mb-4">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Contact OC Water Features
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Have questions about your residential or commercial fountain, pond, or custom water feature? Call us directly or request an estimate.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Details */}
            <div className="lg:col-span-7 space-y-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Direct Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <PhoneCallLink
                  locationLabel="contact-page"
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:border-brand-500 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <Phone className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Phone Support</h3>
                    <p className="text-sm text-slate-600 mt-1">Direct line for consultations & service</p>
                  </div>
                  <span className="text-base font-bold text-brand-600 mt-4 block">
                    {companyData.phoneDisplay}
                  </span>
                </PhoneCallLink>

                <EmailLink
                  locationLabel="contact-page"
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:border-brand-500 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                      <Mail className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Email Inquiries</h3>
                    <p className="text-sm text-slate-600 mt-1">Send photos or detail inquiries</p>
                  </div>
                  <span className="text-sm font-bold text-brand-600 mt-4 block">
                    {companyData.emailDisplay}
                  </span>
                </EmailLink>
              </div>

              <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-1">
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Service Coverage Territory</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {companyData.serviceArea}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Action Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-brand-900 to-navy-900 text-white p-8 rounded-3xl border border-brand-800 shadow-xl space-y-6">
              <div className="w-12 h-12 rounded-xl bg-aqua-500/20 text-aqua-300 flex items-center justify-center">
                <FileText className="w-6 h-6" aria-hidden="true" />
              </div>

              <h2 className="text-2xl font-bold text-white leading-snug">
                Request an On-Site or Phone Estimate
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed">
                Skip the back-and-forth by filling out our detailed estimate form. It takes less than 2 minutes and helps us review your project details immediately.
              </p>

              <div className="pt-2">
                <Button href="/request-estimate" variant="accent" size="lg" className="w-full justify-center">
                  Go to Free Estimate Form
                </Button>
              </div>

              <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-aqua-400" />
                  <span>{companyData.experienceTagline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-aqua-400" />
                  <span>{companyData.credentialsTagline}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
