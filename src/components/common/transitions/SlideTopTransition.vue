<template>
  <transition name="__transition_slide_top" v-bind="$attrs">
    <slot></slot>
  </transition>
</template>
<script>
  export default {
    inheritAttrs: false
  };
</script>
<style>
  .__transition_slide_top-enter-active,
  .__transition_slide_top-leave-active {
    transition: transform 0.6s;
  }
  .__transition_slide_top-enter{
    transform: translate(0, -110%)
  }
  .__transition_slide_top-leave-to {
    transform: translate(0, 110%)
  }
</style>
