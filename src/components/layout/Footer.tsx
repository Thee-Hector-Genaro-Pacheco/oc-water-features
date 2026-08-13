import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ShieldCheck } from "lucide-react";
import { companyData } from "@/data/company";
import { servicesData } from "@/data/services";
import { Container } from "./Container";
import { PhoneCallLink } from "@/components/ui/PhoneCallLink";
import { EmailLink } from "@/components/ui/EmailLink";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-navy-800 pt-16 pb-12" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Col 1: Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 bg-white/10 rounded-xl p-1.5 shadow-sm">
                <Image
                  src="/logos/OCWaterFeatLogo.png"
                  alt="OC Water Features Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                OC WATER FEATURES
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              {companyData.serviceAreaTagline}. CPO-certified specialists in water feature creation, repair, maintenance, and restoration.
            </p>

            <div className="flex items-start gap-2 text-xs text-aqua-400">
              <ShieldCheck className="w-4 h-4 text-aqua-400 shrink-0 mt-0.5" aria-hidden="true" />
              <span>CPO Certified • Westminster Business Licensed • LA County Pool Service Technician</span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {servicesData.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-slate-400 hover:text-aqua-300 transition-colors focus-visible:outline-none focus-visible:underline"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">
              Company & Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-aqua-300 transition-colors">
                  About Our Family Business
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-400 hover:text-aqua-300 transition-colors">
                  Project Gallery
                </Link>
              </li>
              <li>
                <Link href="/service-areas" className="text-slate-400 hover:text-aqua-300 transition-colors">
                  Orange County Service Areas
                </Link>
              </li>
              <li>
                <Link href="/request-estimate" className="text-slate-400 hover:text-aqua-300 transition-colors font-semibold text-aqua-400">
                  Request a Free Estimate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-aqua-300 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Coverage */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">
              Direct Contact
            </h3>
            <div className="space-y-3.5 text-sm">
              <PhoneCallLink
                locationLabel="footer"
                className="flex items-start gap-3 text-slate-300 hover:text-aqua-300 transition-colors"
              >
                <Phone className="w-5 h-5 text-aqua-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="block font-bold text-white">Call Us Today</span>
                  <span>{companyData.phoneDisplay}</span>
                </div>
              </PhoneCallLink>

              <EmailLink
                locationLabel="footer"
                className="flex items-start gap-3 text-slate-300 hover:text-aqua-300 transition-colors"
              >
                <Mail className="w-5 h-5 text-aqua-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="block font-bold text-white">Email Inquiries</span>
                  <span>{companyData.emailDisplay}</span>
                </div>
              </EmailLink>

              <div className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-5 h-5 text-aqua-400 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <span className="block font-bold text-white">Service Territory</span>
                  <span>{companyData.serviceArea}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-navy-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} OC Water Features. All rights reserved. Family-operated water-feature specialists.</p>
          <p className="text-slate-500 text-center md:text-right">
            Specializing strictly in residential & commercial water feature maintenance, repair, and restoration.
          </p>
        </div>
      </Container>
    </footer>
  );
};
