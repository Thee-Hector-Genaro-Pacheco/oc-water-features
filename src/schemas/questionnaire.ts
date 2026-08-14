import { z } from "zod";

// Approved value sets for the customer intake questionnaire. Kept as plain
// string enums validated here (not as SQL CHECK constraints) so a future
// wording change to a customer-facing label doesn't require a database
// migration — see supabase/migrations/005_questionnaires.sql.
export const SERVICE_REQUESTED_OPTIONS = [
  "Fountain maintenance",
  "Fountain repair",
  "Fountain cleaning",
  "Pump replacement",
  "Equipment troubleshooting",
  "Water-feature restoration",
  "Leak diagnosis / leak repair",
  "Other",
] as const;

export const PROPERTY_TYPE_OPTIONS = [
  "Residential",
  "Commercial",
  "HOA / community",
  "Hotel / hospitality",
  "Apartment / multifamily",
  "Municipal / public",
  "Other",
] as const;

export const WATER_FEATURE_AGE_OPTIONS = [
  "Less than 1 year",
  "1-3 years",
  "4-7 years",
  "8-10 years",
  "More than 10 years",
  "Not sure",
] as const;

export const ISSUE_DURATION_OPTIONS = [
  "Less than 1 week",
  "1-4 weeks",
  "1-6 months",
  "More than 6 months",
  "Ongoing / recurring",
  "Not sure",
] as const;

export const OPERATING_CONDITION_OPTIONS = [
  "Operating normally",
  "Operating but has problems",
  "Works intermittently",
  "Not operating",
  "Not sure",
] as const;

export const LEAK_CONDITION_OPTIONS = [
  "Yes, definitely leaking",
  "Possibly leaking",
  "No known leak",
  "Not sure",
] as const;

export const PREVIOUS_SERVICE_STATUS_OPTIONS = ["Yes", "No", "Not sure"] as const;

export const MAINTENANCE_FREQUENCY_OPTIONS = [
  "Weekly",
  "Every 2 weeks",
  "Monthly",
  "Every few months",
  "Only when there is a problem",
  "No regular maintenance",
  "Not sure",
] as const;

export const PREFERRED_CONTACT_METHOD_OPTIONS = ["Phone call", "Text message", "Email"] as const;

export const PREFERRED_CONTACT_TIME_OPTIONS = ["Morning", "Afternoon", "Evening", "No preference"] as const;

export const questionnaireSubmissionSchema = z.object({
  serviceRequested: z
    .array(z.enum(SERVICE_REQUESTED_OPTIONS))
    .min(1, "Please select at least one service"),
  serviceRequestedOtherDetail: z
    .string()
    .max(200, "Please keep this under 200 characters")
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),
  propertyType: z.enum(PROPERTY_TYPE_OPTIONS),
  waterFeatureAge: z.enum(WATER_FEATURE_AGE_OPTIONS),
  issueDuration: z.enum(ISSUE_DURATION_OPTIONS),
  operatingCondition: z.enum(OPERATING_CONDITION_OPTIONS),
  leakCondition: z.enum(LEAK_CONDITION_OPTIONS),
  previousServiceStatus: z.enum(PREVIOUS_SERVICE_STATUS_OPTIONS),
  previousServiceExplanation: z
    .string()
    .max(500, "Please keep this under 500 characters")
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),
  maintenanceFrequency: z.enum(MAINTENANCE_FREQUENCY_OPTIONS),
  preferredContactMethod: z.enum(PREFERRED_CONTACT_METHOD_OPTIONS),
  preferredContactTime: z.enum(PREFERRED_CONTACT_TIME_OPTIONS),
  additionalNotes: z
    .string()
    .max(2000, "Please keep this under 2000 characters")
    .optional()
    .transform((val) => (val ? val.trim() : undefined)),
});

export type QuestionnaireSubmissionInput = z.infer<typeof questionnaireSubmissionSchema>;
