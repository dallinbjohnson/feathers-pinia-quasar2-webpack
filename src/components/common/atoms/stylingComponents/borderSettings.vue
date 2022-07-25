<template>
  <q-card flat class="q-pa-sm" style="border-top: 1px solid rgba(220, 220, 220, 0.9);height: 100%;overflow: scroll;">
    <q-card-section class="cardSection">
      <div v-if="border" class="flex justify-between q-pa-sm">
        <q-btn outline icon="add" size="sm" color="positive" label="All Border" @click="initialBorder('setAll')"/>
        <q-btn outline icon="remove" size="sm" color="negative" @click="removeBorder" label="Remove All"/>
      </div>

      <div style="display: flex; justify-content: flex-start;" v-if="bordersSame">
        <div class="flex items-center">
          <span class="text-weight-light q-mr-md">Border Color</span>
          <q-avatar size="30px" style="border: 1px solid black;"
                    :style="{background: colorAll}" class="cursor-pointer hoverColorPicker"
                    @click="allBorderColor = !allBorderColor"></q-avatar>
          <transition name="slide-fade">
            <div style="width: 100%; display: flex;flex-direction: row;position: absolute;top: 0;left: 0;z-index: 1;"
                 v-if="allBorderColor">
              <div style="display: flex; flex-direction: column;">
                <q-btn round color="positive" icon="check" class="q-mb-sm q-mr-sm"
                       @click="initialBorder(setColor)"></q-btn>
                <q-btn round color="negative" icon="close" class="q-mb-sm q-mr-sm"
                       @click="allBorderColor = false"></q-btn>
              </div>
              <ColorPicker
                :value="$lget(element, 'styles.border-top', '0 0 0').split(' ')[2]"
                @colorPicker="setColor = $event"
              />
            </div>
          </transition>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-start;align-items: center;" v-if="bordersSame" class="q-mt-sm">
        <div class="flex items-center">
          <span class=" text-weight-light q-mr-md">Border Width (px)</span>
        </div>
        <div class="inputBackground" style="display: flex; flex-direction: row; align-items: center;">
          <input
            style="width: 100%;"
            :value="separateValues($lget(element, 'styles.border-top', '0 0 0').split(' ')[0])"
            @input="initialBorder('setWidth', $event)"
            type="number"
            min="0"
          />
        </div>
      </div>
      <div style="display: flex; justify-content: flex-start;align-items: center;" v-if="bordersSame" class="q-mt-sm">
        <div class="flex items-center">
          <span class=" text-weight-light q-mr-md">Border Style</span>
        </div>
        <div class="inputBackground" style="display: flex; flex-direction: row; align-items: center;">
          <select
            :value="$lget(element, 'styles.border-top', '0 0 0').split(' ')[1]"
            @change="initialBorder($event.target.value)"
            style="width: 80px;"
          >
            <option v-for="unit in borderStyles" :key="unit" :value="unit">{{ unit }}</option>
          </select>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-start;align-items: center;" class="q-mt-sm">
        <div style="display: flex; flex-direction: row;">
          <span class=" text-weight-light">Border Radius (px) </span>
          <q-icon name="help" size="xs" class="cursor-pointer q-mr-sm">
            <q-tooltip>
              Border radius rounds the corners of an element.
            </q-tooltip>
          </q-icon>
        </div>
        <div class="inputBackground" style="display: flex; flex-direction: row; align-items: center;">
          <input
            style="width: 100%;"
            :value="separateValues($lget(element, 'styles.border-radius'))"
            @input="emitDebounce($event.target.value + 'px', 'styles.border-radius')"
            type="number"
            min="0"
          />
        </div>
      </div>
    </q-card-section>
    <transition name="slide-fade">
      <q-card-section class="flex flex-center q-mt-md" v-if="border">
        <div class="column">
          <div class="addButton">
            <q-btn round icon="add" size="sm" color="black" @click="editing.top = !editing.top"/>
            <transition name="slide-fade">
              <border-editing v-if="editing.top" position="top"
                              :element-border-properties="$lget(element, 'styles.border-top')"
                              @close="editing.top = false"
                              @changeColor="$emit('stylesUpdate', $event)"></border-editing>
            </transition>
          </div>
          <div class="row">
            <div class="addButton">
              <q-btn round icon="add" size="sm" color="black" @click="editing.left = !editing.left"/>
              <transition name="slide-fade">
                <border-editing v-if="editing.left" position="left"
                                :element-border-properties="$lget(element, 'styles.border-left')"
                                @close="editing.left = false"
                                @changeColor="$emit('stylesUpdate', $event)"></border-editing>
              </transition>
            </div>
            <div class="borderBox"
                 :style="borderBoxStyles"></div>
            <div class="addButton">
              <q-btn round icon="add" size="sm" color="black" @click="editing.right = !editing.right"/>
              <transition name="slide-fade">
                <border-editing v-if="editing.right" position="right"
                                :element-border-properties="$lget(element, 'styles.border-right')"
                                @close="editing.right = false"
                                @changeColor="$emit('stylesUpdate', $event)"></border-editing>
              </transition>
            </div>
          </div>
          <div class="addButton">
            <q-btn round icon="add" size="sm" color="black" @click="editing.bottom = !editing.bottom"/>
            <transition name="slide-fade">
              <border-editing v-if="editing.bottom" position="bottom" @close="editing.bottom = false"
                              :element-border-properties="$lget(element, 'styles.border-bottom')"
                              @changeColor="$emit('stylesUpdate', $event)"></border-editing>
            </transition>
          </div>
        </div>
      </q-card-section>
    </transition>


  </q-card>
</template>

<script>
  import ColorPicker from 'components/common/atoms/stylingComponents/colorPicker';
  import BorderEditing from 'components/common/atoms/stylingComponents/border/borderEditing';

  import {lodash} from '@iy4u/common-client-lib';
  const {$ldebounce: debounce} = lodash;

  export default {
    name: 'borderSettings',
    components: {
      BorderEditing,
      ColorPicker,
    },
    props: {
      element: Object,
    },
    mounted() {
      this.initShadowValues();
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal) {
          if (newVal && newVal !== oldVal) {
            if (this.$lget(newVal, 'styles.border-top', false)) {
              this.colorAll = this.$lget(this.element, 'styles.border-top', '0 0 0').split(' ')[2];
              this.setColor = this.$lget(this.element, 'styles.border-top', '0 0 0').split(' ')[2];
            } else {
              this.colorAll = '';
            }
            if (this.$lget(newVal, '_id') !== this.$lget(oldVal, '_id')) {
              this.editing.top = false;
              this.editing.bottom = false;
              this.editing.right = false;
              this.editing.left = false;
            }
          }
        },
      },
    },
    data() {
      return {
        colorAll: 'none',
        setColor: '#000000',
        allBorderColor: false,
        units: ['px', '%'],
        borderStyles: ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'inset', 'outset', 'ridge'],
        borders: [],
        border: true,
        editing: {
          top: false,
          bottom: false,
          right: false,
          left: false,
        },
        shadowOptions: {
          units: ['px'],
          unitValue: 'px',
          verticalOffset: 0,
          horizontalOffset: 0,
          spread: 0,
          blur: 0,
          color: 'rgba(0, 0, 0, 0.5)',
          type: 'outset',
        },
      };
    },
    computed: {
      bordersSame() {
        let topBorder = this.$lget(this.element, 'styles.border-top', false);
        let bottomBorder = this.$lget(this.element, 'styles.border-bottom', false);
        let leftBorder = this.$lget(this.element, 'styles.border-left', false);
        let rightBorder = this.$lget(this.element, 'styles.border-right', false);
        return topBorder === bottomBorder && topBorder === leftBorder && topBorder === rightBorder;
      },
      whichBorders() {
        let borders = [];
        let topBorder = this.$lget(this.element, 'styles.border-top', false);
        let bottomBorder = this.$lget(this.element, 'styles.border-bottom', false);
        let leftBorder = this.$lget(this.element, 'styles.border-left', false);
        let rightBorder = this.$lget(this.element, 'styles.border-right', false);
        if (topBorder) {
          borders.push('top');
        }
        if (bottomBorder) {
          borders.push('bottom');
        }
        if (leftBorder) {
          borders.push('left');
        }
        if (rightBorder) {
          borders.push('right');
        }
        return borders;
      },
      borderBoxStyles() {
        let topBorder = this.$lget(this.element, 'styles.border-top');
        let bottomBorder = this.$lget(this.element, 'styles.border-bottom');
        let leftBorder = this.$lget(this.element, 'styles.border-left');
        let rightBorder = this.$lget(this.element, 'styles.border-right');
        let borderRadius = this.$lget(this.element, 'styles.border-radius');
        if (topBorder === undefined && bottomBorder === undefined && leftBorder === undefined && rightBorder === undefined) {
          return {'border-radius': borderRadius};
        } else {
          return {
            'border-top': topBorder,
            'border-bottom': bottomBorder,
            'border-left': leftBorder,
            'border-right': rightBorder,
            'border-radius': borderRadius,
          };
        }
      },
    },
    methods: {
      removeBorder() {
        if (this.borderBoxStyles.length === 1) {
          this.$infoNotify('There are already no border styles on this element.');
        } else {
          this.$q.dialog({
            cancel: true,
            title: 'Remove Border',
            message: 'This will remove all border styles from this element',
          }).onOk(() => {
            this.$emit('stylesUpdate', [
              {path: 'styles.border-top', value: '$unset'},
              {path: 'styles.border-right', value: '$unset'},
              {path: 'styles.border-bottom', value: '$unset'},
              {path: 'styles.border-left', value: '$unset'},
            ]);
          });
        }
      },
      initShadowValues() {
        let shadow = this.$lget(this.element, 'styles.box-shadow');
        if (shadow) {
          let shadowArr = shadow.split(' ');
          this.shadowOptions.horizontalOffset = this.separateValues(shadowArr[0]);
          this.shadowOptions.verticalOffset = this.separateValues(shadowArr[1]);
          this.shadowOptions.blur = this.separateValues(shadowArr[2]);
          this.shadowOptions.spread = this.separateValues(shadowArr[3]);
          this.shadowOptions.color = shadowArr[4];
          this.shadowOptions.type = shadowArr[5];
          if (shadowArr[5]) {
            this.shadowOptions.type = 'inset';
          } else {
            this.shadowOptions.type = 'outset';
          }
        }
      },
      emitColor(val) {
        this.$emit('stylesUpdate', {path: `styles.border${this.currentBorder}-color`, value: val});
      },
      initialBorder(color, $event) {
        if (color === 'setAll') {
          this.$emit('stylesUpdate', [
            {path: 'styles.border-top', value: '1px solid #000000'},
            {path: 'styles.border-right', value: '1px solid #000000'},
            {path: 'styles.border-bottom', value: '1px solid #000000'},
            {path: 'styles.border-left', value: '1px solid #000000'},
          ]);
        } else {
          if (color === 'setWidth') {
            let numberValue = $event.target.value;
            let currStyle = this.$lget(this.element, 'styles.border-top', '0 0 0').split(' ')[1];
            this.$emit('stylesUpdate', [
              {path: 'styles.border-top', value: `${numberValue}px ${currStyle} ${this.setColor}`},
              {path: 'styles.border-right', value: `${numberValue}px ${currStyle} ${this.setColor}`},
              {path: 'styles.border-bottom', value: `${numberValue}px ${currStyle} ${this.setColor}`},
              {path: 'styles.border-left', value: `${numberValue}px ${currStyle} ${this.setColor}`},
            ]);
          } else if (this.borderStyles.includes(color)) {
            let otherNumberValue = this.$lget(this.element, 'styles.border-top', '0 0 0').split(' ')[0];
            this.$emit('stylesUpdate', [
              {path: 'styles.border-top', value: `${otherNumberValue} ${color} ${this.setColor}`},
              {path: 'styles.border-right', value: `${otherNumberValue} ${color} ${this.setColor}`},
              {path: 'styles.border-bottom', value: `${otherNumberValue} ${color} ${this.setColor}`},
              {path: 'styles.border-left', value: `${otherNumberValue} ${color} ${this.setColor}`},
            ]);
            this.allBorderColor = false;
          } else {
            let otherNumberValue = this.$lget(this.element, 'styles.border-top', '0 0 0').split(' ')[0];
            let currStyle = this.$lget(this.element, 'styles.border-top', '0 0 0').split(' ')[1];
            this.$emit('stylesUpdate', [
              {path: 'styles.border-top', value: `${otherNumberValue} ${currStyle} ${color}`},
              {path: 'styles.border-right', value: `${otherNumberValue} ${currStyle} ${color}`},
              {path: 'styles.border-bottom', value: `${otherNumberValue} ${currStyle} ${color}`},
              {path: 'styles.border-left', value: `${otherNumberValue} ${currStyle} ${color}`},
            ]);
            this.allBorderColor = false;
          }
        }
      },
      separateValues(value) {
        // console.log('this is the value', value);
        if (value) {
          if (value.includes('px')) {
            return Number(value.substring(0, value.length - 2));
          } else if (value.includes('%')) {
            return Number(value.substring(0, value.length - 1));
          } else return null;
        } else return null;
      },
      pullUnit(val) {
        // console.log('this is the pull unit', val);
        if (val.includes('rem')) {
          return 'rem';
        } else if (val.includes('px')) {
          return 'px';
        } else if (val.includes('em')) {
          return 'em';
        } else if (val.includes('%')) {
          return '%';
        } else if (val.includes('initial')) {
          return 'initial';
        } else if (val.includes('inherit')) {
          return 'inherit';
        } else if (val.includes('auto')) {
          return 'auto';
        } else if (val.includes('none')) {
          return 'none';
        } else return 'px';
      },
      emitDebounce: debounce(function (value, path) {
        this.$emit('stylesUpdate', {
          path,
          value,
        });
      }, 370),
    },
  };
</script>

<style scoped>
  p {
    color: #848484;
    margin: 0;
    padding: 0;
  }

  input {
    border: 0;
    outline: 0;
    background-color: #f2f2f2;
  }

  select {
    background-color: #f2f2f2;
    font-size: 14px;
    border: 0;
    outline: 0;
    height: 25px;
    width: 100%;
  }

  .inputBackground {
    background-color: #f2f2f2;
    width: 80px;
  }

  .selectBackground {
    padding: 3px 2px;
    border: 0;
    outline: 0;
  }

  .cardSection {
    padding: 0
  }

  .cardSection {
    padding: 0
  }

  .addButton {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 8px;
    position: relative;
  }

  .slide-fade-enter-active {
    transition: all .5s ease;
  }

  .slide-fade-leave-active {
    transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    transform: translateX(50px);
    opacity: 0;
  }

  .borderBox {
    width: 130px;
    height: 130px;
    background: rgba(235, 235, 235, 0.9);
  }

  .hoverColorPicker:hover {
    transform: scale(1.05);
  }
</style>
