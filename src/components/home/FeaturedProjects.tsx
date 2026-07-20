import React from "react";
import { projectsData } from "@/data/projects";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Button } from "@/components/ui/Button";
import { MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export const FeaturedProjects: React.FC = () => {
  const featured = projectsData.filter((p) => p.featured);

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white relative">
      <Container>
        <SectionHeading
          badge="Our Portfolio"
          title="Featured Southern California Projects"
          subtitle="Explore recent water feature repair, pond cleaning, and fountain restoration projects across Orange County."
          dark
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featured.map((project) => (
            <div
              key={project.id}
              className="bg-slate-800/90 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-aqua-500/50 transition-all duration-300"
            >
              {/* Visual Decorative Gradient Representation (Placeholder Image Fallback) */}
              <div className={`h-48 sm:h-56 w-full bg-gradient-to-br ${project.gradientStyle} p-6 flex flex-col justify-between relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-aqua-300 border border-white/10">
                    {project.category}
                  </span>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white/20 backdrop-blur-md text-white">
                    {project.completionYear}
                  </span>
                </div>

                <div className="z-10">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-aqua-400" aria-hidden="true" />
                    <span>{project.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-aqua-300 transition-colors">
                    {project.title}
                  </h3>
                </div>
              </div>

              {/* Project Info Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="border-t border-slate-700/80 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Services Provided:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.servicesProvided.map((serviceName, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md bg-slate-700/60 text-aqua-200 border border-slate-600/50"
                      >
                        <CheckCircle2 className="w-3 h-3 text-aqua-400" aria-hidden="true" />
                        <span>{serviceName}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/projects" variant="accent" size="lg">
            <span>Explore Full Project Gallery</span>
            <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </section>
  );
};
