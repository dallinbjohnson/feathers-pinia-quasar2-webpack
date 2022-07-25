<template>
  <div v-bind="{ class: 'full-width row justify-center', ...$attrs.divAttrs }">

    <div class="__center">
      <div :class="titleClass">{{ $lget(value, ['title']) }}</div>
      <fade-transition>
        <div class="full-width" v-if="$lget(value, 'component')">
          <component
            :is="$lget(value, 'component')"
            v-bind="{
              options: $lget(value, 'attrs.options'),
              value: selected,
              ...$lget(active, 'attrs')
            }"
            @input="setLayers($event)"
          >
            <template v-for="slot in Object.keys($slots)"
                      v-slot:[slot]="slotProps">
              <slot :name="slot" v-bind="slotProps"></slot>
            </template>

          </component>
        </div>
      </fade-transition>
    </div>
  </div>
</template>


<script>
  import FadeTransition from 'components/common/transitions/FadeTransition';

  export default {
    name: 'SimpleFunnel',
    components: { FadeTransition },
    props: {
      value: { required: true },
      optionKey: { type: String, default: '_id'}
    },
    data() {
      return {
        active: undefined,
        selected: undefined,
        hover: -1,
        type: undefined,
        size: undefined,
        frequency: undefined,
        titleClass: 'text-md q-py-lg text-mb-md text-weight-light text-center'
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(){
          this.selected = undefined;
        }
      }
    },
    methods: {
      setLayers(option){
        this.selected = option;
        this.$emit('input', option);
      }
    }
  };
</script>

<style scoped lang="scss">
  .__center {
    width: 1000px;
    max-width: 100%;
  }


</style>
