const express = require('express');
const router = express.Router();
const Movie = require('../../models/Movie');

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().limit(20); 
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
});
// GET chi tiết phim theo ID
router.get('/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET phim tương tự (cùng thể loại)
router.get('/:movieId/similar', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    const similar = await Movie.find({
      genres: { $in: movie.genres },
      _id: { $ne: movie._id },
    }).limit(6);
    res.json(similar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;