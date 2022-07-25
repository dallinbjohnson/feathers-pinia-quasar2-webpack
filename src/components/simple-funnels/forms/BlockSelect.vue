<template>
  <div v-bind="{ class: 'full-width row justify-center', ...$attrs.divAttrs}">
    <div
      v-for="(option, i) in options"
      :key="`default-layer-${i}`"
      v-bind="{ class: defaultClass(i), ...option.attrs }"
      @pointerenter="hover = i"
      @pointerleave="hover = -1"
      @click="handleInput(option)"
      :style="{
        border: isActive(option) ? `solid 2px var(--q-color-${activeColor})` : 'none'
      }"
    >
      <slot name="option" :hover="hover">
        <div class="__type_card flex flex-center">
          <div class="full-width full-height bg-white" style="border-radius: 6px; cursor: pointer;">
            <div class="row justify-center">
              <div style="height: 150px; width: 150px;" class="flex flex-center" v-if="$lget(option, 'img')">
                <q-img
                  v-bind="{
                contain: true,
                style: 'width: 150px; height: 150px; cursor: pointer',
                src: $lget(option, ['img']),
                ...option.imgAttrs
              }"
                ></q-img>
              </div>
              <q-icon
                v-else-if="$lget(option, 'icon')"
                :name="option.icon"
                v-bind="{size: '30px', ...$lget(option, 'iconAttrs')}"
              ></q-icon>
            </div>
            <div class="text-center font-18 text-uppercase full-width text-weight-bold">
              {{ $lget(option, ['label']) }}
            </div>
            <div class="text-center font-14 full-width">
              {{ $lget(option, ['caption']) }}
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BlockSelect',
    props: {
      options: Array,
      value: { required: true },
      optionKey: { type: String, default: '_id' },
      activeColor: { type: String, default: 'primary' }
    },
    data() {
      return {
        hover: -1
      };
    },
    methods: {
      isActive(opt) {
        let match = this.$lget(opt, [this.optionKey], opt) === this.$lget(this.value, [this.optionKey], this.value);
        return match;
      },
      handleInput(val) {
        console.log('handling input', val);
        this.$emit('input', val);
      },
      defaultClass(i) {
        return `__option col-12 col-sm-6 col-md-3 q-pa-md ${this.hover === i ? 'hover' : ''}`;
      },
    }
  };
</script>

<style scoped lang="scss">
  .__type_card {
    width: 100%;
    height: 200px;
    cursor: pointer;
  }

  .__option {
    transition: all .3s ease-out;
    box-shadow: none;
    border-radius: 8px;
    cursor: pointer;
  }

  .hover {
    box-shadow: 2px 2px 8px rgba(0, 0, 0, .2)
  }
</style>
