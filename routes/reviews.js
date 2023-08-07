const express = require('express');
const router = express.Router();
const { Review, validateReview } = require('../models/review');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.send(reviews);
  } catch (error) {
    res.status(500).send('Error bij het ophalen van reviews.');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).send('Review niet gevonden.');
    res.send(review);
  } catch (error) {
    res.status(500).send('Error bij het ophalen van the review.');
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { error } = validateReview(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { shirt, rating, comment } = req.body;
    const review = new Review({
      user: req.user._id, 
      shirt: shirt,
      rating: rating,
      comment: comment,
    });
    await review.save();
    res.send(review);
  } catch (error) {
    res.status(500).send('Error bij het plaatsen van the review.');
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const { error } = validateReview(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { shirt, rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).send('Review niet gevonden.');

    if (review.user.toString() !== req.user.id) {
      return res.status(403).send('Unauthorized to update this review.');
    }

    review.shirt = shirt;
    review.rating = rating;
    review.comment = comment;
    const updatedReview = await review.save();

    res.send(updatedReview);
  } catch (error) {
    res.status(500).send('Error bij het updaten van the review.');
  }
});


// router.put('/:id', auth, async (req, res) => {
//   try {
//     const { error } = validateReview(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const { shirt, rating, comment } = req.body;
//     const review = await Review.findByIdAndUpdate(
//       req.params.id,
//       {
//         shirt: shirt,
//         rating: rating,
//         comment: comment,
//       },
//       { new: true }
//     );

//     if (!review) return res.status(404).send('Review niet gevonden.');
//     res.send(review);
//   } catch (error) {
//     res.status(500).send('Error bij het updaten van the review.');
//   }
// });

router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndRemove(req.params.id);
    if (!review) return res.status(404).send('Review niet gevonden.');
    res.send(review);
  } catch (error) {
    res.status(500).send('Error bij het deleten van the review.');
  }
});

module.exports = router;
