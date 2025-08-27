import React from 'react';
import { MdReviews } from "react-icons/md";
// Reusable review card component
const ReviewCard = ({ stars, text, author }) => (
  <div className="review-card">
    <div className="stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</div>
    <p className="review-text">{text}</p>
    <p className="review-author">{author}</p>
  </div>
);

const Reviews = () => {
  const reviews = [
    {
      stars: 5,
      text: "I never knew there was a world full of opportunities exclusively for women out there until I came across AuraMart! AuraMart has been an inspiration, a reflection and a driving force for all the women. Having worked with them, I have definitely received a positive push in the right direction. The platform",
      author: "Rabea / Facebook"
    },
    {
      stars: 5,
      text: "AuraMart is the top online fashion store for women. Shop best quality unstitched, stitched dresses, shirts, shawls, shoes, bedding, accessories and more",
      author: "Rabea / Facebook"
    },
    {
      stars: 5,
      text: "AuraMart is a great platform where women buyers and sellers come together to conduct direct business transactions. Having an up and running business, AuraMart has helped provide not only loyal customers but also great testimonials from these women that has further helped generate even more customers in the long run!",
      author: "Rabea / Facebook"
    }
  ];

  return (
    <div className="reviews-container">
      <h2 className="reviews-title"> <MdReviews /> REVIEWS</h2>
      <div className="review-list">
        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            stars={review.stars}
            text={review.text}
            author={review.author}
          />
        ))}
      </div>
    </div>
  );
};

export default Reviews;
