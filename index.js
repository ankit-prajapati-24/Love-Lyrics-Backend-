const express = require('express');
const app = express();
const http = require('http');
const dbconnect = require("./config/connectToDb");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const trackrouter = require("./routes/trackRoutes");
const albumsRouter = require("./routes/albumRoutes");
const Authrouter = require("./routes/Auth");
const playlistRoutes = require("./routes/PlaylistRouts");
const { ConnectCloadinary } = require("./config/Coudinary");
const fileupload = require("express-fileupload");
const dotenv = require("dotenv");
const { Server } = require('socket.io');
const server = http.createServer(app);
dotenv.config(); // Load environment variables from .env file
const PORT = process.env.PORT || 4000;

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials:true,
  }
});

// connect database
dbconnect();

// middleware
const bodyparser = require("body-parser");

app.use(cookieParser());
app.use(bodyparser.json());
app.use(
  cors({
    origin: "*",
    credentials: true
  })
);

app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp"
  })
);

ConnectCloadinary();

app.use("/api/v1/tracks",trackrouter);
app.use("/api/v1/Album",albumsRouter);
app.use("/api/v1/Auth",Authrouter);
app.use("/api/v1/Playlist",playlistRoutes);


io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
   
  socket.on('chat-message', (msg,roomid,) => {
      if(roomid != ""){
      const allRooms = io.sockets.adapter.rooms;
       socket.join(roomid);
       console.log("all rooms",allRooms,allRooms.has(roomid));
       socket.to(roomid).emit('chat-message', msg);
      // socket.broadcast.to(roomid).emit('chat-message', msg);
      }
      else{
          // socket.broadcast.emit('chat-message', msg);
          socket.join("")
      }
      console.log('Received message:', msg,roomid);
  });

  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  });
});

// default route
app.get("/api", (req, res) => {
  res.json({
    message: "Your server is running"
  });
});
app.get("/", (req, res) => {
  res.json({
    message: "Your server is running"
  });
});
app.get("/love-lyrics-backend", (req, res) => {
  res.json({
    message: "Your server is running"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
