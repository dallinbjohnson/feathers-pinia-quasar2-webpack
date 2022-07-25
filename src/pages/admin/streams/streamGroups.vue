<template>
  <q-page class="q-pa-md">
    <stream-groups-table></stream-groups-table>
  </q-page>
</template>

<script>
  import StreamGroupsTable from 'pages/admin/tables/StreamGroupsTable';

  export default {
    name: 'streamGroups',
    components: {StreamGroupsTable},
  };
</script>

<style scoped>

</style>
