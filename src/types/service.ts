export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  benefits: string[];
  features: string[];
  processSteps: {
    title: string;
    description: string;
  }[];
  commonIssues: string[];
  ctaTitle?: string;
  isCommercial?: boolean;
}
