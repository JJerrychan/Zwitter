const express = require("express");
const cors = require('cors')
const app = express();
//const routesConstructor = require("./routes");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const http = require("http").createServer(express);
//var io = require("socket.io")(http);

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits:{
    fileSize: 5* 1024 * 1024
  }
});

app.disable('x-powered-by');
app.use(multerMid.array('file'));

const io = require("socket.io")(4000, {
  cors: {
    origin: "http://localhost:3000",
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

io.on("connection", (socket) => {
  // console.log("new client connected", socket.id);

  socket.on("user_join", (name, roomNum) => {
    console.log("RoomNum: " + roomNum );
    socket.join(roomNum);
    socket.to(roomNum).emit("user_join", name, roomNum);
  });

  socket.on("message", ({ name, message, roomNum }) => {
    // console.log(name);
    // console.log(name, message, socket.id);
    // console.log("room:  " + roomNum);
    io.to(roomNum).emit("message", { name, message, roomNum });
  });

  socket.on("disconnect", () => {
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