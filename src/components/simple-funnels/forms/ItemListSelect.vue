<template>
  <q-list v-bind="{separator: true, ...$attrs.listAttrs}">
    <q-item
      v-for="(option, i) in $lget(attrs, 'options', [])"
      :key="`option-${i}`"
      @click="$emit('input', option)"
      v-bind="{
        clickable: true,
        ...$attrs.optionAttrs,
        ...option.attrs
      }"
    >
        <q-item-section v-if="$lget(option, 'img') || $lget(option, 'icon') || $slots.avatar" name="avatar">
          <slot name="avatar">
          <q-img
            contain
            v-bind="{
           contain: true,
           style: 'width: 40px; height: 40px;',
           src: $lget(option, ['img']),
           ...$attrs.imgAttrs
           }"
            v-if="$lget(option, 'img')"
          ></q-img>
          <q-icon
            v-else-if="$lget(option, 'icon')"
            :name="option.icon"
            v-bind="{size: '30px', ...$lget(option, 'iconAttrs')}"
          ></q-icon>
          </slot>
        </q-item-section>
      <slot name="default">
        <q-item-section>
          <q-item-label
            v-bind="option.labelAttrs"
            v-if="$lget(option ,'label')"
          >
            {{ $lget(option, 'label') }}
          </q-item-label>
          <q-item-label
            v-if="$lget(option ,'caption')"
            v-bind="{
              caption: true,
              ...option.captionAttrs
            }"
          >
            {{ $lget(option, 'caption') }}
          </q-item-label>
        </q-item-section>
      </slot>
      <q-item-section v-if="$slots.side" side>
        <slot name="side"></slot>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script>
  export default {
    name: 'ItemListSelect',
    computed: {
      attrs() {
        return this.$attrs;
      }
    }
  };
</script>

<style scoped>

</style>
