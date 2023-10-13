import Anime from '../models/Anime.js';
import allGenres from '../utils/allGenres.js';
import NotFoundError from '../utils/errorClasses/NotFoundError.js';

const getAnimes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) - 1 || 0;
    const limit = parseInt(req.query.limit, 10) || 5;
    const search = req.query.search || '';
    let sort = req.query.sort || 'names.ru';
    let genres = req.query.genres || 'All';

    if (genres === 'All') {
      genres = [...allGenres];
    } else {
      genres = genres.split(',');
    }

    if (sort === 'names.ru') {
      sort = [sort];
    } else {
      sort = sort.split(',');
    }

    const sortBy = {};
    if (sort[1]) {
      const [sortParam, sortOrder] = sort;
      sortBy[sortParam] = sortOrder;
    } else {
      sortBy[sort[0]] = 'asc';
    }

    const animes = await Anime.find({
      'names.ru': {
        $regex: search,
        $options: 'i',
      },
    })
      .where('genres')
      .in([...genres])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const totalAnimes = await Anime.countDocuments({
      genres: { $in: [...genres] },
      'names.ru': {
        $regex: search,
        $options: 'i',
      },
    });

    res.send({
      list: animes,
      total: totalAnimes,
    });
  } catch (err) {
    next(err);
  }
};

const getAnime = async (req, res, next) => {
  try {
    const { animeId } = req.params;

    const foundAnime = await Anime.findById(animeId).orFail();
    res.send(foundAnime);
  } catch (err) {
    let customError = err;

    if (err.name === 'DocumentNotFoundError') {
      customError = new NotFoundError('Aниме с указанным _id не найден');
    }

    next(customError);
  }
};

export default {
  getAnimes,
  getAnime,
};
