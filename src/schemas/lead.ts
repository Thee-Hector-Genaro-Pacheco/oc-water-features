import { z } from "zod";

export const leadSubmissionSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long")
    .transform((val) => val.trim()),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .max(25, "Phone number is too long")
    .transform((val) => val.trim()),
  email: z
    .string()
    .email("Please enter a valid email address")
    .transform((val) => val.trim().toLowerCase()),
  city: z
    .string()
    .min(2, "City name is required")
    .max(100, "City name is too long")
    .transform((val) => val.trim()),
  serviceAddress: z
    .string()
    .max(250, "Address is too long")
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),
  propertyType: z
    .enum(["Residential", "Commercial"], {
      invalid_type_error: "Property type must be Residential or Commercial",
    })
    .default("Residential"),
  serviceRequested: z
    .string()
    .min(2, "Service type is required")
    .transform((val) => val.trim()),
  message: z
    .string()
    .min(5, "Please enter a description of your request")
    .max(2000, "Description is too long")
    .transform((val) => val.trim()),
  preferredContactMethod: z
    .enum(["Phone", "Email"], {
      invalid_type_error: "Preferred contact method must be Phone or Email",
    })
    .default("Phone"),
  // Honeypot field for bot detection
  website_hp: z.string().optional(),
  // Attribution & tracking parameters
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
});

export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;
