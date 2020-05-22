<template>
<div class="donation-form">
  <div class="donation-form-wrapper">
    <div
      class="donation-form-presets"
      v-if="!!presets && presets.length"
    >
      <div
        class="donation-form-presets-item"
        :class="{'donation-form-presets-active': !amount && preset.value === suggestion}"
        v-for="(preset, key) of preparedPresets"
        :key="key"
        @click="setSuggestion(preset.value)"
      >
        <span
          v-if="currencySymbol"
          :class="{'donation-form-presets-item-symbol-rub': currency === 'RUB'}"
        >{{ currencySymbol }}</span>
        <span>{{ preset.label }}</span>
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
        :value="preparedAmount"
        @input="onAmountEditClearValue"
        @focus="onAmountEditClearValue"
        @change="onAmountChange"
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
import Currency from '@/classes/Currency';

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
      CURRENCY_BASE: 'USD',
    };
  },
  computed:{
    ...mapState({
      presets: (state) => state.Donation.presets,
      currencies: (state) => state.Donation.currencies,
      currency: (state) => state.Donation.currency,
      suggestion: (state) => state.Donation.suggestion,
      amount: (state) => state.Donation.amount,
    }),
    currencyManager(){
      return new Currency(this.currencies);
    },
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
        (preset) => {
          const converted = this.currencyManager.pretty(
            this.currencyManager.convert(
              preset,
              this.CURRENCY_BASE,
              this.currency
            )
          );

          return {
            value: preset,
            converted,
            label: this.numberFormatter.format(converted),
          }
        }
      );
    },
    preparedAmount(){
      if (0 >= this.amount) {
        const preset = this.preparedPresets.find(
          ({value}) => value === this.suggestion
        );

        return preset ? preset.label: '';
      }

      return this.numberFormatter.format(
        this.amount
      );
    },
  },
  methods:{
    ...mapActions([
      'setCurrency',
      'setSuggestion',
      'setAmount',
    ]),
    onChangeCurrency({target:{value}}){
      this.setCurrency(value);
    },
    onAmountChange({target: {value}}){
      value = parseInt(
        this.clearNumberValue(value),
        10
      );
      if (isNaN(value)) {
        this.setAmount(0);
        return;
      }

      const preset = this.preparedPresets.find(
        ({converted}) => converted === value
      );
      if (!preset) {
        this.setAmount(value);
        return;
      }

      this.setSuggestion(
        preset.value
      );
    },
    onAmountEditClearValue({target}){
      target.value = this.clearNumberValue(target.value);
    },
    clearNumberValue(value){
      return value.replace(/[^0-9]+/g, '');
    }
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
    gap: 15px;
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
    display: flex;
    align-items: center;

    &-currency{
      line-height: 30px;
    }

    &-input{
      width: 100%;
      vertical-align: top;
      padding-left: 15px;
      font-size: 1.7em;
      color: #4c77d2;
      flex-grow: 1;
    }

    &-currencies{
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
