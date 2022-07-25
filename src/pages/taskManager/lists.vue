<template>
  <q-page>
    <lists-list></lists-list>
  </q-page>
</template>

<script>
  import listsList from 'components/taskManager/lists/list/list';

  export default {
    name: 'lists',
    components: {
      listsList
    },
  };
</script>

<style scoped lang="scss">

</style>
