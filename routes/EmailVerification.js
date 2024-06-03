const express = require("express");
const router = express.Router();
const emailVerification = require("../controllers/EmailVerification");


router.get("/:email/:token", emailVerification.validateEmail);
router.get("/verify-user", emailVerification.verifyAllUnverifiedUsers);

module.exports = router;
