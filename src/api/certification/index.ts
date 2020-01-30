import Router from 'koa-router';
import * as certificationController from './certification.controller';
import { checkLoggedIn } from '../../lib/utils';

const certification = new Router();

certification.get(
  '/',
  checkLoggedIn,
  certificationController.getCertificationList,
);
certification.post(
  '/',
  checkLoggedIn,
  certificationController.registerCertification,
);
certification.post(
  '/verification',
  checkLoggedIn,
  certificationController.setCertificationVerification,
);

export default certification;
