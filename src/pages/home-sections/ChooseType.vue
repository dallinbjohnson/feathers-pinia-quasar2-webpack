<template>
  <div class="full-width q-pb-xl">
    <div class="row justify-center">
      <div style="width: 1000px; max-width: 100%;">
        <div class="row justify-center q-py-md">
          <div class="text-md text-mb-md">Not sure which option fits you?</div>
        </div>
        <div class="row justify-center q-pb-xl q-mb-xl">
          <q-btn @click="$emit('open')" push size="lg" icon="mdi-video" color="blue">Book A Zoom Meeting</q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ChooseType'
  };
</script>

<style scoped>

</style>
