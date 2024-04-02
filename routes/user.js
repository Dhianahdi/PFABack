const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const resetPasswordController = require("../controllers/resetPassword");

router.post("/", userController.createUser);
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.get("/request/resetPassword", resetPasswordController.requestPasswordReset);
router.patch("/reset/password", resetPasswordController.resetPassword);

router.post("/signup", userController.signup);

router.post("/login", userController.login);

module.exports = router;
