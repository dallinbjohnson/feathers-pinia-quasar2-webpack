<template>
  <div id="actionFab">
    <q-fab v-model="fab"
           @touchstart.stop="fab = !fab"
           vertical-actions-align="left"
           padding="xs"
           icon="more_vert"
           direction="down"
           flat>
      <q-fab-action padding="3px"
                    external-label
                    color="primary"
                    icon="edit"
                    label="Edit"
                    @click.stop="$emit('edit', item)"
                    @touchstart.stop="$emit('edit', item)" />
      <q-fab-action padding="3px"
                    external-label
                    color="secondary"
                    icon="delete"
                    label="Delete"
                    @click.stop="$emit('delete', item)"
                    @touchstart.stop="$emit('delete', item)" />
      <q-fab-action padding="3px"
                    external-label
                    color="primary"
                    icon="visibility_off"
                    label="Hide"
                    @click.stop="$emit('hide', item)"
                    @touchstart.stop="$emit('hide', item)" />
    </q-fab>
  </div>
</template>

<script>
  export default {
    name: 'actionFab',
    props: {
      item: {
        type: Object,
        required: true,
      }
    },
    data() {
      return {
        fab: false,
      };
    },
  };
</script>

<style scoped lang="scss">
  #actionFab {

  }
</style>
