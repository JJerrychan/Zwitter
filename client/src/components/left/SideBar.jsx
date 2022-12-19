import React, { useContext } from "react";
import {
  Box,
  Container,
  FormControlLabel,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import NavItem from "./NavItem";
import { Chat, Home, Person } from "@mui/icons-material";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../public/zwitter-logo/png/logo-color.png";
import { NavLink } from "react-router-dom";
import DarkModeSwitch from "./DarkModeSwitch";
import { DarkModeContext } from "../../context/DarkModeContext";

export default function SideBar() {
  const { currentUser } = useContext(AuthContext);
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  return (
    <Container>
      <Box component={NavLink} to="/">
        <img src={Logo} width="100%" alt="zwitter-logo" />
      </Box>
      {isLarge ? (
        <Stack component="nav" spacing={2} alignItems="start">
          <NavItem title="home" to="/" Icon={Home} />
          {currentUser && <NavItem title="chatRoom" to="/chatRoom" Icon={Chat} />}
          {currentUser && <NavItem title="profile" to="/user" Icon={Person} />}
          <FormControlLabel
            onChange={() => {
              console.log("darkModeOld:", darkMode);
              setDarkMode(!darkMode);
              console.log("darkModeNew:", darkMode);
            }}
            checked={darkMode}
            sx={{ color: "primary.main" }}
            control={<DarkModeSwitch />}
            label="Dark Mode"
          />
        </Stack>
      ) : (
        <Stack component="nav" spacing={2} alignItems="center">
          <NavItem to="/" Icon={Home} />
          {currentUser && <NavItem to="/chatRoom" Icon={Chat} />}
          {currentUser && <NavItem to="/user" Icon={Person} />}
          <DarkModeSwitch />
        </Stack>
      )}
    </Container>
  );
}
