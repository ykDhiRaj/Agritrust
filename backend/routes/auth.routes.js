const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { verifyUser } = require("../controller/auth.controller");

router.get("/verify", authMiddleware, verifyUser);

module.exports = router;