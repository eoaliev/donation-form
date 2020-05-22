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

    <button
      class="donation-form-submit"
      @click.stop.prevent="donate"
    >
      <template v-if="loading">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 100 100" enable-background="new 0 0 0 0" xml:space="preserve"> <path fill="#fff" d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"> <animateTransform attributeName="transform" attributeType="XML" type="rotate" dur="1s" from="0 50 50" to="360 50 50" repeatCount="indefinite"/> </path> </svg>
      </template>
      <span v-else>{{ $t('DONATION_SUBMIT') }}</span>
    </button>
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
      loading: false,
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
    amountValue(){
      let amount = this.amount;
      if (0 < amount) {
        return amount;
      }

      const preset = this.preparedPresets.find(
        ({value}) => value === this.suggestion
      );
      if (preset) {
        return preset.converted;
      }

      return this.suggestion || 0;
    },
    preparedAmount(){
      return this.numberFormatter.format(
        this.amountValue
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
    },
    async donate(){
      if (this.loading) {
        return;
      }

      this.loading = true;

      const response = await fetch(
        '/donate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({
            amount: this.amountValue,
            currency: this.currency,
          }),
        }
      );

      await this.showDonationResult(response);

      this.loading = false;
    },
    async showDonationResult(response){
      if (!response.ok) {
        return alert(this.$t('DONATION_FAILURE'));
      }

      const result = await response.json();
      if (!result.ok) {
        return alert(this.$t('DONATION_FAILURE'));
      }

      alert(this.$t('DONATION_SUCCESS'));
    }
  },
}
</script>

<i18n>
{
  "ru": {
    "DONATION_SUBMIT": "Пожертвовать",
    "DONATION_SUCCESS": "Спасибо за ваше пожертвование!",
    "DONATION_FAILURE": "Не удалось создать пожертвование. Попробуйте повторить позже."
  },
  "en": {
    "DONATION_SUBMIT": "Donate",
    "DONATION_SUCCESS": "Thank you for your donation!",
    "DONATION_FAILURE": "Failed to create donation. Please try again later."
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

    svg {
      width: 40px;
      height: 40px;
      vertical-align: top;
      margin: -5px;
    }
  }
}
</style>
