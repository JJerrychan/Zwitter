import React, { useContext } from "react";
import { Box, Container, Stack, useMediaQuery, useTheme } from "@mui/material";
import NavItem from "./NavItem";
import { Chat, Home, Person } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../public/zwitter-logo/png/logo-color.png";
import { NavLink } from "react-router-dom";

export default function SideBar() {
  const { currentUser } = useContext(AuthContext);
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <Container>
      <Box component={NavLink} to="/">
        <img src={Logo} width="100%" alt="zwitter-logo" />
      </Box>
      {isLarge ? (
        <Stack component="nav" spacing={2} alignItems="start">
          <NavItem title="home" to="/" Icon={Home} />
          <NavItem title="messages" to="/messages" Icon={Chat} />
          <NavItem title="messagesTest" to="/messagesTest" Icon={Chat} />
          <NavItem title="chatRoom" to="/chatRoom" Icon={Chat} />
          {currentUser && <NavItem title="profile" to="/user" Icon={Person} />}
        </Stack>
      ) : (
        <Stack component="nav" spacing={2} alignItems="center">
          <NavItem to="/" Icon={Home} />
          <NavItem to="/messages" Icon={Chat} />
          <NavItem to="/messagesTest" Icon={Chat} />
          <NavItem to="/chatRoom" Icon={Chat} />
          {currentUser && <NavItem to="/user" Icon={Person} />}
        </Stack>
      )}
    </Container>
  );
}
