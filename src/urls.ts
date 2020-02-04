import Router from 'koa-router';
import { main, login } from './routes/main';
import { signUp, signIn, signOut } from './routes/auth';
import { challenge, createChallenge } from './routes/challenge';

const url = new Router();

// Main
url.get('/', main);
url.get('/login', login);

// Auth
url.post('/signup', signUp);
url.post('/login', signIn);
url.get('/logout', signOut);

// Challenge
url.get('/challenge', challenge);
url.post('/challenge', createChallenge);

export default url;
