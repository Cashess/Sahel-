"use client";

import { OrderParams } from "@/constant.types";
import Image from "next/image";
import { useState } from "react";
import StarRating from "./StarRating";
import {
  reviewImagesSchema,
  reviewSchema,
} from "@/lib/zodvalidations/review-validations";
import toast from "react-hot-toast";
import {
  uploadImagesToSupabase,
  createReview,
} from "@/lib/supabase/actions/reviews.actions";
import { useRouter } from "next/navigation";
import { Upload, Star, Truck, ImageIcon, CheckCircle, X, ArrowLeft } from "lucide-react";

// ── Interactive star picker ──────────────────────────────────────
const StarPicker = ({
  rating,
  setRating,
  label,
}: {
  rating: number;
  setRating: (v: number) => void;
  label: string;
}) => {
  const [hovered, setHovered] = useState(0);
  const labels = ["Terrible", "Poor", "Okay", "Good", "Excellent"];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(star)}
            className="transition-transform duration-150 hover:scale-110 active:scale-95"
          >
            <svg
              className={`w-8 h-8 transition-colors duration-150 ${
                star <= (hovered || rating)
                  ? "text-amber-400 drop-shadow-sm"
                  : "text-[#D4C5A9]"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        {(hovered || rating) > 0 && (
          <span className="ml-2 text-xs font-bold text-[#C8A96E] uppercase tracking-wider">
            {labels[(hovered || rating) - 1]}
          </span>
        )}
      </div>
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────
const ReviewOrderPage = ({ orderData }: { orderData: OrderParams }) => {
  const [reviewImageFiles, setReviewImageFiles] = useState<(File | undefined)[]>([]);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");
  const [productRating, setProductRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<Array<Record<string, string>>>([]);
  const [imagesError, setImagesError] = useState<string[]>([]);

  // ── exact same logic ──────────────────────────────────────────
  const colorDisabled =
    !reviewTitle || !reviewDescription || reviewImageFiles.length <= 0;

  const handleRemoveImage = (index: number) => {
    setReviewImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFilesChange = (files: FileList | null) => {
    setImagesError([]);
    setReviewImageFiles(files ? Array.from(files) : []);
  };

  const handleSubmitReview = async () => {
    let localError = false;
    const reviewFormValidation = reviewSchema.safeParse({ reviewTitle, reviewDescription });
    const reviewImagesValidation = reviewImagesSchema.safeParse({ reviewImages: reviewImageFiles });

    const reviewResult = reviewFormValidation.error?.issues.map((each) => ({
      [each.path[0]]: each.message,
    }));

    if (reviewResult) {
      localError = true;
      setFormErrors(reviewResult);
    }

    if (reviewImagesValidation.error?.issues) {
      localError = true;
      setImagesError(reviewImagesValidation.error.issues.map((each) => each.message));
    }

    if (localError) {
      toast.error("Please fix the errors");
      return;
    }

    try {
      setIsSubmitting(true);
      const imageReviewsFormData = new FormData();
      reviewImageFiles.forEach((file) => {
        if (file) imageReviewsFormData.append("reviewImages", file);
      });

      const imageUrlsInSupabase = await uploadImagesToSupabase(imageReviewsFormData);

      if (imageUrlsInSupabase.success) {
        const { reviewData } = await createReview({
          orderToReview: orderData,
          reviewData: {
            reviewTitle,
            reviewDescription,
            productRating,
            deliveryRating,
            reviewImageUrls: imageUrlsInSupabase.imageUrls || [],
          },
        });
        if (reviewData) {
          toast.success("Review created successfully!");
          router.push("/");
        } else {
          toast.error("Failed to create review. Please try again.");
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
      setReviewTitle("");
      setReviewDescription("");
      setProductRating(5);
      setDeliveryRating(5);
      setReviewImageFiles([]);
    }
  };

  // ── completion progress ───────────────────────────────────────
  const steps = [
    !!reviewImageFiles.length,
    !!reviewTitle,
    !!reviewDescription,
  ];
  const progress = Math.round((steps.filter(Boolean).length / steps.length) * 100);

  return (
    <div className="min-h-screen bg-[#FAFAF8]" style={{ fontFamily: "'Lato', 'Helvetica Neue', sans-serif" }}>
      {/* Top accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-[#C8A96E] via-[#8B6340] to-[#3A2F23]" />

      <div className="max-w-5xl mx-auto px-5 md:px-10 pt-10 pb-24">

        {/* ── Back + Header ── */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-[#9C8776] hover:text-[#3A2F23] transition mb-5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to orders
          </button>
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8A96E] mb-1">Share Your Experience</p>
          <h1 className="text-3xl font-black text-[#2A1F14]" style={{ fontFamily: "'Georgia', serif" }}>
            Write a Review
          </h1>
          <p className="text-sm text-[#9C8776] mt-1">Your honest feedback helps thousands of customers</p>
        </div>

        {/* ── Progress bar ── */}
        <div className="mb-8 bg-white border border-[#EDE0C4] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#5C4A32]">Review completion</span>
            <span className="text-xs font-black text-[#C8A96E]">{progress}%</span>
          </div>
          <div className="h-2 bg-[#F5EDD8] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C8A96E] to-[#8B6340] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex gap-4 mt-3">
            {[
              { label: "Photo", done: steps[0] },
              { label: "Title", done: steps[1] },
              { label: "Description", done: steps[2] },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${s.done ? "bg-emerald-500" : "bg-[#EDE0C4]"}`}>
                  {s.done && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-xs font-semibold ${s.done ? "text-emerald-700" : "text-[#9C8776]"}`}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── LEFT: Order summary card ── */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-[#EDE0C4] rounded-3xl overflow-hidden shadow-sm sticky top-6">
              {/* Product image */}
              <div className="bg-gradient-to-br from-[#F5EDD8] to-[#EDE0C4] p-6">
                <Image
                  src={orderData.image_url}
                  alt={orderData.product_name}
                  width={0}
                  height={0}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  style={{ width: "100%", height: "auto" }}
                  className="rounded-2xl object-cover mix-blend-multiply drop-shadow-md"
                />
              </div>

              {/* Order meta */}
              <div className="p-5 space-y-4">
                <div>
                  <h2 className="text-base font-black text-[#2A1F14] leading-tight" style={{ fontFamily: "'Georgia', serif" }}>
                    {orderData.product_name}
                  </h2>
                  <p className="text-2xl font-black text-[#3A2F23] mt-1">
                    {process.env.NEXT_PUBLIC_CURRENCY} {orderData.amount_paid}
                  </p>
                </div>

                <div className="h-px bg-[#EDE0C4]" />

                <div className="space-y-2">
                  {[
                    { label: "Region", value: orderData.region },
                    { label: "State", value: orderData.state },
                    { label: "City", value: orderData.city },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#9C8776] uppercase tracking-wider">{row.label}</span>
                      <span className="text-xs font-semibold text-[#2A1F14]">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#F5EDD8] border border-[#D4C5A9]/60 rounded-xl px-3 py-2 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-[#5C4A32]">Verified Purchase</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Review form ── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Image upload */}
            <div className="bg-white border border-[#EDE0C4] rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-[#F5EDD8] p-2 rounded-xl">
                  <ImageIcon className="w-4 h-4 text-[#8B6340]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2A1F14]">Upload Photos</p>
                  <p className="text-xs text-[#9C8776]">Show others what you received</p>
                </div>
              </div>

              <label
                htmlFor="imageFiles"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  handleFilesChange(e.dataTransfer.files);
                }}
                className={`flex flex-col items-center w-full p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? "border-[#C8A96E] bg-[#F5EDD8]"
                    : "border-[#D4C5A9] bg-[#FAFAF8] hover:border-[#C8A96E] hover:bg-[#F5EDD8]"
                }`}
              >
                <div className="bg-[#F5EDD8] p-3 rounded-2xl mb-3">
                  <Upload className="w-6 h-6 text-[#8B6340]" />
                </div>
                <p className="text-sm font-bold text-[#2A1F14]">
                  {isDragging ? "Drop images here" : "Click or drag & drop"}
                </p>
                <p className="text-xs text-[#9C8776] mt-1">PNG, JPG, GIF or SVG</p>
                <input
                  onChange={(e) => handleFilesChange(e.target.files)}
                  id="imageFiles"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                />
              </label>

              {/* Preview grid */}
              {reviewImageFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {reviewImageFiles.map((file, index) =>
                    file ? (
                      <div key={`preview-${index}`} className="relative group rounded-xl overflow-hidden border border-[#EDE0C4] aspect-square">
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={`preview-${index}`}
                          width={0}
                          height={0}
                          sizes="25vw"
                          style={{ width: "100%", height: "100%" }}
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : null
                  )}
                </div>
              )}

              {imagesError.map((each, index) => (
                <p key={`img-err-${index}`} className="mt-2 text-xs text-red-500 font-medium">{each}</p>
              ))}
            </div>

            {/* Review title */}
            <div className="bg-white border border-[#EDE0C4] rounded-3xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-[#2A1F14] mb-3" htmlFor="review-title">
                Review Title
              </label>
              <input
                id="review-title"
                type="text"
                placeholder="Summarise your experience in a sentence..."
                className="w-full px-4 py-3 rounded-xl border border-[#D4C5A9] bg-[#FAFAF8] text-sm text-[#2A1F14] placeholder:text-[#C8B8A2] outline-none focus:border-[#8B6340] focus:ring-2 focus:ring-[#C8A96E]/20 transition"
                onChange={(e) => { setFormErrors([]); setReviewTitle(e.target.value); }}
                value={reviewTitle}
              />
              {formErrors.map((each, index) =>
                each.reviewTitle ? (
                  <p key={`title-err-${index}`} className="mt-1.5 text-xs text-red-500 font-medium">{each.reviewTitle}</p>
                ) : null
              )}
            </div>

            {/* Review description */}
            <div className="bg-white border border-[#EDE0C4] rounded-3xl p-5 shadow-sm">
              <label className="block text-sm font-bold text-[#2A1F14] mb-3" htmlFor="review-description">
                Your Review
              </label>
              <textarea
                id="review-description"
                rows={5}
                placeholder="Tell others what you liked, what could be better, and whether you'd recommend it..."
                className="w-full px-4 py-3 rounded-xl border border-[#D4C5A9] bg-[#FAFAF8] text-sm text-[#2A1F14] placeholder:text-[#C8B8A2] outline-none focus:border-[#8B6340] focus:ring-2 focus:ring-[#C8A96E]/20 transition resize-none"
                onChange={(e) => { setFormErrors([]); setReviewDescription(e.target.value); }}
                value={reviewDescription}
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs font-semibold ${reviewDescription.length > 20 ? "text-emerald-600" : "text-[#9C8776]"}`}>
                  {reviewDescription.length} characters
                </span>
              </div>
              {formErrors.map((each, index) =>
                each.reviewDescription ? (
                  <p key={`desc-err-${index}`} className="mt-1.5 text-xs text-red-500 font-medium">{each.reviewDescription}</p>
                ) : null
              )}
            </div>

            {/* Ratings */}
            <div className="bg-white border border-[#EDE0C4] rounded-3xl p-5 shadow-sm space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-[#8B6340]" />
                  <p className="text-sm font-bold text-[#2A1F14]">Product Rating</p>
                </div>
                <StarPicker rating={productRating} setRating={setProductRating} label="Product" />
              </div>
              <div className="h-px bg-[#EDE0C4]" />
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="w-4 h-4 text-[#8B6340]" />
                  <p className="text-sm font-bold text-[#2A1F14]">Delivery Rating</p>
                </div>
                <StarPicker rating={deliveryRating} setRating={setDeliveryRating} label="Delivery" />
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitReview}
              disabled={colorDisabled || isSubmitting}
              className={`w-full py-4 rounded-2xl text-sm font-black tracking-wide transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                colorDisabled || isSubmitting
                  ? "bg-[#D4C5A9] text-[#9C8776] cursor-not-allowed"
                  : "bg-gradient-to-r from-[#3A2F23] to-[#2A1F14] text-white hover:from-[#2A1F14] hover:to-[#1A0F04] active:scale-[0.98]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Submit Review
                </>
              )}
            </button>

            {colorDisabled && (
              <p className="text-center text-xs text-[#9C8776]">
                Complete all fields above to submit your review
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrderPage;
