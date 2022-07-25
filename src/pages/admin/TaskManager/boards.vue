<template>
  <q-page class="q-pa-md">
    <boards-table></boards-table>
  </q-page>
</template>

<script>
  import BoardsTable from 'pages/admin/tables/BoardsTable';
  export default {
    name: 'boards',
    components: {BoardsTable},
  };
</script>

<style scoped>

</style>
