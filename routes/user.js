const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/getUserByEmail/:email', userController.getUserByEmail);
router.get('/getAllDoctors', userController.getAllDoctors);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

router.post('/signup', userController.signup);

router.post('/login', userController.login);

module.exports = router;
