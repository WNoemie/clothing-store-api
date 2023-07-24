const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();
const { Shirt, validateShirt } = require('../models/shirt');


router.get('/', async (req, res) => {
    try {
      const shirts = await Shirt.find();
      res.send(shirts);
    } catch (err) {
      res.status(500).send('Kan geen shirts ophalen');
    }
  });


router.get('/:id', async (req, res) => {
    try {
      const shirt = await Shirt.findById(req.params.id);
      if (!shirt) {
        return res.status(404).send('Shirt niet gevonden.');
      }
      res.send(shirt);
    } catch (err) {
      res.status(500).send('Kan shirt niet ophalen.');
    }
  });
  

router.post('/', auth, async (req, res) => {
  const { error } = validateShirt(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const shirt = new Shirt({
    naam: req.body.naam,
    beschrijving: req.body.beschrijving,
    prijs: req.body.prijs,
    categorie: req.body.categorie,
    maten: req.body.maten,
    kleuren: req.body.kleuren,
  });

  try {
    await shirt.save();
    res.send(shirt);
  } catch (err) {
    res.status(500).send('Kan geen shirt aanmaken.');
  }
});


router.put('/:id',auth,  async (req, res) => {
  const { error } = validateShirt(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const shirt = await Shirt.findByIdAndUpdate(
      req.params.id,
      {
        naam: req.body.naam,
        beschrijving: req.body.beschrijving,
        prijs: req.body.prijs,
        categorie: req.body.categorie,
        maten: req.body.maten,
        kleuren: req.body.kleuren,
      },
      { new: true } 
    );

    if (!shirt) {
      return res.status(404).send('Shirt niet gevonden.');
    }

    res.send(shirt);
  } catch (err) {
    res.status(500).send('Kan shirt niet updaten.');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const shirt = await Shirt.findByIdAndRemove(req.params.id);
    if (!shirt) {
      return res.status(404).send('Shirt niet geconden.');
    }
    res.send(shirt);
  } catch (err) {
    res.status(500).send('Kan shirt niet deleten.');
  }
});


module.exports = router;
