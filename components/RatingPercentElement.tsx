import React from 'react';

interface RatingPercentElementProps {
  percentage: number;
}

const RatingPercentElement: React.FC<RatingPercentElementProps> = ({ percentage }) => {
  return (
    <div className="rating-percent-element-placeholder">
      <p>{percentage}%</p>
      {/* Add actual rating display logic here */}
    </div>
  );
};

export default RatingPercentElement;
