<template>
  <connect-quickbooks-link :state="state">
    <div class=" box column items-center justify-center q-pa-xl" style=" position: relative">
      <q-icon  name="sp:add_quickBooksIcon"
               style="font-size: clamp(60px, 20vw, 90px)"/>
      <p class="text-center q-pa-sm text-h5 text-bold"
         style="font-size: clamp(15px, 5vw, 25px)">Add Quickbooks</p>
    </div>
  </connect-quickbooks-link >
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import ConnectQuickbooksLink from 'components/common/molecules/quickbooks/ConnectQuickbooksLink';

  export default {
    name: 'MyCompaniesOld',
    components: {
      ConnectQuickbooksLink,
    },
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
    },
    computed: {
      state() {
        let state = {};
        let accountId = this.$lget(this.accountData, 'account._id');
        if (accountId) {
          this.$lset(state, 'accountId', accountId);
        }
        return state;
      },
    },

  };
</script>

<style scoped lang="scss">

  .box {
    max-width: 100%;
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.25);
    height: calc(100% + 1vh);
    transition: 0.2s all;
    &:hover {
      background-color: #edeff3;
      transform: scale(1.05);
      cursor: pointer;
    }
  }

</style>
