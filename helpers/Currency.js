module.exports = class Currency {
  static get currencies() {
    return [
      {name: "US Dollar", code: "USD", symbol: "$", rate: 1},
      {name: "Euro", code: "EUR", symbol: "€", rate: 0.897597},
      {name: "British Pound", code: "GBP", symbol: "£", rate: 0.81755},
      {name: "Russian Ruble", code: "RUB", symbol: "₽", rate: 63.461993},
    ];
  }

  static get codes() {
    return this.currencies.map(
      ({code}) => code
    );
  }
}
