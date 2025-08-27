import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="view-user-wrapper">
      <div className="view-user">

        {/* LEFT SIDE: Profile Picture */}
        <div className="user-image">
          <img
            src={`http://localhost:5000/images/${user.image ? user.image : 'User.jpg'}`}
            alt={user.name || 'User Profile'}
            onError={(e) => { e.target.src = '/images/User.jpg'; }}
          />
        </div>

        {/* RIGHT SIDE: User Details */}
        <div className="user-details">
          <h2>{user.name}</h2>
          <p className="user-role">{user.role}</p>

          <div className="user-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Profession:</strong> {user.profession}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p>
              <strong>Status:</strong>{' '}
              <span className={`status ${user.status === 'Active' ? 'active' : 'inactive'}`}>
                {user.status}
              </span>
            </p>
          </div>

          {user.bio && (
            <div className="user-bio">
              <h4>Bio</h4>
              <p>{user.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
