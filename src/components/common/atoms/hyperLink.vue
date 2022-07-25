<template>
  <div :id="elementData._id"
       :style="{...$lget(elementData, 'styles', {}), position: 'relative'}"
       @click.stop="!previewing ? currentElement = {...elementData, treePath, index, pathToMe} : ''"
       :class="[...$lget(elementData, '_fastjoin.classes', []).map(cl => cl.name.replace('.', '')), !isEditing ? showBorder ? 'inactive': '' : 'editing']">
    <editing-options v-if="isEditing && !previewing"
                     :parent="$lget(treePath, [0])"
                     :type="elementData._type"
                     @jumpToParent="currentElement = $event"/>
    <a :href="elementData.url" :target="elementData.target">
      <p :style="{'margin-bottom': '0px', ...elementData.styles, width: '100%'}"
         @blur="elementUpdate($event.target.innerText)">{{ elementData.content }}
      </p>
    </a>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import editingOptions from 'components/editingOptions/editingOptions';

  export default {
    name: 'hyperLink',
    components: {
      editingOptions,
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
            this.elementData = this.$lcloneDeep(newVal);
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
      ...mapActions('wpb-elements', {
        patchElement: 'patch',
      }),
      elementUpdate(val) {
        if (this.isEditing) {
          console.log('-------YaY------');
          console.log('Element Update', val, this.elementData);
          if (val !== this.$lget(this.elementData, 'content')) {
            this.patchElement([this.elementData._id, {'content': val}, {query: {_type: this.elementData._type}}])
              .then(res => {
                console.log('YaY it saved', res.content);
              })
              .catch(err => {
                console.log('REEEE SOMETHING IS WRONG', err);
              });
          }
        } else {
          console.log('sorry you can\'t save right now because youre not editing');
        }
      },
    },
  };
</script>

<style scoped>

</style>
