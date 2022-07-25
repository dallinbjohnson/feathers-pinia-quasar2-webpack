<template>
  <q-card class="q-pa-xs" flat>
    <q-card-section class="cardSection">
      <p style="color: #404040; font-weight: bold">Positions </p>
      <div class="row">

        <div class="column" style="width: 100%">
          <div>
            <p>Display</p>
          </div>
          <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <select style="font-size: 14px; height: 25px; width: 100%"
                    :value="$lget(element, 'styles.display', '')"
                    @change="$emit('stylesUpdate', { path: 'styles.display', value: $event.target.value})"
                    class="q-mb-md">
              <q-tooltip>
                Select Display
              </q-tooltip>
              <option v-for="unit in displayOptions" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

        <q-space/>
      </div>
      <div class="row" v-if="$lget(element, 'styles.display', '') === 'flex'">

        <div class="column" style="width: 50%">
          <div>
            <p>Flex Direction</p>
          </div>
          <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <select style="font-size: 14px; height: 25px; width: 100%"
                    :value="$lget(element, 'styles.flex-direction', '')"
                    @change="$emit('stylesUpdate', { path: 'styles.flex-direction', value: $event.target.value})">
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in flexDirectionOptions" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

        <q-space/>
        <div class="column" style="width: 50%">
          <div>
            <p>Flex Wrap</p>
          </div>
          <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <select style="font-size: 14px; height: 25px; width: 100%"
                    :value="$lget(element, 'styles.flex-wrap', '')"
                    @change="$emit('stylesUpdate', { path: 'styles.flex-wrap', value: $event.target.value })">
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in flexWrapOptions" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

      </div>
      <div v-else>
        <grid-flex :element="element"
                   @stylesUpdate="$emit('stylesUpdate', {path: $event.path, value: $event.value})"
                   v-if="$lget(element, 'styles.display', '') === 'grid'">

        </grid-flex>
      </div>


      <div class="row q-my-sm" v-if="$lget(element, 'styles.display', '') !== 'initial'">

        <div class="column" style="width: 50%">
          <div>
            <p>Align Items</p>
          </div>
          <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <select style="font-size: 14px; height: 25px; width: 100%"
                    :value="$lget(element, 'styles.align-items', '')"
                    @change="$emit('stylesUpdate', { path: 'styles.align-items', value: $event.target.value })">
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in alignItemsOptions" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

        <q-space/>

        <div class="column" style="width: 50%">
          <div>
            <p>Align Content</p>
          </div>
          <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <select style="font-size: 14px; height: 25px; width: 100%"
                    :value="$lget(element, 'styles.align-content', '')"
                    @change="$emit('stylesUpdate', { path: 'styles.align-content', value: $event.target.value })">
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in alignContentOptions" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>

        </div>

      </div>

      <div class="row" v-if="$lget(element, 'styles.display', '') !== 'initial'">

        <div class="column" style="width: 50%">
          <div>
            <p>Justify Content</p>
          </div>
          <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <select style="font-size: 14px; height: 25px; width: 100%"
                    :value="$lget(element, 'styles.justify-content', '')"
                    @change="$emit('stylesUpdate', { path: 'styles.justify-content', value: $event.target.value })">
              <q-tooltip>
                Select Unit
              </q-tooltip>
              <option v-for="unit in justifyContentOptions" :key="unit" :value="unit">{{ unit }}</option>
            </select>
          </div>
        </div>

        <div class="column" style="width: 50%">
          <div class="row">
            <p>Z index</p>
            <q-icon name="help" class="cursor-pointer q-ml-xs">
              <q-tooltip>
                The z-index property specifies the stack order of an element.An element with a greater z-index is always
                in front of an element with a lower z-index.
              </q-tooltip>
            </q-icon>
          </div>
          <div class="inputBackground" style="width: 90%; display: flex; flex-direction: row; align-items: center">
            <input style="font-size: 14px; height: 25px; width: 100%"
                   type="number"
                   :value="$lget(element, 'styles.z-index', 0)"
                   @input="$emit('stylesUpdate', { path: 'styles.z-index', value: $event.target.value })"/>

          </div>
        </div>
      </div>

      <div v-if="$lget(element, 'treePath.0.styles.display', '') === 'flex'">
        <div>
          <p>flex</p>
        </div>
        <div style="width: 90%; display: flex; flex-direction: row; align-items: center">
          <input style="font-size: 14px; height: 25px; width: 100%"
                 type="text"
                 :value="$lget(element, 'styles.flex')"
                 @input="$emit('stylesUpdate', { path: 'styles.flex', value: $event.target.value })"/>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
  import GridFlex from 'components/stylingComponents/gridFlex';

  export default {
    name: 'general',
    components: {GridFlex},
    props: {
      element: Object,
    },
    data() {
      return {
        form: {},
        displayOptions: ['grid', 'flex', 'initial'],
        flexDirectionOptions: ['', '$unset', 'row', 'column', 'row-reverse', 'column-reverse'],
        justifyContentOptions: ['', '$unset', 'center', 'flex-start', 'flex-end', 'space-between', 'space-around', 'space-evenly'],
        alignItemsOptions: ['', '$unset', 'stretch', 'center', 'flex-start', 'flex-end', 'baseline', 'initial', 'inherit'],
        alignContentOptions: ['', '$unset', 'stretch', 'center', 'flex-start', 'flex-end', 'space-between', 'space-around', 'space-evenly', 'initial', 'inherit'],
        flexWrapOptions: ['', '$unset', 'nowrap', 'wrap', 'wrap-reverse', 'initial', 'inherit'],
      };
    },
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
