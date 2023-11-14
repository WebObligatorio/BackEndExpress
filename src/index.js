const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");

// To use environment variables defined in .env file
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require("./routes/users");
const activitiesRoutes = require("./routes/activities");

app.use(cors());                // CORS middleware
app.use(express.json());        // express.json middleware


// Routes
app.use("/api", userRoutes);

// Protected Routes
app.use("/api", activitiesRoutes);


// MongoDB connection
mongoose
    .connect(process.env.DATABASE_URL)
        .then(() => {
            console.log("Successfully connected to the Mongo database.")
        })
        .catch((error) => {
            console.log("An error occurred while trying to connect to the Mongo database")
            console.error(error)
        });



app.listen(PORT, () => {
    console.log('Server running in port: ', PORT)
});
