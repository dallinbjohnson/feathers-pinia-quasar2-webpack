<template>
  <q-page class="q-pa-md">
    <card-events-table></card-events-table>
  </q-page>
</template>

<script>
  import CardEventsTable from 'pages/admin/tables/CardEventsTable';
  export default {
    name: 'cardEvents',
    components: {CardEventsTable},
  };
</script>

<style scoped>

</style>
