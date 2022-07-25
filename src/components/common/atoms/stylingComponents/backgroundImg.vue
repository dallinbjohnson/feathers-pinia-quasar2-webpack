<template>
  <q-card flat class="q-pa-sm">
    <q-btn v-if="computedImgUrl" class="q-my-sm" style="width: 100%;" label="Clear Background" color="red"
           @click="resetImgStyles"/>
    <q-card-section>
      <SingleImageUpload style="height: 200px" :addLabel="computedImgUrl ? 'Change' : 'Add'"
                         :value="{large: {file: computedImgUrl}}" @input="emitImg"/>
    </q-card-section>
    <q-card-section class="cardSection">
      <p style="font-size: 21px; color: #404040">Background Settings</p>

      <div class="row q-my-xs">

        <div class="column" style="width: 50%">
          <div>
            <p>Repeat</p>
          </div>
          <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <select
              style="font-size: 14px; height: 25px; width: 100%"
              :value="$lget(element, 'styles.background-repeat', 'no-repeat')"
              @input="$emit('stylesUpdate', {path: 'styles.background-repeat', value: $event.target.value })"
            >
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in repeatOptions" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

        <q-space/>

        <div class="column" style="width: 50%">
          <div>
            <p>Position</p>
          </div>
          <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <select
              style="font-size: 14px; height: 25px; width: 100%"
              :value="$lget(element, 'styles.background-position', 'center center')"
              @input="$emit('stylesUpdate', {path: 'styles.background-position', value: $event.target.value })"
            >
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in positionOptions" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

      </div>

      <div class="row q-my-xs">

        <div class="column" style="width: 50%">
          <div>
            <p>Attachment</p>
          </div>
          <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <select
              style="font-size: 14px; height: 25px; width: 100%"
              :value="$lget(element, 'styles.background-attachment', 'scroll')"
              @input="$emit('stylesUpdate', {path: 'styles.background-attachment', value: $event.target.value })"
            >
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in attachmentOptions" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

        <q-space/>

        <div class="column" style="width: 50%">
          <div>
            <p>Size</p>
          </div>
          <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <select
              style="font-size: 14px; height: 25px; width: 100%"
              :value="$lget(element, 'styles.background-size', 'auto')"
              @input="checkSizing($event.target.value)"
            >
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in sizeOptions" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>

        </div>
        <div v-if="customSize" class="row q-my-xs" style="width: 100%;" >
          <div class="column" style="width: 50%">
            <div>
              <p>X Axis</p>
            </div>
            <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
              <input
                style="width: 100%; height: 25px"
                type="number"
                min="0"
                :disabled="disableCheck(customBgSize.xAxisUnit)"
                v-model="customBgSize.xAxis"
                @input="emitBgSize({path: 'styles.background-size', value: $event.target.innerText})"
              />
              <select
                style="font-size: 14px; border: 0; outline: 0; height: 25px"
                v-model="customBgSize.xAxisUnit"
                @change="emitBgSize({path: 'styles.background-size', value: $event.target.value})"
              >
                <q-tooltip>
                  Select Unit
                </q-tooltip>
                <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
              </select>
            </div>
          </div>

          <q-space />

          <div class="column" style="width: 50%">
            <div>
              <p>Y Axis</p>
            </div>
            <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
              <input
                style="width: 100%; height: 25px"
                type="number"
                min="0"
                :disabled="disableCheck(customBgSize.yAxisUnit)"
                v-model="customBgSize.yAxis"
                @input="emitBgSize({path: 'styles.background-size', value: $event.target.innerText})"
              />
              <select
                style="font-size: 14px; border: 0; outline: 0; height: 25px"
                v-model="customBgSize.yAxisUnit"
                @change="emitBgSize({path: 'styles.background-size', value: $event.target.value})"
              >
                <q-tooltip>
                  Select Unit
                </q-tooltip>
                <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="column" style="width: 50%">
          <div>
            <p>Rotate</p>
          </div>
          <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <select
              style="font-size: 14px; height: 25px; width: 100%"
              :value="splitAndGrab($lget(element, 'styles.transform', 'rotate(0deg)'), 7, 6, 'rotate')"
              @input="$emit('stylesUpdate', {path: 'styles.transform', value: `rotate(${$event.target.value})` })"
            >
              <q-tooltip>
                Rotate the background
              </q-tooltip>
              <option v-for="unit in orientationOptions" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>

        </div>
        <div class="column" style="width: 50%">
          <div>
            <p>GreyScale</p>
          </div>
          <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <select
              style="font-size: 14px; height: 25px; width: 100%"
              :value="splitAndGrab($lget(element, 'styles.filter', 'grayscale(0%)') , 10, 3, 'grayscale')"
              @input="$emit('stylesUpdate', {path: 'styles.filter', value: `grayscale(${$event.target.value})` })"
            >
              <q-tooltip>
                Change Background to Black & White
              </q-tooltip>
              <option v-for="unit in greyscaleOptions" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

      </div>
    </q-card-section>
  </q-card>
</template>

<script>
  import SingleImageUpload from 'components/images/SingleImageUpload';

  export default {
    name: 'backgroundImg',
    props: {
      element: Object
    },
    components: {
      SingleImageUpload
    },
    mounted() {
      this.initBackgroundSize();
    },
    data() {
      return {
        greyscaleOptions: ['0%', '5%', '10%', '15%', '20%', '25%', '30%', '35%', '40%', '45%', '50%', '55%', '60%', '65%', '70%', '75%', '80%', '85%', '90%', '95%', '100%'],
        orientationOptions: ['0deg', '15deg', '30deg', '45deg', '60deg', '75deg', '90deg', '105deg', '120deg', '135deg', '150deg', '165deg', '180deg', '195deg', '210deg', '225deg', '240deg', '255deg', '270deg', '285deg', '300deg', '315deg', '330deg', '345deg', '360deg'],
        repeatOptions: ['$unset', 'repeat', 'repeat-x', 'repeat-y', 'no-repeat'],
        positionOptions: ['$unset', 'left top', 'left center', 'left bottom', 'right top', 'right center', 'right bottom', 'center top', 'center center', 'center bottom'],
        attachmentOptions: ['$unset', 'scroll', 'fixed', 'local', 'initial', 'inherit'],
        sizeOptions: ['$unset', 'auto', 'cover', 'contain', 'custom'],
        units: ['auto', 'px', '%'],
        customSize: false,
        customBgSize: {
          xAxis: 0,
          xAxisUnit: 'px',
          yAxis: 0,
          yAxisUnit: 'px'
        }
      };
    },
    computed: {
      computedImgUrl() {
        let imgUrl = this.$lget(this.element, 'styles.background-image');
        return imgUrl ? imgUrl.split('\'')[1] : '';
      }
    },
    methods: {
      checkMax(unit) {
        if (unit === '%') {
          return 100;
        } else {
          return 999;
        }
      },
      disableCheck(val){
        return val === 'auto';
      },
      initBackgroundSize() {
        let size = this.$lget(this.element, 'styles.background-size', '0px 0px');
        if (size !== 'cover' || size !== 'contain' || size !== 'auto') {
          let value = size.split(' ');
          this.customBgSize.xAxis = this.separateValues(value[0]);
          this.customBgSize.xAxisUnit = this.pullUnit(value[0]);
          this.customBgSize.yAxis = this.separateValues(value[1]);
          this.customBgSize.yAxisUnit = this.pullUnit(value[1]);
        }
      },
      checkSizing(val) {
        if (val !== 'custom') {
          this.customSize = false;
          this.$emit('stylesUpdate', {path: 'styles.background-size', value: val});
        } else {
          this.customSize = true;
        }
      },
      splitAndGrab(string, from, amount, optional) {
        if (string) {
          if (optional === 'grayscale') {
            switch (string) {
              case 'grayscale(0%)':
                amount = 2;
                break;
              case 'grayscale(5%)':
                amount = 2;
                break;
              case 'grayscale(100%)':
                amount = 4;
                break;
              default:
                amount = 3;
                break;
            }
          } else if (optional === 'rotate') {
            switch (string) {
              case 'rotate(0deg)':
                amount = 4;
                break;
              case 'rotate(15deg)':
                amount = 5;
                break;
              case 'rotate(30deg)':
                amount = 5;
                break;
              case 'rotate(45deg)':
                amount = 5;
                break;
              case 'rotate(60deg)':
                amount = 5;
                break;
              case 'rotate(75deg)':
                amount = 5;
                break;
              case 'rotate(90deg)':
                amount = 5;
                break;
            }
          }
          let split = string.split('');
          let removedValue = split.splice(from, amount);
          return removedValue.join('');
        }
      },
      emitImg(val) {
        this.$emit('stylesUpdate', {path: 'styles.background-image', value: `url('${val.raw.file}')`});
      },
      separateValues(value) {
        if (value) {
          if (value.includes('px')) {
            return Number(value.substring(0, value.length - 2));
          } else if (value.includes('%')) {
            return Number(value.substring(0, value.length - 1));
          } else if (value.includes('auto')) {
            return '';
          } else return null;
        } else return null;
      },
      pullUnit(val) {
        if (val) {
          if (val.includes('px')) {
            return 'px';
          } else if (val.includes('%')) {
            return '%';
          } else if (val.includes('auto')) {
            return 'auto';
          } else {
            return 'px';
          }
        } else return 'px';
      },
      resetImgStyles() {
        this.$emit('stylesUpdate', [{path: 'styles.transform', value: '$unset'},
                                    {path: 'styles.filter', value: '$unset'},
                                    {path: 'styles.background-size', value: '$unset'},
                                    {path: 'styles.background-repeat', value: '$unset'},
                                    {path: 'styles.background-position', value: '$unset'},
                                    {path: 'styles.background-attachment', value: '$unset'},
                                    {path: 'styles.background-image', value: '$unset'}]);
      },
      debounce(val) {
        this.$lset(this.elementData, val.path, val.value);
        this.$emit('stylesUpdate', {path: val.path, value: val.value});
      },
      emitBgSize(val) {
        if (this.customBgSize.xAxisUnit === 'auto') {
          this.customBgSize.xAxis = '';
        } else if (this.customBgSize.yAxisUnit === 'auto') {
          this.customBgSize.yAxis = '';
        }
        val.value = `${this.customBgSize.xAxis}${this.customBgSize.xAxisUnit} ${this.customBgSize.yAxis}${this.customBgSize.yAxisUnit}`;
        console.log('val changes', val);
        this.$emit('stylesUpdate', val);
      }
    }
  };
</script>

<style scoped>
p {
  color: #848484;
  margin: 0;
  padding: 0;
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

.cardSection {
  padding: 0
}
</style>
