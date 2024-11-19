import React, { useState, useEffect } from "react";
import "./Modals.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../client";

function NewCandidate({ toggleModal, onSubmit, candidate }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [position, setPosition] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [campaignObjective, setCampaignObjective] = useState("");
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    console.log("Candidate data in modal:", candidate);
    if (candidate) {
      setCandidateName(candidate.name || "");
      setSkills(candidate.skills || "");
      setDescription(candidate.description || "");
      setCampaignObjective(candidate.campaignObjective || "");
      setPosition(candidate.position || "");
      setAvatarUrl(candidate.avatarUrl || null);
    } else {
      // Reset for new candidate
      setCandidateName("");
      setSkills("");
      setDescription("");
      setCampaignObjective("");
      setPosition("");
      setAvatarUrl(null);
    }
  }, [candidate]); // Ensure the dependency is correct

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.target.files[0]);
    reader.onload = () => {
      setAvatarUrl(reader.result);
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  };

  const fetchPositions = async () => {
    const { data, error } = await supabase.from("positions").select("*");
    if (error) {
      console.error("Error fetching positions:", error);
      return;
    }
    setPositions(data.map((pos) => pos.positions)); // Map Supabase data to state
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const handleChange = (event) => {
    setPosition(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !candidateName ||
      !skills ||
      !description ||
      !campaignObjective ||
      !avatarUrl ||
      !position
    ) {
      alert("Please fill all fields!");
      return;
    }

    const candidateData = {
      name: candidateName,
      skills,
      description,
      campaignObjective,
      position,
      avatarUrl,
      candidateID: candidate?.candidateID, // Preserve candidateID if editing
    };

    onSubmit(candidateData);
    toggleModal();
  };

  return (
    <div style={{ zIndex: "999" }} className="modal">
      <div className="modalOverlay" onClick={toggleModal}></div>
      <div className="modalContent">
        <div className="closeBtn"></div>
        <div>
          <h2 className="topLabel">
            {candidate ? "EDIT CANDIDATE" : "NEW CANDIDATE"}
            <span>
              <Button
                className="closeIcon"
                variant="text"
                onClick={toggleModal}
              >
                <CloseIcon />
              </Button>
            </span>
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <FormControl sx={{ m: 1, minWidth: 450 }} size="small">
              <InputLabel id="demo-select-small-label">Position</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={position}
                label="Position"
                onChange={handleChange}
                required
              >
                {positions.map((pos, index) => (
                  <MenuItem key={index} value={pos}>
                    {pos}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  label="Candidate Name"
                  id="outlined-size-small"
                  size="small"
                  required
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                />
              </div>
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  label="Skills"
                  id="outlined-size-small"
                  size="small"
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  id="outlined-multiline-static"
                  label="Description"
                  multiline
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, width: "50ch" } }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  id="outlined-multiline-static"
                  label="Campaign Objective"
                  multiline
                  rows={3}
                  required
                  value={campaignObjective}
                  onChange={(e) => setCampaignObjective(e.target.value)}
                />
              </div>
            </Box>
          </div>

          {!avatarUrl && (
            <div>
              <label className="uploadIcon" htmlFor="imageUpload">
                <AddPhotoAlternateIcon sx={{ fontSize: 100 }} />
              </label>
              <br />
              <span>Upload Image</span>
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                style={{ display: "none" }}
                onChange={convertToBase64}
                required
              />
            </div>
          )}

          <div className="preview">
            {avatarUrl && (
              <img className="imgSize" src={avatarUrl} alt="candidate" />
            )}
          </div>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#1ab394",
              marginTop: "10px",
            }}
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}

export default NewCandidate;
