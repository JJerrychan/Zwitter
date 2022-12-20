const express = require("express");
const cors = require('cors')
const app = express();
//const routesConstructor = require("./routes");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { log } = require("console");
const { LOADIPHLPAPI } = require("dns");
const http = require("http").createServer(express);
//var io = require("socket.io")(http);
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits:{
    fileSize: 5* 1024 * 1024
  }
});
const PORT = process.env.PORT || 5000;

app.disable('x-powered-by');
app.use(multerMid.array('file'));

const io = require("socket.io")(PORT, {
  cors: {
    origin: "http://zwitter.herokuapp.com",
  },
});
//app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


//routesConstructor(app);

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string",
    resave: false,
    saveUninitialized: true,
  })
);
let userIsLogin = false;
io.on("connection", (socket) => {
  // console.log("new client connected", socket.id);
  userIsLogin = true;
  socket.on("user_join", (name, roomNum) => {
    try{
      if(roomNum.trim() !== ""){
        if(userIsLogin ===true){
          console.log("RoomNum: " + roomNum + " user join");
          socket.join(roomNum);
          socket.to(roomNum).emit("user_join", name, roomNum);      
        }
        else{
          console.log("user did not login");
        }
      }
      else{
        throw 'chat room name can not be just space'
      }
    }catch(error){
      console.log(error)
    }
  });

  socket.on("message", ({ name, message, roomNum }) => {
    if(userIsLogin ===true){
      // console.log(name);
      // console.log(name, message, socket.id);
      // console.log("room:  " + roomNum);
      console.log("user sent message in" + roomNum);
      io.to(roomNum).emit("message", { name, message, roomNum });
    }
    else{
      console.log("user did not login");
    }
  });
  /*
  socket.on("leave_room",function(name, roomNum){
    if(userIsLogin ===true){
      console.log("user leave");
      socket.to(roomNum).emit("leave_room", name, roomNum);     
      socket.leave(roomNum);  
    }
    else{
      console.log("user did not login");
    }
  });
  */
  socket.on("disconnect", () => {
    userIsLogin=false;
    // console.log("Disconnect Fired");
  });
});


app.use('*', (req, res) => {
  res.status(404).json({ error: 'Page Not found' });
});
/*
http.listen(4000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:4000');
});
*/
/*
app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:4000');
});
*/