export interface TestimonialItem {
  id: string;
  author: string;
  roleOrLocation: string;
  propertyType: "Residential" | "Commercial";
  serviceCategory: string;
  rating: number;
  content: string;
  date: string;
  // Must be true only for a review confirmed as an actual verified customer
  // submission. Unpublished entries are excluded from public rendering by
  // src/components/home/Testimonials.tsx — see src/data/testimonials.ts.
  published: boolean;
}
