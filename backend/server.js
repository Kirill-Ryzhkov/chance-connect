// declare dependencies
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const eventRoutes = require("./routes/event");
const userRoutes = require("./routes/user");

const app = express();

// add base middleware
app.use(express.json());

// routes

app.use("/api/event", eventRoutes);
app.use("/api/user", userRoutes);

// trying to connect to db & starting server
mongoose.connect(process.env.MONGODB)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log("connected to db\nlistening on port " + process.env.PORT);
        });
    })
    .catch((error) => {
        console.log("error is ", error)
    });

module.exports = app;