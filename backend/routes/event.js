// declare dependencies
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const isAdminRole = require("../middleware/isAdminRole");
const {
    createEvent,
    toggleCafeEvent
} = require("../controllers/eventController");

const router = express.Router();

// home example
router.use(requireAuth);
router.use(isAdminRole);
router.post("/", createEvent);
router.get("/toggleCafe/:name", toggleCafeEvent);

module.exports = router;