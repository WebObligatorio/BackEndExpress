const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// To use environment variables defined in .env file
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require("./src/routes/users");
const activitiesRoutes = require("./src/routes/activities");

app.use(cors()); // CORS middleware
app.use(express.json()); // express.json middleware

// Routes
app.use("/api", userRoutes);

// Protected Routes
app.use("/api", activitiesRoutes);

// MongoDB connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Successfully connected to the Mongo database.");
  })
  .catch((error) => {
    console.log(
      "An error occurred while trying to connect to the Mongo database"
    );
    console.error(error);
  });

// Socket Logic
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ['GET', 'POST'],
  },
});


io.on("connection", (socket) => {

  let roomIdFromHost = ""

  // The host client fixed a Room ID
  socket.on('set_room_id', (roomId) => {
    roomIdFromHost = roomId
    console.log("ROOM ID for the Game is: " + roomId)
  });

  // User for the host to launch a new room (and wait for players)
  socket.on("join_room", ({ roomId, name, socketId }) => {
    console.log("Listening Join Room: " + roomId + " --> " + name + "   ---> Socket ID: " + socketId)
    socket.join(roomId);
    io.to(roomId).emit("joined_room", { type: "join", id: socket.id, name: name, socketId: socketId });
  });

  // Used when host confirm the game lunching
  socket.on('game_ready', ({value, roomId}) => {
    if (socket.rooms.has(roomId)) {
      io.to(roomId).emit('game_ready', value)
    }
  }) 

  // Used when the game waiting time after lunching ends
  socket.on('game_start', ({value, roomId}) => {
    if (socket.rooms.has(roomId)) {
      io.to(roomId).emit('game_start', value)
    }
  }) 

  // Used to receive votes from players, and to emit votes to host client
  socket.on("vote", ({ roomId, activityId, vote, socketId }) => {
    console.log("Voting Activity ID: " + activityId + " Vote Type: " + vote + " ---> Socket ID: " + socketId)
    io.to(roomId).emit("vote", { activityId, vote, socketId });
  });

  // Used by the host to set a new activity for voting
  socket.on("set_activity", ({ roomId, activityId, currentActivity, lastActivity }) => {
    console.log("Setting Activity ID: " + activityId)
    io.to(roomId).emit("set_activity", {activityId, currentActivity, lastActivity});
  });

  // Used by the host to stop the voting of the activity
  socket.on("stop_activity", ({ roomId, activityId }) => {
    console.log("Stopping Activity ID: " + activityId)
    io.to(roomId).emit("stop_activity", activityId);
  });

});

server.listen(PORT, () => {
  console.log("Server running in port: ", PORT);
});
