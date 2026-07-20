"use client";

import React, { useState } from "react";
import Image from "next/image";
import { projectsData } from "@/data/projects";
import { ProjectItem } from "@/types/project";
import { Container } from "@/components/layout/Container";
import { MapPin, CheckCircle2, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ContactCTA } from "@/components/home/ContactCTA";

const categories = [
  { id: "all", label: "All Projects" },
  { id: "fountain", label: "Fountains" },
  { id: "commercial", label: "Commercial" },
  { id: "restoration", label: "Restorations" },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = activeCategory === "all"
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* Header Banner */}
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
              Explore our portfolio of commercial fountain maintenance, leak repairs, pump replacements, and water-feature restoration projects across Southern California.
            </p>
          </div>
        </Container>
      </section>

      {/* Main Portfolio Grid */}
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
                onClick={() => setSelectedProject(project)}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                {/* Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <Image
                    src={project.image}
                    alt={project.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-aqua-300 border border-white/20">
                      {project.category}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white border border-white/10">
                      {project.completionYear}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <div className="flex items-center gap-1 text-xs font-semibold text-aqua-300">
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{project.location}</span>
                    </div>
                  </div>
                </div>

                {/* Info & Caption Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mt-2 line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Caption beneath gallery image */}
                  <div className="text-xs font-medium text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                    📷 {project.caption}
                  </div>

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

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-0 my-8 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative aspect-[16/9] w-full bg-slate-950">
              <Image
                src={selectedProject.image}
                alt={selectedProject.imageAlt}
                fill
                sizes="(max-width: 1200px) 100vw, 800px"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all"
                aria-label="Close project modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md font-bold uppercase tracking-wider text-aqua-300 border border-white/20">
                  {selectedProject.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md font-semibold">
                  {selectedProject.location}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-navy-900">{selectedProject.title}</h2>
                <p className="text-sm font-semibold text-brand-600 mt-1">
                  Completion Year: {selectedProject.completionYear} • {selectedProject.location}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm italic">
                📷 <strong>Caption:</strong> {selectedProject.caption}
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Project Description:
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Services Provided:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.servicesProvided.map((s, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg bg-brand-50 text-brand-800 border border-brand-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                      <span>{s}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button onClick={() => setSelectedProject(null)} variant="outline" size="sm">
                  Close Preview
                </Button>
                <Button href="/request-estimate" variant="primary" size="sm">
                  <span>Request Similar Service</span>
                  <ExternalLink className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ContactCTA />
    </>
  );
}
