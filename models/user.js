const Joi = require('joi');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
 name: {
 type: String,
 required: true,
 minlength: 5,
 maxlength: 50
 },
 email: {
 type: String,
 required: true,
 minlength: 5,
 maxlength: 255,
 unique: true
 },
 password: {
 type: String,
 required: true,
 minlength: 5,
 maxlength: 1024
 },
 isAdmin: {
  type: Boolean,
  default: true // Set the default value to true
  }
 });

 userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin},config.get('jwtPrivateKey'));
    return token;
   }

 const User = mongoose.model('User', userSchema);

function validateUser(user) {
 const schema = Joi.object({
 name: Joi.string().min(5).max(50).required(),
 email: Joi.string().min(5).max(255).email().required(),
 password: Joi.string().min(5).max(255).required(),
 isAdmin: Joi.boolean()
 });
 return schema.validate(user);
}
exports.User = User;
exports.validate = validateUser;