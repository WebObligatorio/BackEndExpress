const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// To use environment variables defined in .env file
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require("./routes/users");
const activitiesRoutes = require("./routes/activities");

app.use(cors()); // CORS middleware
app.use(express.json()); // express.json middleware

app.use("/check", (req, res) => {
  res.send("Server is running");
});

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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", ({ roomId, name }) => {
    socket.join(roomId);
    socket
      .to(roomId)
      .emit("joined_room", { type: "join", id: socket.id, name });
  });

  socket.on("vote", ({ roomId, vote, activityId }) => {
    socket.to(roomId).emit("vote", { vote, activityId });
  });

  socket.on("set_activity", ({ roomId, activityId }) => {
    socket.to(roomId).emit("activity_set", activityId);
  });
});

server.listen(PORT, () => {
  console.log("Server running in port: ", PORT);
});
