import React, { useContext } from "react";
import { Box, Container, Link, Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import AuthCard from "./AuthCard";
import UserCard from "./UserCard";

export default function RightPanel() {
  const { currentUser } = useContext(AuthContext);
  return (
    <Container sx={{ display: "flex", flexDirection: "column" }}>
      {currentUser ? <UserCard /> : <AuthCard />}
      <Box marginTop={"auto"}>
        <Typography fontSize={"0.9rem"} fontStyle={"italic"}>
          Zwitter - A New Wave of Social for Gen Z
        </Typography>
        <Typography component="span" fontSize={1}>
          © Zwitter Contributors ·{" "}
          <Link
            color={"secondary"}
            underline="hover"
            target="_blank"
            href="https://github.com/JJerrychan/Zwitter"
          >
            Link to Github
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
