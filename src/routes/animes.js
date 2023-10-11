import express from 'express';
import { celebrate } from 'celebrate';
import animesController from '../controllers/anime.js';
import validators from '../utils/validators.js';

const { getAnimes, getAnime } = animesController;
const { getAnimeValidator } = validators;

const router = express.Router();

router.get('/animes/:animeId', celebrate(getAnimeValidator), getAnime);

router.get('/animes', getAnimes);

export default router;
