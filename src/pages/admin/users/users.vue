<template>
  <q-page id="Users" class="q-pa-md">
    <f-data-users/>
  </q-page>
</template>

<script>
  import FDataUsers from 'pages/admin/AdminTables/FDataUsers';

  export default {
    name: 'users',
    components: {
      FDataUsers
    },
  };
</script>

<style scoped>
</style>
