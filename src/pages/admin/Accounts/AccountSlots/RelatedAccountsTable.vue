<template>
  <q-table :data="$lget(row, path, [])"></q-table>
</template>

<script>
  export default {
    name: 'FDataTableRelatedAccounts',
    props: {
      row: {
        type: Object,
        required: true,
      },
      path: {
        type: String,
        required: true,
      }
    },
  };
</script>

<style scoped>

</style>
