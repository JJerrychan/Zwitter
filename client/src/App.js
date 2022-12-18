import "./App.scss";
import Home from "./components/Home";
import Profile from "./components/users/Profile";
import ChatRoom from "./components/messages/ChatRoom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import SideBar from "./components/left/SideBar";
import {Container, CssBaseline, Grid} from "@mui/material";
import RightPanel from "./components/right/RightPanel";
import {
  DarkModeContextProvider,
} from "./context/DarkModeContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    contrastThreshold: 4.5,
    mode: "light",
    primary: {
      main: "#6936F5",
    },
    secondary: {
      main: "#cb428f",
    },
  },
  typography: {
    fontFamily: [
      "Montserrat",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

const darkTheme = createTheme({
  palette: {
    contrastThreshold: 4.5,
    mode: "dark",
    primary: {
      main: "#6936F5",
    },
    secondary: {
      main: "#cb428f",
    },
  },
  typography: {
    fontFamily: [
      "Montserrat",
      "Roboto",
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  // const { darkMode } = useContext(DarkModeContext);
  return (
    <DarkModeContextProvider>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline/>
        <BrowserRouter>
          <Container maxWidth={"xl"}>
            <Grid container direction="row" justifyContent="center">
              <Grid item component="header" lg={3} md={2} sm={2}>
                <SideBar />
              </Grid>
              <Grid
                item
                sx={{
                  borderLeft: "1px solid #eff3f4",
                  borderRight: "1px solid  #eff3f4",
                }}
                component="main"
                lg={6}
                md={7}
                sm={10}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/user" element={<Profile />} />
                  <Route path="/chatRoom" element={<ChatRoom />} />
                </Routes>
              </Grid>
              <Grid item component="footer" lg={3} md={3} sm={0}>
                <RightPanel />
              </Grid>
            </Grid>
          </Container>
        </BrowserRouter>
      </ThemeProvider>
    </DarkModeContextProvider>
  );
}

export default App;
