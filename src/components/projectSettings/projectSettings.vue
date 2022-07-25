<template>
  <q-card id="projectSettings">
    <div class="flex justify-end">
      <q-icon right name="close" size="sm" @click.stop="$emit('close')"/>
    </div>
    <q-card-section>
      <div>Privacy</div>
    </q-card-section>
    <q-card-section>
      <div>Shared Access</div>
    </q-card-section>
    <q-card-section>
      <div>More to come</div>
    </q-card-section>
    <q-card-section class="flex ">
      <div class="self-center">Delete Project</div>
      <q-btn color="red" flat icon="delete" @click.stop="removeDialog = true"/>

    </q-card-section>

    <q-dialog v-model="removeDialog" seamless>
      <q-card>
        <q-card-section>
          <h4>Are you sure you want to remove this project and all of its pages?</h4>
          <q-card-actions style="width: 100%; display: flex; justify-content: flex-end">
            <q-btn flat @click.stop="removeDialog = false">Cancel</q-btn>
            <q-btn color="red" @click.stop="$emit('deleteProject')">Delete</q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script>
  export default {
    name: 'projectSettings',
    props: {
      project: Object,
    },
    data() {
      return {
        removeDialog: false
      };
    },
    created() {
    },
    mounted() {
    },
    computed: {},
    watch: {},
    methods: {},
  };
</script>

<style scoped lang="scss">
  #projectSettings {
    min-width: 300px;
    min-height: 300px
  }
</style>
