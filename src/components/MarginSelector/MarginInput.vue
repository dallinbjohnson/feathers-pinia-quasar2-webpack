<template>
  <div class="inputBackground" style="width: 100%; display: flex; flex-direction: row; align-items: center">
    <input v-if="!marginMode" :value="marginKeyValue" type="text" disabled class="margin-input"/>
    <input v-model="numberValue"
           style="flex: 1"
           type="number"
           min="0"
           :max="checkMax(pullUnit(value))"/>
    <select v-model="unitValue" style="font-size: 14px; border: 0; outline: 0; height: 25px">
      <q-tooltip>
        Select Unit
      </q-tooltip>
      <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
    </select>
    <q-btn v-if="listLength !== 1 || !marginMode" flat round size="sm" icon="close" @click="$emit('removeMargin', margin)"></q-btn>
  </div>
</template>

<script>
  export default {
    name: 'MarginInput',
    props: {
      value: {
        type: String,
        required: true
      },
      margin: {
        type: Object,
      },
      listLength: {
        type: Number,
        required: true,
      },
      listIndex: {
        type: Number,
        required: true,
      },
      marginMode: {
        type: Boolean,
        default: true,
      },
      marginKeyValue: {
        type: String,
      },
    },
    data() {
      return {
        numberValue: null,
        unitValue: null,
        units: ['px', '%'],
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            this.numberValue = this.separateValues(newVal);
            this.unitValue = this.pullUnit(newVal);
          }
        }
      },
      numberValue: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            this.$emit('input', newVal + this.unitValue);
          }
        }
      },
      unitValue: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            this.$emit('input', this.numberValue + newVal);
          }
        }
      },
      listLength: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            if (newVal === 1 || !this.marginMode) {
              this.units = ['px', '%', 'initial', 'inherit', 'auto', 'unset', 'revert'];
            } else {
              this.units = ['px', '%'];
            }
          }
        }
      },
    },
    methods: {
      checkMax(unit) {
        if (unit === '%') {
          return 100;
        } else {
          return 999;
        }
      },
      pullUnit(val) {
        if (val) {
          if (val.includes('px')) {
            return 'px';
          } else if (val.includes('em')) {
            return 'em';
          } else if (val.includes('%')) {
            return '%';
          } else if (val.includes('vw')) {
            return 'vw';
          } else if (val.includes('vh')) {
            return 'vh';
          } else if (val.includes('initial')) {
            return 'initial';
          } else if (val.includes('inherit')) {
            return 'inherit';
          } else if (val.includes('auto')) {
            return 'auto';
          } else if (val.includes('unset')) {
            return 'unset';
          } else if (val.includes('revert')) {
            return 'revert';
          } else {
            return 'px';
          }
        } else return 'px';
      },
      separateValues(value) {
        if (value) {
          if (value.includes('px') || value.includes('vw') || value.includes('vh')) {
            return Number(value.substring(0, value.length - 2));
          } else if (value.includes('%')) {
            return Number(value.substring(0, value.length - 1));
          } else if (value.includes('initial')) {
            return '';
          } else if (value.includes('inherit')) {
            return '';
          } else if (value.includes('auto')) {
            return '';
          } else if (value.includes('revert')) {
            return '';
          } else if (value.includes('unset')) {
            return '';
          } else return null;
        } else return null;
      },
    }
  };
</script>

<style scoped>
  .margin-input {
    width: 100px;
  }
  input {
    border: 0;
    outline: 0;
    background-color: #f2f2f2;
  }

  select {
    background-color: transparent;
  }

  .inputBackground {
    background-color: #f2f2f2;
  }
</style>
