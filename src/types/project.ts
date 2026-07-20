export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  category: "fountain" | "pond" | "waterfall" | "commercial" | "restoration";
  location: string;
  completionYear: string;
  description: string;
  image: string;
  imageAlt: string;
  caption: string;
  featured: boolean;
  servicesProvided: string[];
}
