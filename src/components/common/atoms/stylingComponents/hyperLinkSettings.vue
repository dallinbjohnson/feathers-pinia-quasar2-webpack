<template>
  <q-card class="q-pa-sm">
    <q-card-section class="cardSection">
      <p style="margin: 0">
        Content
      </p>
      <input :value="$lget(elementData, 'content', '')"
             @input="stylesUpdate({path: 'content', value: $event.target.value})"
             style="width: 100%;"/>
    </q-card-section>

    <q-card-section class="cardSection">
      <p style="margin: 0">
        Url
      </p>
      <input :value="$lget(elementData, 'url', '')"
             @input="stylesUpdate({path: 'url', value: $event.target.value})"
             style="width: 100%;"/>
    </q-card-section>

    <!-- add once target and to stuff is figured out -->
    <q-card-section class="cardSection">
      <p style="margin: 0">
        Target
      </p>
      <select :value="$lget(elementData, 'target', '')"
              @input="stylesUpdate({path: 'target', value: $event.target.value})"
              style="width: 100%;">
        <option v-for="(target, index) in targetOptions" :key="index" :value="target.value">{{ target.label }}</option>
      </select>
    </q-card-section>
  </q-card>
</template>

<script>
// eslint-disable-next-line no-undef
  const {lodash: {$ldebounce}} = require('@iy4u/common-client-lib');

  export default {
    name: 'hyperLinkSettings',
    props: {
      element: Object,
    },
    data() {
      return {
        elementData: {},
        targetOptions: [
          {
            label: '_blank',
            value: '_blank',
          },
          {
            label: '_self',
            value: '_self',
          },
          {
            label: '_parent',
            value: '_parent',
          },
          {
            label: '_top',
            value: '_top',
          },
        ],
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          this.elementData = this.$lcloneDeep(newVal);
        },
      },
    },
    methods: {
      stylesUpdate: $ldebounce(function (value) {
        this.$emit('stylesUpdate', value);
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
    border: 0;
    outline: 0;
    background-color: #f2f2f2;
  }

  .cardSection {
    padding: 0;
    margin-bottom: 16px;
  }

  .inputBackground {
    background-color: #f2f2f2;
  }
</style>
