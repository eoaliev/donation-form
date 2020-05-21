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
  }),
  mutations: {
    setCurrency(state, currency){
      state.currency = currency;
    },
    setSuggestion(state, suggestion){
      suggestion = parseInt(suggestion);
      if (isNaN(suggestion)) {
        suggestion = '';
      }

      state.suggestion = suggestion;
    },
  },
  actions: {
    setCurrency({commit}, currency){
      commit('setCurrency', currency);
    },
    setSuggestion({commit}, suggestion){
      commit('setSuggestion', suggestion);
    },
  },
};
