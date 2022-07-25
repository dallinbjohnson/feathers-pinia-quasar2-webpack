<template>
  <div id="account-phones">
    <div class="my-numbers-wrapper">
      <form-generator v-model="accountData" :fields="fields" useQform v-model:valid="valid"></form-generator>
    </div>
    <div class="flex justify-end" style="width: 100%">
      <q-btn @click="updatePhone" label="Save" :disable="!valid" style="margin: 0 10px 10px" dense>
        <!--        Consider making unclickable unless account has changed.-->
        <!--        Consider making flat unless hovering over card-->
      </q-btn>
    </div>
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';

  export default {
    name: 'AccountPhonesOld',

    props: {
      value: {
        type: Object,
        required: true,
      },
    },

    data() {
      return {
        accountData: {
          account: new models.api.Accounts().clone(),
        },
        valid: false,
      };
    },

    watch: {
      value: {
        deep: true,
        immediate: true,
        handler(newVal) {
          if (newVal && Object.keys(newVal).length) {
            this.accountData = this.$lcloneDeep(newVal);
          }
        },
      },
      accountData: {
        deep: true,
        immediate: true,
        handler(newVal) {
          if (newVal) {
            console.log('This is phones in newVal in watcher: ', newVal.account.phones);
            console.log('This is phones in accountData in watcher: ', this.accountData.account.phones);
          }
        }
      }
    },

    computed: {
      fields() {
        let self = this;
        return [
          {
            fieldType: 'FormsetGenerator',
            label: 'Phones:',
            itemLabel: 'Phone',
            add_form_btn_text: 'Phone',
            path: 'account.phones',
            // attrs: {
            //   style: 'display: flex; justify-content: space-between;',
            // },
            'add-icon-attrs': {
              name: 'sp:add_phoneIcon',
              size: '18px',
              style: {
                'padding-bottom': '3px',
              }
            },
            templateFormFields: [
              {
                fieldType: 'SelectInput',
                path: 'phoneType',
                attrs: {
                  label: 'Type',
                  filled: true,
                  clearable: true,
                  'clear-icon': 'close',
                  rules: [val => self.$lget(self.accountData, 'account.phones', []).length === 0 || !!val || 'Required'],
                  options: [
                    'To Be Changed 1', //Need to Change
                    'To Be Changed 2', //Need to Change
                    'To Be Changed 3', //Need to Change
                  ],
                },
                // 'div-attrs': {
                //   class: 'col-12'
                // }
              },
              {
                fieldType: 'PhoneInput',
                id: 'user-phones',
                path: 'phone',
                return_object_no_key: true,
                attrs: {
                  inputOptions: {
                    placeholder: 'Phone',
                  },
                },
                'q-field-attrs': {
                  rules: [val => self.$lget(self.accountData, 'account.phones', []).length === 0 || this.$lget(val, 'isValid') || 'Invalid Number'],
                },
              },
            ],
          },
        ];
      },
    },

    methods: {
      updatePhone() {
        this.$lget(this.accountData, 'account').patch({
          data: {
            phones: this.$lget(this.accountData, 'account.phones'),
          },
        })
          .then(res => {
            console.log('res in updatePhone patch.then: ', res);
            this.$q.notify({
              type: 'positive',
              message: 'Saved',
            });
          })
          .catch(err => {
            console.log('err in updatePhone patch.catch: ', err);
            this.$q.notify({
              type: 'negative',
              message: `Error: ${err}`,
            });
          });
      },
    },
  };
</script>

<style scoped lang="scss">
  .my-numbers-wrapper {
    //text-align: center;
    width: 88%;
    margin: 10px auto; //consider changing margin to to 20 as to match addresses
  }
</style>

<style lang="scss">
  #account-phones {
    #FormGenerator {
      #FormsetGenerator {
        .q-card {
          box-shadow: unset;
        }
      }
    }
  }
</style>
