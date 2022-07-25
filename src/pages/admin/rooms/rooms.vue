<template>
  <q-page class="q-pa-md">
    <rooms-table></rooms-table>
  </q-page>
</template>

<script>
  import RoomsTable from 'pages/admin/tables/RoomsTable';
  export default {
    name: 'rooms',
    components: {RoomsTable},
  };
</script>

<style scoped>

</style>
