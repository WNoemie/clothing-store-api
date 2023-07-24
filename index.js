const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const shirts = require('./routes/shirts');
const categories = require('./routes/categories');
const orders = require('./routes/orders');
const reviews = require('./routes/reviews');
const auth = require('./routes/auth');
const config = require('config');
const app = express();

if (!config.get('jwtPrivateKey')){
  console.error('FATAL ERROR: jwtPrivateKey not defined');
  process.exit(1);
 }

  mongoose.connect(config.get('db'))
  .then(() => console.log(`Connected to ${config.get('db')}`))
  .catch(err => console.error('could not connect to MongoDB'));

app.use(express.json());
app.use('/api/auth', auth);
app.use('/api/categories', categories);
app.use('/api/orders', orders);
app.use('/api/reviews', reviews);
app.use('/api/shirts', shirts);
app.use('/api/users', users)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
