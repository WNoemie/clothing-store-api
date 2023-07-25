const express = require('express');
const router = express.Router();
const { Order, validateOrder } = require('../models/order');
const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
    try {
      const userId = req.user._id;
      const orders = await Order.find({ user: userId });
      res.send(orders);
    } catch (error) {
      res.status(500).send('Error bij het ophalen van orders.');
    }
  });
  
  
  router.get('/:id', auth, async (req, res) => {
    try {
      const userId = req.user._id;
      const order = await Order.findOne({ _id: req.params.id, user: userId });
  
      if (!order) {
        return res.status(404).send('Order niet gevonden.');
      }
  
      res.send(order);
    } catch (error) {
      res.status(500).send('Error bij het ophalen van orders.');
    }
  });

router.post('/', auth, async (req, res) => {
  try {
    const { error } = validateOrder(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const userId = req.user._id;

    const { shirts, totalPrice } = req.body;
    const order = new Order({
      user: userId,
      shirts: shirts,
      totalPrice: totalPrice,
    });
    await order.save();

    res.send(order);
  } catch (error) {
    res.status(500).send('Error bij het plaatsen van de order.');
  }
});



router.put('/:id', auth, async (req, res) => {
  try {
    
    const userId = req.user._id;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      {
        $set: req.body,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).send('Order niet gevonden.');
    }

    res.send(order);
  } catch (error) {
    res.status(500).send('Error bij het updaten van de order.');
  }
});


router.delete('/:id', auth, async (req, res) => {
  try {
    
    const userId = req.user._id;

    
    const order = await Order.findOneAndRemove({ _id: req.params.id, user: userId });

    if (!order) {
      return res.status(404).send('Order niet gevonden.');
    }

    res.send(order);
  } catch (error) {
    res.status(500).send('Error bij het deleten van de order.');
  }
});

module.exports = router;
module.exports.validateOrder = validateOrder;