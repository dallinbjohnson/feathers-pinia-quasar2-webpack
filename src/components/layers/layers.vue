<template>
  <div id="Layers" :style="`height: calc(${parentHeight}px - 50px)`">
    <q-scroll-area :style="`height: calc(${parentHeight}px - (50px + 45px))`">
      <draggable-tree v-model="tree"
                      :attrs="{
                        keyProp: '_id',
                        childrenProp: 'tree_children',
                        group: 'page',
                      }"
                      :div-attrs="{height: '100%'}"
                      @change="editTree">
        <template v-slot:default="{item, index}">
          <div :class="`${isSelected(item) ? 'bg-grey-4':''} flex q-pl-sm q-my-xs`"
               :id="`${index}-${item._id}`"
               style="width: 90%; border-radius: 10px"
               @click.stop="$emit('scrollToElement', item)">
            <div class="flex items-center" style="font-size: .9rem; align-self: center">
              {{ item._type !== 'page' ? `${index + 1}. ` : '' }}
              <p style="margin: 0"
                 @dblclick.stop="handleContentEditable"
                 :contenteditable="contentEditable"
                 @blur="updateName(item, $event.target.innerText)">
                {{ $lget(item, 'name', $lget(item, '_type', 'section')) }}
              </p>
            </div>
            <q-space/>
            <div class="drag-action-icons">
              <q-icon v-show="isSelected(item) && item._type !== 'page'"
                      name="drive_folder_upload"
                      size="xs"
                      class="cursor-pointer"
                      @click.stop="setItem(item)">
                <q-tooltip>Make a Template</q-tooltip>
              </q-icon>
              <q-icon v-show="isSelected(item) && item._type !== 'page'"
                      name="delete"
                      size="xs"
                      class="cursor-pointer"
                      @click.stop="startRemove(item)">
                <q-tooltip>Delete</q-tooltip>
              </q-icon>
            </div>
          </div>
        </template>
      </draggable-tree>
    </q-scroll-area>

    <q-dialog v-model="saveAsTemplate">
      <q-card style="width: 100%; max-width: 500px">
        <q-card-section>
          <p style=" margin: 0; font-size: 2rem">Save as Template</p>
        </q-card-section>
        <q-card-section style="padding: 0 16px;">
          <q-input label="Name of Template" v-model="templateName" style="width: 100%; font-size: 1rem"
                   input-style="font-size: 1rem"/>
        </q-card-section>
        <q-card-section class="flex column">
          <div
            style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; width: 50%">
            <p style="margin: 0; font-size: 1rem">
              Save as Template?
            </p>
            <q-toggle v-model="template"/>
          </div>
          <div
            style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; width: 50%">
            <p style="margin: 0; font-size: 1rem">
              Save as Public?
            </p>
            <q-toggle v-model="isPublic"
                      @input="devTemplate && !$event ? devTemplate = $event : false"/>
          </div>
          <div
            style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; width: 50%">
            <p style="margin: 0; font-size: 1rem">
              Save as Base Template?
            </p>
            <q-toggle v-model="baseTemplate"/>
          </div>
          <div
            style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; width: 50%">
            <p style="margin: 0; font-size: 1rem">
              Save as Dev Template?
            </p>
            <q-toggle v-model="devTemplate"
                      @input="$event ? isPublic = $event : false"/>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="textSize col-12">
            <q-select v-model="icon_set" label="Icon Set" :options="icon_options"/>
            <q-input v-model="filter" label="Search..." outlined clearable class="q-my-lg"/>
            <p style="font-size: 1.1rem;">
              <b class="q-mr-sm">Selected:</b>
              <q-icon :name="edited_item.icon" size="md"></q-icon>
              {{ edited_item.icon }}
            </p>
            <q-icon-picker v-model="edited_item.icon"
                           :icon-set="icon_set"
                           v-model:pagination="pagination"
                           :filter="filter"
                           animated
                           style="height: 180px;"/>
          </div>
        </q-card-section>
        <q-card-section style="width: 100%; display: flex; justify-content: flex-end">
          <q-btn flat class="q-mx-md" label="Cancel" @click="saveAsTemplate = !saveAsTemplate"/>
          <q-btn label="Save" color="green" @click.stop="saveTemplate"/>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="removeDialog" seamless>
      <q-card>
        <q-card-section>
          <h4>
            Are you sure you want to remove this {{
              hasChildren() ? 'section and all its children' : 'element'
            }}?
          </h4>
          <q-card-actions style="width: 100%; display: flex; justify-content: flex-end">
            <q-btn flat @click.stop="removeDialog = false">Cancel</q-btn>
            <q-btn color="red" @click.stop="removeFromTree">Delete</q-btn>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import draggableTree from 'components/common/atoms/draggableTree/draggableTree';
  import {mapActions, mapGetters} from 'vuex';

  export default {
    name: 'layers',
    components: {
      draggableTree,
    },
    props: {
      form: Object,
      parentHeight: Number,
    },
    data() {
      return {
        formCopy: {},
        removeDialog: false,
        saveAsTemplate: false,
        templatePlaceholder: {},
        templateName: '',
        isPublic: false,
        devTemplate: false,
        template: false,
        baseTemplate: false,
        saveAsPage: false,
        icon_set: 'material-icons',
        icon_options: [
          'ionicons-v4',
          'fontawesome-v5',
          'eva-icons',
          'themify',
          'line-awesome',
          'mdi-v5',
          'material-icons',
          'material-icons-outlined',
          'material-icons-round',
          'material-icons-sharp',
        ],
        filter: '',
        edited_item: {
          name: '',
          icon: '',
        },
        pagination: {
          itemsPerPage: 60,
          page: 0,
        },
        contentEditable: false,
      };
    },
    mounted() {
      this.$emit('mountedScroll');
    },
    watch: {
      form: {
        immediate: true,
        deep: true,
        handler(newVal) {
          let self = this;

          function treeCompiler(arr, parentPath, treePath = []) {
            return arr.map((item, index) => {
              const myPath = !parentPath ? `_fastjoin.sections[${index}]` : parentPath + `._fastjoin.children[${index}]`;
              let sections = self.$lget(item, '_fastjoin.children', []);
              let elements = self.$lget(item, '_fastjoin.elements', []);
              elements = elements.map((item, index) => {
                return {
                  ...item,
                  pathToMe: myPath + `._fastjoin.elements[${index}]`,
                  treePath: [{...item, index, treePath}, ...treePath],
                };
              });
              if (sections.length) {
                sections = treeCompiler(sections, myPath, [{...item, index, treePath}, ...treePath]);
              }
              self.$lset(item, 'tree_children', [...elements, ...sections]);
              self.$lset(item, 'pathToMe', myPath);
              self.$lset(item, 'treePath', treePath);
              item.tree_children.sort((curr, next) => {
                return curr.styles.order - next.styles.order;
              });
              return item;
            });
          }

          if (newVal) {
            // console.log('watch form layers.vue', newVal);
            let copyNewVal = this.$lcloneDeep(newVal);

            let children = this.$lget(copyNewVal, '_fastjoin.sections', []);
            if (children.length) {
              let tree = [{
                ...copyNewVal,
                _type: 'page',
                treePath: [{...copyNewVal, index: 0, path: '', pathToMe: ''}],
                tree_children: treeCompiler(children, null, [copyNewVal]),
              }];
              this.$lset(copyNewVal, '_fastjoin.tree', tree);
              if (!this.currentElement || !Object.keys(this.currentElement).length) this.currentElement = tree[0];
            }
            this.formCopy = copyNewVal;
          }
        },
      },
    },
    computed: {
      ...mapGetters('auth', {
        user: 'user',
      }),
      axiosFeathers() {
        return this.$axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.$store.state.auth.accessToken,
          },
        });
      },
      feathersAxios() {
        return this.$axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.$store.state.auth.accessToken,
          },
        });
      },
      tree: {
        get() {
          return this.$lget(this.formCopy, '_fastjoin.tree', []);
        },
        set(val) {
          // console.log('setting the tree', val);
          let formCopy = this.$lcloneDeep(this.formCopy);
          this.$lset(formCopy, '_fastjoin.tree', val);
          this.formCopy = formCopy;
        },
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
      ...mapActions('wpb-sections', {
        patchSection: 'patch',
      }),
      updateName(val, change) {
        this.contentEditable = false;
        if (!['section', val._type, val.name].includes(change)) {

          if (val._type) {
            this.patchElement([val._id, {name: change}, {query: {_type: val._type}}])
              .then(res => {
                console.log('remvoed', res);
                this.$q.notify({
                  type: 'positive', message: 'Updated Element Name',
                });
              })
              .catch(err => {
                this.$q.notify({
                  type: 'negative', message: 'Error Updating Name',
                });
                console.log('erroring', err);
              });
          } else {
            this.patchSection([val._id, {name: change}])
              .then(res => {
                console.log('remvoed', res);
                this.$q.notify({
                  type: 'positive', message: 'Updated Section Name',
                });
              })
              .catch(err => {
                this.$q.notify({
                  type: 'negative', message: 'Error Changing Name',
                });
                console.log('erroring', err);
              });
          }
        }
      },
      async editTree() {
        // we need to make a copy of our tree to avoid vuex mutation errors
        // console.log('editTree', this.tree);
        let treeCopy = this.$lcloneDeep(this.tree);
        // console.log('\n\ntreeCopy:', treeCopy);
        let findChanges = (arr, parentType, parentId) => {
          if (parentType === 'page') {
            return arr.reduce((acc, curr, index) => {
              // console.log('curr parent', parentType, ' curr type', curr._type ? curr._type : ' section', 'acc: ', acc, ' curr order: ', curr.styles.order, ' arr index: ', index);
              if (this.$lget(curr, '_type') && this.$lget(curr, '_type') !== 'page') {
                let newManagementData = {
                  'page_id': this.$lget(this.formCopy, '_id'),
                  value: curr,
                  'order_position': index,
                };
                acc.rootElements.push(newManagementData);
              } else {
                let changed = false;
                let data = {_id: curr._id, changes: {}};
                if (this.$lget(curr, 'styles.order') !== index) {
                  data.changes['styles.order'] = index;
                  changed = true;
                }
                if (this.$lget(curr, 'parent')) {
                  data.changes.parent = null;
                  changed = true;
                }
                if (changed) {
                  // console.log('acc changed', Object.assign({}, acc));
                  acc.sections.push(data);
                }
                let children = this.$lget(curr, 'tree_children', []);

                if (children.length) {
                  // console.log(parentType, ' children: ', children);
                  let changes = findChanges(children, 'section', curr._id);
                  acc = {
                    ...acc,
                    sections: [...acc.sections, ...changes.sections],
                    elements: [...acc.elements, ...changes.elements],
                  };
                }
              }
              return acc;
            }, {rootElements: [], sections: [], elements: []});
          } else {
            return arr.reduce((acc, curr, index) => {
              // console.log('curr parent', parentType, ' curr type', curr._type ? curr._type : ' section', 'acc: ', acc, ' curr order: ', curr.styles.order, ' arr index: ', index);
              let element = curr._type;
              let changed = false;
              let data = {_id: curr._id, _type: curr._type, changes: {}};
              if (this.$lget(curr, 'styles.order') !== index) {
                data.changes['styles.order'] = index;
                changed = true;
              }
              if (element) {
                // console.log('element parentId', parentId, curr.section);
                if (parentId && this.$lget(curr, 'section') !== parentId) {
                  console.log('setting element section');
                  data.changes.section = parentId;
                  changed = true;
                }
              }
              if (!element) {
                // console.log('section parentId', parentId, curr.section);
                if (parentId && !this.$lget(curr, 'parent')) {
                  data.changes.parent = parentId;
                  changed = true;
                }
                if (parentId && this.$lget(curr, 'parent') && this.$lget(curr, 'parent') !== parentId) {
                  data.changes.parent = parentId;
                  changed = true;
                }
                let children = this.$lget(curr, 'tree_children', []);
                if (children.length) {
                  let changes = findChanges(children, 'section', curr._id);
                  acc = {
                    ...acc,
                    sections: [...acc.sections, ...changes.sections],
                    elements: [...acc.elements, ...changes.elements],
                  };
                }
              }
              if (changed) {
                if (element) {
                  acc.elements.push(data);
                } else {
                  acc.sections.push(data);
                }
              }
              return acc;
            }, {management: [], sections: [], elements: []});
          }
        };
        let patch_items = findChanges(this.$lget(treeCopy, [0, 'tree_children'], []), 'page', this.formCopy._id);
        let {rootElements, sections, elements} = patch_items;
        // console.log('after doing findChanges');
        // console.log(patch_items);
        if (rootElements.length || sections.length || elements.length) {
          this.$isLoading(true);
          this.saving = true;
          await this.axiosFeathers.post('wpb-management', {
            action: 'treeChanges',
            value: patch_items,
            page_id: this.formCopy._id,
          })
            .then(res => {
              console.log('management success', res);
            })
            .catch(err => console.error('management error', err));
          this.$isLoading(false);
          this.saving = false;
        }
      },
      setItem(item) {
        this.templatePlaceholder = item;
        this.saveAsTemplate = !this.saveAsTemplate;
      },
      saveTemplate() {
        if (this.isPublic === true) {
          if (this.templatePlaceholder._type) {
            console.log('numba 1 element public');
            let templateCopy = Object.assign({}, this.templatePlaceholder);
            templateCopy.isPublic = this.isPublic;
            templateCopy.baseElement = this.baseTemplate;
            templateCopy.template = this.template;
            templateCopy.devTemplate = this.devTemplate;
            templateCopy.icon = this.edited_item.icon;
            templateCopy.name = this.templateName;
            templateCopy.ownerId = this.user._id;
            console.log('ownerId:', templateCopy.ownerId, 'userID', this.user._id);
            const data = {
              value: templateCopy,
              action: 'makeElementTemplate',
            };
            this.feathersAxios.post('/wpb-management', data)
              .then(res => {
                console.log(res);
                this.saveAsTemplate = !this.saveAsTemplate;
              })
              .catch(err => console.error(err));
          } else {
            console.log('numba 2 sections public');
            const data = {
              value: {
                id: this.templatePlaceholder._id,
                isPublic: this.isPublic,
                baseSection: this.baseTemplate,
                template: this.template,
                devTemplate: this.devTemplate,
                icon: this.edited_item.icon,
                name: this.templateName,
                ownerId: this.user._id,
              },
              action: 'makeSectionTemplate',
            };
            console.log('this si the section add data', data);
            this.feathersAxios.post('/wpb-management', data)
              .then(res => {
                console.log('it worked homie dont stress', res);
                this.saveAsTemplate = !this.saveAsTemplate;
              })
              .catch(err => console.error(err));
          }
        } else if (this.isPublic === false) {
          if (this.templatePlaceholder._type) {
            console.log('numba 1 element not public');
            let templateCopy = Object.assign({}, this.templatePlaceholder);
            templateCopy.isPublic = this.isPublic;
            templateCopy.baseElement = this.baseTemplate;
            templateCopy.template = this.template;
            templateCopy.devTemplate = this.devTemplate;
            templateCopy.icon = this.edited_item.icon;
            templateCopy.name = this.templateName;
            templateCopy.ownerId = this.user._id;
            const data = {
              value: templateCopy,
              action: 'makeElementTemplate',
            };
            console.log('not public element', data);
            this.feathersAxios.post('/wpb-management', data)
              .then(res => {
                console.log(res);
                this.saveAsTemplate = !this.saveAsTemplate;
              })
              .catch(err => console.error(err));
          } else {
            console.log('numba 2 sections not public');
            const data = {
              value: {
                id: this.templatePlaceholder._id,
                isPublic: this.isPublic,
                baseSection: this.baseTemplate,
                template: this.template,
                devTemplate: this.devTemplate,
                icon: this.edited_item.icon,
                name: this.templateName,
                ownerId: this.user._id,
              },
              action: 'makeSectionTemplate',
            };
            console.log('this is the darta', data);
            this.feathersAxios.post('/wpb-management', data)
              .then(res => {
                console.log('it worked homie dont stress', res);
                this.saveAsTemplate = !this.saveAsTemplate;
              })
              .catch(err => console.error(err));
          }
        }
      },
      isSelected(item) {
        return this.$lget(this.currentElement, '_id', true) === this.$lget(item, '_id', false);
      },
      startRemove(val) {
        this.currentElement = val;
        this.removeDialog = true;
      },
      hasChildren() {
        return !!this.$lget(this.currentElement, 'tree_children', []).length;
      },
      async removeFromTree() {

        let element = this.currentElement._type;
        this.$q.loading.show({message: 'Removing', ignoreDefaults: true});
        if (element) {
          await this.$store.dispatch('wpb-elements/remove', this.currentElement._id)
            .catch(err => console.error('problem removing element\n', err));
        } else {
          await this.$store.dispatch('wpb-sections/remove', this.currentElement._id)
            .catch(err => console.error('problem removing section\n', err));
        }
        this.removeDialog = false;
        this.$isLoading(false);
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

<style scoped lang="scss" src="./_Layers.scss">

</style>
