import Anime from '../models/Anime.js';

const getAnimes = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || '';
    let sort = req.query.sort || 'names.ru';
    let genre = req.query.genre || 'All';

    if (genre === 'All') {
      genre = [...genre];
    } else {
      genre = genre.split(',');
    }

    if (sort === 'names.ru') {
      sort = [sort];
    } else {
      sort = sort.split(',');
    }
    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = 'asc';
    }

    const animes = await Anime.find({
      'names.ru': {
        $regex: search,
        $options: 'i',
      },
    })
      .where('genre')
      .in([...genre])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit);

    const totalAnimes = await Anime.countDocuments({
      genre: { $in: [...genre] },
      'names.ru': {
        $regex: search,
        $options: 'i',
      },
    });

    res.send({
      list: animes,
      total: totalAnimes
    })
  } catch (err) {
    next(err);
  }
};

export default {
  getAnimes,
};
