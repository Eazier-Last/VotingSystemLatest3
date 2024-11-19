import React, { useState, useEffect } from "react";
import "../App.css";
import Button from "@mui/material/Button";
import NewCandidate from "./Modals/NewCandidate";
import { supabase } from "./client";
import AvatarComponent from "./Avatar/AvatarComponent";
import { v4 as uuidv4 } from "uuid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Three() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [positions, setPositions] = useState([]); // Positions order from Two.js
  const [editingCandidate, setEditingCandidate] = useState(null);

  const toggleModal = () => {
    if (isModalOpen) {
      setEditingCandidate(null); // Reset only when closing
    }
    setIsModalOpen(!isModalOpen);
  };

  const handleCandidateSubmit = async (candidate) => {
    if (candidate.candidateID) {
      const { error } = await supabase
        .from("candidates")
        .update(candidate)
        .eq("candidateID", candidate.candidateID);
      if (error) {
        console.error("Error updating candidate:", error);
        return;
      }
      setCandidates((prevCandidates) =>
        prevCandidates.map((c) =>
          c.candidateID === candidate.candidateID ? candidate : c
        )
      );
    } else {
      const candidateWithID = { ...candidate, candidateID: uuidv4() };
      const { error } = await supabase
        .from("candidates")
        .insert([candidateWithID]);
      if (error) {
        console.error("Error saving candidate:", error);
        return;
      }
      setCandidates([...candidates, candidateWithID]);
    }

    toggleModal();
  };

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    toggleModal();
  };

  const handleDeleteCandidate = async (candidateID) => {
    const { error } = await supabase
      .from("candidates")
      .delete()
      .eq("candidateID", candidateID);
    if (error) {
      console.error("Error deleting candidate:", error);
      return;
    }
    setCandidates((prevCandidates) =>
      prevCandidates.filter((c) => c.candidateID !== candidateID)
    );
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      const { data, error } = await supabase.from("candidates").select("*");
      if (error) {
        console.error("Error fetching candidates:", error);
        return;
      }
      setCandidates(data);
    };

    const fetchPositions = async () => {
      const { data, error } = await supabase.from("positions").select("*");
      if (error) {
        console.error("Error fetching positions:", error);
        return;
      }
      // Ensure positions are ordered based on database
      setPositions(data.map((pos) => pos.positions));
    };

    fetchCandidates();
    fetchPositions();
  }, []);

  // Group and sort candidates based on position order
  const groupedCandidates = candidates.reduce((acc, candidate) => {
    acc[candidate.position] = acc[candidate.position] || [];
    acc[candidate.position].push(candidate);
    return acc;
  }, {});

  const sortedGroupedCandidates = positions.map((position) => ({
    position,
    candidates: groupedCandidates[position] || [],
  }));

  return (
    <div className="homeRow">
      <div className="navSpace"></div>
      <div className="homeContainer">
        <div className="listContainer topLabel">
          MANAGE CANDIDATES <br />
          <Button
            sx={{
              // color: "#1ab394",
              borderColor: "#1ab394",
              marginTop: "10px",
              backgroundColor: "white",
              color: "#1ab394",
              "&:hover": {
                backgroundColor: "#1ab394",
                color: "#fff",
              },
              // borderColor: "#1ab394",
            }}
            onClick={toggleModal}
            variant="outlined"
          >
            + New Candidate
          </Button>
        </div>

        <div className="listContainer candidateListContainer">
          <div>
            <h2 className="topLabel">CANDIDATES</h2>
          </div>
          {sortedGroupedCandidates.map(({ position, candidates }) => (
            <div key={position}>
              <h3 className="position candidateProfileContainer">
                {position
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .toUpperCase()}
              </h3>
              <div className="profileContainer ">
                {candidates.map((candidate, index) => (
                  <div key={index}>
                    <div className="profileAction">
                      <div className="profileRow">
                        <AvatarComponent
                          imgStyle={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "10px",
                          }}
                          imgSrc={candidate.avatarUrl}
                        />
                        <p className="candidateName"> {candidate.name}</p>
                      </div>
                      <div className="candidActions">
                        <Button
                          className="candidBtn"
                          type="submit"
                          variant="contained"
                          onClick={() => handleEditCandidate(candidate)}
                          sx={{
                            backgroundColor: "#1ab394",
                            marginLeft: "5px",
                          }}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          className="candidBtn"
                          type="submit"
                          variant="contained"
                          onClick={() =>
                            handleDeleteCandidate(candidate.candidateID)
                          }
                          sx={{
                            backgroundColor: "#eb5455",
                            marginTop: "10px",
                            marginLeft: "5px",
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {isModalOpen && (
          <NewCandidate
            onSubmit={handleCandidateSubmit}
            toggleModal={toggleModal}
            candidate={editingCandidate}
          />
        )}
      </div>
    </div>
  );
}

export default Three;
