"use client";

import React, { useState } from "react";
import { projectsData } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { MapPin, CheckCircle2 } from "lucide-react";
import { ContactCTA } from "@/components/home/ContactCTA";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "fountain", label: "Fountains" },
  { id: "pond", label: "Ponds" },
  { id: "waterfall", label: "Waterfalls" },
  { id: "commercial", label: "Commercial" },
  { id: "restoration", label: "Restorations" }
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProjects = activeCategory === "all"
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <>
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-brand-950 text-white py-16 sm:py-20 border-b border-navy-800">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-aqua-500/20 text-aqua-300 border border-aqua-500/30 mb-4">
              Proven Craftsmanship
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Project Gallery & Case Studies
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Explore our portfolio of fountain repairs, pond cleanouts, waterfall leak fixes, and commercial feature maintenance across Southern California.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-slate-50">
        <Container>
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12" role="tablist" aria-label="Filter Projects by Category">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/20"
                    : "bg-white text-slate-700 hover:bg-brand-50 border border-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className={`h-48 w-full bg-gradient-to-br ${project.gradientStyle} p-6 flex flex-col justify-between relative text-white`}>
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-aqua-300 border border-white/10">
                      {project.category}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/20 text-white">
                      {project.completionYear}
                    </span>
                  </div>

                  <div className="z-10">
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-aqua-400" aria-hidden="true" />
                      <span>{project.location}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {project.description}
                  </p>

                  <div className="border-t border-slate-100 pt-4">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Scope of Work:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.servicesProvided.map((service, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-50 text-brand-800 border border-brand-100"
                        >
                          <CheckCircle2 className="w-3 h-3 text-brand-600" aria-hidden="true" />
                          <span>{service}</span>
                        </span>
                      ))}
                    </div>
                  </div>
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
