<template>
  <q-page class="q-pa-md">
    <lists-table></lists-table>
  </q-page>
</template>

<script>
  import ListsTable from 'pages/admin/tables/ListsTable';
  export default {
    name: 'lists',
    components: {ListsTable},
  };
</script>

<style scoped>

</style>
