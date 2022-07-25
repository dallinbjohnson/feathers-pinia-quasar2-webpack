<template>
  <q-card flat style="max-width:550px;" class="self-center container">
    <q-card-section class="q-mb-none">
      <span class="q-px-sm text-bold">Help us verify your identity as:</span>

      <div class="text-caption row q-gutter-xs items-center">
        <q-radio size="xl" v-model="formData.walletFor" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                 val="company" label="A Company"/>
        <q-radio size="xl" v-model="formData.walletFor" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                 val="individual" label="An Individual"/>
      </div>
      <!--      <q-input
              v-model="formData.email"
              label="BUSINESS EMAIL"
              type="email"
              :debounce="0"
              filled
              outline
              dense
              bg-color="grey-2"
              input-class="text-grey-8 text-caption"
              label-color="grey-6"
              clearable
              clear-icon="close"
              lazy-rules="ondemand"
              :rules="['email']"
            >
              <template #append>
                <q-checkbox class="text-caption" v-model="sameAsAccountz" label="same as account's" :true-value="true" :false-value="false"/>
              </template>
            </q-input>
      -->
    </q-card-section>
    <q-card-section>
      <q-slide-transition>
        <div v-show="formData.walletFor==='individual'">
          <q-select
            class="q-mb-lg"
            filled
            v-model="formData.idType"
            :label="formData.idType? undefined:'SELECT ID TYPE'"
            input-class="text-grey6"
            use-input
            dense
            popup-content-class="text-caption"
            input-debounce="0"
            :options="options"
            @filter="filterFn"
            behavior="menu"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-slide-transition>
            <form-generator
              v-show="formData.idType"
              v-model="formData"
              :fields="fields"
              useQform
              v-model:valid="valid">
              <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
                <slot :name="slot" v-bind="scope"/>
              </template>
            </form-generator>
          </q-slide-transition>
        </div>
      </q-slide-transition>
      <q-slide-transition>
        <div class="column q-gutter-md">
          <q-input
            v-show="formData.walletFor==='individual'"
            v-model="formData['socialSecurityNo']"
            placeholder="TAXPAYER'S IDENTIFICATION NUMBER (SSN / ITIN)"
            type="text"
            filled
            outline
            dense
            mask="###-##-####"
            bg-color="grey-2"
            input-class="text-grey-8"
            label-color="grey-6"
            clearable
            clear-icon="close"
            lazy-rules="ondemand"
            :rules="[this.validateSSN]"
            hint="The IRS requires us to ask for your full SSN / ITIN. We'll keep it private."
          />
          <q-input
            v-show="formData.walletFor==='company'"
            v-model="formData['employersIDNumber']"
            placeholder="EMPLOYER'S IDENTIFICATION NUMBER (EIN)"
            type="text"
            filled
            outline
            dense
            mask="##-#######"
            bg-color="grey-2"
            input-class="text-grey-8 text-caption"
            label-color="grey-6"
            clearable
            clear-icon="close"
            lazy-rules="ondemand"
            :rules="[this.validateSSN]"
            hint="The IRS requires us to ask for your full EIN. We'll keep it private."
          />
        </div>
      </q-slide-transition>
      <plaid-prompt-dialog
        @verified="sendVerifiedBankResults"
        v-model="dialogPlaid"
        :products="plaid.products"
        :environment="plaid.environment"
        :link-token="plaid.link_token"
        :stripe_publishable="plaid.stripe_publishable"
        @clear="clear"
        :data_to_tokenize="formData"
      >
        <template #custom-message>
          <p> You're required to connect to your bank before submitting your information!</p>
        </template>
      </plaid-prompt-dialog>
    </q-card-section>
    <q-card-section class="q-mt-none">
      <div class="text-caption row q-gutter-md items-center">
        <q-checkbox :disable="!valid&&(formData.walletFor==='individual')" class="text-bold" v-model="addPaymentMethods"
                    label="Add your Debit / Credit Card"/>
        <span class="text-grey-8">(optional: You can do so later.)</span>
      </div>
      <q-slide-transition>
        <credit-card v-show="addPaymentMethods" @tokenize="cardChanged"/>
      </q-slide-transition>
    </q-card-section>
    <slot name="sendInviteBtn">

      <q-card-actions align="between" class="q-pa-lg">
        <q-btn outline label="Cancel" @click="closeForm"/>
        <q-btn color="primary" label="Submit" type="submit" :disabled="!validForm || loading" :loading="loading"
               @click="createPlaidLink"/>
      </q-card-actions>
    </slot>
  </q-card>
</template>

<script>
  import {isValid} from 'ssn-validator';
  import CreditCard from 'components/banks/components/CreditCard';
  import {models} from '@feathersjs/vuex';
  import PlaidPromptDialog from 'components/banks/components/PlaidPromptDialog';

  const documentTypeOptions = ['State ID', 'Passport', 'Drivers License', 'Visa', 'Immigration ID', 'Military ID', 'Matricula Consular'];

  export default {
    name: 'add-wallet-form',
    props: {
      account: {
        type: Object,
        required: true,
      },
    },
    components: {CreditCard, PlaidPromptDialog},
    data() {
      return {
        formData: {
          walletFor: 'company',
          idType: '',
          name: 'byld-capital',
          email: undefined,
        },
        // sameAsAccountz: undefined,
        loading: false,
        documentTypeOptions,
        options: documentTypeOptions,
        valid: false,
        validCard: false,
        addPaymentMethods: false,
        plaid: {
          environment: '',
          products: ['auth'],
          link_token: '',
          stripe_publishable: '',
        },
        dialogPlaid: false,

      };
    },
    watch: {
      plaid: {
        immediate: true,
        deep: true,
        handler: function (newVal) {
          this.dialogPlaid = !!newVal.link_token;
        },
      },
      account: {
        immediate: true,
        handler: function (newVal) {
          if (newVal) {
            this.formData.account = newVal;
          }
        },
      },
    },
    computed: {
      individualFormValid() {
        const idDocumentFront = this.$lget(this.formData, ['idDocumentFront', '0', 'raw']);
        const idDocumentBack = this.$lget(this.formData, ['idDocumentBack', '0', 'raw']);
        const ssnValid = this.$lget(this.formData, 'socialSecurityNo');
        return this.validateSSN(ssnValid) && idDocumentFront && idDocumentBack;
      },
      companyFormValid() {
        const companyDocumentBack = this.$lget(this.formData, 'employersIDNumber');
        if (companyDocumentBack) {
          const id = companyDocumentBack.replace('-', '');
          return this.validateSSN(id);
        }
        return false;
      },
      validForm() {
        const withCard = this.addPaymentMethods ? this.validCard : true;
        const formValid = this.formData.walletFor === 'individual' ? this.individualFormValid : this.companyFormValid;
        return formValid && withCard;
      },
      fields() {
        return [
          {
            fieldType: 'ImageSelect',
            path: 'idDocumentFront',
            attrs: {
              stylePanelLayout: null,
              maxParallelUploads: 1,
              allowMultiple: false,
              maxFiles: 1,
              allowReplace: false,
              checkValidity: true,
              credits: '',
              labelIdle: '<span class="column text-grey-7"><a style="font-size:0.8rem;"  class="q-mt-sm q-mb-xs">DRAG & DROP OR</a>  <a style="border-radius:1rem; font-size:0.6rem;" class="q-pa-sm text-primary text-xs bg-white q-pa-xs"> browse photo</a> </span>',
            },
            'label-attrs': {
              'v-text': 'ID FRONT PHOTO',
              class: 'text-bold q-my-sm',
            },
            'div-attrs': {
              class: 'col-6 gt-xs text-caption column items-center q-pa-none text-center',
            },
          },
          {
            fieldType: 'ImageSelect',
            path: 'idDocumentBack',
            attrs: {
              stylePanelLayout: null,
              maxParallelUploads: 1,
              allowMultiple: false,
              allowReplace: false,
              checkValidity: true,
              credits: '',
              labelIdle: '<span class="column text-grey-7"><a style="font-size:0.8rem;"  class="q-mt-sm q-mb-xs">DRAG & DROP OR</a>  <a style="border-radius:1rem; font-size:0.6rem;" class="q-pa-sm text-primary text-xs bg-white q-pa-xs"> browse photo</a> </span>',
            },
            'label-attrs': {
              'v-text': 'ID BACK PHOTO',
              class: 'text-bold q-my-sm',
            },
            'div-attrs': {
              class: 'col-6 gt-xs  text-caption column items-center q-pa-none text-center',
            },
          },
          // {
          //   fieldType: 'TextInput',
          //   path: 'formData.socialSecurityNo',
          //   attrs: {
          //     label: 'SOCIAL SECURITY NUMBER',
          //     type: 'text',
          //     filled: true,
          //     outline: true,
          //     dense: true,
          //     mask: '###-##-####',
          //     'bg-color': 'grey-2',
          //     'label-color': 'grey-6',
          //     clearable: true,
          //     'clear-icon': 'close',
          //     'lazy-rules': 'ondemand',
          //     rules: [this.validateSSN],
          //   },
          //   'div-attrs': {
          //     class: 'col-12 q-mt-md',
          //   },
          // },
        ];
      },
    },
    methods: {
      validateSSN(value) {
        return isValid(value);
      },
      cardChanged(value) {
        this.formData.card = (value);
        this.validCard = true;
      },
      async createPlaidLink() {
        try {
          this.loading = true;
          // we are going we request a plaid token from the local server
          // this is a one time token used only here, no need to store it in vuex
          await new models.api['VerifyBankAccount']().save();
          this.loading = false;
          this.dialogPlaid = true;
        } catch (e) {
          this.loading = false;
          this.$q.notify({
            type: 'negative',
            message: `Error initializing plaid connection: ${e.message}`,
          });
        }
      },
      clear() {
        this.plaid = {
          environment: '',
          products: ['auth'],
          link_token: '',
        };
      },
      async sendVerifiedBankResults(result) {
        try {
          const formData = this.formData;
          const {metadata} = result;
          await new models.api.Wallets({metadata, formData}).save();
          this.loading = false;
          this.$emit('close');
          this.$q.notify({
            type: 'positive',
            message: 'Successfully created a wallet',
          });
        } catch (e) {
          this.loading = false;
          this.$q.notify({
            type: 'negative',
            message: `Error on access token processing: ${e.message}.`,
          });
        }
      },
      filterFn(val, update) {
        if (val === '') {
          update(() => {
            this.options = documentTypeOptions;
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          this.options = documentTypeOptions.filter(v => v.toLowerCase().indexOf(needle) > -1);
        });
      },
      closeForm() {
        this.formData = {
          walletFor: 'company',
          idType: '',
          name: 'byld-capital',
          email: undefined,
        };
        this.$emit('close');
      },
    },
  };
</script>
<style lang="scss" scoped>
  $col3s: #4a74c9;
  .link-button {
    overflow: hidden;
    transform: translateX(0);
  }

  .q-field__native.q-placeholder {
    color: red;
  }

  .container {
    min-width: 550px;
    @media screen and (max-width: 600px) {
      min-width: 100%;
    }
  }
</style>
