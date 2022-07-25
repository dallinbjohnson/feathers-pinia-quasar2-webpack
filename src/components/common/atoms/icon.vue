<template>
  <div :id="elementData._id"
       :style="{...$lget(elementData, 'styles', {}), position: 'relative', background_color: 'transparent'}"
       @click.stop="!previewing ? currentElement = {...elementData, treePath, index, pathToMe} : ''"
       :class="!isEditing ? showBorder ? 'inactive': '' : 'editing'" >
    <editing-options v-if="isEditing && !previewing"
                     :parent="$lget(treePath, [0])"
                     :type="elementData._type"
                     @jumpToParent="currentElement = $event"
    />
    <q-icon :styles="{...elementData.styles, width: '100%'}"
            v-bind="$lget(elementData, 'attrs', {})"/>
  </div>
</template>

<script>
  import editingOptions from 'components/editingOptions/editingOptions';

  export default {
    name: 'icon',
    inheritAttrs: false,
    components: {
      editingOptions
    },
    props: {
      previewing: Boolean,
      treePath: Array,
      pathToMe: String,
      element: Object,
      index: Number,
      attrs: Object,
      editing: Boolean,
      focus: {
        type: Boolean,
        default: false
      },
      showBorder: {
        type: Boolean
      }
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
            this.elementData = this.$lcloneDeep(newVal);
          }
        }
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
        }
      },
    }
  };
</script>

<style scoped>

</style>
