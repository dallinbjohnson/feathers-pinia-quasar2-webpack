<template>
  <div class="q-pa-md column">
    <div class="column q-my-sm">
      <p style="margin: 0">Label: </p>
      <input class="inputBackground"
             :value="$lget(elementData, 'label', 'placeholder')"
             @input="debounce({path: 'label', value: $event.target.value})"/>
    </div>
    <div class="column q-my-sm">
      <p style="margin: 0">Link: </p>
      <input class="inputBackground"
             :value="$lget(elementData, 'to', '')"
             @input="debounce({path: 'to', value: $event.target.value})"/>
    </div>
    <div class="column q-my-sm">
      <p style="margin: 0">Icon: </p>
      <input class="inputBackground"
             :value="$lget(elementData, 'attrs.icon', '')"
             @input="debounce({path: 'attrs.icon', value: $event.target.value})"/>
    </div>
    <div class="column q-my-sm">
      <p style="margin: 0">Icon Right: </p>
      <input class="inputBackground"
             :value="$lget(elementData, 'attrs.iconRight', '')"
             @input="debounce({path: 'attrs.iconRight', value: $event.target.value})"/>
    </div>
    <div class="column q-my-sm">
      <p style="margin: 0">color: </p>
      <input class="inputBackground"
             :value="$lget(elementData, 'attrs.color', '')"
             @input="debounce({path: 'attrs.color', value: $event.target.value})"/>
    </div>
    <div>
      <p>Configure Button Styles</p>
      <div class="row">
        <div class="col-12 col-md-6">
          <q-toggle color="green"
                    label="Flat"
                    left-label
                    :value="$lget(elementData, 'attrs.flat')"
                    @input="$emit('stylesUpdate', {path: 'attrs.flat', value: $event})"/>
        </div>
        <div class="col-12 col-md-6">
          <q-toggle color="green"
                    label="Outline"
                    left-label
                    :value="$lget(elementData, 'attrs.outline', false)"
                    @input="$emit('stylesUpdate', {path: 'attrs.outline', value: $event})"/>
        </div>
        <div class="col-12 col-md-6">
          <q-toggle color="green"
                    label="Unelevated"
                    left-label
                    :value="$lget(elementData, 'attrs.unelevated', false)"
                    @input="$emit('stylesUpdate', {path: 'attrs.unelevated', value: $event})"/>
        </div>
        <div class="col-12 col-md-6">
          <q-toggle color="green"
                    label="Rounded"
                    left-label
                    :value="$lget(elementData, 'attrs.rounded', false)"
                    @input="$emit('stylesUpdate', {path: 'attrs.rounded', value: $event})"/>
        </div>
        <div class="col-12 col-md-6">
          <q-toggle color="green"
                    label="Round"
                    left-label
                    :value="$lget(elementData, 'attrs.round', false)"
                    @input="$emit('stylesUpdate', {path: 'attrs.round', value: $event})"/>
        </div>
        <div class="col-12 col-md-6">
          <q-toggle color="green"
                    label="Push"
                    left-label
                    :value="$lget(elementData, 'attrs.push', false)"
                    @input="$emit('stylesUpdate', {path: 'attrs.push', value: $event})"/>
        </div>
        <div class="col-12 col-md-6">
          <q-toggle color="green"
                    label="Dense"
                    left-label
                    :value="$lget(elementData, 'attrs.dense', false)"
                    @input="$emit('stylesUpdate', {path: 'attrs.dense', value: $event})"/>
        </div>
        <div class="col-12 col-md-6">
          <q-toggle color="green"
                    label="Stack"
                    left-label
                    :value="$lget(elementData, 'attrs.stack', false)"
                    @input="$emit('stylesUpdate', {path: 'attrs.stack', value: $event})"/>
        </div>
        <div class="col-12 col-md-6">
          <q-toggle color="green"
                    label="Glossy"
                    left-label
                    :value="$lget(elementData, 'attrs.glossy', false)"
                    @input="$emit('stylesUpdate', {path: 'attrs.glossy', value: $event})"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'buttonEditor',
    inheritAttrs: false,
    props: {
      element: Object,
    },
    data() {
      return {
        timer: new this.$timer(),
        flat: this.$lget(this.elementData, 'flat', false),
        elementData: {},
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          this.elementData = this.$lcloneDeep(newVal);
        },
      },
    },
    methods: {
      debounce(val) {
        let emit = () => {
          this.$emit('stylesUpdate', {path: val.path, value: val.value});
        };
        this.timer.start({cb: emit, iv: 2000});
        console.log('emitting......');
      },
    },
  };
</script>

<style scoped>
  .inputBackground {
    background-color: #f2f2f2;
    border: none;
  }
</style>
