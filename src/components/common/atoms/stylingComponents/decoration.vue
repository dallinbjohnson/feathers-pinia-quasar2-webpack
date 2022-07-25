<template>
  <q-card flat class="q-pa-sm">
    <q-card-section class="cardSection">
      <p style="color: #404040; font-weight: bold">Opacity</p>
      <div class="q-pa-sm">
        <q-slider
          :value="$lget(element, 'styles.opacity', 1.0)"
          @change="$emit('stylesUpdate', { path: 'styles.opacity', value: $event })"
          :min="0"
          :max="1"
          :step="0.1"
          label
        />
      </div>
    </q-card-section>

    <q-card-section class="cardSection">
      <p style="color: #404040; font-weight: bold">Border Radius</p>
      <div class="q-pa-sm"
           style="width: 100%; display: flex; flex-direction: column; justify-content: flex-start">

        <div class="row">

          <div class="column" style="width: 50%">
            <div>
              <p>Top Left</p>
            </div>
            <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
              <input
                style="width: 100%"
                :value="separateValues($lget(element, 'styles.border-top-left-radius', '0px'))"
                @input="debounce({ path: 'styles.border-top-left-radius', value: $event.target.value + pullUnit($lget(element, 'styles.border-top-left-radius', '0px')) })"
                type="number"
                min="0"
                :max="checkMax(pullUnit($lget(element, 'styles.border-top-left-radius', '0px')))"
              />
              <select
                style="font-size: 14px; border: 0; outline: 0; height: 25px"
                :value="pullUnit($lget(element, 'styles.border-top-left-radius', '0px'))"
                @change="$emit('stylesUpdate', {path: 'styles.border-top-left-radius', value: separateValues($lget(element, 'styles.border-top-left-radius', '0px')) + $event.target.value });"
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
              <p>Top Right</p>
            </div>
            <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
              <input
                style="width: 100%"
                :value="separateValues($lget(element, 'styles.border-top-right-radius', '0px'))"
                @input="debounce({ path: 'styles.border-top-right-radius', value: $event.target.value + pullUnit($lget(element, 'styles.border-top-right-radius', '0px')) })"
                type="number"
                min="0"
                :max="checkMax(pullUnit($lget(element, 'styles.border-top-right-radius', '0px')))"
              />
              <select
                style="font-size: 14px; border: 0; outline: 0; height: 25px"
                :value="pullUnit($lget(element, 'styles.border-top-right-radius', '0px'))"
                @change="$emit('stylesUpdate', { path: 'styles.border-top-right-radius', value: separateValues($lget(element, 'styles.border-top-right-radius', '0px')) + $event.target.value })"
              >
                <q-tooltip>
                  Select Unit
                </q-tooltip>
                <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
              </select>
            </div>
          </div>

        </div>

        <div class="row">

          <div class="column" style="width: 50%">
            <div>
              <p>Bottom Left</p>
            </div>
            <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
              <input
                style="width: 100%"
                :value="separateValues($lget(element, 'styles.border-bottom-left-radius', '0px'))"
                @input="debounce({ path: 'styles.border-bottom-left-radius', value: $event.target.value + pullUnit($lget(element, 'styles.border-bottom-left-radius', '0px')) })"
                type="number"
                min="0"
                :max="checkMax(pullUnit($lget(element, 'styles.border-bottom-left-radius', '0px')))"
              />
              <select
                style="font-size: 14px; border: 0; outline: 0; height: 25px"
                :value="pullUnit($lget(element, 'styles.border-bottom-left-radius', '0px'))"
                @change="$emit('stylesUpdate', { path: 'styles.border-bottom-left-radius', value: separateValues($lget(element, 'styles.border-bottom-left-radius', '0px')) + $event.target.value })"
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
              <p>Bottom Right</p>
            </div>
            <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
              <input
                style="width: 100%"
                :value="separateValues($lget(element, 'styles.border-bottom-right-radius', '0px'))"
                @input="debounce( { path: 'styles.border-bottom-right-radius', value: $event.target.value + pullUnit($lget(element, 'styles.border-bottom-right-radius', '0px')) })"
                type="number"
                min="0"
                :max="checkMax(pullUnit($lget(element, 'styles.border-bottom-right-radius', '0px')))"
              />
              <select
                style="font-size: 14px; border: 0; outline: 0; height: 25px"
                :value="pullUnit($lget(element, 'styles.border-bottom-right-radius', '0px'))"
                @change="$emit('stylesUpdate', { path: 'styles.border-bottom-right-radius', value: separateValues($lget(element, 'styles.border-bottom-right-radius', '0px')) + $event.target.value })"
              >
                <q-tooltip>
                  Select Unit
                </q-tooltip>
                <option v-for="unit in units" :key="unit" :value="unit">{{ unit }}</option>
              </select>
            </div>
          </div>

        </div>

      </div>
    </q-card-section>

    <q-card-section class="cardSection">
      <p style="color: #404040; font-weight: bold">Box shadow</p>
      <div class="q-pa-sm" style="width: 100%; display: flex; flex-direction: column; justify-content: flex-start">
        <div class="row">
          <div class="column" style="width: 50%">
            <div>
              <p>Horizontal offset</p>
              <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
                <input
                  style="width: 100%"
                  v-model="shadowOptions.horizontalOffset"
                  @input="debounce({ path: 'styles.box-shadow', value: '' }, true)"
                  type="number"
                  min="0"
                  :max="50"
                />
                <select
                  style="font-size: 14px; border: 0; outline: 0; height: 25px"
                  :value="'px'"
                >
                  <q-tooltip>
                    Select Unit
                  </q-tooltip>
                  <option v-for="unit in ['px']" :key="unit" :value="unit">{{ unit }}</option>
                </select>
              </div>
            </div>
          </div>

          <q-space />

          <div class="column" style="width: 50%">
            <div>
              <p>Vertical offset</p>
              <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
                <input
                  style="width: 100%"
                  v-model="shadowOptions.verticalOffset"
                  @input="debounce({ path: 'styles.box-shadow', value: '' }, true)"
                  type="number"
                  min="0"
                  :max="50"
                />
                <select
                  style="font-size: 14px; border: 0; outline: 0; height: 25px"
                  :value="'px'"
                >
                  <q-tooltip>
                    Select Unit
                  </q-tooltip>
                  <option v-for="unit in ['px']" :key="unit" :value="unit">{{ unit }}</option>
                </select>
              </div>
            </div>
          </div>

          <q-space />

          <div class="column" style="width: 50%">
            <div>
              <p>Blur radius</p>
              <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
                <input
                  style="width: 100%"
                  v-model="shadowOptions.blur"
                  @input="debounce({ path: 'styles.box-shadow', value: '' }, true)"
                  type="number"
                  min="0"
                  :max="50"
                />
                <select
                  style="font-size: 14px; border: 0; outline: 0; height: 25px"
                  :value="'px'"
                >
                  <q-tooltip>
                    Select Unit
                  </q-tooltip>
                  <option v-for="unit in ['px']" :key="unit" :value="unit">{{ unit }}</option>
                </select>
              </div>
            </div>
          </div>

          <q-space />

          <div class="column" style="width: 50%">
            <div>
              <p>Spread radius</p>
              <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
                <input
                  style="width: 100%"
                  v-model="shadowOptions.spread"
                  @input="debounce({ path: 'styles.box-shadow', value: '' }, true)"
                  type="number"
                  min="0"
                  :max="50"
                />
                <select
                  style="font-size: 14px; border: 0; outline: 0; height: 25px"
                  :value="'px'"
                >
                  <q-tooltip>
                    Select Unit
                  </q-tooltip>
                  <option v-for="unit in ['px']" :key="unit" :value="unit">{{ unit }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="column" style="width: 50%">
            <div>
              <p>Type</p>
              <div class="inputBackground selectBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
                <select
                  class="selectBackground"
                  style="width: 100%"
                  v-model="shadowOptions.type"
                  @change="debounce({ path: 'styles.box-shadow', value: '' }, true)"
                >
                  <q-tooltip>
                    Select type
                  </q-tooltip>
                  <option v-for="type of ['inset', 'outset']" :key="type" :value="type">{{ type }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="column" style="width: 80%; margin: 10px auto 10px auto;">
            <q-color v-model="shadowOptions.color" format-model="rgba" @input="debounce({ path: 'styles.box-shadow', value: '' }, true)"/>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="cardSection q-pa-sm">
      <p class="q-my-md" style="color: #404040; font-weight: bold">Background</p>
      <div>
        <q-btn-toggle
          v-model="backgroundType"
          toggle-color="primary"
          flat
          spread
          :options="[
        {slot: 'one', value: 'backgroundImg'},
        {slot: 'two', value: 'color'}
      ]"
        >
          <template style="width: 33%" v-slot:one>
            <q-icon name="photo">
              <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
                Image
              </q-tooltip>
            </q-icon>
          </template>
          <template style="width: 33%" v-slot:two>
            <q-icon name="palette">
              <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
                Color
              </q-tooltip>
            </q-icon>
          </template>
        </q-btn-toggle>
        <component
          :is="backgroundType"
          :element="element"
          :name="'Background'"
          :format="'rgba'"
          :path="'styles.background-color'"
          @stylesUpdate="debounce"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
  import Color from './backgroundColor';
  import backgroundImg from './backgroundImg';

  export default {
    name: 'decoration',
    props: {
      element: Object
    },
    components: {
      Color,
      backgroundImg
    },
    mounted(){
      this.initShadowValues();
    },
    data() {
      return {
        opacitySlider: 1.0,
        units: ['px', '%'],
        backgroundType: '',
        timer: new this.$timer(),
        shadowOptions: {
          units: ['px'],
          unitValue: 'px',
          verticalOffset: 0,
          horizontalOffset: 0,
          spread: 0,
          blur: 0,
          color: 'rgba(0, 0, 0, 0.5)',
          type: 'outset'
        }
      };
    },
    // watch: {
    //   element: {
    //     immediate: true,
    //     deep: true,
    //     handler(newVal) {
    //       if (newVal) {
    //         let bgImage = this.$lget(this.element, 'styles.background-image');
    //         let color = this.$lget(this.element, 'styles.background-color');
    //         console.log('the color and img', color, bgImage);
    //         this.backgroundType = bgImage ? 'backgroundImg' : !color || color === 'transparent' ? '' : 'color';
    //       }
    //     }
    //   }
    // },
    methods: {
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
          if(shadowArr[5]) {
            this.shadowOptions.type = 'inset';
          } else {
            this.shadowOptions.type = 'outset';
          }
        }
      },
      checkMax(unit) {
        if(unit === '%') {
          return 100;
        } else {
          return  999;
        }
      },
      separateValues(value){
        // console.log('this is the value', value);
        if(value) {
          if(value.includes('px')) {
            return Number(value.substring(0, value.length - 2));
          } else if (value.includes('%')) {
            return Number(value.substring(0, value.length - 1));
          } else return null;
        } else return null;
      },
      pullUnit(val){
        // console.log('this is the pull unit', val);
        if (val.includes('rem')) {
          return 'rem';
        } else if ( val.includes('px') ) {
          return 'px';
        } else if ( val.includes('em') ) {
          return  'em';
        } else if (val.includes('%') ) {
          return '%';
        } else if (val.includes('initial') ) {
          return 'initial';
        } else if (val.includes('inherit') ) {
          return 'inherit';
        } else if (val.includes('auto') ) {
          return 'auto';
        } else if (val.includes('none') ) {
          return 'none';
        } else return 'px';
      },
      debounce(val, isShadow = false) {
        if(isShadow === true) {
          val.value = `${this.shadowOptions.horizontalOffset}px ${this.shadowOptions.verticalOffset}px ${this.shadowOptions.blur}px ${this.shadowOptions.spread}px ${this.shadowOptions.color ? this.shadowOptions.color : 'rgba(0,0,0,0.5)'}${this.shadowOptions.type === 'inset' ? ' inset' : ''}`;
        }
        this.$emit('stylesUpdate', {path: val.path, value: val.value});
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

.selectBackground {
  padding: 3px 2px;
  border: 0;
  outline: 0;
}

.cardSection {
  padding: 0
}
</style>
