<template>
  <div id="GoogleAddressInput" v-bind="$attrs['div-attrs']">
    <q-card>
      <q-card-section>
        <p v-if="label" class="text-h3">{{ label }}:</p>

        <q-card class="q-mb-sm">
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-8">
                <places-auto-complete :value="newEditedAddress"
                                      @input="newEditedAddress = { ...value, ...$event }"
                                      @error="searchInput = ''"
                                      :path="path"></places-auto-complete>
              </div>

              <div class="col-12 col-sm-4">
                <div>
                  <q-input v-model="newEditedAddress.name"
                           label="Name"
                           filled
                           :hide-details="hide_details"></q-input>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <places-auto-complete-box :value="newEditedAddress"
                                  :path="path"
                                  :attrs="{readonly: true, borderless: false, 'hide-dropdown-icon': true}"></places-auto-complete-box>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
  import PlacesAutoComplete from '../PlacesAutoComplete/PlacesAutoComplete';
  import PlacesAutoCompleteBox from '../PlacesAutoCompleteBox/PlacesAutoCompleteBox';

  export default {
    name: 'GoogleAddressInput',
    components: {
      PlacesAutoComplete,
      PlacesAutoCompleteBox,
    },
    props: {
      value: {
        type: Object,
        required: false,
        default: function () {
          return {
            name: '',
            formatted: '',
            address1: '',
            address2: '',
            region: '',
            route: '',
            city: '',
            postal: '',
            country: '',
            latitude: 0,
            longitude: 0,
          };
        },
      },
      path: {
        required: true,
      },
      slots: {
        type: Array,
        default() {
          return [];
        },
      },
      label: {
        type: String,
        required: false,
      },
      hide_details: {
        type: Boolean,
        required: false,
        default: true,
      },
      search: {
        type: String,
        required: false,
        default: '',
      },
    },
    data() {
      return {
        debounce: fn => this.$ldebounce(fn, 200),
        selectedSuggestion: null,
        searchInput: '',
        newEditedAddress: {},
      };
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          // this.$lset(newVal, 'attrs.filled', this.$lget(newVal, 'attrs.filled', true));

          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));
        },
      },
      newEditedAddress: {
        deep: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          // console.log('Old: ', oldVal,'New: ', newVal);
          if (JSON.stringify(this.value) !== JSON.stringify(newVal)) {
            this.$emit('input', newVal);
            this.selectedSuggestion = null;
          }
        },
      },
      value: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          // console.log('watch google address: ', newVal);
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.newEditedAddress = newVal;
            this.selectedSuggestion = newVal.formatted ? newVal.formatted : '';
          }
        },
      },
    },
  };
</script>

<style scoped lang="scss" src="./_GoogleAddressInput.scss">
</style>
