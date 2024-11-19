// src/Modals/ConfirmVote.js

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import "./Modals.css";

// Confirmation Modal Component
function ConfirmVote({ open, onClose, selectedCandidatesList, onSubmit }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <div class="confirmVote">
        <DialogTitle className="dialogTitle">Confirm Your Vote</DialogTitle>
        <DialogContent className="confirmTable">
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Position</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedCandidatesList.map((item) => (
                  <TableRow key={item.position}>
                    <TableCell>{item.position}</TableCell>
                    <TableCell>{item.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <div class="confirmVoteBtn">
            <Button
              className="confirmBtn"
              type="submit"
              variant="outlined"
              onClick={onClose}
              sx={{
                // backgroundColor: "#eb5455",
                marginTop: "10px",
              }}
            >
              Cancel
            </Button>
            <Button
              className="confirmBtn"
              type="submit"
              variant="contained"
              onClick={onSubmit}
              sx={{
                backgroundColor: "#1ab394",
                marginTop: "10px",
              }}
            >
              Submit
            </Button>
          </div>
          {/* <Button onClick={onClose} color="error">
            Cancel
          </Button>
          <Button onClick={onSubmit} color="primary">
            Submit
          </Button> */}
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default ConfirmVote;
