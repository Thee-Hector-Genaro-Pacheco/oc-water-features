export interface ProjectItem {
  id: string;
  title: string;
  category: "fountain" | "pond" | "waterfall" | "commercial" | "restoration";
  location: string;
  completionYear: string;
  description: string;
  servicesProvided: string[];
  beforeImage?: string;
  afterImage?: string;
  featured: boolean;
  gradientStyle: string;
}
