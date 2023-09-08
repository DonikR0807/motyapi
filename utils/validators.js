const { Joi } = require('celebrate');
const urlExpression = require('./urlExpression');

const linkValidator = (value, helpers) => {
  if (!urlExpression.test(value)) {
    return helpers.error('incorrect avatar');
  }
  return value;
};

const loginValidator = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const registerValidator = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
};

const updateProfileValidator = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
};

const saveMovieValidator = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(linkValidator),
    trailerLink: Joi.string().required().custom(linkValidator),
    thumbnail: Joi.string().required().custom(linkValidator),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
};

const deleteMovieValidator = {
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
};

module.exports = {
  loginValidator,
  registerValidator,
  updateProfileValidator,
  saveMovieValidator,
  deleteMovieValidator,
};
