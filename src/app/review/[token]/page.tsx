"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Star, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function CustomerReviewPage() {
  const params = useParams();
  const token = params.token as string;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [city, setCity] = useState("");
  const [permissionToPublish, setPermissionToPublish] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const googleReviewUrl =
    process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "https://g.page/r/placeholder/review";

  useEffect(() => {
    if (token) {
      fetch(`/api/reviews/${token}/open`, { method: "POST" }).catch(() => {});
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!reviewText.trim()) {
      setErrorMessage("Please enter your written feedback.");
      return;
    }
    if (!displayName.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!city.trim()) {
      setErrorMessage("Please enter your city.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/reviews/${token}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          reviewText: reviewText.trim(),
          displayName: displayName.trim(),
          city: city.trim(),
          permissionToPublish,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        setErrorMessage(resData.error || "Unable to submit review.");
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
          {/* Header */}
          <div className="text-center space-y-3 border-b border-slate-100 pb-6">
            <div className="relative w-16 h-16 bg-brand-50 rounded-2xl p-2 mx-auto shadow-sm">
              <Image
                src="/logos/logo.png"
                alt="OC Water Features Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              OC Water Features Review
            </h1>
            <p className="text-sm text-slate-600">
              We value your feedback on our recent water feature service.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                Thank You for Your Review!
              </h2>

              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Your feedback helps our family business maintain high quality standards across Southern California.
              </p>

              {/* Ungated Google Review Option */}
              <div className="p-6 rounded-2xl bg-brand-50 border border-brand-200 text-center space-y-4">
                <h3 className="text-base font-bold text-navy-900">
                  Would you also share your experience on Google?
                </h3>
                <p className="text-xs text-slate-600">
                  Posting your review on Google helps other Southern California homeowners and business owners find reliable water feature care.
                </p>

                <div className="pt-1">
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all"
                  >
                    <span>Leave a Google Review</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Star Rating Picker */}
              <div className="text-center space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Overall Service Rating
                </label>
                <div className="flex items-center justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform focus:outline-none"
                      aria-label={`Rate ${star} out of 5 stars`}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          (hoverRating || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-500 block">
                  {rating} of 5 Stars Selected
                </span>
              </div>

              {/* Written Feedback */}
              <div>
                <label htmlFor="review-text" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Your Feedback / Experience <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="review-text"
                  rows={4}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Please describe how our technicians performed, water clarity results, pump repairs, or overall service quality..."
                  className="w-full p-4 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
                />
              </div>

              {/* Display Name & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="display-name" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Your Name / Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="display-name"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Robert M."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label htmlFor="review-city" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="review-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Newport Beach"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-brand-600"
                  />
                </div>
              </div>

              {/* Optional Permission to Publish Checkbox */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={permissionToPublish}
                    onChange={(e) => setPermissionToPublish(e.target.checked)}
                    className="mt-1 text-brand-600 focus:ring-brand-500 rounded"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    I grant OC Water Features permission to display my review name and feedback on their official website project gallery.
                  </span>
                </label>
              </div>

              <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full justify-center">
                {submitting ? "Submitting Review..." : "Submit Review"}
              </Button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
