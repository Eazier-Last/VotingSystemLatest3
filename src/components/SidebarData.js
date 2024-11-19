import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import GroupIcon from "@mui/icons-material/Group";

export const SidebarData = [
  {
    title: "Home",
    icon: <HomeIcon />,
    link: "/home",
  },
  {
    title: "Category List",
    icon: <FormatListBulletedIcon />,
    link: "/two",
  },
  {
    title: "Candidate",
    icon: <AssignmentIndIcon />,
    link: "/three",
  },
  {
    title: "Users",
    icon: <GroupIcon />,
    link: "/four",
  },
  // {
  //   title: "VotePage",
  //   icon: <GroupIcon />,
  //   link: "/VotePage",
  // },
];
