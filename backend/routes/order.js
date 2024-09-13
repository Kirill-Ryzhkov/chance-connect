const express = require("express");
const corsHeader = require("../middleware/corsHeaders");
const requireAuth = require("../middleware/requireAuth");

const { createOrder, paymentOrder } = require("../controllers/orderController");

const router = express.Router();

router.use(corsHeader);

router.post("/payment", paymentOrder );

router.use(requireAuth);

router.post("/", createOrder);

module.exports = router;