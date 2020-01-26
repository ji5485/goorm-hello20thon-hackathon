import Router from 'koa-router';
import * as challengeController from './challenge.controller';
import { checkLoggedIn } from '../../lib/utils';

const challenge = new Router();

challenge.get('/', checkLoggedIn, challengeController.getChallengeList);
challenge.post('/', checkLoggedIn, challengeController.createChallenge);
challenge.delete('/:id', checkLoggedIn, challengeController.giveUpChallenge);

export default challenge;
