export interface CompanyInfo {
  name: string;
  tagline: string;
  experienceSinceYear: number;
  phonePlaceholder: string;
  phoneRaw: string;
  emailPlaceholder: string;
  licensePlaceholder: string;
  serviceArea: string;
  primaryLocations: string[];
  description: string;
  shortDescription: string;
  values: {
    title: string;
    description: string;
  }[];
  trustBadges: {
    id: string;
    title: string;
    subtitle: string;
    icon: string;
  }[];
}
