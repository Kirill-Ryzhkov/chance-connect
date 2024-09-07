// declare dependencies
const express = require("express");
const {
    signupUser,
    signinUser,
    transferUsers,
    getTokenByNFC,
    addNFCIdToUser
} = require("../controllers/userController");
const corsHeader = require("../middleware/corsHeaders");
const requireAuth = require("../middleware/requireAuth");
const isAdminRole = require("../middleware/isAdminRole");

const router = express.Router();

// middleware
router.use(corsHeader);

// sign up
router.post("/signup", signupUser);
// login
router.post("/signin", signinUser);
// get token by nfc_id
router.post("/get-token", getTokenByNFC);
router.post("/add-nfc", addNFCIdToUser);

router.use(requireAuth);
router.use(isAdminRole);
// transfer users
router.post("/transfer", transferUsers);

module.exports = router;