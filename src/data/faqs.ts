export interface FAQItem {
  question: string;
  answer: string;
  category: "General" | "Services" | "Estimates" | "Maintenance";
}

export const faqsData: FAQItem[] = [
  {
    question: "How often should my fountain or pond be serviced?",
    answer:
      "For standard residential fountains, monthly or bi-weekly servicing keeps water clear and prevents pump clogs. High-exposure commercial fountains and bio-active koi ponds often benefit from weekly or bi-weekly maintenance depending on tree canopy, sunlight, and bather/fish load.",
    category: "Maintenance"
  },
  {
    question: "How do I know if my water feature has a leak?",
    answer:
      "If your water feature loses more than 1/4 inch of water per day beyond normal warm-weather evaporation, or if your automatic fill valve runs continuously, you likely have a leak in the basin, liner, or plumbing lines.",
    category: "Services"
  },
  {
    question: "Do you provide free estimates for repairs and maintenance?",
    answer:
      "Yes! We offer free initial consultations. We can review photos, discuss issues over the phone, or schedule an on-site evaluation across Orange County and Los Angeles County.",
    category: "Estimates"
  },
  {
    question: "How much experience does your team have?",
    answer:
      "Our technicians bring industry experience dating back to 1992, serving Orange County and Los Angeles County with hands-on expertise creating, repairing, restoring, and servicing custom water features.",
    category: "General"
  },
  {
    question: "Do you work with commercial properties and HOAs?",
    answer:
      "Absolutely. We manage commercial architectural fountains, HOA entrance water walls, reflection basins, and office park water features. We provide regular property manager logs and prompt emergency response.",
    category: "Services"
  },
  {
    question: "What should I do if my pump stops working completely?",
    answer:
      "Turn off power to the pump circuit at the breaker box immediately to prevent motor burnout or electrical shorts. Contact our team to inspect the electrical connection, check for impeller blockages, or replace the pump unit.",
    category: "Services"
  }
];
