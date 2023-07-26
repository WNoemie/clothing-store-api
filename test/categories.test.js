
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

  

});