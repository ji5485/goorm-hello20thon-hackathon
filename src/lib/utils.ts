import { Next } from 'koa';

export const generateResponse = (
  ok: boolean,
  error: any | null,
  payload: any,
): object => {
  return { ok, error, payload };
};

export const checkLoggedIn = (ctx: any, next: Next) => {
  const { user } = ctx.request;

  if (!user) {
    ctx.status = 402;
    ctx.body = generateResponse(false, 'Not Logged In', null);
    return;
  }

  return next();
};
