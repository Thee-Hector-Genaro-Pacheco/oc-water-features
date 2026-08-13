export interface CompanyInfo {
  name: string;
  tagline: string;
  /** Year of verified industry experience for the company's technicians (NOT a company founding-year claim). */
  industryExperienceSinceYear: number;
  /** Short, verified-safe phrase describing tenure. Use this instead of hardcoding "since 19xx" copy. */
  experienceTagline: string;
  phoneDisplay: string;
  phoneRaw: string;
  phonePlaceholder: string;
  emailDisplay: string;
  emailPlaceholder: string;
  /** Verified-safe credentials phrase (no "Licensed"/"Insured" claims unless independently verified). */
  credentialsTagline: string;
  serviceArea: string;
  /** Short, verified-safe phrase describing the two-county service area. */
  serviceAreaTagline: string;
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
