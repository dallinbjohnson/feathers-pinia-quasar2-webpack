<template>
  <transition name="__transition_flip" v-bind="$attrs">
    <slot></slot>
  </transition>
</template>
<script>
  export default {
    inheritAttrs: false
  };
</script>
<style>
  .__transition_flip-enter-active,
  .__transition_flip-leave-active {
    transition: transform 0.6s;
  }
  .__transition_flip-enter,
  .__transition_flip-leave-to {
    transform: rotateY(180deg);
  }
</style>
