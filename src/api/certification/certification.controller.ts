import { generateResponse } from '../../lib/utils';
import Joi from '@hapi/joi';
import { Op } from 'sequelize';
import Certification from '../../models/Cerfitication';
import Challenge from '../../models/Challenge';

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
    challenge_id: Joi.string().required(),
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

  // Create New Certification
  let certification;

  try {
    certification = await Certification.build({ ...ctx.request.body, user_id });
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.body = generateResponse(true, null, ctx.request.files);
};
