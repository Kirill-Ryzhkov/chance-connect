const express = require("express");
const corsHeader = require("../middleware/corsHeaders");
const requireAuth = require("../middleware/requireAuth");
const isAdminRole = require("../middleware/isAdminRole");

const { createOrder } = require("../controllers/orderController");

const router = express.Router();

router.use(corsHeader);
router.use(requireAuth);

router.post("/", createOrder);

module.exports = router;