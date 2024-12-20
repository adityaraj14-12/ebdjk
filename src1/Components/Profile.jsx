import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Get the username from localStorage
    const storedUsername = localStorage.getItem("username");

    // If no username, redirect to login page
    if (!storedUsername) {
      navigate("/login");
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  return (
    <div className="profile-container">
      <h1>Welcome, {username}!</h1>
      {/* Add any other profile details here */}
    </div>
  );
};

export default Profile;
