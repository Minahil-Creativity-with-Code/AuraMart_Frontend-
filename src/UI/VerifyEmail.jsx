import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // Prevent duplicate API calls using ref
      if (hasVerifiedRef.current) {
        console.log('🔄 Verification already in progress, skipping duplicate call');
        return;
      }

      console.log('🚀 Starting email verification process...');
      hasVerifiedRef.current = true;

      const token = searchParams.get('token');
      
      if (!token) {
        setVerificationStatus('error');
        setMessage('No verification token found. Please check your email for the correct verification link.');
        return;
      }

      try {
        console.log('📡 Calling verification API...');
        const response = await axios.get(`http://localhost:5000/api/users/verify-email?token=${token}`);

        if (response.status === 200) {
          console.log('✅ Verification successful!');
          setVerificationStatus('success');
          setMessage('Email verified successfully! You can now log in to your account.');
          
          // Redirect to login after 3 seconds
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } catch (error) {
        console.error('❌ Verification error:', error);
        setVerificationStatus('error');
        
        if (error.response?.status === 400) {
          setMessage(error.response.data.error || 'Invalid or expired verification token. Please request a new verification email.');
        } else {
          setMessage('Verification failed. Please try again or contact support.');
        }
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="verification-content">
            <FaSpinner className="verification-icon spinning" />
            <h1>Verifying Your Email...</h1>
            <p>Please wait while we verify your email address.</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="verification-content">
            <FaCheckCircle className="verification-icon success" />
            <h1>Email Verified Successfully!</h1>
            <p>{message}</p>
            <p>Redirecting to login page...</p>
          </div>
        );
      
      case 'error':
        return (
          <div className="verification-content">
            <FaTimesCircle className="verification-icon error" />
            <h1>Verification Failed</h1>
            <p>{message}</p>
            <div className="verification-actions">
              <button 
                onClick={() => navigate('/login')}
                className="btn-primary"
              >
                Go to Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="btn-secondary"
              >
                Register Again
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="verify-email-container">
        <div className="verify-email-content">
          {renderContent()}
        </div>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
