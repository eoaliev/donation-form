export default class Currency {
  constructor(currencies){
    this.rates = {};

    if (!currencies) {
      return;
    }

    for (const currency of currencies) {
      this.rates[currency.code] = currency.rate || 1;
    }
  }

  convert(value, from, to){
    if (!this.rates) {
      return value;
    }

    const rateFrom = this.rates[from] || 1;
    const rateTo = this.rates[to] || 1;

    return Math.round(value / rateFrom * rateTo);
  }

  pretty(value){
    const divider = 10 ** ((String(Math.round(value)).length - 2) || 1);

    return Math.ceil(value / divider) * divider;
  }
}
