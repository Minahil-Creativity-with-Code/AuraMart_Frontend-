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
  const [formData, setFormData] = useState({
    profileImage: null,
    role: 'user',
    gender: 'male',
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

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[A-Z])(?=(?:.*[a-z]){8,})(?=.*[!@#$%^&*()_+={};':"\\|,.<>/?-]).+$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setSuccess('');
      return;
    }

    if (!validatePassword(password)) {
      setError(
        'Password must contain at least 1 uppercase letter, 8 lowercase letters, and 1 special character.'
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
      const data = {
        name: username,
        email,
        password,
        role: formData.role,
        gender: formData.gender,
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
      setFormData({
        profileImage: null,
        role: 'user',
        gender: 'male',
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
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="gs-input"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="gs-input"
          />
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

          <div className="gs-form-section">
            <label className="gs-label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="gs-select"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="gs-form-section">
            <label className="gs-label">Profile Photo</label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="gs-file"
            />
          </div>

          {formData.profileImage && (
            <img
              src={URL.createObjectURL(formData.profileImage)}
              alt="Preview"
              className="gs-preview-img"
            />
          )}

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
