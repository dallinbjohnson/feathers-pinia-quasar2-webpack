<template>
  <q-page id="Rules" className="q-pa-md">
    <f-data-rules/>
  </q-page>
</template>

<script>
  import FDataRules from 'pages/admin/AdminTables/FDataRules';

  export default {
    name: 'rules',
    components: {
      FDataRules,
    },
    computed: {},
  };
</script>

<style scoped lang="scss">
</style>
