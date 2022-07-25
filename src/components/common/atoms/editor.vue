<template>
  <div :style="{...$lget(isEditing ? currentElement : elementData, 'styles', {}), position: 'relative'}"
       :class="!isEditing ? showBorder ? 'inactive': '' : 'editing'"
       @click.stop="!previewing ? currentElement = {...elementData, treePath, index, pathToMe} : ''">
    <editing-options v-if="isEditing && !previewing"
                     :parent="$lget(treePath, [0])"
                     :type="isEditing ? currentElement._type : elementData._type"
                     @jumpToParent="currentElement = $event"/>
    <q-card v-if="edit"
            @dblclick="showEditor()"
            flat
            style="background: unset;">
      <q-card-section :style="{...elementData.styles, width: '100%'}">
        <span v-html="content"></span>
      </q-card-section>
    </q-card>
    <q-editor v-else
              v-model="content"
              :dense="$q.screen.lt.md"
              :style="{...elementData.styles, width: '100%'}"
              :definitions="{
                save: {
                  tip: 'Save',
                  icon: 'save',
                  label: 'Save',
                  handler: saveContents
                },
                view: {
                  tip: 'Hide View',
                  icon: 'visibility_off',
                  label: 'Hide View',
                  handler: switchView
                }
              }"
              :toolbar="[
                [
                  {
                    label: $q.lang.editor.align,
                    icon: $q.iconSet.editor.align,
                    fixedLabel: true,
                    list: 'only-icons',
                    options: ['left', 'center', 'right', 'justify']
                  }
                ],
                ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
                ['token', 'hr', 'link', 'custom_btn'],
                ['print', 'fullscreen'],
                [
                  {
                    label: $q.lang.editor.formatting,
                    icon: $q.iconSet.editor.formatting,
                    list: 'no-icons',
                    options: [
                      'p',
                      'h1',
                      'h2',
                      'h3',
                      'h4',
                      'h5',
                      'h6',
                      'code'
                    ]
                  },
                  {
                    label: $q.lang.editor.fontSize,
                    icon: $q.iconSet.editor.fontSize,
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'size-1',
                      'size-2',
                      'size-3',
                      'size-4',
                      'size-5',
                      'size-6',
                      'size-7'
                    ]
                  },
                  {
                    label: $q.lang.editor.defaultFont,
                    icon: $q.iconSet.editor.font,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'default_font',
                      'arial',
                      'arial_black',
                      'comic_sans',
                      'courier_new',
                      'impact',
                      'lucida_grande',
                      'times_new_roman',
                      'verdana'
                    ]
                  },
                  'removeFormat'
                ],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                ['undo', 'redo'],
                ['viewsource'],
                ['save', 'view']
              ]"
              :fonts="{
                arial: 'Arial',
                arial_black: 'Arial Black',
                comic_sans: 'Comic Sans MS',
                courier_new: 'Courier New',
                impact: 'Impact',
                lucida_grande: 'Lucida Grande',
                times_new_roman: 'Times New Roman',
                verdana: 'Verdana'
              }"
    />
  </div>
</template>

<script>
  import editingOptions from 'components/editingOptions/editingOptions';
  import {mapFields} from 'vuex-map-fields';
  import {mapActions} from 'vuex';

  export default {
    name: 'editor',
    components: {
      editingOptions,
    },
    mounted() {
      this.setContent();
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
        content: '',
        edit: true,
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
      currentElement: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (this.isEditing) {
            this.elementData = newVal;
          }
        },
      },
    },
    computed: {
      isEditing() {
        return this.$lget(this.currentElement, '_id', false) === this.$lget(this.elementData, '_id', true) && !this.previewing;
      },
      ...mapFields(['currentElement']),
    },
    methods: {
      ...mapActions('wpb-elements', {
        patchElement: 'patch',
      }),
      setContent() {
        this.content = this.$lget(this.elementData, 'content', '');
      },
      switchView() {
        this.edit = true;
      },
      showEditor() {
        console.log('chganging');
        this.edit = false;
      },
      saveContents() {
        this.patchElement([this.elementData._id, {content: this.content}, {query: {_type: this.elementData._type}}])
          .then(res => {
            console.log('Saved', res);
            this.$q.notify({
              type: 'positive',
              message: 'Saved',
            });
          })
          .catch(err => {
            this.$q.notify({
              type: 'negative',
              message: 'Error saving',
            });
            console.log('erroring', err);
          });
      },
    },
  };
</script>

<style scoped>

</style>
