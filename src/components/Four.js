import React, { useState, useEffect } from "react";
import "../App.css";
import "./css/Users.css";
import Button from "@mui/material/Button";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import NewUser from "./Modals/NewUser";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { supabase } from "./client";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1ab394",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function Four() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("BSIT");

  const [users, setUsers] = useState({
    BSIT: [],
    BSCS: [],
    BSCA: [],
    BSBA: [],
    BSHM: [],
    BSTM: [],
    BSE: [],
    BSED: [],
    BSPSY: [],
    BSCrim: [],
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Error fetching users:", error);
      return;
    }

    console.log(data);

    const organizedUsers = {
      BSIT: [],
      BSCS: [],
      BSCA: [],
      BSBA: [],
      BSHM: [],
      BSTM: [],
      BSE: [],
      BSED: [],
      BSPSY: [],
      BSCrim: [],
    };

    data.forEach((user) => {
      organizedUsers[user.course]?.push(user);
    });

    setUsers(organizedUsers);
  };

  const handleOpenModal = (user = null) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const handleAddUser = async (newUser) => {
    if (selectedUser) {
      // Update user if editing
      await handleEditUser(selectedUser.id, newUser);
    } else {
      // Avoid inserting duplicate if user already exists in NewUser.js
      setUsers((prevUsers) => ({
        ...prevUsers,
        [newUser.course]: [...prevUsers[newUser.course], newUser],
      }));
    }
    setIsModalOpen(false);
  };

  // const handleCreateUser = async (newUser) => {
  //   const { error } = await supabase.from("users").insert([
  //     {
  //       name: newUser.name,
  //       course: newUser.course,
  //       // studentNumber is no longer saved to the database
  //     },
  //   ]);
  //   if (error) {
  //     console.error("Error adding user:", error.message);
  //     alert("Failed to add user: " + error.message);
  //     return;
  //   }

  //   setUsers((prevUsers) => ({
  //     ...prevUsers,
  //     [newUser.course]: [...prevUsers[newUser.course], newUser],
  //   }));
  // };

  const handleEditUser = async (userId, updatedUser) => {
    const { error } = await supabase
      .from("users")
      .update({
        name: updatedUser.name,
        course: updatedUser.course,
        // studentNumber is no longer updated in the database
      })
      .match({ id: userId });

    if (error) {
      console.error("Error updating user:", error.message);
      alert("Failed to update user: " + error.message);
      return;
    }

    setUsers((prevUsers) => {
      const updatedUsers = { ...prevUsers };
      updatedUsers[updatedUser.course] = updatedUsers[updatedUser.course].map(
        (user) => (user.id === userId ? updatedUser : user)
      );
      return updatedUsers;
    });
    setSelectedUser(null);
  };

  const handleDeleteUser = async (course, index) => {
    const userToDelete = users[course]?.[index];

    // Check and log for debugging
    if (!userToDelete) {
      console.error("No user found at specified index:", index);
      alert("Failed to delete user: no user found at specified index");
      return;
    }

    if (!userToDelete.id || !userToDelete.auth_id) {
      console.error(
        "Invalid user data: missing user ID or auth ID",
        userToDelete
      );
      alert("Failed to delete user: invalid user data");
      return;
    }

    console.log("Attempting to delete user:", userToDelete);

    // Step 1: Delete from the `users` table
    const { error: deleteTableError } = await supabase
      .from("users")
      .delete()
      .match({ id: userToDelete.id });

    if (deleteTableError) {
      console.error(
        "Error deleting user from `users` table:",
        deleteTableError.message
      );
      alert(
        "Failed to delete user from users table: " + deleteTableError.message
      );
      return;
    }

    // Step 2: Delete from Supabase Auth using the `auth_id`
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(
      userToDelete.auth_id
    );

    if (deleteAuthError) {
      console.error(
        "Error deleting user from authentication:",
        deleteAuthError.message
      );
      alert(
        "Failed to delete user from authentication: " + deleteAuthError.message
      );
      return;
    }

    // Update the UI by removing the user from the displayed list
    const updatedUsers = users[course].filter((_, i) => i !== index);
    setUsers((prevUsers) => ({
      ...prevUsers,
      [course]: updatedUsers,
    }));

    console.log(
      "User deleted successfully from both users table and authentication"
    );
  };

  return (
    <div className="homeRow">
      <div className="navSpace"></div>
      <div className="homeContainer">
        <div className="listContainer topLabel">
          USERS <br />
          <Button
            sx={{
              marginTop: "10px",
              color: "#1ab394",
              "&:hover": {
                backgroundColor: "#1ab394",
                color: "#fff",
              },
              borderColor: "#1ab394",
            }}
            onClick={() => handleOpenModal()}
            variant="outlined"
          >
            + New User
          </Button>
        </div>
        <div className="listContainer userContainer">
          <div className="userSectionRow1">
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader
                  sx={{ fontSize: "1.2rem", color: "#1ab394" }}
                  component="div"
                  id="nested-list-subheader"
                  className="topLabel"
                >
                  Courses
                </ListSubheader>
              }
            >
              {Object.keys(users).map((course) => (
                <ListItemButton
                  className="listCourse"
                  key={course}
                  onClick={() => setSelectedCourse(course)}
                  selected={selectedCourse === course}
                  sx={{
                    "&.Mui-selected": {
                      borderRadius: "10px",
                      backgroundColor: "#9bf2df",
                      color: "#fff",
                      "&:hover": {
                        borderRadius: "10px",
                        color: "#fff",
                      },
                    },
                    "&:hover": {
                      borderRadius: "10px",
                      color: "#fff",
                      backgroundColor: "#e0f7fa",
                    },
                  }}
                >
                  <ListItemText primary={course} />
                </ListItemButton>
              ))}
            </List>
          </div>
          <div className="userSectionRow2">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Student Number</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="right"></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users[selectedCourse]?.length > 0 ? (
                    users[selectedCourse].map((user, index) => (
                      <StyledTableRow key={user.id}>
                        <StyledTableCell align="left">
                          {user.studentNumber}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {user.name}
                          {/* ({user.auth_id}) */}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{ backgroundColor: "#1ab394", marginRight: 1 }}
                            onClick={() => handleOpenModal(user)}
                          >
                            <EditIcon />
                          </Button>
                          <Button
                            sx={{ backgroundColor: "#eb5455" }}
                            variant="contained"
                            color="secondary"
                            onClick={() =>
                              handleDeleteUser(selectedCourse, index)
                            }
                          >
                            <DeleteIcon />
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableCell colSpan={3} align="center">
                        No users available for this course.
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <NewUser
          onClose={handleCloseModal}
          onAddUser={handleAddUser}
          initialData={selectedUser}
        />
      )}
    </div>
  );
}

export default Four;
