<template>
  <q-item clickable
          tag="a"
          :to="link"
          active-class="active-link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon"/>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption :lines="1">
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
  export default {
    name: 'EssentialLink',
    props: {
      title: {
        type: String,
        required: true
      },

      caption: {
        type: String,
        default: ''
      },

      link: {
        type: [String, Object],
        default: '#'
      },

      icon: {
        type: String,
        default: ''
      }
    }
  };
</script>

<style scoped lang="scss">
  .active-link {
    border-left: 3px solid var(--q-color-secondary);

    * {
      color: var(--q-color-secondary);
    }
  }
</style>
