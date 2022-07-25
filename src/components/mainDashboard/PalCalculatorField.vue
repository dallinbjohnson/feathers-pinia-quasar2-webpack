<template>
  <div class="q-py-md">
    <q-tabs
      v-model="selectType"
      dense
      narrow-indicator
      align="left"
      content-class="col-9 q-pb-sm"
    >
      <q-tab name="report-field"
             class="q-px-sm"
             style="font-size: small">
        report field
      </q-tab>
      <q-separator vertical inset/>
      <q-tab name="number"
             class="q-px-sm"
             style="font-size: small">
        number
      </q-tab>
    </q-tabs>

    <div class="row">
      <q-select v-if="selectType === 'report-field'"
                class="col-9"
                v-model="selection"
                label="Field"
                dense
                filled
                :options="fieldOptions"
                emit-value
                map-options
                @input="$emit('field-input', $event)">
        <template v-slot:append>{{ selection ? `$${selection}` : '' }}</template>
      </q-select>
      <q-input v-if="selectType === 'number'"
               class="col-9"
               v-model="selection"
               label="Number"
               type="number"
               dense
               filled
               @input="$emit('field-input', $event)">
        <template v-slot:prepend>$</template>
      </q-input>

      <q-select class="col-3 q-pl-md"
                v-model="operatorSelection"
                label="Operator"
                dense
                filled
                :options="operators"
                @input="$emit('add-field', $event)"></q-select>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PalCalculatorField',
    props: {
      options: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        selection: null,
        operatorSelection: null,
        selectType: 'report-field',
        operators: ['+', '-', '*', '/']
      };
    },
    computed: {
      fieldOptions() {
        return JSON.parse(JSON.stringify(this.options));
      },
    },
  };
</script>

<style scoped>

</style>
