import React from "react";
import { servicesData } from "@/data/services";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export const ServicesSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-slate-50 relative" id="services">
      <Container>
        <SectionHeading
          badge="Specialized Services"
          title="Complete Water Feature Solutions"
          subtitle="From emergency leak detection to weekly commercial maintenance, our team delivers expert solutions for all water features."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/services" variant="outline" size="lg">
            <span>View All Service Specifications</span>
            <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </section>
  );
};
