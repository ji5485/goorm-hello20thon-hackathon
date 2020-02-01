import Joi from '@hapi/joi';
import { generateResponse } from '../../lib/utils';
import Challenge from '../../models/Challenge';
import ChallengeGroup from '../../models/ChallengeGroup';
import Category from '../../models/Category';
import { Op } from 'sequelize';
import { sequelize } from '../../sequelize';

export const getChallengeList = async (ctx: any) => {
  const { user } = ctx.request;

  // Get Challenge List
  let challenges;

  try {
    challenges = await user.$get('challenges');
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = generateResponse(true, null, challenges);
};

export const createChallenge = async (ctx: any) => {
  const { user } = ctx.request;

  // Validate Request Form
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    goal: Joi.string().required(),
    category: Joi.array().required(),
    start_date: Joi.date().required(),
    price: Joi.number().required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = generateResponse(false, result.error.details, null);
    return;
  }

  // Create New Challenge
  const { category, ...payload } = ctx.request.body;

  let categories: Array<Category> = await Promise.all(
    category.map(async (id: number) => await Category.findByPk(id)),
  );

  let challenge;
  // Use transaction Because of Accessing to Two or More Tables
  const transaction = await sequelize.transaction();

  try {
    challenge = await Challenge.create(payload, { transaction });
    await challenge.$set('category', categories, { transaction });
    await challenge.$set('user', ctx.request.user, { transaction });

    // Create Challenge Group If The Corresponding Challenge Group Does Not Exists
    const challengeGroup = await ChallengeGroup.findOrCreate({
      where: {
        [Op.and]: [
          { start_date: payload.start_date },
          { price: payload.price },
        ],
      },
      defaults: {
        start_date: payload.start_date,
        price: payload.price,
        status:
          new Date(payload.start_date).getTime() <= new Date().getTime()
            ? 'ONGOING'
            : 'WAITING',
      },
      transaction,
    });
    await challenge.$set('challenge_group', challengeGroup[0], { transaction });
    await challengeGroup[0].$add('user', user, { transaction });

    transaction.commit();
  } catch (e) {
    transaction.rollback();
    ctx.throw(500, e);
  }

  ctx.body = generateResponse(true, null, challenge);
  ctx.status = 200;
};

export const giveUpChallenge = async (ctx: any) => {
  const { id } = ctx.params;
  const { id: user_id } = ctx.request.user;

  // Find Challenge Through Challenge ID and User ID
  let challenge;

  try {
    challenge = await Challenge.findOne({
      where: { [Op.and]: [{ id }, { user_id }] },
    });
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!challenge) {
    ctx.status = 404;
    ctx.body = generateResponse(
      false,
      'No corresponding challenge found.',
      null,
    );
    return;
  }

  // Remove Challenge Instance
  try {
    await challenge.destroy();
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = generateResponse(true, null, { id: challenge.id });
};
