<template>
  <div class="my-accounts">
    <div class="box-wrapper">
      <div v-for="(account, index) in accountList" :key="index" class="q-mb-lg">
        <account-profile-component :value="{account}" :hover="true"/>
      </div>
      <div @click="newAccountDio = true" class="box new-account"
           :style="{backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark') : ''}">
        <q-icon name="fas fa-plus" size="xl"/>
        <div>Add New Account</div>
      </div>
    </div>
    <account-form-dialog-component v-model="newAccountDio"
                                   @saved="notifySaved"
                                   @close="newAccountDio = false"/>
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import AccountProfileComponent from '@iy4u/common-client-lib/src/components/profile/AccountProfile';
  import AccountFormDialogComponent from '@iy4u/common-client-lib/src/components/profile/accounts/AccountFormDialog';

  export default {
    name: 'MyAccounts',
    components: {
      AccountProfileComponent,
      AccountFormDialogComponent,
    },
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
    },
    methods: {
      notifySaved(value) {
        this.$q.notify({
          type: 'positive',
          message: `Successfully Saved "${value.name}"`,
          timeout: 10000,
          actions: [
            {
              icon: 'close', color: 'white', handler: () => {
                /* ... */
              },
            },
          ],
        });
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
