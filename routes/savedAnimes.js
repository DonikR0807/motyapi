const router = require('express').Router();

const { celebrate } = require('celebrate');
const { saveAnime, deleteAnime, getSavedAnimes } = require('../controllers/savedAnimes');
const { saveAnimeValidator, deleteAnimeValidator } = require('../utils/validators');

router.get('/savedAnimes', getSavedAnimes);

router.post('/savedAnimes', celebrate(saveAnimeValidator), saveAnime);

router.delete('/savedAnimes/:animeId', celebrate(deleteAnimeValidator), deleteAnime);

module.exports = {
  savedAnimesRouter: router,
};
