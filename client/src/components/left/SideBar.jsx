import React from "react";
import { Container, IconButton, Stack } from "@mui/material";
import NavItem from "./NavItem";
import { Chat, OtherHouses, Person, Twitter } from "@mui/icons-material";

export default function SideBar() {
  return (
    <Container component="header" maxWidth="xs" >
      <IconButton aria-label="logo" color="primary" size="large" style={{position:"fixed", top:"0"}}>
        <Twitter />Zwitter
      </IconButton>
      <Stack component="nav" spacing={2} alignItems="start" style={{position:"fixed", top:"100px"}}>
        <NavItem title="home" to="/" Icon={OtherHouses} />
        <NavItem title="messages" to="/messages" Icon={Chat} />
        <NavItem title="profile" to="/user" Icon={Person} />
      </Stack>
    </Container>
  );
}
