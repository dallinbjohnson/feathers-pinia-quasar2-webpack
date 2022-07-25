<template>
  <div class="column q-pa-sm">
    <div class="q-pa-sm q-mb-md" style="background-color: #f2f2f2">
      <p style="font-style: italic">
        To get the api for the map you want to display: <br/>
        > Go to google maps <br/>
        > Search location <br/>
        > Share <br/>
        > Embed a map <br/>
        > Copy and paste link
      </p>
    </div>
    <p style="margin: 0">Label: </p>
    <input
      class="inputBackground"
      :value="$lget(elementData, 'src')"
      @input="debounce({path: 'src', value: $event.target.value})"
    />
  </div>
</template>

<script>
  export default {
    name: 'mapSettings',
    props: {
      element: Object
    },
    data() {
      return {
        timer: new this.$timer(),
        elementData: {}
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          this.elementData = this.$lcloneDeep(newVal);
        }
      }
    },
    methods: {
      debounce(val) {
        let emit = () => {
          this.$emit('stylesUpdate', {path: val.path, value: val.value});
        };
        this.timer.start({cb: emit, iv: 2000});
        console.log('emitting......');
      }
    }
  };
</script>

<style scoped>
.inputBackground {
  background-color: #f2f2f2;
  border: none;
}


p {
  color: #848484;
  margin: 0;
  padding: 0;
}

</style>
