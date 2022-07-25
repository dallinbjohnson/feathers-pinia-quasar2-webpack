<template>
  <q-page class="q-pa-md">
    <cards-table></cards-table>
  </q-page>
</template>

<script>
  import CardsTable from 'pages/admin/tables/CardsTable';
  export default {
    name: 'cards',
    components: {CardsTable},
  };
</script>

<style scoped>

</style>
