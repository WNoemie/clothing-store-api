const { User, validate } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
  
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).send('User already registered.');
    }
  
    user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isAdmin: req.body.isAdmin 
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
  });

router.get('/me', auth, async (req, res )=> {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
   });

   router.delete('/:id', [auth, admin], async(req,res)=>{
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return res.status(404).send("user not found");

    res.send(user);
})

module.exports = router;
