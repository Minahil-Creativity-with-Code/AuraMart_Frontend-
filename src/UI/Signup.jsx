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
    role: 'user'
  });

  // Handle file and select input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profileImage') {
      setFormData((prev) => ({
        ...prev,
        profileImage: files[0]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
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
        email: email,
        password: password,
        role: formData.role
        // Note: Image upload not supported in current register route
        // Profile image can be updated later
      };

      await axios.post('http://localhost:5000/api/users/register', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setError('');
      setSuccess(`Welcome, ${username}! Your account has been created. Please check your email for verification.`);

      // Clear fields
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setAgree(false);
      setFormData({
        profileImage: null,
        role: 'user'
      });
    } catch (err) {
      const message =
        err.response?.data?.error || 'Signup failed. Please try again.';
      setError(message);
      setSuccess('');
    }
  };

  return (
    <div className="signup-page">
      <div className="container">
        <h1>Sign Up</h1>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Role dropdown */}
             <div className="upload-section-signup">
              <label className='label-gender'>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Profile photo upload */}
            <div className="upload-section-signup">
              <label className='label-signup'>Profile Photo</label>
              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            {/* Image preview */}
            {formData.profileImage && (
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="Preview"
                style={{
                  width: '150px',
                  marginTop: '10px',
                  borderRadius: '8px',
                  objectFit: 'cover',
                }}
              />
            )}
          </div>

          <br />
          <div className="password">
            <label>
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />
              <span className="rem">I agree to the terms & conditions</span>
            </label>
          </div>

          <button type="submit" className="submit">Sign Up</button>
        </form>

        <div className="register">
          <span>Already have an account? <Link to="/login">Login</Link></span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
