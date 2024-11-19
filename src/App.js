import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Main from "./Main";
import VotePage from "./components/VotePage";
import ThankYouForm from "./components/ThankYouForm";

function App() {
  const [authType, setAuthType] = useState(null); // 'admin' or 'user'

  const handleLogout = () => {
    console.log("Logging out..."); // Log to confirm logout triggered
    setAuthType(null); // Clear auth type to log out
  };

  console.log("Current authType:", authType); // Logs current auth state on each render

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              authType ? (
                <Navigate
                  to={authType === "admin" ? "/main" : "/vote"}
                  replace
                />
              ) : (
                <Login setAuthType={setAuthType} />
              )
            }
          />

          <Route
            path="/main"
            element={
              authType === "admin" ? (
                <Main onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/vote"
            element={
              authType === "user" ? (
                <VotePage setAuthType={setAuthType} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Place the thank-you route above the wildcard route */}
          <Route
            path="/thank-you"
            element={<ThankYouForm setAuthType={setAuthType} />}
          />

          {/* Wildcard route for unmatched paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
