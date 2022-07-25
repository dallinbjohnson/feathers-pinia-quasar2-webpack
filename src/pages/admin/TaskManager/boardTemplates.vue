<template>
  <q-page class="q-pa-md">
    <board-templates-table></board-templates-table>
  </q-page>
</template>

<script>
  import BoardTemplatesTable from 'pages/admin/tables/BoardTemplatesTable';

  export default {
    name: 'boardTemplates',
    components: {BoardTemplatesTable},
  };
</script>

<style scoped>

</style>
