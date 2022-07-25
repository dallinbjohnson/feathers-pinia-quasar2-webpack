<template>
  <div class="borderEditContainer q-pa-xs" :style="positionStyles">
    <div style="text-transform: capitalize;" class="q-ml-xs">
      {{position}} Border
    </div>
    <div style="display: flex;justify-content: flex-end;">
      <q-btn @click="$emit('close')" round icon="close" color="red" size="sm" style="position: absolute;top: -10px;"></q-btn>
    </div>
    <div>
      <div style="display: flex; justify-content: flex-start;">
        <div class="flex items-center">
          <span class="text-weight-light q-mr-md">Border Color</span>
          <q-avatar size="30px" style="border: 1px solid black;"
                    :style="{background: elementBorderProperties.split(' ')[2]}" class="cursor-pointer"
                    @click="changeColor = !changeColor"></q-avatar>
          <transition name="slide-fade">
            <div  style="width: 100%; display: flex;flex-direction: row;position: absolute;top: 0;left: -25px;z-index: 100;" v-if="changeColor">
              <div style="display: flex; flex-direction: column;">
                <q-btn round color="positive" icon="check" class="q-mb-sm q-mr-sm" @click="updateBorder()"></q-btn>
                <q-btn round color="negative" icon="close" class="q-mb-sm q-mr-sm" @click="changeColor = false"></q-btn>
              </div>
              <ColorPicker
                :value="elementBorderProperties.split(' ')[2]"
                @colorPicker="setColor = $event"
              />
            </div>
          </transition>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-start;align-items: center;" class="q-mt-sm">
        <div class="flex items-center">
          <span class=" text-weight-light q-mr-md">Border Width</span>
        </div>
        <div class="inputBackground" style="width: 40px; display: flex; flex-direction: row; align-items: center;height: 20px;">
          <input
            style="width: 40px;"
            :value="separateValues(elementBorderProperties.split(' ')[0])"
            @input="emitDebounce($event.target.value)"
            type="number"
            min="0"
          />
        </div>
      </div>
      <div class="row q-mt-sm">
        <div class="flex items-center">
          <span class=" text-weight-light q-mr-md">Border Style</span>
        </div>
        <div class="inputBackground" style="display: flex; flex-direction: row; align-items: center;">
          <select
            :value="elementBorderProperties.split(' ')[1]"
            @change="updateBorder($event.target.value)"
            style="width: 80px;"
          >
            <option v-for="unit in borderStyles" :key="unit" :value="unit">{{ unit }}</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ColorPicker from 'components/common/atoms/stylingComponents/colorPicker';
  import {lodash} from '@iy4u/common-client-lib';
  const {$ldebounce: debounce} = lodash;

  export default {
    name: 'borderEditing',
    components: {
      ColorPicker
    },
    props: {
      position: String,
      elementBorderProperties: {
        type: String,
        default: '0px none #FFFFFF'
      }
    },
    watch: {
      elementBorderProperties: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal){
          if(newVal && newVal !== oldVal){
            this.setColor = newVal.split(' ')[2];
            this.setStyle = newVal.split(' ')[1];
          }
        }
      }
    },
    data(){
      return {
        positionStyles: '',
        changeColor: false,
        setColor: '',
        setStyle: '',
        borderStyles: ['none', 'solid', 'dotted', 'dashed', 'double', 'groove', 'inset', 'outset', 'ridge'],
      };
    },
    mounted(){

      if(this.position === 'top' || this.position === 'bottom'){
        this.positionStyles = {position: 'absolute', top: '20px',left: '0px'};
      }else if(this.position === 'right'){
        this.positionStyles = {position: 'absolute', top: '65px',left: '-130px'};
      }else {
        this.positionStyles = {position: 'absolute', top: '65px', left: '-20px'};
      }
    },
    methods: {
      updateBorder(value){
        let NumberValue = this.elementBorderProperties.split(' ')[0];
        let styleValue = this.elementBorderProperties.split(' ')[1];
        if(value && this.borderStyles.includes(value)){
          styleValue = value;
        }else if(value){
          NumberValue = value + 'px';
        }
        if(this.value === 'none'){
          this.$emit('changeColor', {path: `styles.border-${this.position}`,value: '$unset'});
        }else {
          this.$emit('changeColor', {path: `styles.border-${this.position}`,value: `${NumberValue} ${styleValue} ${this.setColor}`});
        }
        this.changeColor = false;
      },
      separateValues(value) {
        if (value) {
          if (value.includes('px')) {
            return Number(value.substring(0, value.length - 2));
          } else if (value.includes('%')) {
            return Number(value.substring(0, value.length - 1));
          } else return null;
        } else return null;
      },
      emitDebounce: debounce(function(value){
        this.updateBorder(value);
      }, 370),
    }
  };
</script>

<style scoped>
  .borderEditContainer {
    width: 200px;
    height: 120px;
    background: rgba(255, 255, 255, 0.97);
    z-index: 5;
    border-radius: 10px;
    -webkit-box-shadow: 0px 0px 7px 3px rgba(0,0,0,0.33);
    box-shadow: 0px 0px 6px 1px rgba(0,0,0,0.35);
  }

  .slide-fade-enter-active {
    transition: all .5s ease;
  }

  .slide-fade-leave-active {
    transition: all .7s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    transform: translateX(50px);
    opacity: 0;
  }

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
    width: 80%;
  }

  .inputBackground {
    background-color: #f2f2f2;
  }

</style>
