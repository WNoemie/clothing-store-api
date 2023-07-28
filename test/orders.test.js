const request = require('supertest');
const { expect } = require('chai');
const { Categorie } = require('../models/categorie');
const { Shirt } = require('../models/shirt');
const { User } = require('../models/user');
const { Order } = require('../models/order');
const existingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGMwNjVjZTc5YjNlNDU5NmU5MTdlMWYiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2OTAzNjcwNzZ9.JBTKNtbrdztoyxmIEoJ_rtwEB5qrhdBKyIOAfnkZquc';

let server;
let user;
let shirt1;
let shirt2;
let order;

describe('Orders Routes', () => {
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

  describe('GET /api/orders', () => {
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

 describe('GET /api/orders/:id', () => {
    it('should return a order with id for the authenticated user', async () => {
      const res = await request(server)
        .get(`/api/orders/${order._id}`)
        .set('x-auth-token', existingToken);

      expect(res.status).to.equal(200);
      expect(res.body.shirts).to.be.an('array');
      expect(res.body.shirts.length).to.equal(2);
      
    });

    it('should return 404 if the order is not found', async () => {
      const invalidId = '123456152345676543212345'; 

      const res = await request(server)
        .get(`/api/orders/${invalidId}`)
        .set('x-auth-token', existingToken);

      expect(res.status).to.equal(404);
      expect(res.text).to.equal('Order niet gevonden.');
      
    });
  });

  describe('POST /api/orders', () => {
    it('should create a new order for the aauthenticated user', async () => {
        const orderData = {
            user: user._id.toString(),
            shirts: [
              { shirt: shirt1._id.toString(), quantity: 2 },
              { shirt: shirt2._id.toString(), quantity: 1 },
            ],
            totalPrice: 60,
          };
  
      const res = await request(server)
        .post('/api/orders')
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken)
        .send(orderData);
  
      expect(res.status).to.equal(200);
      expect(res.body.totalPrice).to.equal(60);
  
      const savedOrder = await Order.findById(res.body._id);
      expect(savedOrder).to.exist;

    });
  
    it('should return 400 if the order data is not valid', async () => {
      const invalidOrderData = {};
  
      const res = await request(server)
        .post('/api/orders')
        .set('x-auth-token', existingToken)
        .send(invalidOrderData);
  
      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /api/orders/:id', () => {
    it('should update an order for the authenticated user', async () => {
      const updatedOrderData = {
        user: user._id.toString(),
        shirts: [
          { shirt: shirt1._id.toString(), quantity: 3 },
          { shirt: shirt2._id.toString(), quantity: 2 },
        ],
        totalPrice: 100,
      };
  
      const res = await request(server)
        .put(`/api/orders/${order._id}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken)
        .send(updatedOrderData);
  
      expect(res.status).to.equal(200);
      expect(res.body.totalPrice).to.equal(100);
  
    });
  
    it('should return 404 if the order is not found', async () => {
      const invalidId = '123456152345676543212345';
  
      const res = await request(server)
        .put(`/api/orders/${invalidId}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken)
        .send({});
  
      expect(res.status).to.equal(404);
      expect(res.text).to.equal('Order niet gevonden.');
    });
  });

  describe('DELETE /api/orders/:id', () => {
    it('should delete an order for the authenticated user', async () => {
      const res = await request(server)
        .delete(`/api/orders/${order._id}`)
        .set('x-auth-token', existingToken);
  
      expect(res.status).to.equal(200);
      expect(res.body._id).to.equal(order._id.toString());
  
      const deletedOrder = await Order.findById(order._id);
      expect(deletedOrder).to.be.null;
    });
  
    it('should return 404 if the order is not found', async () => {
      const invalidId = '123456152345676543212345';
  
      const res = await request(server)
        .delete(`/api/orders/${invalidId}`)
        .set('x-auth-token', existingToken);
  
      expect(res.status).to.equal(404);
      expect(res.text).to.equal('Order niet gevonden.');
    });
  });
  
  
  
  
});
