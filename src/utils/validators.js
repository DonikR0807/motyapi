import { Joi } from 'celebrate';
import urlExpression from './urlExpression.js';
import passwordExpression from './passwordExpression.js';

const linkValidator = (value, helpers) => {
  if (!urlExpression.test(value)) {
    return helpers.error('incorrect avatar');
  }
  return value;
};

const categoryValidator = (value, helpers) => {
  if (value !== 'watched' && value !== 'planned') {
    return helpers.error('incorrect category');
  }
  return value;
};

const passwordValidator = (value, helpers) => {
  if (!passwordExpression.test(value)) {
    return helpers.error('incorrect password');
  }
  return value;
};

const loginValidator = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(passwordValidator),
  }),
};

const registerValidator = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(passwordValidator),
    userName: Joi.string().required().min(2).max(30),
  }),
};

const updateProfileValidator = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    userName: Joi.string().required().min(2).max(30),
  }),
};

const getCommentsValidator = {
  params: Joi.object().keys({
    animeId: Joi.string().required().hex().length(24),
  }),
};

const createCommentValidator = {
  body: Joi.object().keys({
    createdAt: Joi.date().required(),
    text: Joi.string().required(),
    animeId: Joi.string().required().hex().length(24),
  }),
};

const saveAnimeValidator = {
  body: Joi.object().keys({
    animeId: Joi.string().required().hex().length(24),
    category: Joi.string().required().custom(categoryValidator),
    genres: Joi.array().required().items(Joi.string().required()),
    status: Joi.object().required().keys({
      string: Joi.string().required(),
    }),
    names: Joi.object().required().keys({
      ru: Joi.string().required(),
    }),
    image: Joi.string().required().custom(linkValidator),
  }),
};

const deleteAnimeValidator = {
  params: Joi.object().keys({
    animeId: Joi.string().required().hex().length(24),
  }),
};

const getAnimeValidator = {
  params: Joi.object().keys({
    animeId: Joi.string().required().hex().length(24),
  }),
};

export default {
  loginValidator,
  registerValidator,
  updateProfileValidator,
  getCommentsValidator,
  createCommentValidator,
  saveAnimeValidator,
  deleteAnimeValidator,
  getAnimeValidator,
};
