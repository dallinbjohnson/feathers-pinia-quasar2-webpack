<template>
  <div class="my-accounts">
    <div class="box-wrapper">
      <div v-for="(account, index) in accountList" :key="index" class="q-mb-lg">
        <account-card :value="{account}" :hover="true" @edit-account="editAccount"></account-card>
      </div>
      <div @click="newAccountDio = true" class="box new-account"
           :style="{backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark') : ''}">
        <q-icon name="fas fa-plus" size="xl"/>
        <div>Add New Account</div>
      </div>
    </div>

    <q-dialog v-model="newAccountDio">
      <q-card style="min-width: 30vw; padding: 10px; border-top: 25px solid var(--q-color-primary)">
        <q-card-section>
          <form-generator v-model="formData" :fields="fields" useQform v-model:valid="valid"></form-generator>
          <p class="q-ma-none text-caption" style="opacity: 0.7">
            {{ $lget(formData, 'account.description') ? $lget(formData, 'account.description').length : 0 }}/255
          </p>
        </q-card-section>
        <q-card-actions align="right" class="q-mt-md">
          <q-btn label="Cancel" v-close-popup color="red"/>
          <q-btn label="Save Account"
                 :disable="!valid"
                 v-close-popup
                 color="primary"
                 @click="saveAccount"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import AccountCard from 'components/profile/ProfileOld/AccountCardOld/AccountCardOld';
  import {models} from '@feathersjs/vuex';
  // import {makeFindPaginateMixin} from '@iy4u/common-client-lib';

  export default {
    name: 'MyAccountsOld',
    components: {
      AccountCard,
    },
    // mixins: [
    //   makeFindPaginateMixin({
    //     limit: 5,
    //     service: 'accounts',
    //     name: 'accounts',
    //     qid: 'accountsList',
    //     infinite: true,
    //     query() {
    //       return {};
    //     },
    //     params() {
    //       return {
    //         // accountResolversQuery: {
    //         //   members: [['_id', 'name', 'email', 'avatar']],
    //         // },
    //       };
    //     }
    //   }),
    // ],
    data() {
      return {
        newAccountDio: false,
        formData: {
          account: new models.api.Accounts().clone(),
        },
        valid: false,
      };
    },
    computed: {
      accountList() {
        // return this.accounts.map(item => item.clone());
        return this.$lget(this.$store.state, 'auth.accounts', []).map(item => item.clone());
      },
      fields() {
        return [
          {
            fieldType: 'ImageSelect',
            path: 'account.avatar',
            attrs: {
              stylePanelLayout: null,
            },
            'label-attrs': {
              'v-text': 'Account Avatar',
              style: 'font-size: 20px; margin-top: -5px',
            },
            'div-attrs': {
              class: 'col-6',
            },
          },
          {
            fieldType: 'ImageSelect',
            path: 'account.banner',
            attrs: {
              stylePanelLayout: null,
              imageCropAspectRatio: '3:1',
            },
            'label-attrs': {
              'v-text': 'Account Banner',
              style: 'font-size: 20px; margin-top: -5px',
            },
            'div-attrs': {
              class: 'col-6',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'account.name',
            attrs: {
              label: 'Name',
              type: 'text',
              filled: true,
              'bg-color': 'secondary',
              'label-color': 'white',
              color: 'accent',
              clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'account.description',
            attrs: {
              label: 'Description',
              type: 'textarea',
              filled: true,
              'bg-color': 'secondary',
              'label-color': 'white',
              color: 'accent',
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
      editAccount(account) {
        this.formData.account = account;
        this.newAccountDio = true;
      },
      async saveAccount() {
        if (this.formData.account && Object.keys(this.formData.account).length) {
          try {
            this.$lset(this.formData, 'account.avatar', this.$lget(this.formData, 'account.avatar.0', null));
            this.$lset(this.formData, 'account.banner', this.$lget(this.formData, 'account.banner.0', null));
            this.$lset(this.formData, 'account.email', this.$authUser.email); // could be a problem if users can edit other user's accounts
            this.$lget(this.formData, 'account.logins.ownedBy', []).push(this.$activeLogin._id);
            let account = await this.formData.account.save({
              data: {
                name: this.$lget(this.formData, 'account.name'),
                description: this.$lget(this.formData, 'account.description'),
                avatar: this.$lget(this.formData, 'account.avatar'),
                banner: this.$lget(this.formData, 'account.banner'),
                email: this.$lget(this.formData, 'account.email'),
                logins: this.$lget(this.formData, 'account.logins'),
              },
              userJoin: true,
            });
            this.formData = {
              account: new models.api.Accounts().clone(),
            };
            this.newAccountDio = false;
            this.accountsRefresh;

            this.$q.notify({
              type: 'positive',
              message: `Successfully Saved "${account.name}"`,
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                  },
                },
              ],
            });
          } catch (err) {
            this.$q.notify({
              type: 'negative',
              message: err.message,
              timeout: 30000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          }
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .box-wrapper {
    padding: 30px 50px;
    //display: grid;
    //grid-template-columns: 1fr 1fr 1fr 1fr;
    //grid-gap: 15px;
    //justify-items: center;
    display: flex;
    flex-direction: column;

    .box {
      width: 100%;
      max-height: 40vh;
      min-height: 29vh;
      box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.25);
      transition: 0.2s all;
    }

    .box:hover {
      background-color: #edeff3;
      transform: scale(1.02);
      cursor: pointer;
    }

    .new-account {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
    }

    .account {
      overflow-y: scroll;
      padding: 10px;
      position: relative;

      div:not(.name) {
        margin: 6px 0;
      }

      .delete {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        font-size: 1.3em;
      }

      .name {
        font-size: 1.4em;
        font-weight: 500;
        margin-bottom: 8px;
      }
    }

    .account::-webkit-scrollbar {
      display: none;
    }
  }

  @media screen and (max-width: 600px) {
    .box-wrapper {
      padding: 30px 20px;
    }
  }

  @media screen and (max-width: 400px) {
    .box-wrapper {
      padding: 30px 10px;
    }
  }
</style>
