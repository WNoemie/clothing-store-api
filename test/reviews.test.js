const request = require('supertest');
const { expect } = require('chai');
const mongoose = require('mongoose');
const { Review } = require('../models/review');
const { Categorie } = require('../models/categorie');
const { User } = require('../models/user');
const { Shirt } = require('../models/shirt');
const existingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGMwNjVjZTc5YjNlNDU5NmU5MTdlMWYiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2OTAzNjcwNzZ9.JBTKNtbrdztoyxmIEoJ_rtwEB5qrhdBKyIOAfnkZquc';

let server;
let user;
let shirt;
let review;


describe('Review Routes', () => {
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

    const categorie = new Categorie({ naam: 'Zomer', beschrijving: 'Zomer Collectie' });
    await categorie.save();

    shirt = new Shirt({
      naam: 'Groene Shirt',
      beschrijving: 'Groene shirt',
      prijs: 29.99,
      categorie: categorie._id, 
      maten: ['M', 'L'],
      kleuren: ['Groen'],
    });
    await shirt.save();
  });

  after(async () => {
    await Review.deleteMany({});
    await User.deleteMany({});
    await Shirt.deleteMany({});
    await Categorie.deleteMany({});
    server.close();
  });

  describe('GET /api/reviews', () => {
    it('should return all reviews from db', async () => {
      const res = await request(server).get('/api/reviews');

      expect(res.status).to.equal(200);
    });
  });

  describe('GET /api/reviews/:id', () => {
    it('should return a review with id', async () => {
      review = new Review({
        user: user._id,
        shirt: shirt._id,
        rating: 5,
        comment: 'Heel mooi!',
      });
      await review.save();

      const res = await request(server).get(`/api/reviews/${review._id}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('rating', 5);
    });

    it('should return 404 if the review is not found', async () => {
      const invalidId = '123456789012456766655467';

      const res = await request(server).get(`/api/reviews/${invalidId}`);

      expect(res.status).to.equal(404);
      expect(res.text).to.equal('Review niet gevonden.');
    });
  });

  describe('POST /api/reviews', () => {
    it('should create a new review for the authenticated user', async () => {
      const reviewData = {
        shirt: shirt._id.toString(),
        rating: 4,
        comment: 'Leuke shirt',
      };

      const res = await request(server)
        .post('/api/reviews')
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken)
        .send(reviewData);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('rating', 4);

      const savedReview = await Review.findById(res.body._id);
      expect(savedReview).to.exist;
    });

    it('should return 400 if the review data is not valid', async () => {
      const invalidReviewData = {};

      const res = await request(server)
        .post('/api/reviews')
        .set('x-auth-token', existingToken)
        .send(invalidReviewData);

      expect(res.status).to.equal(400);
    });
  });

  //PUT geeft een error weer..

  describe('PUT /api/reviews/:id', () => {
    it('should update a review for the authenticated user', async () => {
      const review2 = new Review({
        user: user._id,
        shirt: shirt._id,
        rating: 5,
        comment: 'Heel mooi!',
      });
      await review2.save();
  
      const updatedReviewData = {
        shirt: shirt._id.toString(),
        rating: 2,
        comment: 'Niet zo goed.',
      };

      const res = await request(server)
        .put(`/api/reviews/${review2._id}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingTokenoken) 
        .send(updatedReviewData);
  
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('rating', 2);
    });
  });

  describe('DELETE /api/reviews/:id', () => {
    it('should delete a review for the authenticated user', async () => {
      review = new Review({
        user: user._id,
        shirt: shirt._id,
        rating: 5,
        comment: 'Heel leuk!',
      });
      await review.save();

      const res = await request(server)
        .delete(`/api/reviews/${review._id}`)
        .set('x-auth-token', existingToken);

      expect(res.status).to.equal(200);
    });

    it('should return 404 if the review is not found', async () => {
      const invalidId = '123456789012123456781234';

      const res = await request(server)
        .delete(`/api/reviews/${invalidId}`)
        .set('x-auth-token', existingToken);

      expect(res.status).to.equal(404);
      expect(res.text).to.equal('Review niet gevonden.');
    });
  });
});
