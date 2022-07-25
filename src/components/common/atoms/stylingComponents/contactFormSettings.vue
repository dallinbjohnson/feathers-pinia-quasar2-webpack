<template>
  <q-card>
    <q-card-section class="cardSection q-mx-md">
      <div class="column q-my-sm">
        <p style="margin: 0">Send form to: </p>
        <input
          class="inputBackground"
          :value="$lget(elementData, 'to', '')"
          @input="debounce({path: 'to', value: $event.target.value})"
        />
      </div>
      <div class="column q-my-sm">
        <p style="margin: 0">Success Message: </p>
        <textarea
          class="inputBackground"
          :value="$lget(elementData, 'successMessage', '')"
          @input="debounce({path: 'successMessage', value: $event.target.value})"
        />
      </div>
    </q-card-section>
    <q-list>
      <q-expansion-item label="Input Settings">
        <div class="q-px-md" >
        <div class="row">
          <div class="col-12 col-md-6">
            <q-toggle
              color="green"
              label="Filled"
              left-label
              :value="$lget(elementData, 'input-attrs.filled')"
              @input="$emit('stylesUpdate', {path: 'input-attrs.filled', value: $event})"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-toggle
              color="green"
              label="Standout"
              left-label
              :value="$lget(elementData, 'input-attrs.standout')"
              @input="$emit('stylesUpdate', {path: 'input-attrs.standout', value: $event})"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-toggle
              color="green"
              label="Outlined"
              left-label
              :value="$lget(elementData, 'input-attrs.outlined', false)"
              @input="$emit('stylesUpdate', {path: 'input-attrs.outlined', value: $event})"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-toggle
              color="green"
              label="Borderless"
              left-label
              :value="$lget(elementData, 'input-attrs.borderless', false)"
              @input="$emit('stylesUpdate', {path: 'input-attrs.borderless', value: $event})"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-toggle
              color="green"
              label="Rounded"
              left-label
              :value="$lget(elementData, 'input-attrs.rounded', false)"
              @input="$emit('stylesUpdate', {path: 'input-attrs.rounded', value: $event})"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-toggle
              color="green"
              label="Square"
              left-label
              :value="$lget(elementData, 'input-attrs.square', false)"
              @input="$emit('stylesUpdate', {path: 'input-attrs.square', value: $event})"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-toggle
              color="green"
              label="Dense"
              left-label
              :value="$lget(elementData, 'input-attrs.dense', false)"
              @input="$emit('stylesUpdate', {path: 'input-attrs.dense', value: $event})"
            />
          </div>
        </div>
        </div>
      </q-expansion-item>
    </q-list>
    <q-list>
      <q-expansion-item label="Button Settings">
        <div class="q-px-md" >
        <div class="column">
          <div class="column q-my-sm">
            <p style="margin: 0">Label: </p>
            <input
              class="inputBackground"
              :value="$lget(elementData, 'button-attrs.label', 'Submit')"
              @input="debounce({path: 'button-attrs.label', value: $event.target.value})"
            />
          </div>
          <div class="column q-my-sm">
            <p style="margin: 0">Size: </p>
            <select
              :value="$lget(element, 'button-attrs.size', '16px')"
              @change="$emit('stylesUpdate', {path: 'button-attrs.size', value: $event.target.value})"
              style="width: 100%;"
            >
              <option v-for="unit in sizingUnits" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6">
            <q-toggle
              color="green"
              label="Flat"
              left-label
              :value="$lget(elementData, 'button-attrs.flat')"
              @input="$emit('stylesUpdate', {path: 'button-attrs.flat', value: $event})"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-toggle
              color="green"
              label="Outlined"
              left-label
              :value="$lget(elementData, 'button-attrs.outlined', false)"
              @input="$emit('stylesUpdate', {path: 'button-attrs.outlined', value: $event})"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-toggle
              color="green"
              label="Glossy"
              left-label
              :value="$lget(elementData, 'button-attrs.glossy', false)"
              @input="$emit('stylesUpdate', {path: 'button-attrs.glossy', value: $event})"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-toggle
              color="green"
              label="Rounded"
              left-label
              :value="$lget(elementData, 'button-attrs.rounded', false)"
              @input="$emit('stylesUpdate', {path: 'button-attrs.rounded', value: $event})"
            />
          </div>
          <div class="col-12 col-md-6">
            <q-toggle
              color="green"
              label="Push"
              left-label
              :value="$lget(elementData, 'button-attrs.push', false)"
              @input="$emit('stylesUpdate', {path: 'button-attrs.push', value: $event})"
            />
          </div>
        </div>
          <color
            :element="elementData"
            @stylesUpdate="emitDebounce( $event.value, 'button-attrs.styles.background-color' )"
            :format="'rgba'"
            :path="'button-attrs.styles.background-color'"
            :name="'Background'" />
          <color
            :element="elementData"
            @stylesUpdate="emitDebounce( $event.value, 'button-attrs.styles.color' )"
            :format="'hex'"
            :path="'button-attrs.styles.color'"
            :name="'Text'" />
        </div>
      </q-expansion-item>
    </q-list>
  </q-card>
</template>

<script>
  import Color from './backgroundColor';
  import {lodash} from '@iy4u/common-client-lib';
  const {$ldebounce: debounce} = lodash;

  export default {
    name: 'contactFormSettings',
    inheritAttrs: false,
    components: {
      Color
    },
    props: {
      element: Object
    },
    data() {
      return {
        timer: new this.$timer(),
        elementData: {},
        sizingUnits: ['16px', '24px', '36px', '48px', 'xs', 'sm', 'md', 'lg', 'xl']
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          this.elementData = this.$lcloneDeep(newVal);
        }
      }
    },
    methods: {
      emitDebounce: debounce(function (value, path) {
        this.$emit('stylesUpdate', {
          path,
          value
        });
      }, 370),
      debounce(val) {
        let emit = () => {
          this.$emit('stylesUpdate', {path: val.path, value: val.value});
          console.log('emitting......', val);
        };
        this.timer.start(emit, 2000);
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

textarea {
  border: 0;
  outline: 0;
  background-color: #f2f2f2;
}

select {
  background-color: transparent;
}

.cardSection {
  padding: 0
}

select {
  background-color: #f2f2f2;
  font-size: 14px;
  border: 0;
  outline: 0;
  height: 25px;
  width: 100%;
}
</style>
