import React from 'react';
import { Link } from 'react-router-dom';
const NotFound404 = () => {
  return (
    <div className="not-found-container">
      <div className="error-code">
        <span className="pixel">4</span>
        <span className="pixel">0</span>
        <span className="pixel">4</span>
      </div>
      <p className="message">page not found</p>
      <Link to="/" className="home-button">Back to Home</Link>
    </div>
  );
};

export default NotFound404;
