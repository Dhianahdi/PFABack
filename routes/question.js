const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

router.post('/', questionController.createQuestion);
router.post('/add', questionController.addQuestion);
router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);
router.get('/user/:userEmail', questionController.getQuestionsByUserEmail);
router.get('/doctor/:doctorEmail', questionController.getQuestionsByDoctorEmail);

module.exports = router;
