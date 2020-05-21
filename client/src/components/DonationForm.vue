<template>
<div class="donation-form">
  <div class="donation-form-wrapper">
    <div
      class="donation-form-presets"
      v-if="!!presets && presets.length"
    >
      <div
        class="donation-form-presets-item"
        :class="{'donation-form-presets-active': preset === suggestion}"
        v-for="(preset, key) of preparedPresets"
        :key="key"
        @click="setSuggestion(preset)"
      >
        <span
          v-if="currencySymbol"
          :class="{'donation-form-presets-item-symbol-rub': currency === 'RUB'}"
        >{{ currencySymbol }}</span>
        <span>{{ numberFormatter.format(preset) }}</span>
      </div>
    </div>

    <div class="donation-form-input">
      <span
        class="donation-form-input-currency"
        v-if="currencySymbol"
      >{{ currencySymbol }}</span>

      <input
        type="text"
        class="donation-form-input-input"
        :value="suggestion"
        @input.stop.prevent="onSuggestionChange"
      />

      <select
        class="donation-form-input-currencies"
        @change="onChangeCurrency"
      >
        <option
          v-for="(item, key) of currencies"
          :value="item.code"
          :key="key"
          :selected="item.code === currency"
        >{{ item.name }}</option>
      </select>
    </div>

    <button class="donation-form-submit">{{ $t('DONATION_SUBMIT') }}</button>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

// For Safari & ie10
if (!global.Intl) {
    require.ensure([
        'intl',
        'intl/locale-data/jsonp/en.js'
    ], function (require) {
        require('intl');
        require('intl/locale-data/jsonp/en.js');
    });
}

export default {
  name: 'DonationForm',
  data(){
    return {
      numberFormatter: new Intl.NumberFormat('en-US'),
    };
  },
  computed:{
    ...mapState({
      presets: (state) => state.Donation.presets,
      currencies: (state) => state.Donation.currencies,
      currency: (state) => state.Donation.currency,
      suggestion: (state) => state.Donation.suggestion,
    }),
    currencyInfo(){
      return this.currencies.find(
        ({code}) => code === this.currency
      );
    },
    currencySymbol(){
      return this.currencyInfo ? this.currencyInfo.symbol: '';
    },
    preparedPresets(){
      return this.presets.map(
        (preset) => this.convert(preset)
      );
    },
  },
  methods:{
    ...mapActions([
      'setCurrency',
      'setSuggestion',
    ]),
    convert(value, pretty = true){
      const rate = this.currencyInfo ? this.currencyInfo.rate: 1;

      value = Math.ceil(value * rate);
      if (!pretty) {
        return value;
      }

      const divider = 10 ** ((String(value).length - 2) || 1);

      return Math.ceil(value / divider) * divider;
    },
    onChangeCurrency({target:{value}}){
      this.setCurrency(value);
    },
    onSuggestionChange({target}){
      target.value = target.value.replace(/[^0-9]+/, '')

      this.setSuggestion(target.value);
    },
  },
  watch:{
    preparedPresets(current, prev){
      if (prev.includes(this.suggestion)) {
        this.setSuggestion(
          this.convert(this.suggestion)
        );
        return;
      }

      this.setSuggestion(
        this.convert(this.suggestion, false)
      );
    },
  },
}
</script>

<i18n>
{
  "ru": {
    "DONATION_SUBMIT": "Пожертвовать"
  },
  "en": {
    "DONATION_SUBMIT": "Donate"
  }
}
</i18n>

<style lang="scss" scoped>
.donation-form{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;

  &-wrapper{
    width: 570px;
    margin: 0 auto;
    padding: 50px;
    background-color: #f5f5f5;
  }

  &-presets{
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 2rem;

    &-item{
      background-color: #ffffff;
      font-size: 2em;
      padding: 15px;
      text-align: center;
      border: 1px solid #dcdcdc;
      box-shadow: 3px 3px 5px #dcdcdc;
      cursor: pointer;
      border-radius: 5px;

      &-symbol-rub{
        font-size: 0.9em;
      }
    }

    &-active{
      background-color: #4c77d2;
      color: #ffffff;
      border: 0;
      box-shadow: none;
    }
  }

  &-input{
    width: 100%;
    background-color: #fff;
    border: 1px solid #8e939e;
    padding: 0 15px;
    font-size: 2em;
    border-radius: 5px;
    margin-bottom: 2rem;
    position: relative;

    &-currency,
    &-currencies{
      position: absolute;
      top: 50%;
      margin-top: -15px;
    }

    &-currency{
      left: 15px;
      line-height: 30px;
    }

    &-input{
      width: 100%;
      vertical-align: top;
      padding-left: 30px;
      font-size: 2em;
      color: #4c77d2;
    }

    &-currencies{
      right: 15px;
      background: none;
      font-size: 0.8em;
      height: 30px;
      text-align: right;
      text-align-last: right;
    }
  }

  &-submit{
    width: 100%;
    padding: 15px;
    font-size: 2em;
    background-color: #4c77d2;
    color: #fff;
    text-transform: uppercase;
    font-weight: 600;
    border-radius: 5px;
  }
}
</style>
