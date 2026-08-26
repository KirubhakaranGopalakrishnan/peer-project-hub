import { useState } from 'react';

export default function RatingStars({ value = 0, onRate, readOnly = false, size = 'text-lg' }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className={`flex items-center gap-0.5 ${size}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onMouseEnter={() => !readOnly && setHover(star)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onRate && onRate(star)}
          className={
            (star <= display ? 'text-rating' : 'text-border') +
            (readOnly ? '' : ' cursor-pointer transition hover:scale-110')
          }
        >
          ★
        </span>
      ))}
    </div>
  );
}
