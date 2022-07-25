<template>
  <q-page id="Abilities" className="q-pa-md">
    <f-data-abilities/>
  </q-page>
</template>

<script>
  import FDataAbilities from 'pages/admin/AdminTables/FDataAbilities';

  export default {
    name: 'abilities',
    components: {
      FDataAbilities,
    },
    computed: {},
  };
</script>

<style scoped lang="scss">
</style>
