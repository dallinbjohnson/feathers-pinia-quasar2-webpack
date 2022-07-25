<template>
  <div id="MarginPaddingInput" class="inputBackground"
       style="width: 100%; display: flex; flex-direction: row; align-items: center">
    <input v-if="!itemMode" :value="itemKey" type="text" disabled class="item-input"/>
    <input v-if="!units_only.includes(unitValue)"
           v-model="numberValue"
           style="flex: 1"
           type="number"
           min="0"
           :max="checkMax(pullUnit(value))"/>
    <select v-model="unitValue"
            :style="`font-size: 14px; border: 0; outline: 0; height: 25px; ${units_only.includes(unitValue) ? 'flex: 1': ''}`">
      <q-tooltip>
        Select Unit
      </q-tooltip>
      <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
    </select>
    <q-btn flat round size="sm" icon="close" @click="$emit('removeItem', item, listIndex)"></q-btn>
  </div>
</template>

<script>
  import {lodash} from '@iy4u/common-client-lib';
  const {$ldebounce: debounce} = lodash;

  export default {
    name: 'MarginPaddingInput',
    props: {
      value: {
        type: String,
        required: true,
      },
      item: {
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
      itemMode: {
        type: Boolean,
        default: true,
      },
      itemKey: {
        type: String,
      },
    },
    data() {
      return {
        numberValue: null,
        unitValue: null,
        units: ['px', '%', 'initial', 'inherit', 'auto', 'unset', 'revert'],
        units_only: ['initial', 'inherit', 'auto', 'unset', 'revert'],
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
            if (this.units_only.includes(this.unitValue)) {
              this.$emit('input', this.unitValue);
            } else {
              this.$emit('input', this.numberValue + newVal);
            }
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
      emitDebounce: debounce(function(value){
        this.$emit('input', value);
      }, 370),
    },
  };
</script>

<style scoped lang="scss">
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
