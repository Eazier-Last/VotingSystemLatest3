import React, { useState } from "react";
import "../App.css";
import { supabase } from "./client"; // Ensure this points to your Supabase client configuration
import "./Modals/Modals.css";
import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
// import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Button from "@mui/material/Button";
// import CloseIcon from "@mui/icons-material/Close";
// import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
// import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
// import FormControl from "@mui/material/FormControl";
// import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import Button from "@mui/material/Button";
// import CloseIcon from "@mui/icons-material/Close";
// import MenuItem from "@mui/material/MenuItem";

function Login({ setAuthType }) {
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    // Check if the user is logging in as "admin"
    if (studentNumber === "admin" && password === "password") {
      setAuthType("admin");
      return;
    }

    // Otherwise, authenticate as a regular user in Supabase
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: `${studentNumber}@lc.com`, // Match the email format you set in Supabase
        password,
      });

      if (authError) {
        throw authError;
      }

      setAuthType("user"); // Set the role to "user" after successful login
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError("Invalid login credentials. Please try again.");
    }
  };

  return (
    <div className="modal">
      <div className="modalContent login">
        <div>
          <h2 className="topLabel login">LOGIN FORM</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  label="Student Number"
                  id="outlined-size-small"
                  size="small"
                  required
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  // required
                />
              </div>
            </Box>
          </div>

          <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <div>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#1ab394",
                marginTop: "10px",
              }}
            >
              Login
            </Button>
          </div>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>

    // <div>
    //   <h2>Login</h2>
    //   <form onSubmit={handleLogin}>
    //     <input
    //       type="text"
    //       placeholder="Student Number"
    //       value={studentNumber}
    //       onChange={(e) => setStudentNumber(e.target.value)}
    //       required
    //     />
    //     <input
    //       type="password"
    //       placeholder="Password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //       required
    //     />
    //     <button type="submit">Login</button>
    //   </form>
    //   {error && <p style={{ color: "red" }}>{error}</p>}
    // </div>
  );
}

export default Login;
