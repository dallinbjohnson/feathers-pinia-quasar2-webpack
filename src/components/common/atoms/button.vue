<template>
  <div :id="elementData._id"
       :style="{...$lget(elementData, 'styles', {}), position: 'relative', 'background-color': 'none', border: 'none'}"
       :class="[...$lget(elementData, 'classes', []).map(cl => cl.classValue), !isEditing ? showBorder ? 'inactive': '' : 'editing']">
    <editing-options v-if="isEditing && !previewing"
                     :parent="$lget(treePath, [0])"
                     :type="elementData._type"
                     @jumpToParent="currentElement = $event"/>
    <q-btn :style="{width: '100%'}"
           :label="elementData.label"
           v-bind="$attrs['attrs']"
           @click.stop="goToLink(elementData.to)"/>
  </div>
</template>

<script>
  import editingOptions from 'components/editingOptions/editingOptions';

  export default {
    name: 'isButton',
    inheritAttrs: false,
    components: {
      editingOptions,
    },
    props: {
      previewing: Boolean,
      treePath: Array,
      pathToMe: String,
      element: Object,
      index: Number,
      editing: Boolean,
      focus: {
        type: Boolean,
        default: false,
      },
      showBorder: {
        type: Boolean,
      },
    },
    data() {
      return {
        elementData: {},
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        async handler(newVal) {
          if (newVal && JSON.stringify(newVal) !== JSON.stringify(this.elementData)) {
            this.elementData = newVal;
          }
        },
      },
    },
    computed: {
      isEditing() {
        return this.$lget(this.currentElement, '_id', false) === this.$lget(this.elementData, '_id', true) && !this.previewing;
      },
      currentElement: {
        get() {
          return this.$store.getters.getCurrentElement;
        },
        set(element) {
          this.$store.dispatch('setCurrentElement', element);
        },
      },
    },
    methods: {
      testing() {
        console.log('hello', this.$attrs, this.element);
      },
      goToLink(val) {
        if (this.previewing) {
          window.location.href = val;
          const re = new RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i);
          console.log('regex', re.test(val));
          if (re.test(val)) {
            console.log('regex', re.test(val));
            window.location.href = val;
          } else {
            console.log('hitting this');
            this.$router.push(val);
          }
        } else {
          this.currentElement = {
            ...this.elementData,
            treePath: this.treePath,
            index: this.index,
            pathToMe: this.pathToMe,
          };
        }
      },
    },
  };
</script>

<style scoped>

</style>
