<template>
  <div>
    <q-color
      :value="value"
      @change="$emit('colorPicker', $event)"
      :format-model="format"
      class="my-picker"/>
  </div>
</template>

<script>
  export default {
    name: 'colorPicker',
    mounted() {
      console.log('color picker value', this.value.value);
    },
    props: {
      format: String,
      value: String
    }
  };
</script>

<style scoped>

</style>
