<template>
  <q-select v-bind="attrs">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

  </q-select>
</template>

<script>
  import { SelectMixin } from '@iy4u/common-client-lib';
  export default {
    name: 'Select',
    mixins: [SelectMixin],
    computed: {
      attrs(){
        return this.$attrs;
      },
    }
  };
</script>

<style scoped lang="scss">

</style>
