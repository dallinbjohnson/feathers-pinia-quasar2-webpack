<template>
  <transition name="__transition_flip_y" v-bind="$attrs">
    <slot></slot>
  </transition>
</template>
<script>
  export default {
    inheritAttrs: false
  };
</script>
<style>
  .__transition_flip_y-enter-active,
  .__transition_flip_y-leave-active {
    transition: all 0.6s;
  }
  .__transition_flip_y-enter,
  .__transition_flip_y-leave-to {
    transform: rotateX(540deg);
    opacity: 0
  }

  .__transition_flip_y-enter-to,
  .__transition_flip_y-leave {
    transform: rotateX(0deg);
    opacity: 1
  }

</style>
