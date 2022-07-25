<template>
  <q-page class="q-pa-md">
    <events-table></events-table>
  </q-page>
</template>

<script>
  import EventsTable from 'pages/admin/tables/EventsTable';

  export default {
    name: 'events',
    components: {EventsTable},
  };
</script>

<style scoped>

</style>
