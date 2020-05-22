import Currency from '@/classes/Currency';

export default {
  state: () => ({
    presets: [
      40,
      100,
      200,
      1000,
      2500,
      5000
    ],
    currencies: [
      {name: "US Dollar", code: "USD", symbol: "$", rate: 1},
      {name: "Euro", code: "EUR", symbol: "€", rate: 0.897597},
      {name: "British Pound", code: "GBP", symbol: "£", rate: 0.81755},
      {name: "Russian Ruble", code: "RUB", symbol: "₽", rate: 63.461993},
    ],
    suggestion: 40,
    currency: 'USD',
    amount: 0,
  }),
  mutations: {
    setCurrency(state, currency){
      state.currency = currency;
    },
    setSuggestion(state, suggestion){
      if (state.presets.includes(suggestion)) {
        state.suggestion = suggestion;
      }
    },
    setAmount(state, amount){
      state.amount = amount;
    },
  },
  actions: {
    setCurrency({commit, dispatch, state}, currency){
      if (state.currency === currency) {
        return;
      }

      dispatch('convertAmount', currency);

      commit('setCurrency', currency);
    },
    setSuggestion({commit}, suggestion){
      commit('setAmount', 0);

      commit('setSuggestion', suggestion);
    },
    setAmount({commit}, amount){
      amount = parseInt(amount, 10);
      if (isNaN(amount)) {
        amount = 0;
      }

      commit('setAmount', amount);
    },
    convertAmount({commit, state}, to){
      if (0 >= state.amount) {
        return;
      }

      commit(
        'setAmount',
        (new Currency(state.currencies))
          .convert(state.amount, state.currency, to)
      );
    },
  },
};
