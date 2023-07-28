const request = require('supertest');
const { expect } = require('chai');
const { Categorie } = require('../models/categorie');
const { Shirt } = require('../models/shirt');
const { User } = require('../models/user'); // Import the User model
const { Order } = require('../models/order'); // Import the Order model
const existingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGMwNjVjZTc5YjNlNDU5NmU5MTdlMWYiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2OTAzNjcwNzZ9.JBTKNtbrdztoyxmIEoJ_rtwEB5qrhdBKyIOAfnkZquc';

let server; 

describe('Orders Routes', () => {
  let user; 
  let shirt1;
  let shirt2;
  let order;
  
  before(async () => {
    server = require('../index');
    user = new User({
        _id: '64c065ce79b3e4596e917e1f',
        name: 'Maarten',
        email: 'maarten@vives.be',
        isAdmin: true,
        password: '12345', 
      });
    await user.save();
  });

  after(async () => {
    await Order.deleteMany({});
    await Shirt.deleteMany({});
    await Categorie.deleteMany({});
    await User.deleteMany({});
    server.close();
  });

  beforeEach(async () => {
    const categorie1 = new Categorie({
      naam: 'Zomer',
      beschrijving: 'Zomer Collectie',
    });
    await categorie1.save();

    shirt1 = new Shirt({
      naam: 'Gele shirt',
      beschrijving: 'Gele shirt',
      prijs: 19.99,
      categorie: categorie1._id,
      maten: ['M'],
      kleuren: ['Geel'],
    });
    await shirt1.save();

    shirt2 = new Shirt({
      naam: 'Rode shirt',
      beschrijving: 'Rode shirt',
      prijs: 19.99,
      categorie: categorie1._id,
      maten: ['S'],
      kleuren: ['Rood'],
    });
    await shirt2.save();

    
    order = new Order({
      user: user._id,
      shirts: [
        { shirt: shirt1._id, quantity: 2 },
        { shirt: shirt2._id, quantity: 1 },
      ],
      totalPrice: 60,
    });
    await order.save();
  });

  it('should return all orders from db', async () => {
    const res = await request(server)
      .get('/api/orders')
      .set('x-auth-token', existingToken);

    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.equal(1);
    expect(res.body[0].shirts).to.be.an('array');
    expect(res.body[0].shirts.length).to.equal(2); 
    
    expect(res.body[0].shirts[0].shirt.beschrijving).to.equal('Gele shirt');

  });
});



  