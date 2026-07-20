import React from "react";
import { Phone, FileText, Clock, ShieldCheck } from "lucide-react";
import { companyData } from "@/data/company";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export const ContactCTA: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-r from-brand-900 via-navy-900 to-brand-950 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-aqua-500/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="bg-white/5 rounded-3xl border border-white/15 p-8 sm:p-12 lg:p-16 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-aqua-500/20 text-aqua-300 border border-aqua-500/30">
                Ready to Restore Your Water Feature?
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Schedule Your Free Initial Consultation
              </h2>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Whether you need urgent leak repair, pump replacement, or a customized monthly maintenance schedule for your fountain or pond, our family team is ready to help.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-aqua-400" aria-hidden="true" />
                  <span>Prompt SoCal Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-aqua-400" aria-hidden="true" />
                  <span>30+ Years Experience</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <Button href="/request-estimate" variant="accent" size="lg" className="w-full justify-center">
                <FileText className="w-5 h-5 mr-2" aria-hidden="true" />
                <span>Request Free Estimate</span>
              </Button>

              <a
                href={companyData.phoneRaw}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 transition-all text-center"
              >
                <Phone className="w-5 h-5 text-aqua-400" aria-hidden="true" />
                <span>Call {companyData.phonePlaceholder}</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
