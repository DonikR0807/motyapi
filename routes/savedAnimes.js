const router = require('express').Router();

const { saveAnime, deleteAnime, getSavedAnimes } = require('../controllers/savedAnimes');

router.get('/savedAnimes', getSavedAnimes);

router.post('/savedAnimes', saveAnime);

router.delete('/savedAnimes/:animeId', deleteAnime);

module.exports = {
  savedAnimeRouter: router,
};
