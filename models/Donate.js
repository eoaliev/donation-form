const {Schema, model} = require('mongoose');
const Currency = require(`${__rootdir}/helpers/Currency`);

module.exports = model(
  'Donate',
  new Schema({
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {type: String, enum: Currency.codes, required: true},
  })
);
