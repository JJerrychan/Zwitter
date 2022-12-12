const express = require("express");
const cors = require('cors')
const app = express();
//const routesConstructor = require("./routes");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const session = require("express-session");


const multerMid = multer({
  storage: multer.memoryStorage(),
  limits:{
    fileSize: 5* 1024 * 1024
  }
});

app.disable('x-powered-by');
app.use(multerMid.array('file'));

app.use(cors())
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

app.use('*', (req, res) => {
  res.status(404).json({ error: 'Page Not found' });
});

app.listen(4000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:4000');
});
