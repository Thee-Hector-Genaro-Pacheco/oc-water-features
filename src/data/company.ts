import { CompanyInfo } from "@/types/company";

export const companyData: CompanyInfo = {
  name: "OC Water Features",
  tagline: "Professional Water Feature Maintenance & Repair",
  establishedYear: 1992,
  phonePlaceholder: "(714) XXX-XXXX",
  phoneRaw: "tel:7140000000",
  emailPlaceholder: "info@ocwaterfeatures.com",
  licensePlaceholder: "License information coming soon",
  serviceArea: "Orange County and surrounding Southern California communities",
  primaryLocations: [
    "Irvine",
    "Newport Beach",
    "Huntington Beach",
    "Laguna Beach",
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
    "OC Water Features is a family-operated company backed by hands-on industry experience dating to 1992. Our team specializes in maintaining, repairing, restoring, and improving residential and commercial water features throughout Southern California.",
  shortDescription:
    "Trusted residential and commercial fountain, pond, waterfall, and water-feature specialists serving Southern California.",
  values: [
    {
      title: "Family-Operated Dedication",
      description:
        "We treat every residential and commercial property with individual care, personal accountability, and honest communication."
    },
    {
      title: "Hands-On Experience Since 1992",
      description:
        "Over three decades of specialized knowledge in Southern California water systems, water mechanics, filtration, and leak diagnosis."
    },
    {
      title: "Customized Maintenance Solutions",
      description:
        "Every fountain, pond, and custom waterfall is unique. We tailor our cleaning, chemical balance, and repair schedules to your specific installation."
    },
    {
      title: "Prompt & Reliable Service",
      description:
        "From urgent pump replacements to routine monthly maintenance, we arrive on schedule with fully equipped service vehicles."
    }
  ],
  trustBadges: [
    {
      id: "experience",
      title: "Industry Experience Since 1992",
      subtitle: "30+ Years of Hands-On Expertise",
      icon: "Award"
    },
    {
      id: "coverage",
      title: "Residential & Commercial",
      subtitle: "Estates, HOAs, & Commercial Properties",
      icon: "Building2"
    },
    {
      id: "compliance",
      title: "Licensed & Insured",
      subtitle: "Full Protection & Professional Standards",
      icon: "ShieldCheck"
    },
    {
      id: "consultation",
      title: "Free Initial Consultation",
      subtitle: "Transparent On-Site & Phone Estimates",
      icon: "FileCheck"
    }
  ]
};
