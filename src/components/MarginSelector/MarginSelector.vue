<template>
  <div id="MarginSelector">
    <div style="display: flex; align-items: center;">
      <p style="color: #404040; font-weight: bold">{{ isMarginMode ? 'Margin' : 'Separate Margins' }}</p>
      <q-checkbox v-model="isMarginMode" @input="$emit('update:marginMode', $event)"></q-checkbox>
    </div>
    <div class="row q-col-gutter-md">
      <div v-for="(margin, index) in margins"
           :key="index"
           :class="isMarginMode ? 'col-6' : 'col-12'">
        <p v-if="isMarginMode">{{ marginTitle(index) }}</p>
        <margin-input v-model="margin.value"
                      :margin="margin"
                      :listLength="margins.length"
                      :listIndex="index"
                      :marginMode="isMarginMode"
                      :marginKeyValue="margin.marginKeyValue"
                      :marginTypes="marginTypes"
                      @removeMargin="removeMargin"></margin-input>
      </div>
    </div>
    <div class="q-mt-sm" style="display: flex; justify-content: flex-end">
      <div v-if="!isMarginMode && margins.length !== 4" class="inputBackground">
        <select v-model="marginKeyValue"
                style="font-size: 14px; border: 0; outline: 0; height: 25px">
          <q-tooltip>
            Select margin
          </q-tooltip>
          <option v-for="marginType in marginTypes" :key="marginType" :value="marginType">{{ marginType }}</option>
        </select>
        <q-btn v-if="margins.length !== 4" flat round size="sm" icon="add" @click="addMargin"></q-btn>
      </div>
      <q-btn v-if="isMarginMode && margins.length !== 4" flat round size="sm" icon="add" @click="addMargin"></q-btn>
    </div>
  </div>
</template>

<script>
  import MarginInput from './MarginInput';

  export default {
    name: 'MarginSelector',
    components: {
      MarginInput,
    },
    props: {
      element: Object,
      marginMode: {
        type: Boolean,
      },
    },
    data() {
      return {
        isMarginMode: true,
        marginKeyValue: 'margin-top',
        marginTypes: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
        margins: [],
        elementData: {},
      };
    },
    watch: {
      marginMode: {
        immediate: true,
        handler(newVal) {
          this.isMarginMode = newVal;
        },
      },
      isMarginMode: {
        immediate: true,
        handler(newVal) {
          // this.fixMarginTypes();

          if (newVal) {
            this.margins = this.$lget(this.elementData, 'styles.margin', '0px').split(' ').map(item => {
              return {value: item};
            });
          } else {
            this.margins = [];
            this.marginTypes.forEach(marginKey => {
              let margin_val = this.$lget(this.elementData, `styles.${marginKey}`);
              console.log('this.elementData', Object.assign({}, this.elementData));
              if (margin_val) {
                this.margins.push({value: margin_val, marginKeyValue: marginKey});
                this.marginTypes = this.marginTypes.filter(item => item !== marginKey);
              }
            });
          }

          this.fixMarginTypes();
        },
      },
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.elementData = this.$lcloneDeep(newVal);
            if (this.$lget(this.elementData, 'styles.margin')) {
              this.isMarginMode = true;
              this.$emit('update:marginMode', this.isMarginMode);
            } else if (this.marginTypes.map(marginKey => this.$lget(this.elementData, `styles.${marginKey}`)).some(item => !!item)) {
              this.isMarginMode = false;
              this.$emit('update:marginMode', this.isMarginMode);
            }

            if (this.isMarginMode) {
              this.margins = this.$lget(this.elementData, 'styles.margin', '0px').split(' ').map(item => {
                return {value: item};
              });
            } else {
              this.marginTypes.forEach(marginKey => {
                let margin_val = this.$lget(this.elementData, `styles.${marginKey}`);
                if (margin_val) {
                  this.margins.push({value: margin_val, marginKeyValue: marginKey});
                  this.marginTypes = this.marginTypes.filter(item => item !== marginKey);
                }
              });
              console.log(this.margins);
            }
          }
        },
      },
      margins: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal.length) {
            if (!this.isMarginMode) {
              newVal.forEach(item => {
                this.debounce({path: `styles.${item.marginKeyValue}`, value: item.value});
              });
            } else {
              this.debounce({path: 'styles.margin', value: newVal.map(item => item.value).join(' ')});
            }
          }
        },
      },
    },
    methods: {
      fixMarginTypes() {
        if (this.marginTypes.length === 0 && this.margins.length === 0) {
          this.marginTypes = ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'];
          this.marginKeyValue = this.marginTypes[0];
        }
      },
      addMargin() {
        if (this.margins.length < 4) {
          if (!this.isMarginMode) {
            this.marginTypes = this.marginTypes.filter(item => item !== this.marginKeyValue);
            this.margins.push({value: '0px', marginKeyValue: this.marginKeyValue});
            this.marginKeyValue = this.marginTypes[0];
          } else {
            this.margins.push({value: '0px'});
          }
        }
      },
      removeMargin(margin) {
        if (!this.isMarginMode) {
          // this.margins = this.margins.map(item => {
          //   if (item.marginKeyValue === margin.marginKeyValue) {
          //     item.value = '$unset';
          //   }
          //   return item;
          // });
          this.margins = this.margins.filter(item => item.marginKeyValue !== margin.marginKeyValue);
          this.marginTypes.push(margin.marginKeyValue);
          this.marginKeyValue = margin.marginKeyValue;
        } else {
          if (this.margins.length > 1) {
            this.margins.pop();
          }
        }
      },
      marginTitle(index) {
        if (this.margins.length === 1 && index === 0) {
          return 'All';
        } else if (this.margins.length === 2 && index === 0) {
          return 'Top Bottom';
        } else if (this.margins.length === 2 && index === 1) {
          return 'Right Left';
        } else if (this.margins.length === 3 && index === 1) {
          return 'Right Left';
        } else if ((this.margins.length === 3 && index === 0) || index === 0) {
          return 'Top';
        } else if (index === 1) {
          return 'Right';
        } else if ((this.margins.length === 3 && index === 2) || index === 2) {
          return 'Bottom';
        } else if (index === 3) {
          return 'Left';
        } else {
          return '';
        }
      },
      debounce(val) {
        this.$lset(this.elementData, val.path, val.value);
        this.$emit('stylesUpdate', {path: val.path, value: val.value});
      },
    },
  };
</script>

<style scoped lang="scss" src="./_MarginSelector.scss">

</style>
