<template>
  <div id="cardFormDialog">
    <q-dialog :value="value" @input="$emit('input', $event)" :position="dialog_position"
              :full-height="dialog_position === 'right'" :seamless="dialog_position === 'right'">
      <q-layout view="Lhh LpR Lff" container :class="$q.dark.mode ? 'bg-dark' : 'bg-white'"
                :style="(dialog_position === 'right' ? `width: ${$data.$windowWidth < 420 ? $data.$windowWidth - 10 : 400}px;` : '') + ' overflow: visible !important;'">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-btn flat
                   round
                   dense
                   :icon="dialog_position !== 'right' ? 'fas fa-thumbtack' : 'fas fa-expand-alt'"
                   @click="handleDialogPosition"/>
            <q-btn flat
                   round
                   dense
                   :icon="card_comment_drawer ? 'fas fa-comment-slash' : 'fas fa-comment'"
                   @click="card_comment_drawer = !card_comment_drawer"/>
            <q-toolbar-title>{{ form_data._id ? form_data.name : 'Create Card' }}</q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close"/>
          </q-toolbar>
        </q-header>

        <q-drawer bordered v-model="card_comment_drawer"
                  :width="$data.$windowWidth < 420 ? $data.$windowWidth - 25 : 350" content-class="shadow-1"
                  class="comment-drawer" :breakpoint="100" persistent overlay>
          <q-page-sticky position="top-right" :offset="[5, -45]" style="z-index: 100;">
            <q-btn @click="card_comment_drawer = false" flat dense round icon="close"></q-btn>
          </q-page-sticky>

          <div class="comment-wrapper q-pb-xl" v-if="card != undefined">
            <div class="no-comments" v-if="$lget(card, 'comments', []).length === 0">Be the first to add a comment</div>
            <div v-else
                 class="comment"
                 v-for="(comment, idx) in $lget(card, '_fastjoin.comments', card.comments)"
                 :key="idx" :id="'comment' + idx"
                 @click="toggleComment(idx, $event)">
              <!--              <q-avatar>-->
              <!--                <img src="https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"/>-->
              <!--              </q-avatar>-->
              <!--              <div class="center">-->
              <!--                <span class="creator">{{ $lget(comment, 'createdBy.name', $lget(comment, 'createdBy.email'))}}</span>-->
              <!--                <br>-->
              <!--                <span v-html="comment.comment"></span>-->
              <!--              </div>-->
              <div class="top">
                <q-avatar size="md">
                  <img
                    src="https://images.vexels.com/media/users/3/145908/preview2/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.jpg"/>
                </q-avatar>
                <span class="creator">{{ $lget(comment, 'createdBy.name', $lget(comment, 'createdBy.email')) }}</span>
              </div>
              <div class="q-mt-sm" v-html="comment.comment"></div>
              <div class="actions-buttons-wrapper">
                <q-fab
                  label-position="top"
                  external-label
                  color="primary"
                  icon="keyboard_arrow_left"
                  direction="left"
                  padding="xs"
                  @click.stop>
                  <q-fab-action @click.stop="openEditComment(comment)" padding="5px" external-label color="primary"
                                icon="create"/>
                  <q-fab-action padding="5px" external-label color="orange" @click.stop="deleteComment(comment)"
                                icon="delete"/>
                </q-fab>
              </div>
            </div>
          </div>
          <div class="input-wrapper">
            <q-editor class="comment-rich-editor"
                      v-model="commentInputVal"
                      :definitions="{
                                      upload: {
                                        tip: 'Upload an image',
                                        icon: 'photo',
                                        handler: insertImg
                                      },
                                      save: {
                                        tip: 'Add comment',
                                        icon: 'send',
                                        handler: addComment,
                                        color: 'blue',
                                      }
                                    }"
                      :toolbar="[...toolbar, ['upload', 'save']]"/>
          </div>
        </q-drawer>

        <q-page-container>
          <q-page class="q-pa-sm">
            <form-generator v-model="form_data" :fields="fields">
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section avatar>
                    <q-avatar v-if="scope.image">
                      <img src="https://cdn.quasar.dev/img/avatar.png">
                    </q-avatar>
                    <q-avatar v-else color="primary" text-color="white">
                      {{
                        option_label(scope.opt) === 'Unknown' ? scope.opt.email.charAt(0).toUpperCase() : option_label(scope.opt).charAt(0).toUpperCase()
                      }}
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <!--<q-item-label v-html="scope.opt.name" />-->
                    <q-item-label v-html="option_label(scope.opt)"/>
                    <q-item-label caption>{{ scope.opt.email }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </form-generator>
            <tag-picker adding v-model="form_data.tags" serviceIn="cards"></tag-picker>
            <div class="q-my-md">
<!--              <q-select-->
<!--                multiple-->
<!--                :options="people.data"-->
<!--                option-label="name"-->
<!--                option-value="_id"-->
<!--                v-model="additionalOwners"-->
<!--                label="Add Owners"-->
<!--                use-chips-->
<!--                stack-label-->
<!--                filled-->
<!--              >-->

<!--              </q-select>-->
            </div>
            <div class="q-my-md">
              <add-card :list="list" :parent-card="card" label="Add SubCard" style="position: sticky; bottom: 0;"></add-card>
            </div>
            <card-event-list :card-events="cardEvents" :card="card"></card-event-list>
          </q-page>
        </q-page-container>

        <q-footer :class="$q.dark.mode ? 'bg-dark' : 'bg-white'" bordered>
          <q-toolbar>
            <q-btn color="primary" @click="saveCard">Save</q-btn>
          </q-toolbar>
        </q-footer>
      </q-layout>
    </q-dialog>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 250px">
        <q-card-section>
          <div class="text-h6">Edit comment</div>
        </q-card-section>

        <q-card-section class="q-pt-none edit-comment-popup">
          <q-editor class="edit-comment-form" v-model="editCommentInputVal"
                    :definitions="{
                                      upload: {
                                        tip: 'Upload an image',
                                        icon: 'photo',
                                        handler: insertImg
                                      },
                                      save: {
                                        tip: 'Add comment',
                                        icon: 'send',
                                        handler: addComment,
                                        color: 'blue',
                                      }
                                    }"
                    :toolbar="[...toolbar, ['fullscreen']]"/>
          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup/>
            <q-btn flat label="Save" @click="saveEditComment"/>
          </q-card-actions>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import {mapActions, mapGetters} from 'vuex';
  import TagPicker from 'components/formGeneratorCustom/TagPicker';
  import addCard from 'components/taskManager/lists/forms/addCard';
  import CardEventList from 'components/taskManager/cardEvents/CardEventList';

  export default {
    name: 'cardFormDialog',
    components: {
      TagPicker,
      addCard,
      CardEventList
    },
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      card: {
        type: Object,
      },
      list: {
        type: Object,
      },
      board: {
        type: Object,
      },
    },
    data() {
      return {
        eventDialog: false,
        toolbar: [
          [
            {
              icon: this.$q.iconSet.editor.formatting,
              options: ['bold', 'italic', 'strike', 'underline']
            }
          ],
          [
            {
              icon: 'text_fields',
              options: ['p', 'code', 'unordered', 'ordered', 'h4', 'h5', 'h6'],
              list: 'no-icons',
              fixedLabel: true
            }
          ],
          [
            {
              icon: this.$q.iconSet.editor.align,
              fixedLabel: true,
              options: ['left', 'center', 'right', 'justify']
            }
          ],
          [
            {
              icon: 'handyman',
              fixedLabel: true,
              options: ['undo', 'redo', 'removeFormat', 'hr', 'link', 'viewsource'],
            },
          ],
        ],
        events: [
          {
            title: 'Title 1',
            subtitle: 'Subtitle 1',
            body: 'Body'
          },
          {
            title: 'Title 1',
            subtitle: 'Subtitle 1',
            body: 'Body'
          },
          {
            title: 'Title 1',
            subtitle: 'Subtitle 1',
            body: 'Body'
          },
          {
            title: 'Title 1',
            subtitle: 'Subtitle 1',
            body: 'Body'
          },
        ],
        // additionalOwners: [],
        prompt: false,
        card_comment_drawer: false,
        dialog_position: 'right',
        commentInputVal: '',
        editCommentInputVal: '',
        commentToEdit: {},
        form_data: new models.api.Cards().clone(),
        fields: [
          {
            fieldType: 'TextInput',
            path: 'name',
            attrs: {
              label: 'name',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12'
            }
          },
          {
            fieldType: 'EditorInput',
            path: 'description',
            label: 'Description',
            attrs: {
              toolbar: [
                [
                  {
                    icon: this.$q.iconSet.editor.formatting,
                    options: [
                      'bold',
                      'italic',
                      'strike',
                      'underline',
                    ]
                  },
                ],
                [
                  {
                    icon: this.$q.iconSet.editor.heading,
                    fixedLabel: true,
                    list: 'no-icons',
                    options: [
                      'h4',
                      'h5',
                      'h6',
                      'p',
                      'code',
                      'unordered',
                      'ordered'
                    ]
                  },
                ],
                [
                  {
                    icon: this.$q.iconSet.editor.align,
                    fixedLabel: true,
                    options: ['left', 'center', 'right', 'justify']
                  },
                ],
                [
                  {
                    icon: this.$q.iconSet.uploader.upload,
                    options: ['insert_img', 'insert_video_url'],
                  },
                ],
                [
                  {
                    icon: 'handyman',
                    fixedLabel: true,
                    options: ['undo', 'redo', 'removeFormat', 'hr', 'link', 'viewsource'],
                  },
                ],
                ['fullscreen']
              ]
            }
          },
          // {
          //   fieldType: 'selectInput',
          //   path: 'owners',
          //   attrs: {
          //     multiple: true,
          //     filled: true,
          //     'hide-selected': false,
          //     'use-chips': true,
          //     'use-input': true,
          //     'input-debounce': 0,
          //     behavior: 'dialog',
          //     // 'option-value': '_id',
          //     label: 'Owners',
          //     'clear-icon': 'close',
          //     'map-options': true,
          //     'emit-value': true,
          //     options: [
          //       {label: 'caleb', value: '_id'}
          //     ]
          //   },
          //   'div-attrs': {
          //     class: 'col-12'
          //   }
          // },
          {
            fieldType: 'selectInput',
            path: 'priority',
            attrs: {
              label: 'Priority',
              'clear-icon': 'close',
              'map-options': true,
              'emit-value': true,
              options: [
                {label: 'Low', value: 'low'},
                {label: 'Medium', value: 'medium'},
                {label: 'High', value: 'high'},
                {label: 'Critical', value: 'critical'}
              ]
            },
            'div-attrs': {
              class: 'col-12'
            }
          },
          {
            fieldType: 'selectInput',
            path: 'category',
            attrs: {
              label: 'Category',
              'clear-icon': 'close',
              'emit-value': true,
              options: [{label: 'Lead', value: 'lead'}, {
                label: 'Task',
                value: 'task'
              }, {label: 'Question', value: 'question'}, {label: 'Research', value: 'research'}, {
                label: 'Other',
                value: 'other'
              }]
            },
            'div-attrs': {
              class: 'col-12'
            }
          }
        ],
      };
    },
    watch: {
      card: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.form_data = newVal;
          }
        }
      },
      board: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            let index = this.fields.findIndex(item => item.path === 'owners');
            if (index !== -1) {
              this.$lset(this.fields, `${index}.attrs.options`, this.$lget(newVal, '_fastjoin.shared', []).map(item => item.user));
            }
          }
        }
      },
      '$data.$windowWidth': {
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal) {
          if (this.value) {
            this.handleCommentDrawerStyle();
          }
        }
      },
      card_comment_drawer: {
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal) {
          if (this.value) {
            this.handleCommentDrawerStyle();
          }
        }
      },
      form_data: {
        deep: true,
        immediate: true,
        handler(newVal) {
          if (newVal.category === null) {
            this.form_data.category = undefined;
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', {
        stateUser: 'user'
      }),
      cardEvents() {
        return this.$lget(this.card,'_fastjoin.cardEvents',[]);
      }
    },
    methods: {
      ...mapActions('cards', {
        patchCards: 'patch'
      }),
      handleCommentDrawerStyle() {
        let drawers = document.querySelectorAll('.comment-drawer .q-drawer') || [];
        if (drawers.length && this.$data.$windowWidth > 755 && this.dialog_position === 'right') {
          drawers.forEach(drawer => drawer.style.marginLeft = '-350px');
        } else if (drawers.length && this.$data.$windowWidth > 1270 && this.dialog_position === 'standard') {
          drawers.forEach(drawer => drawer.style.marginLeft = '-350px');
        } else if (drawers.length !== 0) {
          drawers.forEach(drawer => drawer.style.marginLeft = '0px');
        }
      },
      option_label(item) {
        return this.$lget(item, 'name', 'Unknown');
      },
      handleDialogPosition() {
        this.dialog_position = this.dialog_position === 'right' ? 'standard' : 'right';
      },
      deleteComment(commentObj) {
        this.patchCards([this.card._id, {
          $pull: {
            comments: commentObj
          }
        }]);
      },
      // eslint-disable-next-line no-unused-vars
      toggleComment(idx, e) {
        let el = document.querySelector(`#comment${idx}`);
        let elemHeight = el.scrollHeight + 5;
        if (el.classList.contains('expanded-comment')) {
          el.classList.remove('expanded-comment');
          el.animate([
            {height: `${elemHeight}px`},
            {height: '110px'}
          ], {
            duration: 300,
            easing: 'ease-in-out'
          });
          el.style.height = '110px';
          return;
        }
        el.animate([
          {height: '110px'},
          {height: `${elemHeight}px`}
        ], {
          duration: 300,
          easing: 'ease-in-out'
        });
        el.classList.add('expanded-comment');
        el.style.height = `${elemHeight}px`;
      },
      openEditComment(comment) {
        this.editCommentInputVal = comment.comment;
        this.commentToEdit = comment;
        this.prompt = true;
      },
      saveEditComment() {
        this.card.comments.forEach(comment => {
          if (comment._id === this.commentToEdit._id) {
            comment.comment = this.editCommentInputVal;
          }
        });
        this.patchCards([this.card._id, {
          $set: {
            comments: this.card.comments
          }
        }]);
        this.editCommentInputVal = '';
        this.prompt = false;
      },
      addTag(data) {
        this.form_data.tags.push(data);
      },
      removeTag(data) {
        this.form_data.tags.filter(tag => {
          return tag !== data.value;
        });
      },
      addComment() {
        if (!this.commentInputVal) {
          console.log('empty strings not allowed');
          return;
        }
        this.patchCards([this.card._id, {
          $push: {
            comments: {
              comment: this.commentInputVal,
              createdBy: this.$lget(this.stateUser, '_id', undefined),
              updatedBy: this.$lget(this.stateUser, '_id', undefined)
            }
          }
        }]).then(() => {
          let objDiv = document.querySelectorAll('.comment') || [];
          let lastComment = objDiv[objDiv.length - 1];
          lastComment.scrollIntoView();
        }).catch((err) => {
          console.error(err);
        });
        this.commentInputVal = '';
      },
      insertImg() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.png, .jpg';
        let file;
        input.onchange = () => {
          const files = Array.from(input.files);
          file = files[0];
          const reader = new FileReader();
          let dataUrl = '';
          reader.onloadend = () => {
            dataUrl = reader.result;
            let html = `<img src="${dataUrl}" style="width: ${'100%'};" />`;
            this.commentInputVal += html;
          };
          reader.readAsDataURL(file);
        };
        input.click();
      },
      saveCard() {
        let f_card = new models.api.Cards().clone();
        let form_data = {
          ...this.form_data,
          // owners: this.additionalOwners
        };
        f_card = this.$lmergeWith(f_card, form_data, (obj_value, src_value) => {
          if (Array.isArray(obj_value)) {
            return [...src_value];
          }
        });
        f_card.save({$fastJoinCardCommentsUser: true,})
          .then(res => {
            this.form_data = new models.api.Cards().clone();
            this.$emit('input', false);
            if (this.$lget(this.$route.query, 'view', 'card') === 'list') {
              this.$emit('updatedCard', res);
            }

            this.$q.notify({
              type: 'positive',
              message: `Successfully Saved "${res.name}"`,
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  }
                }
              ]
            });
          })
          .catch(err => {
            this.$q.notify({
              type: 'negative',
              message: err.message,
              timeout: 30000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  }
                }
              ]
            });
          });
      },
    }
  };
</script>

<style scoped lang="scss">
  #cardFormDialog {

  }

  .comment-wrapper {
    position: relative;
  }

  .comment-rich-editor {
    height: 150px;
    overflow: scroll;
  }

  .input-wrapper {
    position: absolute;
    bottom: 0;
    width: 100%;
  }

  .comment {
    width: 100%;
    transition: 0.5s all;
    transform: scaleY(1);
    padding: 15px;
    border-bottom: 1px solid lightgray;
    color: #555;
    font-weight: 350;
    position: relative;
    height: 110px;
    overflow: hidden;
  }

  .comment:last-child {
    margin-bottom: 101px;
  }

  .comment:hover {
    background-color: #e0e0e0;
    cursor: pointer;
    //height: auto;
  }

  .comment .center {
    margin-left: 10px;
    width: 100%;
    margin-right: 15px;
  }

  .creator {
    color: #222;
    margin-left: 12px;
    font-weight: 400;
    font-size: 1.05em;
  }

  .comment .right .icon-actions-wrapper {
    display: flex;
    margin-top: 10px;
    font-size: 1.15em;
    justify-content: space-around;
  }

  .comment .right .icon-actions-wrapper i {
    transition: 0.2s all;
  }

  .fa-trash:hover {
    color: red;
  }

  .fa-pencil-alt:hover {
    color: #00aaf1;
  }

  .send-btn {
    text-align: right;
  }

  .actions-buttons-wrapper {
    z-index: 0;
    position: absolute;
    right: 7px;
    top: 10px;
  }

  .comment:first-child .actions-buttons-wrapper {
    top: 33px;
  }

  .no-comments {
    text-align: center;
    margin-top: 40px;
    font-size: 1.4em;
    font-weight: 350;
  }

  .comment-img {
    width: 20px;
  }

  .edit-comment-popup {

  }

  .edit-comment-form {
    max-height: 72vh !important;
    overflow: scroll;
  }

  .edit-comment-form::-webkit-scrollbar {
    display: none !important;
  }
</style>
