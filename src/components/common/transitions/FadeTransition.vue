<template>
  <transition name="fade" v-bind="$attrs">
    <slot></slot>
  </transition>
</template>
<script>
  export default {
    inheritAttrs: false
  };
</script>
<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-leave,
  .fade-enter-to {
    opacity: 1;
  }
</style>
