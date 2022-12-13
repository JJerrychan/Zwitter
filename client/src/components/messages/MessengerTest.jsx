import "./Messenger.css";
import Conversation from "./Conversations";
import Message from "./Message";
import ChatOneline from "./ChatOnline";
import React, { useContext, useEffect, useState } from 'react';
import { Card, CardActionArea, Grid, Link, TextField, Typography } from "@mui/material";
import { redirect } from "react-router-dom";
// import { format } from "timeago.js";

const Messenger = () => {
  // const [conversations, setConversations] = useState([]);
  const [conversationsRoom, setconversationsRoom] = useState({});
  const [conversationsRoomPassword, setconversationsRoomPassword] = useState({});
  //const [allRoomsGroup, setAllRoomsGroup] = useContext(RoomsContext);
  return (
    <Grid >
            <Card variant='outlined'>
                <Card>
                    <h1>Create Chat Room:</h1>
                    <TextField id="roomName" label="roomName" variant="outlined" />
                    <TextField id="roomPassword" label="roomPassword" variant="outlined" />
                    < br/>
                    < br/>
                    <form  className='form' id='add-Room'
                        onSubmit={(e) => {
                            e.preventDefault();
                            const chatRoomName = document.getElementById('roomName').value.trim();
                            const chatRoomPassword = document.getElementById('roomPassword').value.trim();
                            if (chatRoomName === "") {
                                alert("Chat room name should not be empty!");
                                return;
                            }
                            if (chatRoomPassword === "") {
                              alert("Chat room password should not be empty!");
                              return;
                          }
                            /*
                            if (chatRoomPassword === "") {
                                alert("chatRoomPassword should not be empty!");
                                return;
                            }
                            */
                            setconversationsRoom({ ...conversationsRoom, [chatRoomName]: [], /*[chatRoomPassword]:[]*/ });
                            setconversationsRoomPassword({ ...conversationsRoomPassword, [chatRoomPassword]: []});
                        }}
                    >
                        <button className='button' type='submit'>
                            Create Room
                        </button>
                    </form>
                    < br/>
                </Card>
                < br/>
                {
                    Object.keys(conversationsRoomPassword,conversationsRoom).map((password,roomName) => {
                        return(
                            <Grid container key={roomName}>
                                <Grid container>
                                <Typography gutterBottom variant='h6' component='h2'>Chat room: {roomName} 
                                  <TextField id="roomPassword2" label="roomPassword2" variant="outlined" />
                                    <p>room password: {password}</p>
                                    < br/>
                                    <form className="joinChatRoomPasswordForm" id = "joinChatRoomPasswordForm"
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        const joinRoomPassword = document.getElementById('roomPassword2').value.trim();
                                        if (joinRoomPassword === "") {
                                          alert("Chat room password should not be empty!");
                                          return;
                                        }
                                        <p>password enter: {joinRoomPassword}</p>
                                        if (joinRoomPassword !== password) {
                                          alert(`${joinRoomPassword} Chat room password is wrong!`);
                                          return;
                                        }
                                        /*
                                        if (joinRoomPassword === password) {
                                          
                                        }
                                        */
                                      }}
                                    >
                                      {/*
                                        <button className='button'  type='submit' >
                                          <Link href ='http://localhost:3000/messages'>
                                            Join
                                          </Link>
                                        </button>
                                      */}
                                        <button className='button'  type='submit' to ='http://localhost:3000/messages'>
                                          Join
                                        </button>
                                    </form>
                                    {/*
                                    {
                                      document.getElementById('roomPassword2').value.trim() === password?<Link className='showlink' href='http://localhost:3000/messages'>JoinRoom</Link>:<p>no</p>
                                    }
                                    {/*<Link className='showlink' href='http://localhost:3000/messages'>JoinRoom</Link>*/}
                                    < br/>
                                </Typography>
                                </Grid>
                            </Grid>
                        );
                    })
                }
                < br/>
            </Card>
        </Grid>
  );
};

export default Messenger;
