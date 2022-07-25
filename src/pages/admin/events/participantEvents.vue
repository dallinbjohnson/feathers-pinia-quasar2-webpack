<template>
  <q-page class="q-pa-md">
    <participant-events-table></participant-events-table>
  </q-page>
</template>

<script>
  import ParticipantEventsTable from 'pages/admin/tables/ParticipantEventsTable';
  export default {
    name: 'participantEvents',
    components: {ParticipantEventsTable},
  };
</script>

<style scoped>

</style>
