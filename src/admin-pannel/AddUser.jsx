import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AddUser = ({ mode = 'signup' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEditMode = mode === 'edit' || !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    profession: '',
    gender: 'male',
    address: '',
    phone: '',
    image: '', // Added to hold existing image name
    profileImage: null,
    removeExistingImage: false, // New field to track if user wants to remove existing image
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      fetchUserData();
    }
  }, [id, isEditMode]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch user data: ${response.status} ${response.statusText}`);
      }

      const user = await response.json();
      
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role || 'user',
        profession: user.profession || '',
        gender: user.gender || 'male',
        address: user.address || '',
        phone: user.phone || '',
        image: user.image || '',
        profileImage: null,
        removeExistingImage: false,
      });
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setError(`Error loading user data: ${err.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    const val = type === 'file' ? files[0] : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const clearProfileImage = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name.trim()) {
      setError('Name is required');
      setIsLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError('Email is required');
      setIsLoading(false);
      return;
    }

    if (!isEditMode && !formData.password) {
      setError('Password is required');
      setIsLoading(false);
      return;
    }

    if (!isEditMode && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!isEditMode && formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      let imageName = '';

      // Handle image upload if a new image is selected
      if (formData.profileImage) {
        const formDataImage = new FormData();
        formDataImage.append('profileImage', formData.profileImage);

        const uploadRes = await axios.post('http://localhost:5000/api/users/upload', formDataImage, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' 
          }
        });

        imageName = uploadRes.data.filename;
      } else if (formData.removeExistingImage && isEditMode) {
        // If removeExistingImage is true and in edit mode, set imageName to empty string
        // to indicate that the existing image should be removed.
        imageName = '';
      } else if (formData.image && isEditMode) {
        // Keep existing image if no new image uploaded and not removing
        imageName = formData.image;
      }

      const url = isEditMode
        ? `http://localhost:5000/api/users/${id}`
        : `http://localhost:5000/api/users`;

      const method = isEditMode ? 'PUT' : 'POST';

      // Prepare request body
      const requestBody = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        profession: formData.profession.trim(),
        gender: formData.gender,
        address: formData.address.trim(),
        phone: formData.phone.trim(),
      };

      // Add image if available
      if (imageName) {
        requestBody.image = imageName;
      }

      // Add password only for new users or when editing and password is provided
      if (!isEditMode || (isEditMode && formData.password)) {
        requestBody.password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditMode ? 'update' : 'create'} user`);
      }

      const result = await response.json();
      
      setSuccess(`User ${isEditMode ? 'updated' : 'created'} successfully!`);

      // Clear form for new users
      if (!isEditMode) {
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'user',
          profession: '',
          gender: 'male',
          address: '',
          phone: '',
          image: '',
          profileImage: null,
          removeExistingImage: false,
        });
      }

      // Redirect after successful creation or update
      setTimeout(() => {
        navigate('/user');
      }, 2000);

    } catch (error) {
      console.error('❌ Error submitting form:', error);
      setError(error.message || `Failed to ${isEditMode ? 'update' : 'create'} user.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="form-box">
        <h2 className="title">
          {isEditMode ? 'Edit User' : 'Add New User'}
        </h2>

        {error && <div className="error-message" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
        {success && <div className="success-message" style={{ color: 'green', marginBottom: '15px', textAlign: 'center' }}>{success}</div>}

        <form className="form" onSubmit={handleSubmit}>
          {/* Name & Email */}
          <div className="grid">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          {!isEditMode && (
            <div className="grid">
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>
          )}

          {/* Password for editing (optional) */}
          {isEditMode && (
            <div className="grid">
              <input
                name="password"
                type="password"
                placeholder="New Password (leave blank to keep current)"
                value={formData.password}
                onChange={handleChange}
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Role, Profession, Gender */}
          <div className="grid">
            <div className="field-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="field-group">
              <label>Profession</label>
              <input
                name="profession"
                type="text"
                placeholder="Profession"
                value={formData.profession}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Address & Phone */}
          <div className="grid">
            <input
              name="address"
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
            />
            <input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Profile Image Upload */}
          <div className="upload-section">
            <label>Profile Image</label>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
            />

            {/* Show existing image if editing and no new image selected */}
            {!formData.profileImage && isEditMode && formData.image && (
              <div className="profile-image-preview">
                <p>Current Profile Image:</p>
                <img
                  src={`http://localhost:5000/images/${formData.image}`}
                  alt="Current Profile"
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    objectFit: 'cover'
                  }}
                />
                <label style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={formData.removeExistingImage}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      removeExistingImage: e.target.checked 
                    }))}
                  />
                  Remove current profile image
                </label>
              </div>
            )}

            {/* Show preview of new selected image */}
            {formData.profileImage && (
              <div className="profile-image-preview">
                <p>New Profile Image Preview:</p>
                <img
                  src={URL.createObjectURL(formData.profileImage)}
                  alt="Profile Preview"
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    objectFit: 'cover'
                  }}
                />
                <button
                  type="button"
                  onClick={clearProfileImage}
                  style={{
                    marginTop: '10px',
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading 
              ? (isEditMode ? 'Saving...' : 'Creating...') 
              : (isEditMode ? 'Save Changes' : 'Create User')
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
