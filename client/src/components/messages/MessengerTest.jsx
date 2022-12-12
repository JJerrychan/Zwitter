import "./Messenger.css";
import Conversation from "./Conversations";
import Message from "./Message";
import ChatOneline from "./ChatOnline";
import React, { useContext, useEffect, useState } from 'react';
import { Card, CardActionArea, Grid, TextField, Typography } from "@mui/material";
// import { format } from "timeago.js";

const Messenger = () => {
  // const [conversations, setConversations] = useState([]);
  const [conversationsRoom, setconversationsRoom] = useState({ conversationRoomName: undefined, conversationRoomPassword: undefined });
  return (
    <Grid >
        <Card variant='outlined'>
          <CardActionArea>
              <h1>Create conversation room:</h1>
                <h2>Conversation room name:</h2><TextField id="Conversation room name" label="Conversation room name" variant="outlined" />
                <h2>Conversation room password:</h2><TextField id="Conversation room password" label="Conversation room password" variant="outlined" />
                  <form  className='form' id='add-Conversation-room-name'
                    onSubmit={(e) => {
                      e.preventDefault();
                      const conversationRoomName = document.getElementById('Conversation room name').value.trim();
                      if (conversationRoomName === "") {
                        alert("input should not be empty!");
                        return;
                      }
                      e.preventDefault();
                      const conversationRoomPassword = document.getElementById('Conversation room password').value.trim();
                      if (conversationRoomPassword === "") {
                        alert("input should not be empty!");
                        return;
                      }
                      setconversationsRoom({ conversationRoomName: conversationRoomName, conversationRoomPassword: conversationRoomPassword});
                      console.log(conversationRoomName)
                      console.log(conversationRoomPassword)
                    }}
                  >
                    <button className='button' type='submit'>
                      Create
                    </button>
                  </form>
          </CardActionArea>
          {
            Object.keys(conversationsRoom.conversationRoomName !== undefined && conversationsRoom.conversationRoomPassword !== undefined).map((room) => {
              return(
                <Grid container key={room}>
                  <Typography gutterBottom variant='h6' component='h2'>Room name: {room} 
                  <h2>Conversation room password:</h2><TextField id="Conversation room password" label="Conversation room password" variant="outlined" />
                  <form  className='form' id='add-Conversation-room-password'
                    onSubmit={(e) => {
                      e.preventDefault();
                      const conversationRoomPassword = document.getElementById('Conversation room password').value.trim();
                      if (conversationRoomPassword === "") {
                        alert("input should not be empty!");
                        return;
                      }
                    }}
                  ></form>
                    <button className='button' type='submit'>
                      Join Room
                    </button>
                  </Typography>
                </Grid>
              );
            })
          }
        </Card>
    </Grid>
  );
};

export default Messenger;
