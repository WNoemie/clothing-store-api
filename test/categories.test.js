const request = require('supertest');
const { expect } = require('chai');
const { Categorie } = require('../models/categorie');
const { Shirt } = require('../models/shirt');
const existingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGMwNjVjZTc5YjNlNDU5NmU5MTdlMWYiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2OTAzNjcwNzZ9.JBTKNtbrdztoyxmIEoJ_rtwEB5qrhdBKyIOAfnkZquc';

let server; 

describe('Categories Routes', () => {
  beforeEach(() => {server = require('../index');;
  });

  afterEach(async () => {
    await Shirt.deleteMany({});
    await Categorie.deleteMany({});
    server.close();
  });

  describe('GET /api/categories', () => {
    beforeEach(async () => {
      const categorie = new Categorie({
        naam: 'Winter',
        beschrijving: 'Winter Collectie',
      });
      await categorie.save();
    });

    it('should return all categories from db', async () => {
      const res = await request(server).get('/api/categories');

      expect(res.status).to.equal(200);
      expect(res.body[0].naam).to.equal('Winter'); 
      expect(res.body[0].beschrijving).to.equal('Winter Collectie');
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


  describe('POST /api/categories', () => {
    it('should create a new category if request is valid', async () => {
      const categorieData = {
        naam: 'Winter',
        beschrijving: 'Winter Collectie',
      };

      const res = await request(server)
        .post('/api/categories')
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken) 
        .send(categorieData);

      expect(res.status).to.equal(200);
      expect(res.body.naam).to.equal(categorieData.naam);
      
      const categorie = await Categorie.findOne({ naam: categorieData.naam });
      expect(categorie).to.exist;
      expect(categorie.naam).to.equal(categorieData.naam);
    });

    it('should return 400 if request is invalid', async () => {
      const res = await request(server)
        .post('/api/categories')
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken) 
        .send({});

      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /api/categories/:id', () => {
    it('should update a category if a valid id and request are given', async () => {
      const testCategorie = new Categorie({
        naam: 'Vakantie Collectie',
        beschrijving: 'Vakantie shirts',
      });
      await testCategorie.save();

      const updatedCategorieData = {
        naam: 'Vakantie2 Collectie',
        beschrijving: 'Vakantie2 shirts',
      };

      const res = await request(server)
        .put(`/api/categories/${testCategorie._id}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken) 
        .send(updatedCategorieData);

      expect(res.status).to.equal(200);
      expect(res.body.naam).to.equal(updatedCategorieData.naam);
    });

    it('should return 404 if an id is not valid', async () => {
      
      const testCategorie = new Categorie({
        naam: 'Herfst categorie',
        beschrijving: 'Leuke herfst!',
      });
      await testCategorie.save();

      const invalidData = { naam: 'Herfst2 Collectie' }; //zonder beschrijving = niet compleet

      const res = await request(server)
        .put(`/api/categories/${testCategorie._id}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken) 
        .send(invalidData);

      expect(res.status).to.equal(400);
    });
  });
  
  describe('DELETE /api/categories/:id', () => {
    it('should delete a category if a valid id is provided', async () => {

      const categorie = await new Categorie({
        naam: 'Herfst categorie',
        beschrijving: 'Leuke herfst!',
      }).save();

      const res = await request(server)
        .delete(`/api/categories/${categorie._id}`)
        .set('x-auth-token', existingToken); 

      expect(res.status).to.equal(200);

      const deletedCategorie = await Categorie.findById(categorie._id);
      expect(deletedCategorie).to.not.exist;
    });

    it('should return 404 if an invalid ID is provided', async () => {
      const res = await request(server)
        .delete('/api/categories/123456712345656565765432')
        .set('x-auth-token', existingToken);

      expect(res.status).to.equal(404);
    });
  });
  

});