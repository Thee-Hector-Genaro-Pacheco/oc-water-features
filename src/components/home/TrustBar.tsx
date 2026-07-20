import React from "react";
import { Award, Building2, ShieldCheck, FileCheck } from "lucide-react";
import { companyData } from "@/data/company";
import { Container } from "@/components/layout/Container";

const iconMap: Record<string, React.ElementType> = {
  Award,
  Building2,
  ShieldCheck,
  FileCheck
};

export const TrustBar: React.FC = () => {
  return (
    <section className="bg-navy-900 border-y border-brand-800/40 py-8 text-white">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {companyData.trustBadges.map((badge) => {
            const IconComponent = iconMap[badge.icon] || ShieldCheck;
            return (
              <div
                key={badge.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-navy-950/60 border border-brand-800/50 hover:border-aqua-500/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-brand-600/30 text-aqua-400 border border-brand-500/30 flex items-center justify-center shrink-0">
                  <IconComponent className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
                    {badge.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">{badge.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
