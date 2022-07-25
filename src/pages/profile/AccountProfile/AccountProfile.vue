<template>
  <q-page>
    <account-profile-component :value="{account}" square router-mixin-run />
    <q-img src="~assets/AccountProfilePlaceholder.png"/>
  </q-page>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import AccountProfileComponent from '@iy4u/common-client-lib/src/components/profile/AccountProfile';

  export default {
    name: 'AccountProfile',
    components: {
      AccountProfileComponent,
    },
    mounted() {
      this.$watch('stateAccount', async () => {
        await this.setAccount();
      }, {
        immediate: true,
        deep: true,
      });
    },
    data() {
      return {
        tab: null,
        account: {},
      };
    },
    computed: {
      ...mapGetters('auth', {
        stateAccount: 'activeAccount',
      }),
      ...mapGetters('accounts', {
        getStateAccounts: 'get',
      }),
    },
    methods: {
      ...mapActions('accounts', {
        getDbAccounts: 'get',
      }),
      tabClick(tab) {
        if (tab === this.tab) {
          this.tab = null;
        }
      },
      async setAccount() {
        let id = this.$route.params.id || this.stateAccount._id;
        let account = this.getStateAccounts(id);
        if (!account) {
          account = await this.getDbAccounts(id);
        }
        this.account = account.clone();
      },
    },
  };
</script>

<style scoped lang="scss" src="./_AccountProfile.scss">

</style>
