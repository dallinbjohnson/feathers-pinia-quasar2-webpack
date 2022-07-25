<template>
  <div :style="{...$lget(elementData, 'styles', {}), position: 'relative'}"
       :class="[...classes,  !isEditing ? showBorder ? ' inactive': '' : ' editing']">
    <editing-options v-if="isEditing && !previewing"
                     :parent="$lget(treePath, [0])"
                     :type="elementData._type"
                     @jumpToParent="currentElement = $event"/>
    <p :style="{'margin': '0', width: '100%', height: '100%'}"
       :id="elementData._id"
       :contenteditable="contentEditable"
       @blur="elementUpdate($event.target.innerText)"
       @click.right.stop="test"
       @dblclick.stop="handleContentEditable"
       @click.stop="!previewing ? currentElement = {...elementData, treePath, index, pathToMe} : ''">
      {{ elementData.content }}
    </p>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import editingOptions from 'components/editingOptions/editingOptions';
  import classesMixin from 'src/mixins/classesMixin';


  export default {
    name: 'pTag',
    components: {
      editingOptions,
    },
    mixins: [
      classesMixin({
        nameSpace: 'elementData',
        service: 'wpb-elements',
      }),
    ],
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
        contentEditable: false,
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        async handler(newVal) {
          if (newVal) {
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
        this.contentEditable = false;
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
      test(val) {
        const selection = window.getSelection();
        let tag = document.createElement('a');
        tag.href = 'https://www.google.com';
        tag.target = '_blank';
        // tag.style.color = 'inherit';
        tag.style.textDecoration = 'none';
        tag.style.cursor = 'pointer';
        tag.contentEditable = 'false';
        console.log(tag.getAttributeNames());
        const currentRange = selection.rangeCount === 0 ? null : selection.getRangeAt(0).cloneRange();
        console.log('current range', selection.rangeCount);
        currentRange.surroundContents(tag);
        // const range = document.createRange();
        // range.selectNodeContents(val.target);
        // selection.removeAllRanges();
        // selection.addRange(range);
        let text = val.target.innerText;
        let change = text.substring(currentRange.startOffset - 5, currentRange.endOffset - 5);
        // val.target.innerHTML = stuff;
        console.log('testing val', {change, val: val.target.innerHTML, currentRange});

      },
      getData() {
        return this.isEditing ? this.currentElement : this.elementData;
      },
      handleContentEditable(event) {
        this.contentEditable = true;

        setTimeout(() => {
          let cell = event.target;
          // select all text in contenteditable
          // see http://stackoverflow.com/a/6150060/145346
          let range, selection;
          if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(cell);
            range.select();
          } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(cell);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }, 200);
      },
    },
  };
</script>

<style scoped lang="scss">
  #TheText::v-deep {
    .q-textarea {
      .q-field__control-container {
        padding: 0;
      }
    }
  }
</style>
