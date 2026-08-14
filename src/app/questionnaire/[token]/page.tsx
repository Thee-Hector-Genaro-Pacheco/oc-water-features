"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import {
  SERVICE_REQUESTED_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  WATER_FEATURE_AGE_OPTIONS,
  ISSUE_DURATION_OPTIONS,
  OPERATING_CONDITION_OPTIONS,
  LEAK_CONDITION_OPTIONS,
  PREVIOUS_SERVICE_STATUS_OPTIONS,
  MAINTENANCE_FREQUENCY_OPTIONS,
  PREFERRED_CONTACT_METHOD_OPTIONS,
  PREFERRED_CONTACT_TIME_OPTIONS,
} from "@/schemas/questionnaire";

const selectFieldClasses =
  "w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600 bg-white";
const labelClasses = "block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2";

export default function CustomerQuestionnairePage() {
  const params = useParams();
  const token = params.token as string;

  const [serviceRequested, setServiceRequested] = useState<string[]>([]);
  const [serviceRequestedOtherDetail, setServiceRequestedOtherDetail] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [waterFeatureAge, setWaterFeatureAge] = useState("");
  const [issueDuration, setIssueDuration] = useState("");
  const [operatingCondition, setOperatingCondition] = useState("");
  const [leakCondition, setLeakCondition] = useState("");
  const [previousServiceStatus, setPreviousServiceStatus] = useState("");
  const [previousServiceExplanation, setPreviousServiceExplanation] = useState("");
  const [maintenanceFrequency, setMaintenanceFrequency] = useState("");
  const [preferredContactMethod, setPreferredContactMethod] = useState("");
  const [preferredContactTime, setPreferredContactTime] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetch(`/api/questionnaires/${token}/open`, { method: "POST" }).catch(() => {});
    }
  }, [token]);

  const toggleService = (option: string) => {
    setServiceRequested((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (serviceRequested.length === 0) {
      setErrorMessage("Please select at least one service.");
      return;
    }
    if (
      !propertyType ||
      !waterFeatureAge ||
      !issueDuration ||
      !operatingCondition ||
      !leakCondition ||
      !previousServiceStatus ||
      !maintenanceFrequency ||
      !preferredContactMethod ||
      !preferredContactTime
    ) {
      setErrorMessage("Please answer all required questions.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/questionnaires/${token}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceRequested,
          serviceRequestedOtherDetail: serviceRequestedOtherDetail.trim() || undefined,
          propertyType,
          waterFeatureAge,
          issueDuration,
          operatingCondition,
          leakCondition,
          previousServiceStatus,
          previousServiceExplanation: previousServiceExplanation.trim() || undefined,
          maintenanceFrequency,
          preferredContactMethod,
          preferredContactTime,
          additionalNotes: additionalNotes.trim() || undefined,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        setErrorMessage(resData.error || "Unable to submit your responses.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 sm:py-20">
      <Container>
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl space-y-8">
          <div className="text-center space-y-3 border-b border-slate-100 pb-6">
            <div className="relative w-18 h-18 sm:w-20 sm:h-20 bg-brand-50 rounded-2xl p-2 mx-auto shadow-sm">
              <Image
                src="/logos/OCWaterFeatLogo.png"
                alt="OC Water Features Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Tell Us About Your Water Feature
            </h1>
            <p className="text-sm text-slate-600">
              A few quick questions so we can prepare accurate recommendations before we contact you.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Thank You!</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                We&rsquo;ve received your details and will follow up with you shortly. If photos would help us
                evaluate the issue, you&rsquo;re welcome to reply to our confirmation email with photos attached.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className={labelClasses}>
                  What service(s) do you need? <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SERVICE_REQUESTED_OPTIONS.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 text-sm cursor-pointer hover:bg-slate-50"
                    >
                      <input
                        type="checkbox"
                        checked={serviceRequested.includes(option)}
                        onChange={() => toggleService(option)}
                        className="text-brand-600 focus:ring-brand-500 rounded"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
                {serviceRequested.includes("Other") && (
                  <input
                    type="text"
                    value={serviceRequestedOtherDetail}
                    onChange={(e) => setServiceRequestedOtherDetail(e.target.value)}
                    placeholder="Briefly describe the service you need"
                    maxLength={200}
                    className={`${selectFieldClasses} mt-2`}
                  />
                )}
              </div>

              <div>
                <label htmlFor="property-type" className={labelClasses}>
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="property-type"
                  required
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className={selectFieldClasses}
                >
                  <option value="" disabled>Select one</option>
                  {PROPERTY_TYPE_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="water-feature-age" className={labelClasses}>
                    Water Feature Age <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="water-feature-age"
                    required
                    value={waterFeatureAge}
                    onChange={(e) => setWaterFeatureAge(e.target.value)}
                    className={selectFieldClasses}
                  >
                    <option value="" disabled>Select one</option>
                    {WATER_FEATURE_AGE_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="issue-duration" className={labelClasses}>
                    How Long Has This Been an Issue? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="issue-duration"
                    required
                    value={issueDuration}
                    onChange={(e) => setIssueDuration(e.target.value)}
                    className={selectFieldClasses}
                  >
                    <option value="" disabled>Select one</option>
                    {ISSUE_DURATION_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="operating-condition" className={labelClasses}>
                    Current Operating Condition <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="operating-condition"
                    required
                    value={operatingCondition}
                    onChange={(e) => setOperatingCondition(e.target.value)}
                    className={selectFieldClasses}
                  >
                    <option value="" disabled>Select one</option>
                    {OPERATING_CONDITION_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="leak-condition" className={labelClasses}>
                    Is It Leaking? <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="leak-condition"
                    required
                    value={leakCondition}
                    onChange={(e) => setLeakCondition(e.target.value)}
                    className={selectFieldClasses}
                  >
                    <option value="" disabled>Select one</option>
                    {LEAK_CONDITION_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="previous-service-status" className={labelClasses}>
                  Has This Water Feature Been Serviced Before? <span className="text-red-500">*</span>
                </label>
                <select
                  id="previous-service-status"
                  required
                  value={previousServiceStatus}
                  onChange={(e) => setPreviousServiceStatus(e.target.value)}
                  className={selectFieldClasses}
                >
                  <option value="" disabled>Select one</option>
                  {PREVIOUS_SERVICE_STATUS_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                {previousServiceStatus === "Yes" && (
                  <textarea
                    rows={2}
                    value={previousServiceExplanation}
                    onChange={(e) => setPreviousServiceExplanation(e.target.value)}
                    placeholder="Optional — tell us briefly what was done"
                    maxLength={500}
                    className={`${selectFieldClasses} mt-2`}
                  />
                )}
              </div>

              <div>
                <label htmlFor="maintenance-frequency" className={labelClasses}>
                  How Often Is It Currently Maintained? <span className="text-red-500">*</span>
                </label>
                <select
                  id="maintenance-frequency"
                  required
                  value={maintenanceFrequency}
                  onChange={(e) => setMaintenanceFrequency(e.target.value)}
                  className={selectFieldClasses}
                >
                  <option value="" disabled>Select one</option>
                  {MAINTENANCE_FREQUENCY_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preferred-contact-method" className={labelClasses}>
                    Preferred Contact Method <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="preferred-contact-method"
                    required
                    value={preferredContactMethod}
                    onChange={(e) => setPreferredContactMethod(e.target.value)}
                    className={selectFieldClasses}
                  >
                    <option value="" disabled>Select one</option>
                    {PREFERRED_CONTACT_METHOD_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="preferred-contact-time" className={labelClasses}>
                    Best Time to Reach You <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="preferred-contact-time"
                    required
                    value={preferredContactTime}
                    onChange={(e) => setPreferredContactTime(e.target.value)}
                    className={selectFieldClasses}
                  >
                    <option value="" disabled>Select one</option>
                    {PREFERRED_CONTACT_TIME_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="additional-notes" className={labelClasses}>
                  Additional Notes
                </label>
                <textarea
                  id="additional-notes"
                  rows={4}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Describe your space, the issue, or anything else that would help us prepare..."
                  maxLength={2000}
                  className={selectFieldClasses}
                />
              </div>

              <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full justify-center">
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
