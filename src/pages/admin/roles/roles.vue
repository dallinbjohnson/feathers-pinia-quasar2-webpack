<template>
  <q-page id="Roles" className="q-pa-md">
    <f-data-roles></f-data-roles>
  </q-page>
</template>

<script>
  import FDataRoles from 'pages/admin/AdminTables/FDataRoles';

  export default {
    name: 'roles',
    components: {
      FDataRoles,
    },
    computed: {},
  };
</script>

<style scoped lang="scss">
  #Roles {
  }
</style>
