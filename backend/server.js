// declare dependencies
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const eventRoutes = require("./routes/event");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");
const storeRoutes = require("./routes/store");

const app = express();

// add base middleware
app.use(express.json());

// ability to see images in browser
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/event", eventRoutes);
app.use("/api/user", userRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/store", storeRoutes);

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