<template>
  <div>
  <div v-if="environment">
    <bank-dashboard v-if="$lget(environment,'responsibleAccount')"
                    :account="$lget(environment,['_fastjoin','responsibleAccount'])"/>
    <div v-else class="column items-center q-pa-md q-gutter-md">
      <div class="text-h4 text-primary text-capitalize">Account responsible for {{ $lget(environment, 'name') }}
        environment wallets
      </div>
      <formGenerator v-model="formData" :fields="fields" useQform v-model:valid="valid"/>
      <q-btn label="Save Account"
             :disable="!valid || loading"
             v-close-popup
             color="primary"
             :loading="loading"
             @click="saveAccount"/>
    </div>
    </div>
    <q-inner-loading :showing="!environment">
      <q-spinner-gears size="10rem" color="primary"/>
    </q-inner-loading>
  </div>

</template>

<script>

  import BankDashboard from 'components/banks/BankDashboard';
  import {mapActions} from 'vuex';
  import {models} from '@feathersjs/vuex';

  export default {
    name: 'ProfileWallet',
    components: {
      BankDashboard,
    },
    data() {
      return {
        addCardDio: false,
        environment: undefined,
        formData: new models.api.Accounts().clone(),
        valid: false,
        loading: false,
      };
    },
    async created() {
      const environmentId = this.$lget(this.$activeAccount, 'environment');
      this.formData.responsibleForEnvironments.push(environmentId);
      this.environment = await this.getEnvironment([environmentId,{
        'environments_fJoinHookResolversQuery': {
          responsibleAccount: true
        },
      }]);
    },
    computed: {
      fields() {
        return [
          {
            fieldType: 'TextInput',
            path: 'name',
            attrs: {
              label: 'Name',
              type: 'text',
              filled: true,
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
            path: 'email',
            attrs: {
              label: 'Email',
              type: 'text',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ];
      },
    },
    methods: {
      ...mapActions('environments', {
        getEnvironment: 'get',
      }),
      async saveAccount() {
        try {
          this.loading = true;
          const account = await this.formData.save();
          console.log(this.$lget(account,'_id'));
          const environmentId = this.$lget(this.$activeAccount, 'environment');
          await this.$store.dispatch('environments/patch', [environmentId, {responsibleAccount: this.$lget(account,'_id')}]);
          // await this.environment.save({responsibleAccount: this.$lget(account,'_id')});
          this.$q.notify({
            message: `Account ${this.$lget(account,'name')}`,
            color: 'green-4',
            textColor: 'white',
            icon: 'attachment',
          });

          this.loading = false;
        } catch (e) {
          this.loading = false;
          this.$q.notify({
            message: e.message,
            color: 'negative',
            textColor: 'white',
            icon: 'warning',
          });

        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .embed-responsive-item {
    min-height: 100vh;
    min-width: 100%;
    border: 0;
  }
</style>
