<template>
  <q-card class="q-pa-sm">
    <q-card-section class="cardSection">
      <div class="row q-pa-sm">
        <div class="column" style="width: 50%">
          <div>
            <p>Width</p>
          </div>
          <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <input
              style="width: 100%"
              :value="separateValues($lget(elementData, 'styles.width'))"
              @input="emitDebounce($event, 'styles.width')"
              type="number"
              :disabled="disableCheck($lget(elementData, 'styles.width', 'auto'))"
              min="0"
            />
            <select
              :value="pullUnit($lget(elementData, 'styles.width'))"
              @change="emitCheck(elementData, $event.target.value,'styles.width')"
            >
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in widthUnits" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

        <q-space/>

        <div class="column" style="width: 50%">
          <div>
            <p>Height</p>
          </div>
          <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <input
              style="width: 100%"
              :value="separateValues($lget(elementData, 'styles.height', 'auto'))"
              @input="emitDebounce($event, 'styles.height')"
              type="number"
              :disabled="disableCheck($lget(elementData, 'styles.height', 'auto'))"
              min="0"
            />
            <select
              :value="pullUnit($lget(elementData, 'styles.height', 'auto'))"
              @change="emitCheck(elementData, $event.target.value, 'styles.height')"
            >
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in heightUnits" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

      </div>
    </q-card-section>

    <q-card-section class="cardSection">
      <div class="row q-pa-sm">

        <div class="column" style="width: 50%">
          <div>
            <p>Min-Width</p>
          </div>
          <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <input
              style="width: 100%"
              :value="separateValues($lget(elementData, 'styles.min-width', 'auto'))"
              @input="emitDebounce($event, 'styles.min-width')"
              type="number"
              :disabled="disableCheck($lget(elementData, 'styles.min-width', 'auto'))"
              min="0"
            />
            <select
              :value="pullUnit($lget(elementData, 'styles.min-width', 'auto'))"
              @change="emitCheck(elementData, $event.target.value, 'styles.min-width')"
            >
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in widthUnits" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

        <q-space/>

        <div class="column" style="width: 50%">
          <div>
            <p>Max Width</p>
          </div>
          <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <input
              style="width: 100%"
              :value="separateValues($lget(elementData, 'styles.max-width', 'auto'))"
              @input="emitDebounce($event, 'styles.max-width')"
              type="number"
              :disabled="disableCheck($lget(elementData, 'styles.max-width', 'auto'))"
              min="0"
            />
            <select
              :value="pullUnit($lget(elementData, 'styles.max-width', 'auto'))"
              @change="emitCheck(elementData, $event.target.value, 'styles.max-width')"
            >
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in widthUnits" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

      </div>
    </q-card-section>

    <q-card-section class="cardSection">
      <div class="row q-pa-sm">

        <div class="column" style="width: 50%">
          <div>
            <p>Min-Height</p>
          </div>
          <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <input
              style="width: 100%"
              :value="separateValues($lget(elementData, 'styles.min-height', 'auto'))"
              @input="emitDebounce($event, 'styles.min-height')"
              type="number"
              :disabled="disableCheck($lget(elementData, 'styles.min-height', 'auto'))"
              min="0"
            />
            <select
              :value="pullUnit($lget(elementData, 'styles.min-height', 'auto'))"
              @change="emitCheck(elementData, $event.target.value, 'styles.min-height')"
            >
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in heightUnits" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

        <q-space/>

        <div class="column" style="width: 50%">
          <div>
            <p>Max Height</p>
          </div>
          <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <input
              style="width: 100%"
              :value="separateValues($lget(elementData, 'styles.max-height', 'auto'))"
              @input="emitDebounce($event, 'styles.max-height')"
              type="number"
              :disabled="disableCheck($lget(elementData, 'styles.max-height', 'auto'))"
              min="0"
            />
            <select
              :value="pullUnit($lget(elementData, 'styles.max-height', 'auto'))"
              @change="emitCheck(elementData, $event.target.value, 'styles.max-height')"
            >
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in heightUnits" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

      </div>
    </q-card-section>

    <q-card-section class="cardSection">
      <margin-padding-selector styleName="padding"
                               :element="elementData"
                               @stylesUpdate="debounce"></margin-padding-selector>
    </q-card-section>

    <q-card-section class="cardSection">
      <!--      <margin-selector :element="elementData"></margin-selector>-->
      <margin-padding-selector :element="elementData"
                               @stylesUpdate="debounce"></margin-padding-selector>
    </q-card-section>
  </q-card>
</template>

<script>
  // import MarginSelector from 'components/MarginSelector/MarginSelector';
  import MarginPaddingSelector from 'components/MarginPaddingSelector/MarginPaddingSelector';
  import {lodash} from '@iy4u/common-client-lib';
  const {$ldebounce: debounce} = lodash;

  export default {
    name: 'dimension',
    components: {
      // MarginSelector,
      MarginPaddingSelector,
    },
    props: {
      element: Object,
    },
    data() {
      return {
        widthUnits: ['$unset', 'px', '%', 'vw', 'initial', 'inherit', 'auto', 'revert'],
        heightUnits: ['$unset', 'px', '%', 'vh', 'initial', 'inherit', 'auto', 'revert'],
        units: ['px', '%'],
        timer: new this.$timer(),
        elementData: {},
        changed: false,
      };
    },
    computed: {
      currentDomElement() {
        return document.getElementById(this.$lget(this.elementData, '_id'));
      },
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.elementData = newVal;
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
      emitCheck(elementData, eventValue, path) {
        if (eventValue === 'initial' || eventValue === 'inherit' || eventValue === 'auto' || eventValue === 'unset' || eventValue === 'revert') {
          this.elementData = Object.assign({}, this.$lset(this.elementData, path, this.separateValues(this.$lget(elementData, path, '0%')) + eventValue));
          this.$emit('stylesUpdate', {path: path, value: eventValue});
        } else {
          this.elementData = Object.assign({}, this.$lset(this.elementData, path, this.separateValues(this.$lget(elementData, path, '0%')) + eventValue));
          this.$emit('stylesUpdate', {
            path: path,
            value: this.separateValues(this.$lget(elementData, path, '0%')) + eventValue,
          });
        }
      },
      disableCheck(value) {
        if (value.includes('initial')) {
          return true;
        } else if (value.includes('inherit')) {
          return true;
        } else if (value.includes('auto')) {
          return true;
        } else if (value.includes('unset')) {
          return true;
        } else if (value.includes('revert')) {
          return true;
        } else return false;
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
      debounce(val) {
        if (!Array.isArray(val)) {
          val = [val];
        }
        let changes = val.reduce((acc, curr) => {
          let ele_val = this.$lget(this.element, curr.path);
          if (ele_val !== curr.value) {
            if (curr.value === '$unset') {
              this.$lunset(this.elementData, curr.path);
            } else {
              this.elementData = Object.assign({}, this.$lset(this.elementData, curr.path, curr.value));
            }
            acc.push(curr);
          }
          return acc;
        }, []);

        if (changes.length) {
          this.$emit('stylesUpdate', changes);
        }
      },
      emitDebounce: debounce(function($event, path){
        let ele_val = this.$lget(this.element, path);
        if (ele_val !== $event.target.value) {
          this.elementData = Object.assign({}, this.$lset(this.elementData, path, $event.target.value + this.pullUnit(this.$lget(this.elementData, path))));
          this.$emit('stylesUpdate', {path: path, value: $event.target.value + this.pullUnit(this.$lget(this.elementData, path))});
        }
      }, 370),
    },
  };
</script>

<style scoped>


  p {
    color: #848484;
    padding: 0;
    margin: 0;
  }

  input {
    border: 0;
    outline: 0;
    background-color: #f2f2f2;
  }

  select {
    background-color: transparent;
    font-size: 14px;
    border: 0;
    outline: 0;
    height: 25px;
  }

  .cardSection {
    padding: 0
  }

  .inputBackground {
    background-color: #f2f2f2;
  }
</style>
