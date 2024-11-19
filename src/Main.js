import React, { lazy, Suspense, useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import Header from "./components/Header";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

const Two = lazy(() => import("./components/Two"));
const Three = lazy(() => import("./components/Three"));
const Four = lazy(() => import("./components/Four"));

function Main({ onLogout }) {
  const [activeComponent, setActiveComponent] = useState("");
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Timer Handlers
  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
    } else {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const totalSeconds =
            prevTime.hours * 3600 + prevTime.minutes * 60 + prevTime.seconds;

          if (totalSeconds <= 0) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            return { hours: 0, minutes: 0, seconds: 0 };
          }

          const newHours = Math.floor((totalSeconds - 1) / 3600);
          const newMinutes = Math.floor(((totalSeconds - 1) % 3600) / 60);
          const newSeconds = (totalSeconds - 1) % 60;

          return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
        });
      }, 1000);
      setIsRunning(true);
    }
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTime((prev) => ({
      ...prev,
      [name]: Math.max(0, Math.min(parseInt(value, 10) || 0, 59)),
    }));
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current); // Clear interval on unmount
  }, []);

  const loadComponent = (path) => {
    switch (path) {
      case "/home":
        setActiveComponent(
          <Home
            time={time}
            isRunning={isRunning}
            onStartStop={handleStartStop}
            onTimeChange={handleTimeChange}
          />
        );
        break;
      case "/two":
        setActiveComponent(
          <Suspense fallback={<div>Loading...</div>}>
            <Two />
          </Suspense>
        );
        break;
      case "/three":
        setActiveComponent(
          <Suspense fallback={<div>Loading...</div>}>
            <Three />
          </Suspense>
        );
        break;
      case "/four":
        setActiveComponent(
          <Suspense fallback={<div>Loading...</div>}>
            <Four />
          </Suspense>
        );
        break;
      default:
        setActiveComponent(
          <Home
            time={time}
            isRunning={isRunning}
            onStartStop={handleStartStop}
            onTimeChange={handleTimeChange}
          />
        );
        break;
    }
  };

  useEffect(() => {
    loadComponent(window.location.pathname);
  }, );

  return (
    <div className="App">
      <Sidebar loadComponent={loadComponent} />
      <Header />

      <div className="ContentArea">{activeComponent}</div>

      {/* Logout Button */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        <Button
          sx={{
            backgroundColor: "#1ab394",
            marginTop: "10px",
            position: "fixed",
            right: 50,
          }}
          variant="contained"
          color="secondary"
          onClick={() => {
            console.log("Logout button clicked"); // Debugging line
            onLogout();
          }}
        >
          <PowerSettingsNewIcon />
        </Button>
      </div>
    </div>
  );
}

export default Main;
