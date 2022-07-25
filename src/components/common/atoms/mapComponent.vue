<template>
  <div
    :id="elementData._id"
    @click.stop="!previewing ? currentElement = {...elementData, treePath, index} : ''"
    :style="{...$lget(elementData, 'styles', {}), position: 'relative'}"
    :class="!isEditing ? showBorder ? 'inactive': '' : 'editing'"
  >
    <editing-options v-if="isEditing && !previewing"
                     :parent="$lget(treePath, [0])"
                     :type="elementData._type"
                     @jumpToParent="currentElement = $event"
    />
    <iframe
      @click.stop="!previewing ? currentElement = {...elementData, treePath, index, pathToMe} : ''"
      :src="$lget(elementData, 'src')"
      :style="{...$lget(elementData, 'styles', {})}"
    />

  </div>
</template>

<script>
  import editingOptions from 'components/editingOptions/editingOptions';

  export default {
    name: 'TheMap',
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
      currentElement: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (this.isEditing) {
            this.elementData = this.$lcloneDeep(newVal);
          }
        }
      }
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
