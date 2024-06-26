const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const resetPasswordController = require("../controllers/resetPassword");

router.post("/", userController.createUser);
router.post("/doctor", userController.createdoc);
router.get("/", userController.getAllUsers);
router.get('/getUserByEmail/:email', userController.getUserByEmail);
router.get('/getAllDoctors', userController.getAllDoctors);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
router.post("/addGeolocation",function(req, res){
userController.addGeolocation});
router.get("/request/resetPassword/:email", resetPasswordController.requestPasswordReset);
router.patch("/reset/password", resetPasswordController.resetPassword);

router.post("/signup", userController.signup);
router.post("/add-doctor", userController.addDoctor);

router.post("/login", userController.login);

module.exports = router;
