<template>
  <div :class="`col-${cols} col-sm-${sm} col-md-${md} col-lg-${lg}`">
    <div class="row justify-center">
    <q-select @input="$emit('input', $event)"
              @input-value="inputTrigger"
              :value="select"
              :behavior="$attrs.behavior"
              ref="autoCompleteSelect"
              :rounded="rounded"
              :label="label"
              :stack-label="stackLabel"
              :options="filterOptions"
              :option-label="optionText"
              :option-value="optionValue"
              :hint="hint"
              :dense="dense"
              :hide-hint="hideHint"
              :multiple="multiple"
              :filled="filled"
              :actioned="actioned"
              :outlined="outlined"
              :hide-bottom-space="hideBottomSpace"
              :options-dense="optionsDense"
              :options-dark="optionsDark"
              :dark="dark"
              :name="name"
              :height="height"
              :clearable="clearable"
              :bg-color="bgColor"
              :class="classProp"
              :style="customStyle ? customStyle : { maxWidth: maxWidth, width: width, height: height, padding: padding }"
              :color="color"
              :error-message="errorMessage"
              hide-selected
              fill-input
              use-input
              :borderless="borderless"
              input-debounce="0"
              @filter="filterFn"
              @new-value="createValue"

    >
      <template v-slot:no-option v-if="$attrs.noOption">
        <q-item>
          <q-item-section class="text-italic text-grey">
            {{$attrs.noOption}}
          </q-item-section>
        </q-item>
      </template>
      <template slot="before-options">
        <slot name="beforeOptions"></slot>
      </template>
      <q-icon slot="prepend" :color="icon_color" v-if="prepend_icon" :name="prepend_icon">
      </q-icon>

      <template v-slot:selected-item="data" v-if="chips">
        <q-chip removable
                @remove="handleClick(data.opt, data.selected, data.index)"
        >
          <q-avatar v-if="avatarOn">
            <img :src="data.opt[option_avatar]">
          </q-avatar>
          <q-icon v-if="iconOn" :style="{marginRight: '12px', color: icon_color}"
                  :name="data.opt[option_avatar]"></q-icon>
          {{data.opt[optionText]}}
        </q-chip>
      </template>

      <template v-slot:option="data" v-if="list_detail">
        <q-item clickable @click="handleClick(data.opt, data.selected, data.index)">
          <q-item-section v-if="avatarOn || iconOn" avatar>
            <q-avatar v-if="avatarOn">
              <img :src="data.opt[option_avatar] ? data.opt[option_avatar] : ''" v-if="avatarOn">
            </q-avatar>
            <q-icon v-if="iconOn" :style="{ color: icon_color }"
                    :name="allItemIcon ? allItemIcon : data.opt[option_avatar]"></q-icon>
          </q-item-section>
          <q-item-section style="text-align: left">
            <template v-if="dataItemSlot">
              <slot name="dataItemSlot" :data="data.opt"></slot>
            </template>
            <q-item-label v-if="!dataItemSlot"
                          v-html="optionText ? data.opt[optionText] : data.opt"></q-item-label>
            <q-item-label caption>{{data.opt[item_subtitle]}}</q-item-label>
          </q-item-section>
          <q-item-section v-if="multiple">
            <q-icon name="check_circle" :style="{ color: select.includes(data.opt) ? 'green accent-4' : 'grey' }">
            </q-icon>
            <q-item-label side bottom v-if="select.includes(data.opt) && multiple">
              {{actioned}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:append v-if="appendIcon">
        <div style="height: 100%; display: grid; align-items: center" @click.stop="$emit('append')">
          <q-icon style="font-size: 30px" :color="appendColor" :name="appendIcon"></q-icon>
        </div>
      </template>
    </q-select>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'Autocomplete',
    props: {
      customStyle: Object,
      forceOpen: Boolean,
      dataItemSlot: Boolean,
      classProp: String,
      maxWidth: String,
      clearable: Boolean,
      hideBottomSpace: Boolean,
      width: {
        type: String,
        default: '100%'
      },
      dark: Boolean,
      appendColor: String,
      newValueMode: String,
      appendIcon: String,
      multiple: Boolean,
      color: String,
      bgColor: String,
      chips: Boolean,
      list_detail: Boolean,
      errorMessage: [Array, String],
      padding: String,
      height: [String, Number],
      item_subtitle: String,
      borderless: Boolean,
      options: {
        type: Array,
        required: true
      },
      name: {
        type: String,
        default: ''
      },
      stackLabel: Boolean,
      label: {
        type: String,
        default: '',
        required: true
      },
      prepend_icon: {
        type: String,
        default: '',
        required: false
      },
      icon_color: String,
      hint: {
        type: String,
        default: '',
        required: false
      },
      hideHint: Boolean,
      rounded: Boolean,
      filled: Boolean,
      outlined: Boolean,
      value: {
        type: [Array, Object, String, Number],
        required: false
      },
      optionsDense: Boolean,
      optionsDark: Boolean,
      // DISPLAYS TEXT ACTION ON LIST
      actioned: {
        type: String,
        default: 'Selected',
        required: false
      },
      optionText: String,
      optionValue: {
        type: [String, Object],
        required: false
      },
      option_avatar: {
        type: String
      },
      dense: Boolean,
      avatarOn: {
        type: Boolean,
        default: true
      },
      iconOn: Boolean,
      // use same icon for all items
      allItemIcon: String,
      cols: {
        type: [Number, Boolean, String],
        default: 12
      },
      sm: [Number, Boolean, String],
      md: [Number, Boolean, String],
      lg: [Number, Boolean, String]
    },
    data () {
      return {
        select: '',
        searchInput: null,
        hideSelected: false,
      };
    },
    watch: {
      // options: {
      //   immediate: true,
      //   handler(newVal){
      //     this.stringOptions = this.optionText ? newVal.map(a => a[this.optionText]) : newVal
      //   }
      // },
      value: {
        immediate: true,
        handler (newVal) {
          this.select = newVal;
        }
      }
    },
    computed: {
      filterOptions () {
        if(this.searchInput && typeof this.searchInput !== 'undefined') {
          const needle = this.searchInput.toLowerCase();
          if (this.optionText) {
            // console.log('needle', needle, this.optionText)
            return this.options.filter(v => v[this.optionText].toString().toLowerCase().indexOf(needle) > -1);
          } else {
            return this.options.filter(v => v.toString().toLowerCase().indexOf(needle) > -1);
          }
        } else return this.options;
      },
      colorClicked (item) {
        if (this.options.filter(e => e.name === item.name).length > 0) {
          return 'green accent-4';
        } else {
          return 'grey';
        }
      }
    },
    methods: {
      inputTrigger(val){
        this.select = val;
      },
      createValue (val, done) {
        done(val, 'add-unique');
        // if (this.newValueMode) {
        //   if (val && val.length > 0) {
        //     if (!this.stringOptions.includes(this.optionText ? val[this.optionText] : val)) this.filterOptions.push(val)
        //     done(val, 'toggle')
        //   }
        // }
      },
      filterFn (val, update) {
        this.select = null;
        if (this.options && typeof this.options !== 'undefined') {
          update(() => {
            // eslint-disable-next-line no-unused-vars
            let valPlug;
            if (typeof val !== 'string') {
              this.searchInput = val.toString();
            } else {
              this.searchInput = val;
            }
            // console.log('filtering', val)
          });
        }
        this.$emit('change', val);
      },
      handleClick (val, selected, index) {
        if (this.multiple) {
          if (selected) {
            this.select.splice(index, 1);
          } else {
            this.select = val;
          }
        } else {
          this.$refs.autoCompleteSelect.hidePopup();
          this.select = val;
        }
        console.log('input from autocomplete', val);
        this.$emit('input', this.select);
        this.$emit('change', this.select);
      },
      handleInput (val) {
        if(!this.list_detail) {
          console.log('input from autocomplete', val, this.searchInput, this.hideSelected);
          // this.select = val
          // let payload = this.optionValue ? val[this.optionValue] : val
          let payload = val;
          this.$emit('input', payload);
          this.$emit('change', payload);
        }
      }
    }
  };
</script>
