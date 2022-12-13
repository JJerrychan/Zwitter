import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Avatar,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  IconButton,
  Stack,
  Tab,
  Tabs, Typography,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [value, setValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  // const [form1, setForm1] = useState(false);
  // const [form2, setForm2] = useState(false);
  // const [form3, setForm3] = useState(false);
  // const handleName = () => {
  //   // console.log(currentUser);
  //   setForm1(false);
  //   setForm2(true);
  //   setForm3(false);
  // };
  // const handlePassword = () => {
  //   setForm1(true);
  //   setForm2(false);
  //   setForm3(false);
  // };
  // const handleProfilephoto = () => {
  //   setForm1(false);
  //   setForm2(false);
  //   setForm3(true);
  // };

  return (
    <Container>
      {currentUser ? (
        <Card elevation={0}>
          <CardHeader
            avatar={
              <IconButton size={"small"} sx={{ marginRight: "2rem" }}>
                <ArrowBack fontSize="large" />
              </IconButton>
            }
            title={currentUser.displayName}
            titleTypographyProps={{ fontSize: "1.2rem", fontWeight: "bold" }}
            subheader={`${currentUser.numZwitter} Posts`}
          />
          <CardContent>
            <Stack alignItems={"center"} spacing={3}>
              <Avatar
                sx={{ width: 120, height: 120 }}
                alt={currentUser.displayName}
                src={currentUser.photoURL}
              />
              <Typography variant={"h4"}>{currentUser.displayName}</Typography>
              <ButtonGroup color={"info"} disableElevation variant={"outlined"}>
                <Button>Change Name</Button>
                <Button>Update Photo</Button>
                <Button>Reset Password</Button>
              </ButtonGroup>
            </Stack>
          </CardContent>
          <CardActions>
            <Tabs
              sx={{ marginX: "auto" }}
              value={value}
              onChange={handleTabChange}
              centered
            >
              <Tab label="My Posts" />
              <Tab label="Item Two" />
              <Tab label="Item Three" />
            </Tabs>
          </CardActions>
        </Card>
      ) : (
        <>Please login first!</>
      )}
    </Container>
  );
};

export default Profile;
