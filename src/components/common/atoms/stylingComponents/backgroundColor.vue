<template>
  <q-card flat class="justify-center justify-between row q-pa-sm" style="width: 100%">
    <div class="full-width flex justify-evenly"><span class="text-weight-regular" style="font-size: 17px;">Current {{ name }} Color</span><q-avatar size="30px" style="border: 1px solid black;" :style="{background: hex}" class="cursor-pointer" @click="changeColor = !changeColor"></q-avatar></div>
    <div  style="width: 100%;display: flex; justify-content: center; flex-direction: column;" class="flex flex-center q-mt-sm" v-if="changeColor">
      <q-select :options="options" v-model="selectedOption" @input="startEmit($event, 'select')" outlined class="q-my-sm"/>
      <ColorPicker
        :value="$lget(element, path, 'rgba( 255, 255, 255, 1)')"
        @colorPicker="startEmit($event, 'hex')"
      />
    </div>
  </q-card>
</template>

<script>
  import ColorPicker from './colorPicker';
  export default {
    name: 'color',
    components: {
      ColorPicker
    },
    props: {
      element: Object,
      path: String,
      name: String
    },
    data() {
      return {
        hex: null,
        colorDialog: false,
        options: ['$unset', 'inherit', 'initial', 'transparent', 'unset', 'revert'],
        selectedOption: null,
        changeColor: false,
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            let bgColor = this.$lget(newVal, this.path);
            if (bgColor) {
              if (this.options.includes(bgColor)) {
                this.selectedOption = bgColor;
              } else {
                this.options.push(bgColor);
                this.selectedOption = bgColor;
                this.hex = bgColor;
              }
            }
          }
        }
      }
    },
    methods: {
      startEmit(val, input) {
        if (input === 'hex' && this.options.length > 5) {
          this.options.pop();
          this.options.push(val);
        } else {
          this.options.push(val);
        }
        this.$emit('stylesUpdate', { path: this.path, value: val });
      }
    }
  };
</script>

<style scoped>

</style>
