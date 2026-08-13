export interface CredentialInfo {
  id: string;
  /** Compact public label for trust badges/footer, e.g. "Westminster Business Licensed". */
  shortLabel: string;
  /** Full display heading for the About page card, e.g. "City of Westminster Business License". */
  title: string;
  /** Full credential/document name shown under the title, e.g. "Business License Tax Certificate". Omit if not applicable (e.g. CPO). */
  credentialName?: string;
  /** One-line, non-overstating description of what the credential covers. */
  description: string;
  /** Label preceding the credential number, e.g. "License No." or "Credential No.". Required only when `number` is set. */
  numberLabel?: string;
  /** License/credential number. Omit rather than invent one. */
  number?: string;
  /** Human-readable expiration date. Omit rather than invent one. */
  validThrough?: string;
}

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
  /** Verified credentials/certifications on file — see src/data/company.ts for sourcing notes. */
  credentials: CredentialInfo[];
}
