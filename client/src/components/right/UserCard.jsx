import React, { useContext, useState } from "react";
import {
  Avatar,
  Box,
  CardHeader,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { Logout, MoreVert, Settings } from "@mui/icons-material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function UserCard() {
  const navigate = useNavigate();
  // const [a, setA] = useState(true);
  let { currentUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // useEffect(() => {
  //   // setA(!a);
  //   // currentUser = auth.currentUser
  //   console.log(2);
  // },[a]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      component="section"
      sx={{
        marginY: "10px",
        borderRadius: "16px",
        border: "1px solid #eff3f4",
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            sx={{ width: 56, height: 56 }}
            alt={currentUser.displayName}
            src={currentUser.photoURL}
          />
        }
        action={
          <IconButton aria-label="settings" onClick={handleClick}>
            <MoreVert />
          </IconButton>
        }
        title={currentUser.displayName}
        titleTypographyProps={{ fontSize: "1rem", fontWeight: "bold" }}
        subheader={`${currentUser.numZwitter} Posts`}
      />

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          <ListItemIcon
            onClick={() => {
              navigate("./user");
              handleClose();
            }}
          >
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            signOut(auth).then(handleClose);
            navigate("./");
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
