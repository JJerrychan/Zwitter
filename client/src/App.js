import "./App.scss";
import Home from "./components/Home";
import Profile from "./components/users/Profile";
import ChatRoom from "./components/messages/ChatRoom";
import PostDetail from "./components/post/PostDetail";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useContext } from "react";
import SideBar from "./components/left/SideBar";
import { Container, CssBaseline, Grid } from "@mui/material";
import RightPanel from "./components/right/RightPanel";
import { DarkModeContext } from "./context/DarkModeContext";
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
  const { darkMode } = useContext(DarkModeContext);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Container maxWidth={"xl"}>
          <Grid container direction="row" justifyContent="center">
            <Grid
              paddingY={2}
              item
              component="header"
              lg={3}
              md={2}
              sm={2}
              xs={2}
              position={"sticky"}
              top={0}
              height={"100vh"}
              display={"flex"}
            >
              <SideBar />
            </Grid>
            <Grid
              paddingY={2}
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
                <Route path="/post/:postId" element={<PostDetail />} />
              </Routes>
            </Grid>
            <Grid
              paddingY={2}
              display={"flex"}
              item
              component="footer"
              lg={3}
              md={3}
              sm={0}
              xs={0}
              position={"sticky"}
              top={0}
              height={"100vh"}
            >
              <RightPanel />
            </Grid>
          </Grid>
        </Container>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
