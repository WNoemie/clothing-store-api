const mongoose = require('mongoose');
const Joi = require('joi');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  shirts: [
    {
      shirt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shirt',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order) {
  const schema = Joi.object({
    user: Joi.string().required(), 
    shirts: Joi.array()
      .items(
        Joi.object({
          shirt: Joi.string().required(), 
          quantity: Joi.number().integer().min(1).default(1),
        })
      )
      .min(1)
      .required(),
    totalPrice: Joi.number().min(0).required(),
  });

  return schema.validate(order);
}

module.exports.Order = Order;
module.exports.validateOrder = validateOrder;
