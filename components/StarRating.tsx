"use client";

import { Star } from "lucide-react";

interface StarRatingParams {
  rating: number;
  setRating: (ratingNumber: number) => void;
}

const StarRating = ({ rating, setRating }: StarRatingParams) => {
  const handleRating = (starIndex: number) => {
    setRating(starIndex);
  };

  return (
    <div className="flex flex-row gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starIndex = index + 1;
        const isActive = starIndex <= rating;

        return (
          <Star
            key={starIndex}
            onClick={() => handleRating(starIndex)}
            className={`cursor-pointer transition ${
              isActive
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            size={18}
          />
        );
      })}
    </div>
  );
};

export default StarRating;