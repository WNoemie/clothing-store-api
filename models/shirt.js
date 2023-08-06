const mongoose = require('mongoose');
const Joi = require('joi');

const shirtSchema = new mongoose.Schema({
  naam: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  beschrijving: {
    type: String,
    required: true,
    minlength: 10,
  },
  prijs: {
    type: Number,
    required: true,
    min: 0,
  },
  categorie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categorie', 
    required: true,
  },
  maten: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'Minimum 1 maat.',
    },
  },
  kleuren: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => Array.isArray(v) && v.length > 0,
      message: 'Minimum 1 kleur.',
    },
  }
});

const Shirt = mongoose.model('Shirt', shirtSchema);

function validateShirt(shirt) {
  const schema = Joi.object({
    naam: Joi.string().min(3).max(255).required(),
    beschrijving: Joi.string().min(10).required(),
    prijs: Joi.number().min(0).required(),
    categorie: Joi.string().hex().length(24).required(), 
    maten: Joi.array().items(Joi.string().required()).min(1).required(),
    kleuren: Joi.array().items(Joi.string().required()).min(1).required(),
  });

  return schema.validate(shirt);
}

module.exports.Shirt = Shirt;
module.exports.validateShirt = validateShirt;
