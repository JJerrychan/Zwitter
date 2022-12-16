import React, { useContext } from "react";
import { Container, Link, Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import AuthCard from "./AuthCard";
import UserCard from "./UserCard";

export default function RightPanel() {
  const { currentUser } = useContext(AuthContext);
  return (
    <Container>
      {currentUser ? <UserCard /> : <AuthCard />}
      <Typography component="span" fontSize={1}>
        © Zwitter Contributors ·{" "}
        <Link
          underline="hover"
          target="_blank"
          href="https://github.com/JJerrychan/Zwitter"
        >
          Link to Github
        </Link>
      </Typography>
    </Container>
  );
}
