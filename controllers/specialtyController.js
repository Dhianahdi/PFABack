const Specialty = require('../models/specialty');

// Créer une spécialité
exports.createSpecialty = async (req, res) => {
  try {
    const newSpecialty = new Specialty(req.body);
    await newSpecialty.save();
    res.status(201).json(newSpecialty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir toutes les spécialités
exports.getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find();
    res.json(specialties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir une spécialité par ID
exports.getSpecialtyById = async (req, res) => {
  try {
    const specialty = await Specialty.findById(req.params.id);
    if (!specialty) {
      return res.status(404).json({ message: 'Spécialité non trouvée.' });
    }
    res.json(specialty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour une spécialité
exports.updateSpecialty = async (req, res) => {
  try {
    const updatedSpecialty = await Specialty.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSpecialty) {
      return res.status(404).json({ message: 'Spécialité non trouvée.' });
    }
    res.json(updatedSpecialty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une spécialité
exports.deleteSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByIdAndDelete(req.params.id);
    if (!specialty) {
      return res.status(404).json({ message: 'Spécialité non trouvée.' });
    }
    res.json({ message: 'Spécialité supprimée avec succès.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
