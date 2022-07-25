<template>
  <div class="q-pa-none credit-card-field-wrapper">
    <slot name="control">
      <div class="row">
        <q-input mask="#### #### #### ####" v-model="card.number" max="19" type="text"
                 placeholder="CARD NUMBER"
                 dense flat filled square
                 input-class="text-grey-8 q-ma-sm"
                 label-col="grey-6"
                 class="col-6 col-xs-12"
                 :rules="[validateCardNo]"
        >
          <template #prepend>
            <q-icon :name="brand" class="credit-card-field-icon" width="23.33" height="20"/>
          </template>
        </q-input>
        <div class="col-6 col-xs-12 row">
          <q-input v-model="card.expiration" type="text"
                   mask="##/##"
                   dense flat filled square
                   input-class="text-grey-8 text-center"
                   placeholder="MM/YY" maxlength="7" class="col"
                   lazy-rules
                   :rules="[validateExpirationDate]"
          />
          <q-input v-model="card.cvc" type="text" placeholder="CVC"
                   mask="###"
                   dense outline filled square
                   input-class="text-grey-8 text-center"
                   autocomplete="off" class="col"
                   lazy-rules
                   :rules="[validateCvc]"
          />
          <q-input v-model="card.postalCode"
                   mask="#####"
                   dense flat filled square
                   input-class="text-grey-8 text-center"
                   max="5" type="text" placeholder="ZIP" maxlength="5"
                   class="col"
                   lazy-rules
                   :rules="[validatePostalCode]"
          />
        </div>
        <div class="q-px-md text-grey-8 text-caption">No monthly fees, no set up fee: You pay a transaction fee of <span class="text-bold">1.9% + $0.10</span></div>

      </div>
    </slot>
  </div>
</template>

<script>
  import validator from 'card-validator';

  export default {
    name: 'credit-card',
    data() {
      return {
        width: null,
        isFocused: false,
        focusedElement: null,
        previousValue: null,
        showSecurityFields: false,
        brand: 'fas fa-credit-card',
        card: {
          brand: null,
          number: null,
          expiration: null,
          cvc: null,
          postalCode: null,
        },
      };
    },
    watch: {
      card: {
        deep: true,
        handler(newVal) {
          const numberValidation = validator.number(newVal.number);
          if (numberValidation.card) {
            switch (numberValidation.card.type) {
              case 'jcb':
                this.brand = 'fab fa-cc-jcb';
                break;
              case 'visa':
                this.brand = 'fab fa-cc-visa';
                break;
              case 'american-express':
                this.brand = 'fab fa-cc-amex';
                break;
              case 'diners-club':
                this.brand = 'fab fa-cc-diners-club';
                break;
              case 'discover':
                this.brand = 'fab fa-cc-discover';
                break;
              case 'mastercard':
                this.brand = 'fab fa-cc-mastercard';
                break;
              default:
                this.brand = 'far fa-credit-card';
            }
          } else {
            this.brand = 'fas fa-credit-card';
          }

        },
      },
    },
    updated() {
      if(this.validCard){
        this.$emit('tokenize',this.card);
      }
    },
    computed: {
      validCard() {
        const validCardNo = validator.number(this.card.number).isValid;
        const validCardExpDate = validator.expirationDate(this.card.expiration).isValid;
        const validCardCVC = validator.cvv(this.card.cvc).isValid;
        const validPostalCode = validator.postalCode(this.card.postalCode).isValid;
        return validCardNo && validCardExpDate && validCardCVC && validPostalCode;
      },
    },
    methods: {
      validateCardNo(value) {
        return validator.number(value).isPotentiallyValid;
      },
      validateCvc(value) {
        return validator.cvv(value).isValid;
      },
      validatePostalCode(value) {
        return validator.postalCode(value).isValid;
      },
      validateExpirationDate(value) {
        return validator.expirationDate(value).isValid;
      },
    },
  };
</script>
<style lang="scss" scoped>

</style>
