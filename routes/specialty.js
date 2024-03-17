
const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialtyController');

router.post('/', specialtyController.createSpecialty);
router.get('/', specialtyController.getAllSpecialties);
router.get('/:id', specialtyController.getSpecialtyById);
router.put('/:id', specialtyController.updateSpecialty);
router.delete('/:id', specialtyController.deleteSpecialty);

module.exports = router;
