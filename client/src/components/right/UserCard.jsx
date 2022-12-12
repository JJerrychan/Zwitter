import React, { useContext } from "react";
import { Avatar, Box, CardHeader, IconButton } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import { MoreVert } from "@mui/icons-material";

export default function UserCard() {
  const { currentUser } = useContext(AuthContext);
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
          <IconButton aria-label="settings">
            <MoreVert />
          </IconButton>
        }
        title={currentUser.displayName}
        titleTypographyProps={{fontSize:"1rem",fontWeight:"bold"}}
      />
    </Box>
  );
}
