export const main = async (ctx: any) => {
  const { user } = ctx.request;

  if (user) await ctx.render('secondMain', { user });
  else await ctx.render('firstMain');
};

export const login = async (ctx: any) => {
  await ctx.render('login');
};
