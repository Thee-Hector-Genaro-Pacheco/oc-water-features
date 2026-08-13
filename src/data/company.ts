import { CompanyInfo } from "@/types/company";

// ---------------------------------------------------------------------------
// SINGLE SOURCE OF TRUTH for public-facing business information.
// Every page/component should read from this file rather than hardcoding
// business name, phone, email, service area, history, or credential copy.
//
// VERIFIED CREDENTIALS ON FILE (see docs/seo-optimization-plan.md for full
// detail — do not publish residential addresses from these records):
//   1. City of Westminster Business License Tax Certificate
//      Business: O C WATERFEATURES | License #05118130
//      "Maintenance and Repair for Water Features"
//      Effective 10/1/2025 – 9/30/2026
//      NOTE: This is a city business license / tax certificate. It is NOT a
//      California CSLB contractor license. Do not describe the company as a
//      "licensed contractor," "CSLB licensed," or "C-27 contractor" unless a
//      separate, verified CSLB license number is supplied.
//   2. County of Los Angeles Dept. of Public Health — Swimming Pool Service
//      Technician credential (holder: Antonio Pacheco), #PR0173735,
//      expires 6/30/2027. This is a technician credential, not a contractor
//      license — do not describe it as one.
//   3. CPO (Certified Pool & Spa Operator) certification — confirmed by the
//      business owner. No certification number was provided; do not invent one.
//   4. General liability / business insurance has NOT been independently
//      verified for this project. Do not claim "Insured" anywhere on the
//      site until documentation is supplied.
// ---------------------------------------------------------------------------
export const companyData: CompanyInfo = {
  name: "OC Water Features",
  tagline: "Professional Water Feature Creation, Maintenance & Repair",
  // Verified: the owners/technicians' industry experience dates back to 1992.
  // This describes personal/technician experience, NOT a company founding date.
  industryExperienceSinceYear: 1992,
  experienceTagline: "Industry Experience Since 1992",
  phoneDisplay: "(714) 362-4376",
  phoneRaw: "tel:+17143624376",
  phonePlaceholder: "(714) 362-4376",
  emailDisplay: "ocwaterfeatures@live.com",
  emailPlaceholder: "ocwaterfeatures@live.com",
  // CPO certification is verified. "Licensed"/"Insured" are intentionally
  // excluded — no verified CSLB contractor license or insurance documentation
  // is on file. See the credential note above before changing this string.
  credentialsTagline: "CPO Certified",
  serviceArea: "Orange County and Los Angeles County, California",
  serviceAreaTagline: "Serving Orange & Los Angeles Counties",
  primaryLocations: [
    "Irvine",
    "Newport Beach",
    "Huntington Beach",
    "Laguna Beach",
    "Pasadena",
    "Beverly Hills",
    "Long Beach",
    "Anaheim",
    "Orange",
    "Mission Viejo",
    "Fullerton",
    "Costa Mesa",
    "San Clemente",
    "Yorba Linda",
    "Tustin"
  ],
  description:
    "OC Water Features proudly serves residential and commercial clients throughout Orange County and Los Angeles County, specializing in the creation, repair, restoration, maintenance, and servicing of custom water features. Our CPO-certified team brings industry experience dating back to 1992 and has built a reputation for dependable workmanship, honest service, and lasting customer relationships.",
  shortDescription:
    "Serving Orange and Los Angeles Counties. CPO-certified specialists in custom water feature creation, repair, maintenance, and restoration, with industry experience dating back to 1992.",
  values: [
    {
      title: "Serving Orange & Los Angeles Counties",
      description:
        "Industry experience dating back to 1992 creating, repairing, restoring, and servicing custom residential and commercial water features."
    },
    {
      title: "CPO Certified Technicians",
      description:
        "Certified Pool & Spa Operator standards and technical excellence on every property."
    },
    {
      title: "Repeat Customers & Referral Trusted",
      description:
        "A large portion of our business comes from long-standing repeat clients and direct personal referrals built on honest communication."
    },
    {
      title: "Free Initial Consultation",
      description:
        "Transparent phone and on-site consultations tailored to your water feature's exact mechanical, structural, and water clarity needs."
    }
  ],
  trustBadges: [
    {
      id: "experience",
      title: "Serving Orange & LA Counties",
      subtitle: "Industry Experience Since 1992",
      icon: "Award"
    },
    {
      id: "compliance",
      title: "Certifications & Licensing",
      subtitle: "CPO Certified • Westminster Business Licensed • LA County Pool Service Technician",
      icon: "ShieldCheck"
    },
    {
      id: "reputation",
      title: "Repeat Customers & Referrals",
      subtitle: "Built on Trust & Quality Workmanship",
      icon: "HeartHandshake"
    },
    {
      id: "consultation",
      title: "Free Initial Consultation",
      subtitle: "Transparent On-Site & Phone Estimates",
      icon: "FileCheck"
    }
  ],
  // Public-facing credential summaries. Numbers/dates included only where
  // independently verified (see the sourcing notes at the top of this file).
  // Never add a street address, geo data, or the credential holder's personal
  // name here — the source documents list a private/residential address.
  credentials: [
    {
      id: "cpo",
      shortLabel: "CPO Certified",
      title: "CPO Certified",
      description: "Professional certification supporting water-quality and maintenance expertise."
      // No certification number or expiration date has been independently
      // verified — do not invent one.
    },
    {
      id: "westminster-business-license",
      shortLabel: "Westminster Business Licensed",
      title: "City of Westminster Business License",
      credentialName: "Business License Tax Certificate",
      description:
        "Covers maintenance and repair of water features. This is a business license tax certificate, not a California CSLB contractor license.",
      numberLabel: "License No.",
      number: "05118130",
      validThrough: "September 30, 2026"
    },
    {
      id: "la-county-pool-tech",
      shortLabel: "LA County Pool Service Technician",
      title: "Los Angeles County Department of Public Health",
      credentialName: "Swimming Pool Service Technician",
      description:
        "Technician-level credential for swimming pool service. This is a technician credential, not a contractor license.",
      numberLabel: "Credential No.",
      number: "PR0173735",
      validThrough: "June 30, 2027"
    }
  ]
};
