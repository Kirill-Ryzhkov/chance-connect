const express = require("express");
const corsHeader = require("../middleware/corsHeaders");
const requireAuth = require("../middleware/requireAuth");

const { createOrder, getOrders, completeOrder, clearHistoryOrders, paymentOrder } = require("../controllers/orderController");

const router = express.Router();

router.use(corsHeader);

router.post("/payment", paymentOrder);
router.get("/", getOrders);

router.use(requireAuth);

router.post("/", createOrder);

router.use(isAdminRole);

router.post("/clear", clearHistoryOrders);
router.post("/complete", completeOrder);

module.exports = router;