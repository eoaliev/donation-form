const Donate = require(`${__rootdir}/models/Donate`);
const Currency = require(`${__rootdir}/helpers/Currency`);

module.exports.donate = async (context, next) => {
  const {response, request} = context;

  if ('POST' !== request.method) {
    return next();
  }

  const amount = context.checkBody('amount')
    .toInt()
    .value;

  const currency = context.checkBody('currency')
    .notEmpty()
    .in(Currency.codes)
    .value;

  try {
    await (new Donate({amount, currency})).save();
  } catch (ex) {
    response.status = 400;
    response.body = {error: ex.message};
    return;
  }

  response.status = 201;
  response.body = {ok: true};
};
