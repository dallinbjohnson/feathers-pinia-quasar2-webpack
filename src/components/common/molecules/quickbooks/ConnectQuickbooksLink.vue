<template>
  <div @click="getAuthLink">
    <slot>
      <q-btn color="positive" style="font-size: clamp(15px, 2vw, 25px)">Connect Quickbooks OAuth</q-btn>
    </slot>
  </div>
</template>

<script>
  export default {
    name: 'ConnectQuickbooks',
    props: {
      state: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {};
    },
    methods: {
      async getAuthLink() {
        let self = this;
        let QRedirectUri = new URL(self.$router.resolve({name: 'quickbooks-connect'}).href, window.location.href).href;
        let params = {QRedirectUri};
        params.QState = {
          next: new URL(this.$router.resolve(this.$route).href, window.location.href).href,
          ...this.state,
        };
        window.location.href = await self.$feathersClient.service('quickbooks/authentication').create({}, params);
      },
    },
  };
</script>

<style scoped>

</style>
