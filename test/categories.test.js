
const request = require('supertest');
const { expect } = require('chai');
const { Categorie } = require('../models/categorie');

let server; 

describe('Categories Routes', () => {
  beforeEach(() => {server = require('../index');;
  });

  afterEach(async () => {
    await Categorie.deleteMany({});
    server.close();
  });

  describe('GET /api/categories', () => {
    it('should return all categories from db', async () => {
      await Categorie.insertMany([
        { naam: 'Winter', beschrijving: 'Winter Collecite' },
        { naam: 'Zomer', beschrijving: 'Zomer Collectie' },
      ]);
      const res = await request(server).get('/api/categories');
      expect(res.status).to.equal(200);
      expect(res.body[0].naam).to.equal('Winter');
      expect(res.body[1].naam).to.equal('Zomer');
    });
  });

  

});