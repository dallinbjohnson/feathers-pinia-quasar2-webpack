<template>
  <q-page class="q-pa-md">
    <chats-table></chats-table>
  </q-page>
</template>

<script>
  import ChatsTable from 'pages/admin/tables/ChatsTable';
  export default {
    name: 'chats',
    components: {ChatsTable},
  };
</script>

<style scoped>

</style>
