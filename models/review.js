const mongoose = require('mongoose');
const Joi = require('joi');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shirt: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shirt',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    minlength: 5,
  }
});

const Review = mongoose.model('Review', reviewSchema);

function validateReview(review) {
  const schema = Joi.object({
    shirt: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().min(5).required(),
  });

  return schema.validate(review);
}

module.exports.Review = Review;
module.exports.validateReview = validateReview;
