<template>
  <div id="boardsList">
    <draggable-tree v-model="clone_boards"
                    @change="handleDrag"
                    v-bind="{attrs: {label_key: 'name', maxDepth: 1}}">
      <template v-slot="{ item }">
        <q-card v-if="item._id === 0"
                :class="['board-card cursor-pointer', $q.dark.mode ? 'bg-grey-9' : 'bg-grey-5']"
                @click.stop="newBoard"
                @touchstart.stop="newBoard">
          <q-card-section class="flex flex-center" style="height: 100%; width: 100%">
            <q-icon name="add"/>
            New Board
          </q-card-section>

          <q-dialog v-model="board_form" position="right">
            <q-layout view="Lhh lpR fff" container :class="$q.dark.mode ? 'bg-dark' : 'bg-white'" style="width: 350px">
              <q-header class="bg-primary">
                <q-toolbar>
                  <q-toolbar-title>{{ form_data['_id'] ? 'Edit' : 'New' }} Board</q-toolbar-title>
                  <q-btn flat v-close-popup round dense icon="close"/>
                </q-toolbar>
              </q-header>

              <q-page-container>
                <q-page class="q-pa-sm">
                  <form-generator v-model="form_data" :fields="fields"></form-generator>
                </q-page>
              </q-page-container>

              <q-footer :class="$q.dark.mode ? 'bg-dark' : 'bg-white'" bordered>
                <q-toolbar>
                  <q-btn color="primary" @click="saveBoard">Save</q-btn>
                  <q-space v-if="form_data['_id']"></q-space>
                  <q-btn v-if="form_data['_id']" color="negative" @click="deleteBoard(form_data)">Delete</q-btn>
                </q-toolbar>
              </q-footer>
            </q-layout>
          </q-dialog>
        </q-card>

        <q-card v-else
                class="board-card"
                style="overflow: hidden;"
                @click.stop="$router.push({name: 'lists', params: {board_id: item._id}}).catch((err) => {throw new Error(`list.vue -> template -> q-card -> @click.stop -> lists: ${err}.`);})"
                @touchstart.stop="$router.push({name: 'lists', params: {board_id: item._id}}).catch((err) => {throw new Error(`list.vue -> template -> q-card -> @touchstart.stop -> cards: ${err}.`);})">
          <q-img src="" native-context-menu
                 :style="`background-color: ${$lget(item, 'color.hexa', 'teal')}; height: 100%; width: 100%;`">
            <div class="text-h6 absolute-top text-center">
              {{ item.name }}
            </div>
          </q-img>
          <q-btn @click.stop="editBoard(item)"
                 @touchstart.stop="editBoard(item)"
                 round
                 color="secondary"
                 icon="fas fa-pen"
                 style="position: absolute; bottom: 10px; right: 10px;"/>
        </q-card>
      </template>
    </draggable-tree>
    <q-btn class="t-r text-secondary q-ma-lg"
           icon="fas fa-box"
           :outline="$q.dark.mode"
           @click="template_form = true">&nbsp; &nbsp;Templates
    </q-btn>
    <q-dialog v-model="template_form" position="right">
      <template-form @close="template_form = false" :boards="clone_boards">

      </template-form>
    </q-dialog>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex';
  import {models} from '@feathersjs/vuex';

  import DraggableTree from '../../common/atoms/draggableTree/draggableTree';
  import TemplateForm from '../../templates/templateForm';

  export default {
    name: 'boardsList',
    components: {
      DraggableTree,
      TemplateForm,
    },
    props: {},
    data() {
      return {
        template_form: false,
        board_form: false,
        clone_boards: [],
        form_data: {},
      };
    },
    mounted() {
      console.log(this.$route.params);
      this.loadBoards(this.board_query);
    },
    watch: {
      boards: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          // if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.clone_boards = [{_id: 0}].concat(newVal);
          // }
        },
      },
      clone_boards: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          let new_btn_index = this.clone_boards.findIndex((item) => {
            return item._id === 0;
          });
          if (new_btn_index === -1) {
            this.clone_boards = [{_id: 0}].concat(newVal);
          }
        },
      },
    },
    computed: {
      ...mapState({
        softAutomn: 'softAutomn',
      }),
      ...mapGetters('boards', {
        findBoards: 'find',
      }),
      fields() {
        return [
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
              class: 'col-12',
            },
          },
          {
            fieldType: 'NumberInput',
            path: 'order',
            attrs: {
              min: 1,
              center: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'ColorPicker',
            path: 'color',
            attrs: {
              palette: this.softAutomn,
            },
          },
        ];
      },
      board_query() {
        return {
          query: {
            // process: {$in: this.$route.params.id},
            $sort: {
              order: 1,
              createdAt: 1,
            },
          },
          $fastJoinShared: true,
        };
      },
      boards() {
        return this.findBoards(this.board_query).data.map(board => board.clone());
        // return this.$lorderBy(this.findBoards(this.board_query).data.map(board => board.clone()), ['order', 'createdAt'], ['asc', 'asc']);
      },
    },
    methods: {
      ...mapActions('boards', {
        loadBoards: 'find',
        removeBoard: 'remove',
      }),
      ...mapActions('board-templates', {
        loadTemplates: 'find',
      }),
      // eslint-disable-next-line no-unused-vars
      handleDrag(value, options) {
        this.$isLoading(true);
        let new_btn_index = this.clone_boards.findIndex((item) => {
          return item._id === 0;
        });
        this.clone_boards.splice(new_btn_index, 1);
        Promise.all(this.clone_boards.map((board, index) => {
          if (board.order !== index + 1) {
            board.order = index + 1;
            let {Boards} = models.api;
            if (!(board instanceof Boards)) {
              let f_board = new models.api.Boards().clone();
              board = this.$lmergeWith(f_board, board, (obj_value, src_value) => {
                if (Array.isArray(obj_value)) {
                  return [...src_value];
                }
              });
            }
            return board.patch()
              .then(res => {
                console.log('board res:', res);
              })
              .catch(err => {
                console.log('board err:', err);
              });
          }
        })).then(() => {
          console.log('patch_boards');
          this.loadBoards(this.board_query);
          this.$isLoading(false);
        });
      },
      newBoard() {
        this.form_data = {};
        this.board_form = true;
      },
      editBoard(board) {
        this.form_data = board;
        this.board_form = true;
      },
      saveBoard() {
        let f_board = new models.api.Boards().clone();

        f_board = this.$lmergeWith(f_board, this.form_data, (obj_value, src_value) => {
          if (Array.isArray(obj_value)) {
            return [...src_value];
          }
        });

        // f_board.process = this.$route.params.id;
        f_board.save()
          .then(res => {
            if (this.form_data._id) this.board_form = false;
            this.form_data = {};
            this.board_form = false;
            // this.$store.dispatch('processes/patch', [this.$route.params.id, {$push: {boards: res._id}}]);
            this.$q.notify({
              type: 'positive',
              message: `Successfully Saved "${res.name}"`,
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                  },
                },
              ],
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
                  },
                },
              ],
            });
          });
      },
      deleteBoard(board) {
        this.$q.dialog({
          title: 'Confirm',
          message: `Are you sure you want to remove "${board.name}"?`,
          ok: {
            push: true,
            color: 'negative',
          },
          cancel: true,
          persistent: true,
        }).onOk(() => {
          this.removeBoard(board._id)
            .then(result => {
              this.form_data = {};
              this.board_form = false;

              this.$q.notify({
                type: 'positive',
                message: `Successfully removed "${result.name}"`,
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
            })
            .catch(error => {
              this.$q.notify({
                type: 'negative',
                message: error.message,
                timeout: 30000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
            });
        });
      },
    },
  };
</script>

<style scoped lang="scss" src="./_list.scss">

</style>
