module.exports.donate = (context, next) => {
  if ('POST' !== context.method) {
    return next();
  }

  context.body = {ok: true};
};
