import { generateResponse } from '../../lib/utils';
import Joi from '@hapi/joi';
import { sequelize } from '../../sequelize';
import { Op } from 'sequelize';
import Certification from '../../models/Certification';
import Challenge from '../../models/Challenge';
import Image from '../../models/Image';

export const getCertificationList = async (ctx: any) => {
  const { user } = ctx.request;

  // Get Certification List
  let certificationList;

  try {
    certificationList = await user.$get('certifications');
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = generateResponse(true, null, certificationList);
};

export const registerCertification = async (ctx: any) => {
  const { id: user_id } = ctx.request.user;

  // Validate Request Form
  const schema = Joi.object({
    challenge_id: Joi.number().required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = generateResponse(false, result.error.details, null);
    return;
  }

  // Check Corresponding Challenge Does Existing
  let challenge;

  try {
    challenge = await Challenge.findOne({
      where: { [Op.and]: [{ user_id }, { id: ctx.request.body.challenge_id }] },
    });
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!challenge) {
    ctx.status = 404;
    ctx.body = generateResponse(
      false,
      'The Corresponding Challenge Does Not Exist',
      null,
    );
    return;
  }

  // Use transaction Because of Accessing to Two or More Tables
  const transaction = await sequelize.transaction();

  // Create New Image, Certification
  let images;
  let certification;

  try {
    images = await Image.bulkCreate(
      ctx.request.files.picture.map((image: any) => {
        const { name, path } = image;
        return { name, path };
      }),
      { transaction },
    );

    certification = await Certification.create(
      { ...ctx.request.body, user_id },
      { transaction },
    );
    await certification.$set('image', images, { transaction });

    transaction.commit();
  } catch (e) {
    transaction.rollback();
    ctx.throw(500, e);
  }

  ctx.body = generateResponse(true, null, certification);
};

export const setCertificationVerification = async (ctx: any) => {
  const { id: user_id } = ctx.request.user;
  const VERIFICATION_ENUM = ['PENDING', 'SUCCESS', 'FAILURE'];

  // Validate Request Form
  const schema = Joi.object({
    certification_id: Joi.number().required(),
    verification: Joi.string()
      .valid(...VERIFICATION_ENUM)
      .required(),
  });

  const result = schema.validate(ctx.request.body);

  if (result.error) {
    ctx.status = 400;
    ctx.body = generateResponse(false, result.error.details, null);
    return;
  }

  // Check Corresponding Certification Does Existing
  let certification;

  try {
    certification = await Certification.findOne({
      where: {
        [Op.and]: [{ user_id }, { id: ctx.request.body.certification_id }],
      },
    });
  } catch (e) {
    ctx.throw(500, e);
  }

  if (!certification) {
    ctx.status = 404;
    ctx.body = generateResponse(
      false,
      'The Corresponding Certification Does Not Exist',
      null,
    );
    return;
  }

  // Change Certification Status
  try {
    await certification.update({ verification: ctx.request.body.verification });
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = generateResponse(true, null, certification);
};
