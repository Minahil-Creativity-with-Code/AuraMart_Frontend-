import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaCheckCircle, FaTimesCircle, FaEye, FaEyeSlash } from 'react-icons/fa';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('No reset token found. Please check your email for the correct reset link.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/users/reset-password', {
        token: token,
        newPassword: password
      });

      if (response.status === 200) {
        setIsSuccess(true);
        toast.success('Password reset successfully!');
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      
      if (error.response?.status === 400) {
        setError(error.response.data.error || 'Invalid or expired reset token');
      } else if (error.response?.status === 404) {
        setError('Reset token not found');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="reset-password-page">
        <div className="container">
          <div className="success-message">
            <FaCheckCircle className="success-icon" />
            <h1>Password Reset Successful!</h1>
            <p>Your password has been reset successfully.</p>
            <p>Redirecting to login page...</p>
            <div className="actions">
              <Link to="/login" className="btn-primary">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="reset-password-page">
        <div className="container">
          <div className="error-message">
            <FaTimesCircle className="error-icon" />
            <h1>Invalid Reset Link</h1>
            <p>{error}</p>
            <div className="actions">
              <Link to="/forgot-password" className="btn-primary">
                Request New Reset Link
              </Link>
              <Link to="/login" className="btn-secondary">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="container">
        <div className="reset-password-form">
          <Link to="/login" className="back-link">
            ← Back to Login
          </Link>
          
          <h1>Reset Your Password</h1>
          <p>Enter your new password below.</p>

          {error && (
            <div className="error-message">
              <FaTimesCircle className="error-icon" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="password-input">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={6}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading || !password || !confirmPassword}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="additional-links">
            <p>
              Remember your password? <Link to="/login">Login here</Link>
            </p>
            <p>
              Need a new reset link? <Link to="/forgot-password">Request here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
