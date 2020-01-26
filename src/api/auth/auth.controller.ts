import { Context } from 'koa';
import Joi from '@hapi/joi';
import User from '../../models/User';
import generateResponse from '../../lib/generateResponse';
import { Op } from 'sequelize';

export const register = async (ctx: Context) => {
  // Validate Request Body
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
    username: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = generateResponse(false, result.error.details, null);
    return;
  }

  // Check Email is Exists
  let existingUser;
  const { email, username } = ctx.request.body;

  try {
    existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });
  } catch (e) {
    ctx.throw(500, e);
  }

  if (existingUser) {
    ctx.status = 409;
    ctx.body = generateResponse(
      false,
      `User already exists (${
        existingUser.email === email ? 'email' : 'username'
      } conflict)`,
      null,
    );
    return;
  }

  // Create New User
  let user;

  try {
    user = await User.create(ctx.request.body);
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = generateResponse(true, null, user);
};

export const login = async (ctx: Context) => {
  // Validate Request Body
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = generateResponse(false, result.error.details, null);
    return;
  }

  // Check Account Is Exists And Validate Password
  const { email, password } = ctx.request.body;

  let user;

  try {
    user = await User.findOne({ where: { email } });
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!user || !user.validatePassword(password)) {
    ctx.status = 403;
    ctx.body = generateResponse(false, 'Invalid User Info', null);
    return;
  }

  // Generate Token and Set Cookies
  let token: string;

  try {
    token = await user.generateToken();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.cookies.set('access_token', token, {
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  });
  ctx.body = generateResponse(true, null, {
    id: user.id,
    email: user.email,
    username: user.username,
    money: user.money,
  });
};

export const logout = async (ctx: Context) => {
  ctx.cookies.set('access_token', '', {
    maxAge: 0,
    httpOnly: true,
  });
  ctx.status = 204;
  ctx.body = generateResponse(true, null, null);
};

// export const getBookList = async (ctx: Context) => {
//   let book;

//   try {
//     book = await Book.findAll();
//   } catch (e) {
//     console.warn(e);
//   }

//   ctx.body = book;
// };

// export const saveBookInfo = async (ctx: Context) => {
//   const schema = Joi.object({
//     name: Joi.string().required(),
//     author: Joi.string().required(),
//     price: Joi.number()
//       .integer()
//       .required(),
//     page: Joi.number()
//       .integer()
//       .required(),
//   });

//   const result = schema.validate(ctx.request.body);

//   if (result.error) {
//     ctx.status = 400;
//     return;
//   }

//   let book;

//   try {
//     book = await Book.create(ctx.request.body);
//   } catch (e) {
//     ctx.throw(500, e);
//   }

//   ctx.body = book;
// };
