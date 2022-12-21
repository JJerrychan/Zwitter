# CS-554 Final Project: Zwitter

- In modern society, almost no one can live without using social media. Social media has been integrated into our daily
  lives, with 59% of the world's population using social media for an average of 2 hours and 29 minutes per day (by
  Global WebIndex).
- Many social media such as Facebook, Twitter, Instagram, etc. are monetized by inserting ads or membership systems,
  which also affects some user experience.
- Our application, Zwitter, was designed to be a social media outlet that is in line with the perceptions of the young
  people of Generation Z (the generation born between 1997 and 2012). It will be divided into several sections according
  to the interests that young people like. Users can express their opinions and share and like the content they like.

- The application will be deployed on the cloud using Google Firebase and Heroku.

## Built with

- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Material UI](https://mui.com/) - React components for faster and easier web development
- [Create React App](https://create-react-app.dev/) - Set up a modern web app by running one command
- [Node.js](https://nodejs.org/en/) - A JavaScript runtime built on Chrome's V8 JavaScript engine
- [Express](https://expressjs.com/) - A web application framework for Node.js
- [Socket.io](https://socket.io/) - A library for real-time, bidirectional, and event-based communication
- [Sass](https://sass-lang.com/) - A CSS preprocessor
- [Firebase](https://firebase.google.com/) - A mobile and web application development platform
- [Heroku](https://www.heroku.com/) - A cloud platform as a service supporting several programming languages
- [Aws s3](https://aws.amazon.com/s3/) - A cloud storage service

## Demo Link

https://zwitterbeta.web.app/

## Installation

- Clone the repo

```
git clone https://github.com/JJerrychan/Zwitter
```

- Initialization

```
cd ./server
npm install
cd ../clent
npm install
```

## Configuration

- modify the `client/src/config.js` file to your own firebase and AWS s3 configuration

## Launch Application

```
# please make sure you are in the project root path first
# please make sure the 3000 & 4000 ports are not used first
# open two terminals to run these commands seperately, CTRL + C will close the project.

# terminal 1
cd ./server
npm start

# terminal 2
cd ./client
npm start
```

Once commands run successfully, you will have your client web app on [localhost:3000](http://localhost:3000/) and
Socket.io server on 'ws://localhost:5000/'!

## How the Application Works

Upon loading the website, the first page will be the home page.

A non-authenticated user will be able to view the list of Zwitter. When user click one Zwitter, the webpage will show
the detail of Zwitter. Only authenticated users will be able to upload or reply Zwitter, view or edit their profile, and
create or join chatroom.

For chatroom, authenticated users can create a room after setting room name and room password. Other user will be able
to view the list of room in chatroom page. They can join the room after verifying password of room. In the chatroom all
the users can communicate with each other.

## Resource

- AWS s3 Images Fold URL: https://zwitter11.s3.amazonaws.com/image/
- S3 console panle: https://woio.signin.aws.amazon.com/console
- S3 console IAM user name: zwitter
- S3 console password: Zwitter123

## Authors

- [Junjie Chen](https://github.com/JJerrychan)

- Xiangyu Zhou

- Haolei Wang

- Yuankai Ma

- Ming Tang

## GitHub Link

- https://github.com/JJerrychan/Zwitter
