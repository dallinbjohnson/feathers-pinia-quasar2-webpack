<template>
  <div>
    <q-card>
      <q-card-section>
        <component
          v-for="(component, index) in fieldComps"
          :key="index"
          :is="component"
          v-bind="{options}"
          @add-field="addField(index, $event)"
          @field-input="updateFormula(index, $event)"
        />
      </q-card-section>
      <q-separator v-if="result" inset/>
      <q-card-section v-if="result" class="q-pa-lg" style="display: flex; flex-direction: column; align-items: center">
        <h5 class="q-ma-none">Result</h5>
        <div style="font-size: 2.5em">${{ result }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
  import PalCalculatorField from 'components/mainDashboard/PalCalculatorField';

  export default {
    name: 'PalCalculator',
    components: {PalCalculatorField},
    props: {
      options: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        result: null,
        fieldComps: [PalCalculatorField],
        stuffToCalculate: [{
          value: 0,
          operator: undefined,
          indexOfForm: 0,
        }],
      };
    },
    methods: {
      addField(index, operator) {
        this.stuffToCalculate.find(i => i.indexOfForm === index).operator = operator;
        if (!this.stuffToCalculate.find(i => i.indexOfForm === index + 1)) {
          this.fieldComps.push(PalCalculatorField);
          this.stuffToCalculate.push({
            value: 0,
            operator: undefined,
            indexOfForm: index + 1,
          });
        }
      },
      updateFormula(index, data) {
        this.stuffToCalculate.find(i => i.indexOfForm === index).value = data;
        this.calculate();
      },
      calculate() {
        let result = 0;
        this.stuffToCalculate.map((v, i, arr) => {
          if (i === 0) {
            result = Number(v.value);
          }
          if (v.operator && arr[i + 1]) {
            let nextVal = Number(arr[i + 1].value);
            switch (v.operator) {
              case '+':
                if (!nextVal) {
                  nextVal = 0;
                }
                result += nextVal;
                break;
              case '-':
                if (!nextVal) {
                  nextVal = 0;
                }
                result -= nextVal;
                break;
              case '*':
                if (!nextVal) {
                  nextVal = 1;
                }
                result *= nextVal;
                break;
              case '/':
                if (!nextVal) {
                  nextVal = 1;
                }
                result /= nextVal;
                break;
            }
          }
        });
        this.result = result;
        this.$emit('calculated', result);
      },
    },
  };
</script>

<style scoped>

</style>
