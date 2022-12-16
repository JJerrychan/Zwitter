import React, { useContext } from "react";
import { Container, IconButton, Stack } from "@mui/material";
import NavItem from "./NavItem";
import { Chat, Home, Person } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import LogoIcon from "../LogoIcon";

export default function SideBar() {
  const { currentUser } = useContext(AuthContext);
  return (
    <Container maxWidth="xs">
      <IconButton aria-label="logo" color="primary" size="large">
        <LogoIcon />
      </IconButton>
      <Stack component="nav" spacing={2} alignItems="start">
        <NavItem title="home" to="/" Icon={Home} />
        <NavItem title="messages" to="/messages" Icon={Chat} />
        <NavItem title="messagesTest" to="/messagesTest" Icon={Chat} />
        <NavItem title="chatRoom" to="/chatRoom" Icon={Chat} />
        {currentUser && <NavItem title="profile" to="/user" Icon={Person} />}
      </Stack>
    </Container>
  );
}
