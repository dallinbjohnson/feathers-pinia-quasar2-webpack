<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section class="flex flex-center">
        <img :src="require('assets/quickbooks-logo.png')" style="width: clamp(260px, 50vw, 800px);"/>
      </q-card-section>

      <q-card-section v-if="realmId" class="flex flex-center">
        Company Id: <span>{{ realmId }}</span>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
  export default {
    name: 'ConnectQuickbooks',
    data() {
      return {
        realmId: null,
      };
    },
    watch: {
      $route: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        async handler(to, from) {
          if (to.query.code) {
            console.log('to.query:', to.query);
            try {
              this.realmId = await this.$feathersClient.service('quickbooks/authentication').find({query: to.query});
              console.log('realmId:', this.realmId);
              console.log('to.query.state:', to.query.state);
              let state = typeof to.query.state === 'string' ? JSON.parse(to.query.state) : to.query.state;
              console.log('state.next:', state.next);
              window.location = state.next;

              this.$q.notify({
                type: 'positive',
                message: `Successfully connected Quickbooks Company Id. "${this.realmId}"`,
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
              this.$router.push({name: to.name});
            } catch (e) {
              console.error(e);
              this.$q.notify({
                type: 'negative',
                message: e.message,
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
    },
    methods: {},
  };
</script>

<style scoped>

</style>
