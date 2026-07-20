import { ProjectItem } from "@/types/project";

export const projectsData: ProjectItem[] = [
  {
    id: "estate-fountain-restoration-newport",
    title: "Tiered Stone Fountain Mechanical Overhaul",
    category: "fountain",
    location: "Newport Beach, CA",
    completionYear: "2024",
    description:
      "Complete mechanical restoration of a 3-tier cast stone courtyard fountain. Replaced burnt-out pump, retrofitted low-voltage LED underwater fixtures, and sealed basin hairline fissures.",
    servicesProvided: ["Fountain Repair", "Pump Replacement", "Leak Sealing"],
    featured: true,
    gradientStyle: "from-brand-900 via-brand-700 to-aqua-600"
  },
  {
    id: "hoa-reflecting-pool-irvine",
    title: "HOA Reflecting Pool & Water Wall Care",
    category: "commercial",
    location: "Irvine, CA",
    completionYear: "2024",
    description:
      "Bi-weekly commercial maintenance program for a premier HOA entrance water wall and reflecting pool. Installed automated chemical balancing to eliminate recurrent algae issues.",
    servicesProvided: ["Commercial Water Feature Maintenance", "Chemical Balancing"],
    featured: true,
    gradientStyle: "from-navy-800 via-brand-800 to-cyan-700"
  },
  {
    id: "koi-pond-cleanout-laguna",
    title: "Custom Koi Pond Ecosystem Restoration",
    category: "pond",
    location: "Laguna Beach, CA",
    completionYear: "2023",
    description:
      "Deep seasonal cleanout of a 3,500-gallon hillside koi pond. Vacuumed organic sludge, serviced multi-stage bio-filtration media, and replaced UV clarifier sterilizer unit.",
    servicesProvided: ["Pond Cleaning", "Bio-Filter Servicing", "UV Sterilizer Replacement"],
    featured: true,
    gradientStyle: "from-teal-900 via-emerald-800 to-cyan-600"
  },
  {
    id: "backyard-waterfall-leak-repair-huntington",
    title: "Natural Rock Waterfall Leak Diagnosis & Repair",
    category: "waterfall",
    location: "Huntington Beach, CA",
    completionYear: "2023",
    description:
      "Diagnosed severe 40-gallon-per-day water loss behind a custom stacked stone waterfall stream. Re-lined stream bed with heavy EPDM liner and reinforced stone mortar joints.",
    servicesProvided: ["Leak Detection", "Liner Repair", "Waterfall Restoration"],
    featured: true,
    gradientStyle: "from-slate-900 via-blue-900 to-aqua-700"
  },
  {
    id: "plaza-fountain-refurbishment-anaheim",
    title: "Commercial Retail Plaza Fountain Refurbishment",
    category: "restoration",
    location: "Anaheim, CA",
    completionYear: "2023",
    description:
      "Full refurbishment of an architectural plaza fountain built in the late 1990s. Upgraded dual high-flow centrifugal pumps, repointed stone coping, and recalibrated manifold spray jets.",
    servicesProvided: ["Water Feature Restoration", "Pump Repair", "Commercial Maintenance"],
    featured: false,
    gradientStyle: "from-blue-950 via-brand-800 to-sky-600"
  },
  {
    id: "residential-courtyard-fountain-tustin",
    title: "Modern Courtyard Water Feature Maintenance",
    category: "fountain",
    location: "Tustin, CA",
    completionYear: "2024",
    description:
      "Monthly water treatment and auto-fill calibration for a contemporary zinc architectural water wall located in a residential courtyard.",
    servicesProvided: ["Fountain Maintenance", "Water Treatment"],
    featured: false,
    gradientStyle: "from-cyan-950 via-brand-700 to-teal-600"
  }
];
