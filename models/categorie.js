const mongoose = require('mongoose');
const Joi = require('joi');

const categorieSchema = new mongoose.Schema({
  naam: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  beschrijving: {
    type: String,
    required: true,
    minlength: 10,
  },
});

const Categorie = mongoose.model('Categorie', categorieSchema);

function validateCategorie(categorie) {
  const schema = Joi.object({
    naam: Joi.string().min(3).max(50).required(),
    beschrijving: Joi.string().min(10).required(),
  });

  return schema.validate(categorie);
}

module.exports.Categorie = Categorie;
module.exports.validateCategorie = validateCategorie;
