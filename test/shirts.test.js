const request = require('supertest');
const { Categorie } = require('../models/categorie');
const mongoose = require('mongoose');
const { expect } = require('chai');
const { Shirt } = require('../models/shirt'); 
const existingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGMwNjVjZTc5YjNlNDU5NmU5MTdlMWYiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2OTAzNjcwNzZ9.JBTKNtbrdztoyxmIEoJ_rtwEB5qrhdBKyIOAfnkZquc';

let server;

describe('Shirt Routes', () => {
  beforeEach(() => {server = require('../index');
  });

  afterEach(async () => {
    await Shirt.deleteMany({});
  await Categorie.deleteMany({});
    server.close();
  });

  describe('GET /api/shirts', () => {
    it('should return all shirts from the db', async () => {
      const categorie = new Categorie({ naam: 'T-Shirts', beschrijving: 'T-Shirts Collection' });
      await categorie.save();
  
      await Shirt.insertMany([
        {
          naam: 'Shirt A',
          beschrijving: 'Shirt A Description',
          prijs: 19.99,
          categorie: categorie._id, 
          maten: ['M'],
          kleuren: ['Red'],
        },
        {
          naam: 'Shirt B',
          beschrijving: 'Shirt B Description',
          prijs: 24.99,
          categorie: categorie._id, 
          maten: ['L'],
          kleuren: ['Blue', 'White'],
        },
      ]);
  
      const res = await request(server).get('/api/shirts');
  
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0].naam).to.equal('Shirt A');
      expect(res.body[1].naam).to.equal('Shirt B');
    });
  });
  

  describe('GET /api/shirts/:id', () => {
    it('should return a single shirt by ID if it exists', async () => {
      const categorieShirt = await new Categorie({ naam: 'T-Shirts', beschrijving: 'T-Shirts Collection' }).save();
      const shirt = await new Shirt({
        naam: 'Test Shirt',
        beschrijving: 'Test Shirt Description',
        prijs: 19.99,
        categorie: categorieShirt._id, // Use the correct variable name here (categorieShirt)
        maten: ['XL'],
        kleuren: ['Red'],
      }).save();
  
      const res = await request(server).get(`/api/shirts/${shirt._id}`);
  
      expect(res.status).to.equal(200);
      expect(res.body.naam).to.equal('Test Shirt');
      expect(res.body.beschrijving).to.equal('Test Shirt Description');
      expect(res.body.maten).to.deep.equal(['XL']);
      expect(res.body.kleuren).to.deep.equal(['Red']);
    });
  
    it('should return 404 if a shirt with an invalid id is requested', async () => {
      const categorieInvalid = await new Categorie({ naam: 'Nieuwe Collectie', beschrijving: 'Nieuwe collectie najaar' }).save();
      const validShirtId = categorieInvalid._id;
      const invalidShirtId = new mongoose.Types.ObjectId(); 
  
      const res = await request(server).get(`/api/shirts/${invalidShirtId}`);
  
      expect(res.status).to.equal(404);
    });
  });
});

