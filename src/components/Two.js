import React, { useState } from "react";
import "../App.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { supabase } from "./client";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Two() {
  const [positions, setPositions] = useState([]);
  const [positionInput, setPositionInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const fetchPositions = async () => {
    const { data, error } = await supabase
      .from("positions")
      .select("*")
      .order("position_order", { ascending: true });

    if (error) {
      console.error("Error fetching positions:", error);
      return;
    }
    setPositions(data);
  };

  const handleAddPosition = async () => {
    if (!positionInput) return;

    if (editIndex !== null) {
      // Update existing position
      const updatedPositions = [...positions];
      updatedPositions[editIndex].positions = positionInput;

      const { error } = await supabase
        .from("positions")
        .update({ positions: positionInput })
        .eq("id", positions[editIndex].id);

      if (error) {
        console.error("Error updating position:", error);
        return;
      }

      setEditIndex(null);
    } else {
      // Add new position
      const newPositionOrder = positions.length + 1;
      const { data, error } = await supabase
        .from("positions")
        .insert([
          { positions: positionInput, position_order: newPositionOrder },
        ])
        .select();

      if (error) {
        console.error("Error adding position:", error);
        return;
      }
      setPositions([...positions, ...data]);
    }

    setPositionInput("");
    fetchPositions();
  };

  const handleDeletePosition = async (index) => {
    const positionToDelete = positions[index];
    const { error } = await supabase
      .from("positions")
      .delete()
      .eq("id", positionToDelete.id);

    if (error) {
      console.error("Error deleting position:", error);
      return;
    }

    const updatedPositions = positions.filter((_, i) => i !== index);
    setPositions(updatedPositions);
    updatePositionOrderInDB(updatedPositions);
  };

  const handleEditPosition = (index) => {
    setPositionInput(positions[index].positions);
    setEditIndex(index);
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;

    const updatedPositions = [...positions];
    [updatedPositions[index - 1], updatedPositions[index]] = [
      updatedPositions[index],
      updatedPositions[index - 1],
    ];

    setPositions(updatedPositions);
    await updatePositionOrderInDB(updatedPositions);
  };

  const handleMoveDown = async (index) => {
    if (index === positions.length - 1) return;

    const updatedPositions = [...positions];
    [updatedPositions[index], updatedPositions[index + 1]] = [
      updatedPositions[index + 1],
      updatedPositions[index],
    ];

    setPositions(updatedPositions);
    await updatePositionOrderInDB(updatedPositions);
  };

  const updatePositionOrderInDB = async (updatedPositions) => {
    const updates = updatedPositions.map((pos, order) => ({
      id: pos.id,
      position_order: order + 1,
    }));

    const { error } = await supabase.from("positions").upsert(updates);

    if (error) {
      console.error("Error updating position order:", error);
    }
  };

  React.useEffect(() => {
    fetchPositions();
  }, []);

  return (
    <div className="homeRow">
      <div className="navSpace"></div>
      <div className="homeContainer ">
        <div className="listContainer positionForm">
          <label className="topLabel">POSITION FORM</label>
          <Box
            className="positionInput"
            component="form"
            noValidate
            autoComplete="off"
          >
            <div className="inputField">
              <TextField
                label="Add Position"
                id="outlined-size-small"
                size="small"
                value={positionInput}
                onChange={(e) => setPositionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddPosition();
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#1ab394",
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                      borderRight: 0,
                    },
                    "&:hover fieldset": {
                      borderColor: "#1ab394",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1ab394",
                    },
                  },
                }}
              />
              <Stack spacing={2} direction="row">
                <Button
                  variant="outlined"
                  className="btnAdd"
                  onClick={handleAddPosition}
                  sx={{
                    color: "#1ab394",
                    "&:hover": {
                      backgroundColor: "#1ab394",
                      color: "#fff",
                    },
                    borderColor: "#1ab394",
                  }}
                >
                  {editIndex !== null ? "✔" : "+"}
                </Button>
              </Stack>
            </div>
          </Box>
        </div>
        <div className="listContainer listTable">
          <table>
            <thead>
              <tr className="tableList">
                <th className="positionTabletext">POSITION</th>
                <th className="actionTable">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="tableContainer">
              {positions.map((position, index) => (
                <tr key={position.id} className="tableContent">
                  <hr />
                  <td className="positionTable">{position.positions}</td>
                  <td className="actionTable">
                    <div class="categoryAction">
                      <div class="categoryActionBtn">
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ backgroundColor: "#1ab394", marginRight: 1 }}
                          onClick={() => handleEditPosition(index)}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          sx={{ backgroundColor: "#eb5455" }}
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeletePosition(index)}
                        >
                          <DeleteIcon />
                        </Button>
                        {/* <Button
                          variant="outlined"
                          sx={{ marginRight: 1 }}
                          onClick={() => handleEditPosition(index)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleDeletePosition(index)}
                        >
                          Delete
                        </Button> */}
                      </div>
                      <div>
                        <Button
                          variant="text"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                        >
                          <ArrowDropUpIcon />
                        </Button>
                        <Button
                          variant="text"
                          onClick={() => handleMoveDown(index)}
                          disabled={index === positions.length - 1}
                        >
                          <ArrowDropDownIcon />
                        </Button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Two;
