import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/users/forgot-password', {
        email: email
      });

      if (response.status === 200) {
        setIsSubmitted(true);
        toast.success('Password reset email sent successfully! Please check your email.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      
      if (error.response?.status === 404) {
        toast.error('No account found with this email address');
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error || 'Invalid email address');
      } else {
        toast.error('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="fp-wrapper">
        <div className="fp-container">
          <div className="fp-successBox">
            <FaEnvelope className="fp-successIcon" />
            <h1>Check Your Email</h1>
            <p>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p>
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            <div className="fp-actions">
              <Link to="/login" className="fp-btnPrimary">
                <FaArrowLeft /> Back to Login
              </Link>
              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="fp-btnSecondary"
              >
                Send Another Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fp-wrapper">
      <div className="fp-container">
        <div className="fp-formBox">
          <Link to="/login" className="fp-backLink">
            <FaArrowLeft /> Back to Login
          </Link>
          
          <h1>Forgot Password?</h1>
          <p>Enter your email address and we'll send you a link to reset your password.</p>

          <form onSubmit={handleSubmit}>
            <div className="fp-formGroup">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="fp-submitBtn" 
              disabled={isLoading || !email}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="fp-links">
            <p>
              Remember your password? <Link to="/login">Login here</Link>
            </p>
            <p>
              Don't have an account? <Link to="/register">Sign up here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
