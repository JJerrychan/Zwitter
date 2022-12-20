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
import NewPost from "../post/NewPost";

export default function SideBar() {
  const { currentUser } = useContext(AuthContext);
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  return (
    <Container sx={{ display: "flex", flexDirection: "column" }}>
      <Box padding={2} component={NavLink} to="/">
        <img src={Logo} width="100%" alt="zwitter-logo" />
      </Box>
      {isLarge ? (
        <Stack component="nav" spacing={2} alignItems="start" flexGrow={1}>
          <NavItem title="home" to="/" Icon={Home} />
          {currentUser && (
            <NavItem title="chatRoom" to="/chatRoom" Icon={Chat} />
          )}
          {currentUser && <NavItem title="profile" to="/user" Icon={Person} />}
          {/*<NewPost />*/}
          <FormControlLabel
            style={{ marginTop: "auto" }}
            onChange={() => {
              setDarkMode(!darkMode);
            }}
            checked={darkMode}
            sx={{ color: "primary.main" }}
            control={<DarkModeSwitch />}
            label="Dark Mode"
          />
        </Stack>
      ) : (
        <Stack component="nav" spacing={2} alignItems="center" flexGrow={1}>
          <NavItem to="/" Icon={Home} />
          {currentUser && <NavItem to="/chatRoom" Icon={Chat} />}
          {currentUser && <NavItem to="/user" Icon={Person} />}
          <Box style={{ marginTop: "auto" }}>
            <DarkModeSwitch
              checked={darkMode}
              onChange={() => {
                setDarkMode(!darkMode);
              }}
            />
          </Box>
        </Stack>
      )}
    </Container>
  );
}
