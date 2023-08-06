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
      const categorie = new Categorie({ naam: 'T-Shirts', beschrijving: 'T-Shirts Collectie' });
      await categorie.save();
  
      await Shirt.insertMany([
        {
          naam: 'Shirt A',
          beschrijving: 'Shirt A beschrijving',
          prijs: 19.99,
          categorie: categorie._id, 
          maten: ['M'],
          kleuren: ['Rood'],
        },
        {
          naam: 'Shirt B',
          beschrijving: 'Shirt B beschrijving',
          prijs: 24.99,
          categorie: categorie._id, 
          maten: ['L'],
          kleuren: ['Blauw', 'Wit'],
        },
      ]);
  
      const res = await request(server).get('/api/shirts');
  
      expect(res.status).to.equal(200);
      expect(res.body[0].naam).to.equal('Shirt A');
    });
  });
  

  describe('GET /api/shirts/:id', () => {
    it('should return a single shirt by id if it exists', async () => {
      const categorieShirt = await new Categorie({ naam: 'Zomers', beschrijving: 'Zomer Collectie' }).save();
      const shirt = await new Shirt({
        naam: 'Gele shirt',
        beschrijving: 'Gele shirt beschr.',
        prijs: 19.99,
        categorie: categorieShirt._id,
        maten: ['XL'],
        kleuren: ['Geel'],
      }).save();
  
      const res = await request(server).get(`/api/shirts/${shirt._id}`);
  
      expect(res.status).to.equal(200);
      expect(res.body.naam).to.equal('Gele shirt');

    });
  
    it('should return 404 if a shirt with an invalid id is requested', async () => {
      
      const invalidShirtId = "123456765432123456789876"; 
  
      const res = await request(server).get(`/api/shirts/${invalidShirtId}`);
  
      expect(res.status).to.equal(404);
    });
  });


  describe('POST /api/shirts', () => {
    it('should create a new shirt if request is valid', async () => {
        const categorie = await new Categorie({
            naam: 'Sport',
            beschrijving: 'Sport Collectie',
          }).save();
      
        const shirtData = {
        naam: 'Basketbal shirt',
        beschrijving: 'Basketbal USA shirt',
        prijs: 19.99,
        categorie: categorie._id, 
        maten: ['M'],
        kleuren: ['Rood'],
      };

      const res = await request(server)
        .post('/api/shirts')
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken)
        .send(shirtData);

      expect(res.status).to.equal(200);
    });

    it('should return 400 if request is invalid', async () => {
      const res = await request(server)
        .post('/api/shirts')
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken)
        .send({});

      expect(res.status).to.equal(400);
    });
  });

  describe('PUT /api/shirts/:id', () => {
    it('should update a shirt if a valid id and request are given', async () => {
        const categorie = await new Categorie({
            naam: 'Sport',
            beschrijving: 'Sport Collectie',
          }).save();
      
        const testShirt = new Shirt({
        naam: 'Basketbal shirt',
        beschrijving: 'Basktebal USA shirt',
        prijs: 19.99,
        categorie: categorie._id, 
        maten: ['M'],
        kleuren: ['Rood'],
      });
      await testShirt.save();

      const updatedShirtData = {
        naam: 'Basketbal shirt',
        beschrijving: 'Basketbal EU shirt',
        prijs: 49.99,
        categorie: categorie._id, 
        maten: ['M'],
        kleuren: ['Rood'],
      };

      const res = await request(server)
        .put(`/api/shirts/${testShirt._id}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken)
        .send(updatedShirtData);

      expect(res.status).to.equal(200);

      const updatedShirt = await Shirt.findById(testShirt._id);
      expect(updatedShirt).to.exist;
    });

    it('should return 404 if an invalid ID is provided', async () => {
      const invalidId = '123456789012345678901234';
      const categorie = await new Categorie({
        naam: 'Sport',
        beschrijving: 'Sport Collectie',
      }).save();

      const updatedShirtData = {
        naam: 'Basketbak shirt',
        beschrijving: 'Basketbal USA shirt',
        prijs: 19.99,
        categorie: categorie._id, 
        maten: ['M'],
        kleuren: ['Rood'],
      };

      const res = await request(server)
        .put(`/api/shirts/${invalidId}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken)
        .send(updatedShirtData);

      expect(res.status).to.equal(404);
    });

    it('should return 400 if request is invalid', async () => {
        const categorie = await new Categorie({
            naam: 'Sport',
            beschrijving: 'Sport Collectie',
          }).save();
      
        const testShirt = new Shirt({
        naam: 'Basketbal shirt',
        beschrijving: 'Basketbal USA shirt',
        prijs: 19.99,
        categorie: categorie._id, 
        maten: ['M'],
        kleuren: ['Rood'],
      });
      await testShirt.save();

      const invalidData = { name: 'Basketbal2 shirt' }; 

      const res = await request(server)
        .put(`/api/shirts/${testShirt._id}`)
        .set('Content-type', 'application/json')
        .set('x-auth-token', existingToken)
        .send(invalidData);

      expect(res.status).to.equal(400);
    });
  });

  describe('DELETE /api/shirts/:id', () => {
    it('should delete a shirt if a valid id is given', async () => {
      const categorie = await new Categorie({
        naam: 'Sport',
        beschrijving: 'Sport Collectie',
      }).save();
  
      const shirt = await new Shirt({
        naam: 'Basketbal shirt',
        beschrijving: 'Basketbal USA shirt',
        prijs: 19.99,
        categorie: categorie._id,
        maten: ['M'],
        kleuren: ['Rood'],
      }).save();
  
      const res = await request(server)
        .delete(`/api/shirts/${shirt._id}`)
        .set('x-auth-token', existingToken);
  
      expect(res.status).to.equal(200);
  
      const deletedShirt = await Shirt.findById(shirt._id);
      expect(deletedShirt).to.not.exist;
    });
  
    it('should return 404 if an invalid ID is given', async () => {
      const invalidId = '123456123456356545627654'; 
  
      const res = await request(server)
        .delete(`/api/shirts/${invalidId}`)
        .set('x-auth-token', existingToken);
  
      expect(res.status).to.equal(404);
    });
  });
});

