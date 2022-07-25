<template>
  <q-page class="q-pa-md">
    <streams-table></streams-table>
  </q-page>
</template>

<script>
  import StreamsTable from 'pages/admin/tables/StreamsTable';

  export default {
    name: 'streams',
    components: {StreamsTable},
  };
</script>

<style scoped>

</style>
