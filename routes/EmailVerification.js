const express = require("express");
const router = express.Router();
const emailVerification = require("../controllers/EmailVerification");


router.get("/:email/:token", emailVerification.validateEmail);

module.exports = router;
