<template>
  <q-page class="flex flex-center">
<!--    <div style="height: 700px; width: 800px;">-->
      <wpb-editor></wpb-editor>
<!--    </div>-->
  </q-page>
</template>

<script>
  import WpbEditor from './WpbEditor/WpbEditor';

  export default {
    name: 'WpbEditorPage',
    components: {
      WpbEditor,
    },
  };
</script>

<style scoped>

</style>
