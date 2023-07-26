
const request = require('supertest');
const { expect } = require('chai');
const { Categorie } = require('../models/categorie');
const existingToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGMwNjVjZTc5YjNlNDU5NmU5MTdlMWYiLCJpc0FkbWluIjp0cnVlLCJpYXQiOjE2OTAzNjcwNzZ9.JBTKNtbrdztoyxmIEoJ_rtwEB5qrhdBKyIOAfnkZquc';

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


  describe('POST /api/categories', () => {
    it('should create a new category if request is valid', async () => {
      const categoryData = {
        naam: 'Winter',
        beschrijving: 'Winter Collectie',
      };

      const res = await request(server)
        .post('/api/categories')
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken) 
        .send(categoryData);

      expect(res.status).to.equal(200);
      expect(res.body.naam).to.equal(categoryData.naam);
      expect(res.body.beschrijving).to.equal(categoryData.beschrijving);

      const category = await Categorie.findOne({ naam: categoryData.naam });
      expect(category).to.exist;
      expect(category.naam).to.equal(categoryData.naam);
      expect(category.beschrijving).to.equal(categoryData.beschrijving);
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
      const testCategory = new Categorie({
        naam: 'Test Category',
        beschrijving: 'Test Description',
      });
      await testCategory.save();

      const updatedCategoryData = {
        naam: 'Updated Category',
        beschrijving: 'Updated Description',
      };

      const res = await request(server)
        .put(`/api/categories/${testCategory._id}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken) 
        .send(updatedCategoryData);

      expect(res.status).to.equal(200);
      expect(res.body.naam).to.equal(updatedCategoryData.naam);
      expect(res.body.beschrijving).to.equal(updatedCategoryData.beschrijving);

      const updatedCategory = await Categorie.findById(testCategory._id);
      expect(updatedCategory).to.exist;
      expect(updatedCategory.naam).to.equal(updatedCategoryData.naam);
      expect(updatedCategory.beschrijving).to.equal(updatedCategoryData.beschrijving);
    });

    it('should return 404 if an invalid od is provided', async () => {
      const invalidId = '123456789123456789123456'; 

      const updatedCategoryData = {
        naam: 'Updated Category',
        beschrijving: 'Updated Description',
      };

      const res = await request(server)
        .put(`/api/categories/${invalidId}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken) 
        .send(updatedCategoryData);

      expect(res.status).to.equal(404);
    });

    it('should return 404 if an id is not valid', async () => {
      // Create a test category
      const testCategory = new Categorie({
        naam: 'Test Category',
        beschrijving: 'Test Description',
      });
      await testCategory.save();

      const invalidData = { naam: 'Updated Category' }; //zonder beschrijving = niet compleet

      const res = await request(server)
        .put(`/api/categories/${testCategory._id}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken) 
        .send(invalidData);

      expect(res.status).to.equal(400);
    });
  });
  

  

});