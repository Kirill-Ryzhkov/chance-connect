// declare dependencies
const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const isAdminRole = require("../middleware/isAdminRole");
const corsHeader = require("../middleware/corsHeaders");
const {
    createEvent,
    toggleCafeEvent,
    statusCafe
} = require("../controllers/eventController");

const router = express.Router();

// home example
router.use(corsHeader);

router.get("/statusCafe/:name", statusCafe);

router.use(requireAuth);
router.use(isAdminRole);

router.post("/", createEvent);
router.get("/toggleCafe/:name", toggleCafeEvent);

module.exports = router;