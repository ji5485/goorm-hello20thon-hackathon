import Joi from '@hapi/joi';
import { Op } from 'sequelize';
import { sequelize } from '../sequelize';
import Challenge from '../models/Challenge';
import ChallengeGroup from '../models/ChallengeGroup';

export const challenge = async (ctx: any) => {
  await ctx.render('challengeCreate');
};

export const createChallenge = async (ctx: any) => {
  // Validate Request Form
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    start_date: Joi.date().required(),
    price: Joi.number().required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.redirect('/challenge');
    return;
  }

  let challenge;
  // Use transaction Because of Accessing to Two or More Tables
  const transaction = await sequelize.transaction();

  try {
    challenge = await Challenge.create(ctx.request.body, { transaction });
    await challenge.$set('user', ctx.request.user, { transaction });

    const { start_date, price } = ctx.request.body;

    // Create Challenge Group If The Corresponding Challenge Group Does Not Exists
    const challengeGroup = await ChallengeGroup.findOrCreate({
      where: {
        [Op.and]: [{ start_date }, { price }],
      },
      defaults: {
        start_date,
        price,
        status:
          new Date(start_date).getTime() <= new Date().getTime()
            ? 'ONGOING'
            : 'WAITING',
      },
      transaction,
    });
    await challenge.$set('challenge_group', challengeGroup[0], { transaction });

    transaction.commit();
  } catch (e) {
    transaction.rollback();
    ctx.redirect('/challenge');
    ctx.throw(500, e);
  }

  ctx.status = 200;
  ctx.redirect('/');
};
