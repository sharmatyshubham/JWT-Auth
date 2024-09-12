import React from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
  
    localStorage.removeItem("token");
    alert("You have successfully logged out!");

    
    navigate("/register");
  };

  return (
    <div>
      <h2>Logout</h2>
      <form onSubmit={handleLogout}>
        <button type="submit">Confirm Logout</button>
      </form>
    </div>
  );
}
