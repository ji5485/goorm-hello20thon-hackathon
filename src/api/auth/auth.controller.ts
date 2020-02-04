import Joi from '@hapi/joi';
import User from '../../models/User';
import { generateResponse } from '../../lib/utils';
import { Op } from 'sequelize';

export const register = async (ctx: any) => {
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
    ctx.redirect('/');
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
      `This ${
        existingUser.email === email ? 'email' : 'username'
      } already exists.`,
      null,
    );
    ctx.redirect('/');
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
  await ctx.render('login', { path: '../../', email });
};

export const login = async (ctx: any) => {
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
    ctx.redirect('/login');
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
    ctx.body = generateResponse(false, 'Email or password is invalid.', null);
    ctx.redirect('/login');
    return;
  }

  // Generate Token and Set Cookies
  let token: string;

  try {
    token = await user.generateToken();

    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }

  await ctx.render('secondMain', {
    path: '../../',
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      money: user.money,
    },
  });
};

export const logout = async (ctx: any) => {
  ctx.cookies.set('access_token', '', {
    maxAge: 0,
    httpOnly: true,
  });
  ctx.status = 204;
  ctx.redirect('/');
};
