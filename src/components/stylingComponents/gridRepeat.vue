<template>
  <div class="column q-my-sm">
    <div class="column" style="width: 100%">
      <div>
        <p>Column Repeat</p>
      </div>
      <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
                <select
                  style="font-size: 14px; height: 25px; width: 100%"
                  v-model="pulledValuesCol.repeat"
                  @change="buildColRepeat"
                  class="q-mb-md"
                >
                  <option>auto-fit</option>
                  <option>auto-fill</option>
                </select>
      </div>
    </div>
    <div class="column" style="width: 100%;">
      <p>Column Minimum Size</p>
      <grid-size-input v-model="pulledValuesCol.min" @input="buildColRepeat"></grid-size-input>
      <p>Column Maximum Size</p>
      <grid-size-input v-model="pulledValuesCol.max" @input="buildColRepeat"></grid-size-input>
    </div>
    <q-separator class="q-my-md" />
    <div class="column" style="width: 100%">
      <div>
        <p>Row Repeat</p>
      </div>
      <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
        <select
          style="font-size: 14px; height: 25px; width: 100%"
          v-model="pulledValuesRow.repeat"
          @change="buildRowRepeat"
          class="q-mb-md"
        >
          <option>auto-fit</option>
          <option>auto-fill</option>
        </select>
      </div>
    </div>
    <div class="column" style="width: 100%;">
      <p>Row Minimum Size</p>
      <grid-size-input v-model="pulledValuesRow.min" @input="buildRowRepeat"></grid-size-input>
      <p>Row Maximum Size</p>
      <grid-size-input v-model="pulledValuesRow.max" @input="buildRowRepeat"></grid-size-input>
    </div>
  </div>
</template>

<script>
  import GridSizeInput from 'components/stylingComponents/gridSizeInput';
  export default {
    name: 'gridRepeat',
    components: {GridSizeInput},
    props: {
      element: Object,
    },
    data() {
      return {
        pulledValuesCol: {
          repeat: '',
          min: '',
          max: ''
        },
        pulledValuesRow: {
          repeat: '',
          min: '',
          max: ''
        }
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          this.regexPull(this.$lget(newVal, 'styles.grid-template-columns', ''), 'column');
          this.regexPull(this.$lget(newVal, 'styles.grid-template-rows', ''), 'row');
        }
      }
    },
    methods: {
      buildColRepeat(){
        this.$emit('stylesUpdate', {path: 'styles.grid-template-columns',value: `repeat(${this.$lget(this.pulledValuesCol, 'repeat', 'auto-fit')}, minmax(${this.$lget(this.pulledValuesCol, 'min', '100px')}, ${this.$lget(this.pulledValuesCol, 'max', '1fr')}))`,});
      },
      buildRowRepeat(){
        this.$emit('stylesUpdate', {path: 'styles.grid-template-rows',value: `repeat(${this.$lget(this.pulledValuesCol, 'repeat', 'auto-fit')}, minmax(${this.$lget(this.pulledValuesCol, 'min', '100px')}, ${this.$lget(this.pulledValuesCol, 'max', '1fr')}))`,});
      },
      regexPull(string, type) {
        let reg3 = /repeat\((?<repeat>.*),\s*minmax\((?<min>.*),\s*(?<max>.*)\)\)/;
        if (reg3.test(string)) {
          let d = reg3.exec(string);
          if(type === 'column'){
            this.pulledValuesCol = d.groups;
          }else {
            this.pulledValuesRow = d.groups;
          }
        }
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
          } else if (val.includes('normal')) {
            return 'normal';
          } else if (val.includes('fr')) {
            return 'fr';
          } else {
            return 'px';
          }
        } else return 'px';
      },
    }
  };
</script>

<style scoped>
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

</style>
