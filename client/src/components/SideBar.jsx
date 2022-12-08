import React from "react";
import { Container, IconButton, Stack } from "@mui/material";
import NavItem from "./NavItem";
import { Chat, OtherHouses, Person, Twitter } from "@mui/icons-material";

export default function SideBar() {
  return (
    <Container maxWidth="xs">
      <IconButton aria-label="logo" color="primary" size="large">
        <Twitter />Zwitter
      </IconButton>

      <Stack component="nav" spacing={2}>
        <NavItem title="home" to="/" Icon={OtherHouses} />
        <NavItem title="messages" to="/messages" Icon={Chat} />
        <NavItem title="profile" to="/user" Icon={Person} />
      </Stack>
    </Container>
  );
}
