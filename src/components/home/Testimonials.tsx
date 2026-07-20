import React from "react";
import { Star, Quote, CheckCircle } from "lucide-react";
import { testimonialsData } from "@/data/testimonials";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <Container>
        <SectionHeading
          badge="Client Reviews"
          title="Trusted Across Southern California"
          subtitle="See what residential homeowners and commercial property managers say about our water feature service."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonialsData.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <Quote className="w-10 h-10 text-brand-200 absolute top-6 right-6 pointer-events-none" aria-hidden="true" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4" aria-label={`Rating: ${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" aria-hidden="true" />
                  ))}
                </div>

                <p className="text-slate-700 text-base leading-relaxed italic mb-6">
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>

              <div className="border-t border-slate-200/80 pt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                    <span>{t.author}</span>
                    <CheckCircle className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{t.roleOrLocation}</p>
                </div>

                <div className="text-right">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-brand-100 text-brand-800">
                    {t.propertyType}
                  </span>
                  <span className="block text-[11px] text-slate-500 mt-1">
                    {t.serviceCategory}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
