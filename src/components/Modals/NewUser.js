import React, { useState, useEffect } from "react";
import "./Modals.css";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { supabase } from "../client"; // Ensure you import your configured Supabase client

function NewUser({ onClose, onAddUser, initialData }) {
  const [name, setName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [course, setCourse] = useState("");
  const [gmail, setGmail] = useState(""); // Add Gmail state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setStudentNumber(initialData.studentNumber);
      setCourse(initialData.course);
      setGmail(initialData.gmail); // Set Gmail if editing
      setPassword(initialData.password);
    }
  }, [initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !studentNumber || !course || !gmail || !password) {
      alert("All fields are required!");
      return;
    }

    // Step 1: Create user in Supabase Authentication
    const { error: authError } = await supabase.auth.signUp({
      email: studentNumber + "@lc.com",
      password: password,
    });

    if (authError) {
      console.error("Error creating user in Supabase Auth:", authError.message);
      alert("Failed to create user: " + authError.message);
      return;
    }

    // Step 2: Save the user details in the 'users' table
    const userData = { name, studentNumber, course, gmail, password };

    const { error: userError } = await supabase
      .from("users")
      .insert([userData]);

    if (userError) {
      console.error("Error saving user to database:", userError.message);
      alert("Failed to save user details: " + userError.message);
      return;
    }

    alert("User created successfully!");
    onAddUser(userData); // Update parent component's UI without duplicate DB insert
    onClose(); // Close the modal
  };

  return (
    <div className="modal">
      <div className="modalOverlay" onClick={onClose}></div>
      <div className="modalContent">
        <div className="closeBtn">
          <Button className="closeIcon" variant="text" onClick={onClose}>
            <CloseIcon />
          </Button>
        </div>
        <div>
          <h2 className="topLabel">{initialData ? "EDIT USER" : "NEW USER"}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <Box
            autoComplete="off"
            sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
          >
            <div>
              <TextField
                autoComplete="off"
                label="Student Number"
                id="outlined-size-small"
                size="small"
                required
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
              />
            </div>
            <div>
              <TextField
                autoComplete="off"
                label="Name"
                id="outlined-size-small"
                size="small"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <TextField
                autoComplete="off"
                label="Gmail"
                id="outlined-size-small"
                size="small"
                required
                value={gmail}
                onChange={(e) => setGmail(e.target.value)} // Capture Gmail input
              />
            </div>
            <div>
              <FormControl sx={{ m: 1, minWidth: 450 }} size="small">
                <InputLabel id="demo-select-small-label">Courses</InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={course}
                  label="Course"
                  onChange={(e) => setCourse(e.target.value)}
                >
                  <MenuItem value={"BSIT"}>BSIT</MenuItem>
                  <MenuItem value={"BSCS"}>BSCS</MenuItem>
                  <MenuItem value={"BSCA"}>BSCA</MenuItem>
                  <MenuItem value={"BSBA"}>BSBA</MenuItem>
                  <MenuItem value={"BSHM"}>BSHM</MenuItem>
                  <MenuItem value={"BSTM"}>BSTM</MenuItem>
                  <MenuItem value={"BSE"}>BSE</MenuItem>
                  <MenuItem value={"BSED"}>BSED</MenuItem>
                  <MenuItem value={"BSPSY"}>BSPSY</MenuItem>
                  <MenuItem value={"BSCrim"}>BSCrim</MenuItem>
                </Select>
              </FormControl>
            </div>
            <FormControl
              autoComplete="off"
              sx={{ m: 1, width: "50ch" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <div className="modalBtns">
              <Button
                variant="outlined"
                sx={{ width: "25ch", marginTop: "15px", marginRight: "8px" }}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "25ch",
                  marginTop: "15px",
                  marginRight: "8px",
                  backgroundColor: "#1ab394",
                }}
              >
                {initialData ? "Update User" : "Save User"}
              </Button>
            </div>
          </Box>
        </form>
      </div>
    </div>
  );
}

export default NewUser;
