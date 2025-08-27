import React from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();

  const defaultImage = "/admin.jpg"; // fallback image from /public folder

  const handleLogout = () => {
    clearCart();
    logout();
    navigate("/"); // Go to home after logout
  };

  // ✅ Image handling (same as your product approach)
  const getUserImage = () => {
    if (user?.image && user.image.trim() !== "") {
      return user.image.startsWith("http")
        ? user.image
        : `http://localhost:5000/images/${user.image || "default.jpg"}`;
    }
    return defaultImage;
  };

  if (!user) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>You need to log in to view this page.</h2>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-card">
        <div className="profile-image">
          <img
            src={getUserImage()}
            alt={user.name || "User"}
            onError={(e) => {
              e.target.src = defaultImage; // fallback if image not found
            }}
          />
        </div>
        <div className="profile-details">
          <h2>{user.name}</h2>
          <p>
            <strong>Profession:</strong> {user.profession || "Not provided"}
          </p>
          <p>
            <strong>Gender:</strong> {user.gender || "Not provided"}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <button onClick={handleLogout} className="logout" title="Logout">
            Logout
          </button>

          {user?.role === "admin" && (
            <Link to="/">
              <button className="logout">Go to User Panel</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
