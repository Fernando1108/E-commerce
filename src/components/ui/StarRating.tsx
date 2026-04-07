'use client';

import React, { useState } from 'react';

const STAR_PATH =
  'M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z';

const SIZE_PX: Record<string, number> = { sm: 14, md: 20, lg: 28 };
const LABELS = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];

export type StarRatingProps = {
  rating: number;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
};

export default function StarRating({
  rating,
  onChange,
  size = 'md',
  readOnly = true,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const px = SIZE_PX[size];

  if (readOnly) {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            width={px}
            height={px}
            viewBox="0 0 20 20"
            fill={i < rating ? '#C8922A' : 'none'}
            stroke={i < rating ? '#C8922A' : '#DDD9D3'}
            strokeWidth="1.5"
          >
            <path d={STAR_PATH} />
          </svg>
        ))}
      </div>
    );
  }

  const active = hovered || rating;
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange?.(star)}
            className="transition-transform hover:scale-110"
          >
            <svg
              width={px}
              height={px}
              viewBox="0 0 20 20"
              fill={star <= active ? '#C8922A' : 'none'}
              stroke={star <= active ? '#C8922A' : '#DDD9D3'}
              strokeWidth="1.5"
            >
              <path d={STAR_PATH} />
            </svg>
          </button>
        ))}
      </div>
      {active > 0 && (
        <span className="text-[12px] text-[#8A8A8A] self-center">{LABELS[active]}</span>
      )}
    </div>
  );
}
