<template>
  <div>
    <q-item v-bind="{...{clickable: true}, ...itemProps}" :style="{...{width: '100%'}, ...$lget(itemProps,'style', {})}" @click="$emit('input', value)">
      <q-item-section avatar>
        <q-avatar :style="{background: $lget(value, 'color.hex', '#a7c1d7')}"></q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-xs text-mb-xs text-weight-medium">{{$lget(value, 'name')}}</q-item-label>
<!--        <q-item-label style="width: 90%" class="__one-liner text-xxs text-mb-xxs text-grey-8">{{$lget(value, 'description')}}</q-item-label>-->
      </q-item-section>
      <q-item-section side>
        <q-btn size="sm" dense flat :icon="rmvIcon" @click="$emit('remove', value)"></q-btn>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>

  export default {
    name: 'ListItem',
    components: {},
    mixins: [],
    props: {
      rmvIcon: { type: String, default: 'mdi-delete' },
      removable: Boolean,
      value: Object,
      itemProps: {
        type: Object,
        default: () => {
          return {};
        }
      }
    }
  };
</script>

<style scoped>

</style>
