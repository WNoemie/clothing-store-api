const express = require('express');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { Categorie, validateCategorie } = require('../models/categorie');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
      const categories = await Categorie.find();
      res.send(categories);
    } catch (error) {
      res.status(500).send('Error bij het ophalen.');
    }
  });


  router.get('/:id', async (req, res) => {
    try {
      const categorie = await Categorie.findById(req.params.id);
      if (!categorie) return res.status(404).send('Categorie niet gevonden.');
      res.send(categorie);
    } catch (error) {
      res.status(500).send('Error bij het ophalen.');
    }
  });

  router.post('/', auth, async (req, res) => {
    try {
      const { error } = validateCategorie(req.body);
      if (error) return res.status(400).send(error.details[0].message);
  
      let categorie = new Categorie({
        naam: req.body.naam,
        beschrijving: req.body.beschrijving,
      });
  
      categorie = await categorie.save();
      res.send(categorie);
    } catch (error) {
      res.status(500).send('Error bij het ophalen.');
    }
  });


  router.put('/:id', auth,  async (req, res) => {
    try {
      const { error } = validateCategorie(req.body);
      if (error) return res.status(400).send(error.details[0].message);
  
      const categorie = await Categorie.findByIdAndUpdate(
        req.params.id,
        {
          naam: req.body.naam,
          beschrijving: req.body.beschrijving,
        },
        { new: true }
      );
  
      if (!categorie) return res.status(404).send('Categorie niet gevonden.');
      res.send(categorie);
    } catch (error) {
      res.status(500).send('Error bij het ophalen.');
    }
  });


  router.delete('/:id', [auth, admin], async (req, res) => {
    try {
      const categorie = await Categorie.findByIdAndRemove(req.params.id);
      if (!categorie) return res.status(404).send('Categorie niet gevonden.');
      res.send(categorie);
    } catch (error) {
      res.status(500).send('Error bij het ophalen.');
    }
  });

module.exports = router;
