<template>
  <div class="column q-pa-sm">
    <div class="q-pa-sm q-mb-md" style="background-color: #f2f2f2">
      <p style="font-style: italic">
        To get the video link you want to display: <br/>
        > Find the Youtube video you want to use <br/>
        > Share <br/>
        > Embed <br/>
        > Only select link in src <br/>
        > Copy and paste link below
      </p>
    </div>
    <div>
      <p style="margin: 0">Video Link: </p>
      <input
        style="width: 100%"
        class="inputBackground"
        :value="$lget(elementData, 'src')"
        @input="debounce({path: 'src', value: $event.target.value})"
      />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'youtubeVideoSettings',
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
