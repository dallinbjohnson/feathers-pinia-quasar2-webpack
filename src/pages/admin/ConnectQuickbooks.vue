<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section class="flex flex-center">
        <img :src="require('assets/quickbooks-logo.png')" style="width: clamp(260px, 50vw, 800px);" />
      </q-card-section>

      <q-card-section class="flex flex-center">
<!--        <q-btn color="positive" @click="getAuthLink" style="font-size: clamp(15px, 2vw, 25px)">Connect Quickbooks OAuth</q-btn>-->
        <connect-quickbooks-link></connect-quickbooks-link>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
  import ConnectQuickbooksLink from 'components/common/molecules/quickbooks/ConnectQuickbooksLink';

  export default {
    name: 'ConnectQuickbooks',
    components: {
      ConnectQuickbooksLink,
    },
    data() {
      return {};
    },
    methods: {},
  };
</script>

<style scoped>

</style>
