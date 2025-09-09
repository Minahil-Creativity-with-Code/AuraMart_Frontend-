import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [formData, setFormData] = useState({
    profileImage: null,
    role: 'user',
    gender: 'male',
    profession: '',
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setFormData((prev) => ({
        ...prev,
        profileImage: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const clearProfileImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  // ✅ Updated password rule: only 1 uppercase + 1 special character
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+={};':"\\|,.<>/?-]).+$/;
    return regex.test(password);
  };

  // Check username availability
  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      setUsernameError('');
      return;
    }

    setIsCheckingUsername(true);
    setUsernameError('');

    try {
      const response = await axios.get(`http://localhost:5000/api/users/check-username/${username}`);
      
      if (response.data.available) {
        setUsernameError('');
      } else {
        setUsernameError('Username is already taken');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setUsernameError('Username is already taken');
      } else {
        setUsernameError('');
      }
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // Check email availability
  const checkEmailAvailability = async (email) => {
    if (!email || !email.includes('@')) {
      setEmailError('');
      return;
    }

    setIsCheckingEmail(true);
    setEmailError('');

    try {
      const response = await axios.get(`http://localhost:5000/api/users/check-email/${email}`);
      
      if (response.data.available) {
        setEmailError('');
      } else {
        setEmailError('Email is already registered');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setEmailError('Email is already registered');
      } else {
        setEmailError('');
      }
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setSuccess('');
      return;
    }

    if (usernameError) {
      setError('Please choose a different username');
      setSuccess('');
      return;
    }

    if (emailError) {
      setError('Please choose a different email');
      setSuccess('');
      return;
    }

    if (!validatePassword(password)) {
      setError(
        'Password must contain at least 1 uppercase letter and 1 special character.'
      );
      setSuccess('');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSuccess('');
      return;
    }

    if (!agree) {
      setError('You must agree to terms and conditions');
      setSuccess('');
      return;
    }

    try {
      let imageName = '';

      if (formData.profileImage) {
        try {
          const formDataImage = new FormData();
          formDataImage.append('profileImage', formData.profileImage);

          const uploadRes = await axios.post('http://localhost:5000/api/users/upload-public', formDataImage, {
            headers: { 
              'Content-Type': 'multipart/form-data' 
            }
          });

          imageName = uploadRes.data.filename;
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          setError('Failed to upload profile image. Please try again.');
          setSuccess('');
          return;
        }
      }

      const data = {
        name: username,
        email,
        password,
        role: formData.role,
        gender: formData.gender,
        profession: formData.profession,
        image: imageName,
      };

      await axios.post('http://localhost:5000/api/users/register', data, {
        headers: { 'Content-Type': 'application/json' },
      });

      setError('');
      setSuccess(`Welcome, ${username}! Your account has been created.`);

      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAgree(false);
      setUsernameError('');
      setEmailError('');
      setFormData({
        profileImage: null,
        role: 'user',
        gender: 'male',
        profession: '',
      });
    } catch (err) {
      const message =
        err.response?.data?.error || 'Signup failed. Please try again.';
      setError(message);
      setSuccess('');
    }
  };

  return (
    <div className="gs-signup-wrapper">
      <div className="gs-signup-card">
        <h1 className="gs-signup-title">Create Account</h1>

        {error && <div className="gs-signup-error">{error}</div>}
        {success && <div className="gs-signup-success">{success}</div>}

        <form onSubmit={handleSubmit} className="gs-signup-form">
          {/* Username */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onBlur={(e) => checkUsernameAvailability(e.target.value)}
            className="gs-input"
            style={{
              borderColor: usernameError ? '#e74c3c' : undefined,
              boxShadow: usernameError ? '0 0 0 2px rgba(231, 76, 60, 0.2)' : undefined
            }}
          />
          {isCheckingUsername && (
            <div style={{
              color: '#3498db',
              fontSize: '0.8rem',
              fontStyle: 'italic',
              marginTop: '4px',
              marginLeft: '4px'
            }}>
              Checking username availability...
            </div>
          )}
          {usernameError && (
            <div style={{
              color: '#e74c3c',
              fontSize: '0.8rem',
              marginTop: '4px',
              marginLeft: '4px'
            }}>
              {usernameError}
            </div>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={(e) => checkEmailAvailability(e.target.value)}
            className="gs-input"
            style={{
              borderColor: emailError ? '#e74c3c' : undefined,
              boxShadow: emailError ? '0 0 0 2px rgba(231, 76, 60, 0.2)' : undefined
            }}
          />
          {isCheckingEmail && (
            <div style={{
              color: '#3498db',
              fontSize: '0.8rem',
              fontStyle: 'italic',
              marginTop: '4px',
              marginLeft: '4px'
            }}>
              Checking email availability...
            </div>
          )}
          {emailError && (
            <div style={{
              color: '#e74c3c',
              fontSize: '0.8rem',
              marginTop: '4px',
              marginLeft: '4px'
            }}>
              {emailError}
            </div>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="gs-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="gs-input"
          />

          {/* Profession */}
          <input
            name="profession"
            type="text"
            placeholder="Your Profession"
            value={formData.profession}
            onChange={handleChange}
            className="gs-input"
          />

          {/* Gender */}
          <div className="gs-form-section" style={{ textAlign: 'left' }}>
            <label className="gs-label" style={{ textAlign: 'left', display: 'block' }}>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="gs-select"
              style={{ textAlign: 'left' }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Profile Image */}
          <div className="gs-form-section" style={{ textAlign: 'left' }}>
            <label className="gs-label" style={{ textAlign: 'left', display: 'block' }}>Profile Photo</label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="gs-file"
              style={{ textAlign: 'left' }}
            />
          </div>

          {formData.profileImage && (
            <div style={{ textAlign: 'left', marginTop: '10px' }}>
              <p style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Profile Image Preview:</p>
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="Profile Preview"
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid #ddd'
                }}
              />
              <button
                type="button"
                onClick={clearProfileImage}
                style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  backgroundColor: 'red',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginLeft:'20px',
                }}
              >
                Remove Image
              </button>
            </div>
          )}

          {/* Terms */}
          <div className="gs-terms">
            <label>
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />
              <span className="gs-terms-text">
                I agree to the terms & conditions
              </span>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="gs-submit-btn">
            Sign Up
          </button>
        </form>

        <div className="gs-signin-link">
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
