import React from "react";
import { supabase } from "./client";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Button from "@mui/material/Button";

function ThankYouForm({ setAuthType }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during logout:", error.message);
    } else {
      setAuthType(null); // Reset authType to null to clear user authentication
      navigate("/"); // Redirect to Login.js
    }
  };

  return (
    <div className="thankYouBody">
      <div className="thankYou">
        <h1>Thank you for participating!</h1>
        <p>Your vote has been recorded.</p>
        {/* <button onClick={handleLogout}>Logout</button> */}
        <Button
          onClick={handleLogout}
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#1ab394",
            marginTop: "10px",
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}

export default ThankYouForm;
