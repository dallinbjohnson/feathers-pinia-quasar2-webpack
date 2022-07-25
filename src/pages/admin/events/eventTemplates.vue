<template>
  <q-page class="q-pa-md">
    <event-templates-table></event-templates-table>
  </q-page>
</template>

<script>
  import EventTemplatesTable from 'pages/admin/tables/EventTemplatesTable';

  export default {
    name: 'eventTemplates',
    components: {EventTemplatesTable},
  };
</script>

<style scoped>

</style>
