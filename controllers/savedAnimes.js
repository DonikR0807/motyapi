const SavedAnime = require('../models/SavedAnime');
const ForbiddenError = require('../utils/errorClasses/ForbiddenError');
const InvalidDataError = require('../utils/errorClasses/InvalidDataError');
const NotFoundError = require('../utils/errorClasses/NotFoundError');

const getSavedAnimes = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const savedAnimes = await SavedAnime.find({ owner: _id });
    res.send(savedAnimes);
  } catch (err) {
    let customError = err;

    if (err.name === 'CastError') {
      customError = new InvalidDataError('Передан неправильный Id');
    }

    next(customError);
  }
};

const saveAnime = async (req, res, next) => {
  const { _id } = req.user;
  const { animeId, category } = req.body;

  try {
    const foundAnime = await SavedAnime.findOne({ animeId, owner: _id });
    if (!foundAnime) {
      const savedAnime = await SavedAnime.create({ ...req.body, owner: _id });
      res.send(savedAnime);
    } else if (foundAnime.category !== category) {
      foundAnime.category = category;
      await foundAnime.save();
      res.send(foundAnime);
    } else {
      res.send(foundAnime);
    }
  } catch (err) {
    let customError = err;

    if (err.name === 'ValidationError' || err.name === 'CastError') {
      customError = new InvalidDataError(
        'Переданы некорректные данные при сохранении аниме',
      );
    }

    next(customError);
  }
};

const deleteAnime = async (req, res, next) => {
  const { _id } = req.user;
  const { animeId } = req.params;

  try {
    const savedAnime = await SavedAnime.findById(animeId).orFail();
    if (savedAnime.owner.toString() === _id) {
      return savedAnime.deleteOne().then(() => {
        res.send({ message: 'Аниме удалено' });
      });
    }
    throw new ForbiddenError('Нельзя удалить чужое аниме');
  } catch (err) {
    let customError = err;
    if (err.name === 'CastError') {
      customError = new InvalidDataError(
        'Переданы некорректные данные для удаления аниме',
      );
    }

    if (err.name === 'DocumentNotFoundError') {
      customError = new NotFoundError('Аниме с указанным _id не найден');
    }

    return next(customError);
  }
};

module.exports = {
  getSavedAnimes,
  saveAnime,
  deleteAnime,
};
