<template>
  <div id="stylechoice">
    <div :class="divClass" :style="divStyle">
      <q-select v-model="selected"
                :label="label"
                :placeholder="placeholder ? placeholder : 'Search Or Add Classes...'"
                :options="useOptions"
                :multiple="multiple"
                :rounded="rounded"
                :outlined="outlined"
                filled
                @input="classChange(true)"
                @clear="classChange([])"
                :behavior="behavior"
                style="width: 100%"
                clearable>
        <template v-slot:prepend>
          <q-icon :name="prependIcon"></q-icon>
        </template>
        <template v-slot:no-option>
          <q-item>
            <q-item-section v-if="loading" avatar>
              <q-spinner></q-spinner>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ loading ? 'Loading...' : 'No Classes - Add One' }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:option="scope">
          <q-item v-if="scope"
                  @mouseleave="onOptionLeave(scope.opt)"
                  @mouseover="onOptionHover(scope.opt)"
                  clickable
                  @click="addOption(scope.opt)">
            <q-item-section avatar>
              <q-icon :color="isSelected(scope.opt) ? color : 'grey-5'" :name="tagIcon" size="sm"></q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-xs text-mb-sm text-weight-light text-grey">
                <span v-html="$wpbHighlight(scope.opt.name, scope.opt.classValue)"></span>
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-else>
            <q-item-section>
              <q-item-label class="text-xs text-mb-sm text-weight-light text-grey">No Class Applied</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:selected-item="scope">
          <q-chip :dark="dark"
                  square
                  :color="color"
                  style="font-size: .9em;"
                  :label="scope.opt.classValue"
                  removable
                  @remove="removeOption(scope.opt)"></q-chip>
        </template>
      </q-select>
    </div>
  </div>
</template>


<script>
  import {mapActions} from 'vuex';

  export default {
    name: 'Classes',
    props: {
      divStyle: String,
      behavior: {
        type: String,
        default: 'menu',
      },
      label: String,
      placeholder: String,
      divClass: {
        type: String,
        default: 'q-mx-sm',
      },
      inputClass: String,
      multiple: {
        type: Boolean,
        default: true,
      },
      dense: Boolean,
      outlined: Boolean,
      rounded: Boolean,
      adding: {
        type: Boolean,
      },
      prependIcon: {
        type: String,
        default: 'mdi-tag',
      },
      dark: {
        type: Boolean,
        default: true,
      },
      skipText: {
        type: Number,
        default: 4,
      },
      minTagLength: {
        type: Number,
        default: 2,
      },
      color: {
        type: String,
        default: 'primary',
      },
      tagIcon: {
        type: String,
        default: 'mdi-tag',
      },
      tagPath: {
        type: String,
        default: 'tags',
      },
      value: [String, Array],
      cssRules: {
        type: Array,
      },
      element: {
        type: Object,
      },
    },
    data() {
      return {
        loading: false,
        options: [],
        selected: null,
        searchInput: '',
        limit: 15,
        skip: 0,
        total: 0,
        elementData: {},
        panel: '',
        precedence: '',
        hoveredCssRule: {},
        useOptions: [],
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          this.selected = newVal;
        },
      },
      searchInput: {
        immediate: true,
        handler(newVal, oldVal) {
          let newLength = newVal && newVal.length ? newVal.length : 0;
          let oldLength = oldVal && oldVal.length ? oldVal.length : 0;
          if (newLength && newLength > oldLength && newLength % this.skipText === 0) {
            this.useOptions = this.cssRules.filter(item => item.label.includes(newVal));
          }
        },
      },
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.elementData = this.$lcloneDeep(newVal);
            this.panel = this.$lget(newVal, 'stylingChoice', 'combination');
            this.precedence = this.$lget(newVal, 'combinationPrecedence', 'styles');
          }
        },
      },
      cssRules: {
        immediate: true,
        handler(newVal) {
          this.useOptions = newVal;
        },
      },
    },
    computed: {
      stateClasses() {
        return this.$store.getters['getAvailableClasses'];
      },
    },
    methods: {
      ...mapActions('wpb-pages', {patchPage: 'patch'}),
      ...mapActions('wpb-elements', {patchElement: 'patch'}),
      ...mapActions('wpb-sections', {patchSection: 'patch'}),
      isSelected(tag) {
        if (Array.isArray(this.selected)) {
          if (this.multiple) return this.selected.map(item => item.label + item.name).indexOf(tag.label + tag.name) > -1;
          else return this.selected === tag;
        } else return false;
      },
      onOptionHover(cssRule) {
        this.hoveredCssRule = cssRule;
      },
      onOptionLeave(cssRule) {
        setTimeout(() => {
          if (Object.keys(this.hoveredCssRule).length && this.hoveredCssRule._id === cssRule._id) {
            this.hoveredCssRule = {};
          }
          // console.log(this.hoveredCssRule);
        }, 7000);
      },
      addOption(opt) {
        let selectedLabels = this.selected.map(item => item.label + item.name);
        if (!selectedLabels.includes(opt.label + opt.name)) {
          this.selected.push(opt);
          this.classChange();
        } else {
          this.removeOption(opt);
        }

      },
      removeOption(opt) {
        console.log('remove opt', opt.label === this.selected[0].label);
        this.selected = this.selected.filter(item => item.label + item.name !== opt.label + opt.name);
        this.classChange();
      },
      classChange(val) {
        if (val !== true) {
          if (Array.isArray(val)) this.selected = val;
          let changedClassList = this.selected.map(sel => {
            return {id: sel._id, label: sel.label, classValue: sel.classValue};
          });
          this.$emit('stylesUpdate', {path: 'classes', value: changedClassList});
        }
      },
    },
  };
</script>


<style scoped lang="scss">
  #stylechoice {
    //* {
    //  border: 1px solid red;
    //}
    position: relative;
  }

  .css-rule-info {
    padding: 10px;
    border-radius: 5px;
    position: absolute;
    width: 95%;
    height: 200px;
    z-index: 99999999;
    box-shadow: 2px 2px 6px 3px rgba(0, 0, 0, 0.3);
    background-color: #ffffff;
    left: 0px;
    top: -50px;
  }

  .css-rule-info .content {
    position: relative;
  }

  .css-rule-info .content .close {
    position: absolute;
    top: -5px;
    right: 7px;
    font-size: 1.5em;
    color: red;
    cursor: pointer;
    border-radius: 50%;
  }

  .fade-enter-active {
    transition: all .3s ease;
  }

  .fade-leave-active {
    transition: all .2s ease-in-out;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
