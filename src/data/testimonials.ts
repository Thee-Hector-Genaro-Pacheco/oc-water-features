import { TestimonialItem } from "@/types/testimonial";

// ---------------------------------------------------------------------------
// CONTENT SAFETY NOTE (pre-deploy audit): every entry below is unverified
// placeholder/demo content — fabricated names, quotes, and dates used only to
// exercise the Testimonials component's layout during development. None of
// these are real customer submissions, so `published` is `false` on all of
// them and src/components/home/Testimonials.tsx excludes unpublished entries
// from public rendering. Flip an entry's `published` to `true` only once it
// is confirmed as an actual verified customer review (e.g. sourced from the
// review-request workflow in src/app/review/[token]/page.tsx).
// ---------------------------------------------------------------------------
export const testimonialsData: TestimonialItem[] = [
  {
    id: "review-1",
    author: "Robert & Elena M.",
    roleOrLocation: "Homeowners in Newport Beach",
    propertyType: "Residential",
    serviceCategory: "Fountain Repair & Leak Detection",
    rating: 5,
    content:
      "Our 3-tier courtyard fountain was losing water rapidly and the pump was screeching. OC Water Features located the subterranean leak on their first visit and repaired the pump in short order. Honest, knowledgeable, and true craftsmen!",
    date: "2024-05-12",
    published: false
  },
  {
    id: "review-2",
    author: "David K.",
    roleOrLocation: "HOA Facilities Manager, Irvine",
    propertyType: "Commercial",
    serviceCategory: "Commercial Water Feature Maintenance",
    rating: 5,
    content:
      "We hired OC Water Features to handle our entry waterfall and reflecting basin. Their weekly maintenance has kept the water crystal clear and prevented the algae blooms we struggled with for years.",
    date: "2024-06-20",
    published: false
  },
  {
    id: "review-3",
    author: "Sandra L.",
    roleOrLocation: "Homeowner in Laguna Niguel",
    propertyType: "Residential",
    serviceCategory: "Pond Cleaning",
    rating: 5,
    content:
      "Our koi pond needed a deep cleanout after years of neglect. The team took extra care with our koi during the process. The rocks look pristine and the water clarity is incredible. Highly recommend their family team!",
    date: "2024-04-03",
    published: false
  },
  {
    id: "review-4",
    author: "Marcus T.",
    roleOrLocation: "Property Management Lead, Anaheim",
    propertyType: "Commercial",
    serviceCategory: "Pump Replacement",
    rating: 5,
    content:
      "When our retail plaza pump failed right before a major shopping weekend, OC Water Features responded quickly with an exact replacement. Professional, punctual, and easy to work with.",
    date: "2024-03-15",
    published: false
  }
];
