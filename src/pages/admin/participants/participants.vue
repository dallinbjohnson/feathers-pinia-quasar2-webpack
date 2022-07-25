<template>
  <q-page class="q-pa-md">
    <participants-table></participants-table>
  </q-page>
</template>

<script>
  import ParticipantsTable from 'pages/admin/tables/ParticipantsTable';
  export default {
    name: 'participants',
    components: {ParticipantsTable},
  };
</script>

<style scoped>

</style>
