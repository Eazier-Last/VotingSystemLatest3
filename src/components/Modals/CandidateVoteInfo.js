// src/Modals/CandidateVoteInfo.js

import React from "react";
import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import "./Modals.css";

function CandidateVoteInfo({ open, onClose, candidateInfo }) {
  if (!candidateInfo) {
    return null; // If no candidate is selected, don't render anything
  }

  const { avatarUrl, name, skills, description, campaignObjective } = candidateInfo;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div className="candidateVoteInfoModal">
        
        <DialogContent>
         
          <div className="candidateDetails">
          <div><DialogTitle className="dialogTitle candidInfoTitle" >Candidate Information</DialogTitle></div>
            {/* Candidate Profile Picture */}
            <div className="candidateProfilePicture candidInfoProfile">
             <div className="candidInfoImage"> <img
                src={avatarUrl}
                alt={`${name}'s profile`}
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "20px",
                }}
              /></div>
              <div className="candidInfoName"><h3 style={{ marginBottom: "10px", color: "#333" }}>{name}</h3></div>
            </div>

            {/* Candidate Name */}
            

            {/* Candidate Skills */}
           <div className="candidInformation"> {skills && (
              <div className="candidateSkills" style={{ marginBottom: "10px" }}>
                <strong>Skills:</strong>
                <p>{skills}</p>
              </div>
            )}

            {/* Candidate Description */}
            {description && (
              <div className="candidateDescription" style={{ marginBottom: "10px" }}>
                <strong>Description:</strong>
                <p>{description}</p>
              </div>
            )}

            {/* Campaign Objective */}
            {campaignObjective && (
              <div className="campaignObjective" style={{ marginBottom: "10px" }}>
                <strong>Campaign Objective:</strong>
                <p>{campaignObjective}</p>
              </div>
            )}</div>
            <div> <Button
            className="closeInfoBtn"
            variant="outlined"
            onClick={onClose}
            sx={{ marginTop: "10px" }}
          >
            Close
          </Button></div>
          </div>
        </DialogContent>

       
         
      
      </div>
    </Dialog>
  );
}

export default CandidateVoteInfo;
