<template>
  <q-page class="q-pa-md">
    <boards-list></boards-list>
  </q-page>
</template>

<script>
  import boardsList from 'components/taskManager/boards/list/list';

  export default {
    name: 'boards',
    components: {
      boardsList
    },
  };
</script>

<style scoped lang="scss">

</style>
