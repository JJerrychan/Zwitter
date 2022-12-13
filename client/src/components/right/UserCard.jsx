import React, { useContext } from "react";
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

export default function UserCard() {
  const { currentUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
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
      />
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
