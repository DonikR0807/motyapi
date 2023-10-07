import express from 'express';
import animesController from '../controllers/anime.js';

const { getAnimes } = animesController

const router = express.Router();

router.get('/animes', getAnimes);

export default router;
