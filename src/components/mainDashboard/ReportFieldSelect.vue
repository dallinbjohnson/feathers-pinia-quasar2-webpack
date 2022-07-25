<template>
  <div>
    <q-select
      filled
      :value="value"
      @input="$emit('input', $event)"
      :options="options"
      v-bind="$attrs"
      :disable="loading"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            No results
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-linear-progress v-if="loading" size="xs" rounded indeterminate color="secondary"/>
  </div>
</template>

<script>
  export default {
    name: 'ReportFieldSelect',
    props: {
      options: {
        type: Array,
        required: true,
      },
      value: {
        type: [Object, String, Number, Array],
        required: true,
      },
      loading: {
        type: Boolean,
      }
    },
    computed: {
      // fieldOptions() {
      //   return JSON.parse(JSON.stringify(this.fieldOptions));
      // },
    },
  };
</script>

<style scoped>

</style>
