import express from 'express';

import { celebrate } from 'celebrate';
import savedAnimesController from '../controllers/savedAnimes.js';
import validators from '../utils/validators.js';

const router = express.Router();

router.get('/savedAnimes', savedAnimesController.getSavedAnimes);

router.post('/savedAnimes', celebrate(validators.saveAnimeValidator), savedAnimesController.saveAnime);

router.delete('/savedAnimes/:animeId', celebrate(validators.deleteAnimeValidator), savedAnimesController.deleteAnime);

export default router;
