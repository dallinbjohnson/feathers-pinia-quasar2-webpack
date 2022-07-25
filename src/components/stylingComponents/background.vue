<template>
  <div>
      <color :format="'rgba'" :element="element" :name="'Background'" :path="'styles.background-color'" @stylesUpdate="debounce">

      </color>
    <background-img :element="element" @stylesUpdate="debounce">

    </background-img>
  </div>
</template>

<script>
  import Color from 'components/common/atoms/stylingComponents/backgroundColor';
  import backgroundImg from 'components/common/atoms/stylingComponents/backgroundImg';

  export default {
    name: 'background',
    props: {
      element: Object
    },
    components: {
      Color,
      backgroundImg
    },
    methods: {
      debounce(val) {
        this.$emit('stylesUpdate', val);
      }
    }
  };
</script>

<style scoped>

</style>
