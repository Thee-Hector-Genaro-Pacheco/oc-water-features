export interface TestimonialItem {
  id: string;
  author: string;
  roleOrLocation: string;
  propertyType: "Residential" | "Commercial";
  serviceCategory: string;
  rating: number;
  content: string;
  date: string;
}
