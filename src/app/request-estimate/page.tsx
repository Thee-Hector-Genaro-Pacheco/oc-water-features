"use client";

import React, { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { companyData } from "@/data/company";
import { servicesData } from "@/data/services";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, Phone, Mail, ShieldCheck, AlertCircle } from "lucide-react";

export default function RequestEstimatePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    propertyType: "Residential",
    serviceType: "Fountain Maintenance",
    issueDescription: "",
    preferredContact: "Phone",
    website_hp: "", // Honeypot field
  });

  const [attribution, setAttribution] = useState({
    landingPage: "",
    referrer: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setAttribution({
        landingPage: window.location.pathname,
        referrer: document.referrer || "",
        utmSource: urlParams.get("utm_source") || "",
        utmMedium: urlParams.get("utm_medium") || "",
        utmCampaign: urlParams.get("utm_campaign") || "",
        utmTerm: urlParams.get("utm_term") || "",
        utmContent: urlParams.get("utm_content") || "",
      });
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.issueDescription.trim()) newErrors.issueDescription = "Please describe your issue or project";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          city: formData.city,
          propertyType: formData.propertyType,
          serviceRequested: formData.serviceType,
          message: formData.issueDescription,
          preferredContactMethod: formData.preferredContact,
          website_hp: formData.website_hp,
          ...attribution,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        setServerError(resData.error || "Unable to submit form. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-gradient-to-b from-navy-950 via-navy-900 to-brand-950 text-white py-16 sm:py-20 border-b border-navy-800">
        <Container>
          <div className="max-w-3xl">
            <span className="inline-block text-xs sm:text-sm font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-aqua-500/20 text-aqua-300 border border-aqua-500/30 mb-4">
              Free Consultation
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Request a Free Estimate
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Tell us about your fountain, pond, or waterfall service needs. Our family team will get back to you promptly with expert advice.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-slate-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form Column */}
            <div className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200/80 shadow-md">
              {submitted ? (
                <div className="text-center py-12 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" aria-hidden="true" />
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    Estimate Request Submitted!
                  </h2>

                  <p className="text-slate-600 max-w-lg mx-auto text-base">
                    Thank you, <span className="font-semibold text-slate-900">{formData.fullName}</span>! Our team has received your details for <span className="font-semibold text-slate-900">{formData.city}</span>. We will review your request and reach out shortly via {formData.preferredContact.toLowerCase()}.
                  </p>

                  <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 text-brand-900 text-xs sm:text-sm max-w-lg mx-auto text-left space-y-1">
                    <div className="flex items-center gap-2 font-bold text-brand-800">
                      <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0" />
                      <span>Next Steps</span>
                    </div>
                    <p className="text-slate-700">
                      If your issue requires urgent attention (such as a screeching pump or active leak), feel free to call us directly at <span className="font-bold">{companyData.phonePlaceholder}</span>.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: "",
                          phone: "",
                          email: "",
                          city: "",
                          propertyType: "Residential",
                          serviceType: "Fountain Maintenance",
                          issueDescription: "",
                          preferredContact: "Phone",
                          website_hp: "",
                        });
                      }}
                      variant="outline"
                    >
                      Submit Another Estimate Request
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                    Estimate Details
                  </h2>

                  {serverError && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  {/* Hidden Honeypot Field for Spambots */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website_hp}
                      onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-semibold text-slate-800 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors ${
                          errors.fullName ? "border-red-500 bg-red-50/20" : "border-slate-300 focus:border-brand-600"
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-slate-800 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors ${
                          errors.phone ? "border-red-500 bg-red-50/20" : "border-slate-300 focus:border-brand-600"
                        }`}
                        placeholder="(714) 555-0199"
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors ${
                          errors.email ? "border-red-500 bg-red-50/20" : "border-slate-300 focus:border-brand-600"
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-slate-800 mb-2">
                        City / Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors ${
                          errors.city ? "border-red-500 bg-red-50/20" : "border-slate-300 focus:border-brand-600"
                        }`}
                        placeholder="Newport Beach, Irvine, etc."
                      />
                      {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                    </div>

                    {/* Property Type */}
                    <div>
                      <label htmlFor="propertyType" className="block text-sm font-semibold text-slate-800 mb-2">
                        Property Type
                      </label>
                      <select
                        id="propertyType"
                        value={formData.propertyType}
                        onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-brand-600 bg-white"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial / HOA</option>
                      </select>
                    </div>

                    {/* Type of Service */}
                    <div>
                      <label htmlFor="serviceType" className="block text-sm font-semibold text-slate-800 mb-2">
                        Type of Service Requested
                      </label>
                      <select
                        id="serviceType"
                        value={formData.serviceType}
                        onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-brand-600 bg-white"
                      >
                        {servicesData.map((s) => (
                          <option key={s.id} value={s.title}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Description of Issue */}
                  <div>
                    <label htmlFor="issueDescription" className="block text-sm font-semibold text-slate-800 mb-2">
                      Description of the Issue / Project <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="issueDescription"
                      rows={4}
                      value={formData.issueDescription}
                      onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none transition-colors ${
                        errors.issueDescription ? "border-red-500 bg-red-50/20" : "border-slate-300 focus:border-brand-600"
                      }`}
                      placeholder="Please describe symptoms (e.g. pump humming, losing water, algae blooms, unusual noises)..."
                    />
                    {errors.issueDescription && <p className="text-xs text-red-500 mt-1">{errors.issueDescription}</p>}
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="Phone"
                          checked={formData.preferredContact === "Phone"}
                          onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span>Phone Call</span>
                      </label>

                      <label className="inline-flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="Email"
                          checked={formData.preferredContact === "Email"}
                          onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                          className="text-brand-600 focus:ring-brand-500"
                        />
                        <span>Email</span>
                      </label>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
                      {isSubmitting ? "Submitting Estimate Request..." : "Submit Estimate Request"}
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-navy-900 text-white p-6 sm:p-8 rounded-2xl border border-navy-800 shadow-xl space-y-6">
                <h3 className="text-xl font-bold text-white">Prefer to Call Directly?</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  We are available for immediate telephone consultations to discuss urgent pump failures or water loss.
                </p>

                <div className="space-y-4 pt-2">
                  <a
                    href={companyData.phoneRaw}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                  >
                    <Phone className="w-5 h-5 text-aqua-400 shrink-0" aria-hidden="true" />
                    <div>
                      <span className="block text-xs font-semibold text-slate-300">Call Us Directly</span>
                      <span className="font-bold text-white text-base">{companyData.phonePlaceholder}</span>
                    </div>
                  </a>

                  <a
                    href={`mailto:${companyData.emailPlaceholder}`}
                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                  >
                    <Mail className="w-5 h-5 text-aqua-400 shrink-0" aria-hidden="true" />
                    <div>
                      <span className="block text-xs font-semibold text-slate-300">Email Inquiries</span>
                      <span className="font-bold text-white text-sm">{companyData.emailPlaceholder}</span>
                    </div>
                  </a>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-aqua-400" />
                    <span>Free Initial Consultations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-aqua-400" />
                    <span>30+ Years Experience Since 1992</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
