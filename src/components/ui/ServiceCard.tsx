import React from "react";
import Link from "next/link";
import { ServiceItem } from "@/types/service";
import { Droplets, Wrench, Waves, Zap, Search, Building2, ArrowRight } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Droplets,
  Wrench,
  Waves,
  Zap,
  Search,
  Building2
};

interface ServiceCardProps {
  service: ServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const IconComponent = iconMap[service.iconName] || Droplets;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-600 via-aqua-500 to-brand-800 opacity-80 group-hover:opacity-100 transition-opacity" />

      <div>
        <div className="w-14 h-14 rounded-xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mb-6 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300 shadow-sm">
          <IconComponent className="w-7 h-7" aria-hidden="true" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-3">
          {service.title}
        </h3>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
          {service.shortDescription}
        </p>
      </div>

      <div>
        <ul className="space-y-2 mb-6 text-xs sm:text-sm text-slate-500 border-t border-slate-100 pt-4">
          {service.benefits.slice(0, 2).map((benefit, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-aqua-500 shrink-0" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>

        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 group-hover:text-brand-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-md py-1"
          aria-label={`Learn more about ${service.title}`}
        >
          <span>Explore Service Details</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
};
