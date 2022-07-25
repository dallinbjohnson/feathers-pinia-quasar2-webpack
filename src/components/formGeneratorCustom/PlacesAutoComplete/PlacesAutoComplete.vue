<template>
  <div id="PlacesAutoComplete" v-bind="$attrs['div-attrs']">
    <q-form autocomplete="off">
      <q-select :value="input"
                @input-value="setInput"
                @input="geocode"
                @clear="clearInput"
                @filter="filterFn"
                :options="addresses"
                v-bind="$attrs['attrs']">
        <template v-for="slot in slots" v-slot:[slot]="slotProps">
          <slot :name="slot" :key_name="path" v-bind="slotProps"></slot>
        </template>

        <template v-if="!slots.includes('no-option')" v-slot:no-option>
          <q-item>
            <q-item-section>
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-form>
  </div>
</template>

<script>
  import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';

  export default {
    name: 'PlacesAutoComplete',
    props: {
      value: {
        type: [Number, String, Array, Object],
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
      search_every_num: {
        type: Number,
        default: 2,
      },
      address_format: {
        type: String,
        default: 'short_name',
        validator: value => ['long_name', 'short_name'].indexOf(value) >= 0,
      },
    },
    data() {
      return {
        input: null,
        obj: null,
        normalizedAddress: {
          formatted: '',
          address1: '',
          address2: '',
          region: '',
          city: '',
          postal: '',
          country: '',
          latitude: null,
          longitude: null,
          googleAddress: {},
        },
      };
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          this.$lset(newVal, 'attrs.filled', this.$lget(newVal, 'attrs.filled', true));
          this.$lset(newVal, 'attrs.clearable', this.$lget(newVal, 'attrs.clearable', true));
          this.$lset(newVal, 'attrs.clear-icon', this.$lget(newVal, 'attrs.clear-icon', 'close'));
          this.$lset(newVal, 'attrs.use-input', this.$lget(newVal, 'attrs.use-input', true));
          this.$lset(newVal, 'attrs.hide-selected', this.$lget(newVal, 'attrs.hide-selected', true));
          this.$lset(newVal, 'attrs.fill-input', this.$lget(newVal, 'attrs.fill-input', true));
          this.$lset(newVal, 'attrs.input-debounce', this.$lget(newVal, 'attrs.input-debounce', '0'));
          this.$lset(newVal, 'attrs.placeholder', this.$lget(newVal, 'attrs.placeholder', 'Enter your address (ex. 123 N Main St, City, ZZ 12345)...'));
          this.$lset(newVal, 'attrs.option-label', this.$lget(newVal, 'attrs.option-label', 'description'));

          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));
        },
      },
      '$q.dark.mode': {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.$lset(this.$attrs, 'attrs.dark', newVal);
          }
        }
      },
      value: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.input = newVal.formatted;
          }
        },
      },
    },
    computed: {
      ...mapState('places-auto-complete', {placeloading: 'isFindPending'}),
      ...mapState('geocode', {geoloading: 'isFindPending'}),
      ...mapGetters('places-auto-complete', {addresses: 'list'}),
      loading() {
        return this.placeloading || this.geoloading;
      },
    },
    methods: {
      ...mapMutations('places-auto-complete', {clearAddresses: 'clearAll'}),
      ...mapActions('places-auto-complete', {findAddresses: 'find'}),
      ...mapActions('geocode', {findgeocoded: 'find'}),
      async clearInput() {
        this.input = null;
        this.$emit('input', {
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
          googleAddress: {},
        });
        await this.clearAddresses();
      },
      async setInput(value) {
        this.input = value;
        if (this.input && this.input.length % this.search_every_num === 0) {
          await this.clearAddresses();
          this.findAddresses({
            query: {
              input: this.input, sessiontoken: 'PlacesAutoComplete',
            },
          });
        }
      },
      geocode(val) {
        // TODO: need to parse formated_adress by name and not index ...
        //   _.each(address_components, function(k, v1) {
        //   _.each(address_components[v1].types, function(k2, v2){
        //     components[address_components[v1].types[v2]] = address_components[v1].long_name
        //   });
        // });
        // eslint-disable-next-line no-console
        // console.log('val:', val);
        this.findgeocoded({
          query: {
            address: val.description,
          },
        }).then(response => {
          var mappedAddress = null;
          switch (this.address_format) {
            case 'long_name':
              mappedAddress = response.data[0].address_components.reduce((seed, {long_name, types}) => {
                types.forEach(t => {
                  seed[t] = long_name;
                });
                return seed;
              }, {});
              break;
            case 'short_name':
              mappedAddress = response.data[0].address_components.reduce((seed, {short_name, types}) => {
                types.forEach(t => {
                  seed[t] = short_name;
                });
                return seed;
              }, {});
              break;
          }

          if (mappedAddress) {
            this.normalizedAddress = {
              formatted: response.data[0].formatted_address,
              address1: mappedAddress.street_number + ' ' + mappedAddress.route,
              region: mappedAddress.administrative_area_level_1,
              city: mappedAddress.locality,
              postal: mappedAddress.postal_code + '-' + mappedAddress.postal_code_suffix,
              country: mappedAddress.country,
              latitude: response.data[0].geometry.location.lat,
              longitude: response.data[0].geometry.location.lng,
              googleAddress: response.data[0],
            };
          }
          this.$emit('input', this.normalizedAddress);
          // // eslint-disable-next-line no-console
          // console.log(response)
        }).catch(err => {
          this.$emit('error', err);
        });

      },
      // eslint-disable-next-line no-unused-vars
      filterFn(val, update, abort) {
        update(() => {
          return true;
        });
      },
    },
  };
</script>

<style scoped lang="scss" src="./_PlacesAutoComplete.scss">
</style>
