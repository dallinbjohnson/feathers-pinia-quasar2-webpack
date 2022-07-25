<template>
  <div class="q-pa-md">
    <div class="column q-my-sm">
      <p style="margin: 0">Icon Name: </p>
      <icon-picker :value="$lget(element, 'attrs.name', '')"
                   @input="debounce({path: 'attrs.name', value: $event})"
                   path="attrs.name"
                   :q-field-attrs="{
                     label: '',
                     type: 'text',
                     filled: true,
                     clearable: true,
                     'clear-icon': 'close',
                   }"
                   :attrs="{}"></icon-picker>
    </div>
    <div class="column" style="width: 50%">
      <div>
        <p>Size:</p>
      </div>
      <div style="width: 90%; display: flex; flex-direction: row; align-items: center; background-color: #f2f2f2">
        <input style="width: 100%;"
               type="number"
               min="0"
               :disabled="disableCheck($lget(element, 'attrs.size', ''))"
               :value="separateValues($lget(element, 'attrs.size', ''))"
               @input="debounce({ path: 'attrs.size', value: $event.target.value + pullUnit($lget(element, 'attrs.size', '36px'))})"/>
        <select style="font-size: 14px; border: 0; outline: 0; height: 25px;"
                :value="pullUnit($lget(element, 'attrs.size', ''))"
                @change="$emit('stylesUpdate', {
                  path: 'attrs.size',
                  value: ['', '$unset', 'xs', 'sm', 'md', 'lg', 'xl'].includes($event.target.value) ? $event.target.value : separateValues($lget(element, 'attrs.size', '36px')) + $event.target.value
                }); disableCheck($event.target.value)">
          <q-tooltip>
            Select Unit
          </q-tooltip>
          <option v-for="unit in fontSizeUnits" :key="unit" :value="unit">{{ unit }}</option>
        </select>
      </div>
    </div>
    <div class="column q-my-sm">
      <p style="margin: 0">Color: </p>
      <input class="inputBackground"
             :value="$lget(element, 'attrs.color', '')"
             @input="debounce({path: 'attrs.color', value: $event.target.value})"/>
    </div>
  </div>
</template>

<script>
  import IconPicker from 'components/formGeneratorCustom/IconPicker';

  export default {
    name: 'iconEditor',
    components: {
      IconPicker,
    },
    props: {
      element: Object,
    },
    data() {
      return {
        fontSizeUnits: ['', '$unset', 'px', 'rem', 'em', 'xs', 'sm', 'md', 'lg', 'xl'],
        timer: new this.$timer(),
        flat: this.$lget(this.element, 'flat', false),
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          return newVal;
        },
      },
    },
    methods: {
      separateValues(val) {
        if (val) {
          if (val.includes('rem')) {
            return Number(val.substring(0, val.length - 3));
          } else if (val.includes('em') || val.includes('px')) {
            return Number(val.substring(0, val.length - 2));
          } else if (val.includes('xs')) {
            return '';
          } else if (val.includes('sm')) {
            return '';
          } else if (val.includes('md')) {
            return '';
          } else if (val.includes('lg')) {
            return '';
          } else if (val.includes('xl')) {
            return '';
          } else return Number(val.substring(0, val.length - 2));
        } else return null;
      },
      pullUnit(val) {
        if (val.includes('rem')) {
          return 'rem';
        } else if (val.includes('px')) {
          return 'px';
        } else if (val.includes('em')) {
          return 'em';
        } else if (val.includes('xs')) {
          return 'xs';
        } else if (val.includes('sm')) {
          return 'sm';
        } else if (val.includes('md')) {
          return 'md';
        } else if (val.includes('lg')) {
          return 'lg';
        } else if (val.includes('xl')) {
          return 'xl';
        } else {
          return val;
        }
      },
      disableCheck(value) {
        if (value.includes('xs')) {
          return true;
        } else if (value.includes('sm')) {
          return true;
        } else if (value.includes('md')) {
          return true;
        } else if (value.includes('lg')) {
          return true;
        } else if (value.includes('xl')) {
          return true;
        } else if (value.includes('$unset')) {
          return true;
        } else if (value === '') {
          return true;
        }
        return false;
      },
      debounce(val) {
        let emit = () => {
          this.$emit('stylesUpdate', {path: val.path, value: val.value});
        };
        this.timer.start({cb: emit, iv: 2000});
        console.log('emitting......');
      },
    },
  };
</script>

<style scoped>
  .inputBackground {
    background-color: #f2f2f2;
    border: none;
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
    background-color: transparent;
  }

  .cardSection {
    padding: 0
  }
</style>
