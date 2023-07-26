
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

  describe('GET /api/categories/:id', () => {
    it('should return a category/id', async () => {
      const category = await new Categorie({
        naam: 'Winter',
        beschrijving: 'Winter Collectie',
      }).save();

      const res = await request(server).get(`/api/categories/${category._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.naam).to.equal('Winter');
      expect(res.body.beschrijving).to.equal('Winter Collectie');
    });

    it('should return 404 if an id is not valid', async () => {
        const invalidId = '123456789123456781234567';
        const response = await request(server).get(`/api/categories/${invalidId}`);
        expect(response.status).to.equal(404);
      });
  });

  

});