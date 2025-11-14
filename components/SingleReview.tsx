import React from 'react';

interface SingleReviewProps {
  review: any; // Placeholder for review data
}

const SingleReview: React.FC<SingleReviewProps> = ({ review }) => {
  return (
    <div className="single-review-placeholder">
      <h3>Review Placeholder</h3>
      {/* Display review details here */}
      <p>Review content: {review?.comment}</p>
      <p>Rating: {review?.rating}</p>
    </div>
  );
};

export default SingleReview;
