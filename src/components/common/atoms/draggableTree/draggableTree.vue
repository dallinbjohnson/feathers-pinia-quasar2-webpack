<template>
  <div id="draggableTree" v-bind="$attrs['div-attrs']">
    <vue-nestable :value="value" @input="$emit('input', $event)" v-bind="$attrs['attrs']">
      <template v-slot="scope">
        <vue-nestable-handle
          v-if="Object.keys($slots).includes('default') || Object.keys($slots).length === 0" v-bind="scope">
          <slot v-bind="scope">
            <q-card style="width: 100%;">
              <q-card-section class="nestable-handle q-pa-sm">
                {{ label(scope.item) }}
                <q-space/>

                <div class="drag-action-icons">
                  <q-icon name="add" class="cursor-pointer" @click="add(scope.item)"/>
                  <q-icon name="edit" class="cursor-pointer" @click="edit(scope.item)"/>
                  <q-icon name="delete" class="cursor-pointer" @click="remove(scope.item)"/>
                </div>
              </q-card-section>
            </q-card>
          </slot>
        </vue-nestable-handle>
        <template v-else>

          <slot v-if="Object.keys($slots).includes('before')" name="before" v-bind="scope"></slot>
          <vue-nestable-handle v-if="Object.keys($slots).includes('handle')" v-bind="scope">
            <slot name="handle" v-bind="scope"></slot>
          </vue-nestable-handle>
          <slot v-if="Object.keys($slots).includes('after')" name="after" v-bind="scope"></slot>
        </template>
      </template>
    </vue-nestable>
  </div>
</template>

<script>
  export default {
    name: 'draggableTree',
    inheritAttrs: false,
    props: {
      value: {
        type: Array,
        required: true,
      },
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          this.$lset(newVal, 'attrs.keyProp', this.$lget(newVal, 'attrs.keyProp', '_id'));

          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12'));
        }
      },
    },
    methods: {
      label(item) {
        let label_key = this.$lget(this.$attrs, 'attrs.label_key', 'label');
        if (typeof label_key === 'function') return label_key(item);
        return this.$lget(item, label_key);
      },
      add(item) {
        this.$emit('add', item);
      },
      edit(item) {
        this.$emit('edit', item);
      },
      remove(item) {
        this.$emit('remove', item);
      }
    }
  };
</script>

<style scoped lang="scss" src="./_draggableTree.scss">
</style>
