<template>
  <div class="q-pa-sm-xl q-py-xl q-px-md">
    <h2 class="q-ma-none q-mb-xl" style="font-weight: 500; font-size: clamp(35px, 8vw, 50px)">Let's get in touch</h2>
    <form-generator v-model="formData" :fields="fields" useQform v-model:valid="valid"></form-generator>
    <vue-recaptcha ref="recaptcha"
                   class="q-mt-xl"
                   :size="$q.screen.lt.sm ? 'compact' : 'normal'"
                   @verify="onVerify"
                   @expired="recaptchaTest = false"
                   sitekey="6LfoNOcgAAAAAPnzZ7D5gjLP8IYHY3zu5S8pAO7W"/>
    <q-card-actions class="q-pt-xl">
      <q-btn size="lg"
             color="primary"
             :disable="!valid || !recaptchaTest"
             :loading="isCreatePending"
             class="q-px-lg"
             @click="submitForm">
        Send
      </q-btn>
      <q-space/>
      <h5 class="q-ma-none" style="opacity: 0.4">* These fields are required</h5>
    </q-card-actions>
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import {mapState} from 'vuex';
  import {VueRecaptcha} from 'vue-recaptcha';

  export default {
    name: 'ErcContactForm',
    components: {
      VueRecaptcha,
    },
    props: {
      filled: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        formData: new models.api.Leads().clone(),
        valid: false,
        recaptchaTest: false,
      };
    },
    computed: {
      ...mapState('leads', {
        isCreatePending: 'isCreatePending',
      }),

      fields() {
        return [
          {
            fieldType: 'TextInput',
            path: 'name',
            attrs: {
              label: 'Name',
              type: 'text',
              filled: this.filled,
              // clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'email',
            attrs: {
              label: 'Email',
              type: 'text',
              filled: this.filled,
              // clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'PhoneInput',
            id: 'user-phones',
            path: 'phone',
            'q-field-attrs': {
              filled: this.filled,
              rules: [val => this.$lget(this.formData, 'phones', []).length === 0 || this.$lget(val, 'isValid') || 'Invalid Number'],
            },
            attrs: {
              inputOptions: {
                placeholder: 'Phone',
              },
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'comment',
            attrs: {
              label: 'How can we help?',
              type: 'textarea',
              filled: this.filled,
              clearable: true,
              'clear-icon': 'close',
              maxlength: 255,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ];
      },
    },
    methods: {
      onVerify(response) {
        if (response) this.recaptchaTest = true;
      },
      submitForm() {
        if (this.recaptchaTest) {
          this.formData.save()
            .then(() => {
              this.$q.notify({
                type: 'positive',
                message: 'Thanks for reaching out! We\'ll be in touch',
                timeout: 10000,
                actions: [
                  {
                    icon: 'close',
                    color: 'white',
                    handler: () => {
                    },
                  },
                ],
              });
              this.formData = new models.api.Leads().clone();
              // this.$refs.recaptcha.reset(); // ?
            })
            .catch(err => {
              this.$q.notify({
                type: 'negative',
                message: err.message,
                timeout: 30000,
                actions: [
                  {
                    icon: 'close',
                    color: 'white',
                    handler: () => {
                    },
                  },
                ],
              });
            });
        }
      },
    },
  };
</script>

<style scoped>

</style>
