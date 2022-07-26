<template>
  <div id="MarginPaddingInput" class="inputBackground"
       style="width: 100%; display: flex; flex-direction: row; align-items: center">
    <input v-model="numberValue"
           style="flex: 1"
           type="number"
           min="0"
           :max="checkMax(pullUnit(value))"/>
    <select v-model="unitValue">
      <q-tooltip>
        Select Unit
      </q-tooltip>
      <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
    </select>
  </div>
</template>

<script>
  import {lodash} from '@iy4u/common-client-lib';
  const {$ldebounce: debounce} = lodash;

  export default {
    name: 'gridSizeInput',
    props: {
      value: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        numberValue: null,
        unitValue: null,
        units: ['px', '%', 'fr', 'em', 'vh', 'vw'],
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
        },
      },
      numberValue: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            this.emitDebounce(newVal + this.unitValue);
          }
        },
      },
      unitValue: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            this.$emit('input', this.numberValue + newVal);
          }
        },
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
          } else if (val.includes('fr')){
            return 'fr';
          } else {
            return 'px';
          }
        } else return 'px';
      },
      separateValues(value) {
        if (value) {
          if (value.includes('px') || value.includes('vw') || value.includes('vh') || value.includes('fr')) {
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
      emitDebounce: debounce(function (value) {
        this.$emit('input', value);
      }, 370),
    },
  };
</script>

<style scoped lang="scss">

  p {
    color: #848484;
    padding: 0;
    margin: 0;
  }

  select {
    border: 0;
    outline: 0;
    background-color: #f2f2f2;
  }

  input {
    border: 0;
    outline: 0;
    background-color: #f2f2f2;
  }

  .inputBackground {
    background-color: #f2f2f2;
  }
  #MarginPaddingInput {
    .item-input {
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
  }
</style>
