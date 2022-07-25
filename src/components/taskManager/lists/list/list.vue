<template>
  <div class="q-pa-sm" id="ListsList" :style="{'min-height': '100vh', ...titleCssVars}">
    <div class="flex justify-between flex q-pr-lg">
      <div v-if="clone_board && layout === 'Card view'" class="card-view-nav">
        <q-btn @click="$router.go(-1)" icon="fas fa-arrow-left" flat color="secondary"></q-btn>
        <q-input v-model="clone_board.name" @keyup.enter="updateBoardName"
                 borderless
                 class="title text-h3"
                 :style="`width: ${clone_board.name.length + 1}ch`">
        </q-input>
        <transition-group name="slide">
          <span @click="unHideList(hidden, idx)" :key="hidden.order" v-for="(hidden, idx) in toHide">
            <q-btn round
                   :style="{backgroundColor: $lget(hidden.color, 'hex', '#808080'), color: $lget(hidden.color, 'hex', false) ? $isHexDark(hidden.color.hex) ? 'white' : 'black' : 'white'}"
                   size="sm" icon="open_in_full" class="span"/>
            <q-tooltip>
              Show "{{ hidden.name }}"
            </q-tooltip>
          </span>
        </transition-group>
      </div>
      <div v-else class="show-my-tickets">
        <span>Show my assigned tickets</span>
        <input v-model="showMyTickets" class="apple-switch" type="checkbox">
      </div>
      <!--            <q-select @input="handleViewChange" class="q-mr-lg q-mb-md q-mt-sm" style="width: 25%" v-model="layout" :options="options" label="Layout">-->
      <!--              <template v-slot:prepend>-->
      <!--                <q-icon size="xs" name="table_rows" @click.stop/>-->
      <!--              </template>-->
      <!--            </q-select>-->
      <div class="toggle">
        <span @click="handleViewChange" :class="layout === 'Card view' ? 'active' : 'inactive'">Kanban</span>
        <span @click="handleViewChange" :class="layout === 'List view' ? 'active' : 'inactive'">List</span>
      </div>
    </div>


    <div v-if="layout === 'Card view'" style="position: relative; flex: 1;">
      <draggable-tree v-model="clone_lists"
                      @change="handleDrag"
                      v-bind="{attrs: {label_key: 'name', maxDepth: 1}}"
                      style="position: absolute; top: 0; bottom: 0; right: 0; left: 0;"
                      class="list-tree-wrapper">
        <template v-slot="{ item: list, index }">
          <q-card v-if="list._id === 0"
                  :class="['list-card cursor-pointer', $q.dark.mode ? 'bg-grey-9' : 'bg-grey-5']"
                  @click.stop="newList"
                  @touchstart.stop="newList">
            <q-card-section class="flex flex-center" style="height: 100%; width: 100%">
              <q-icon name="add"/>
              New List
            </q-card-section>

            <q-dialog v-model="list_form" position="right">
              <q-layout view="Lhh lpR fff" container :class="$q.dark.mode ? 'bg-dark' : 'bg-white'"
                        style="width: 350px">
                <q-header class="bg-primary">
                  <q-toolbar>
                    <q-toolbar-title>{{ form_data['_id'] ? 'Edit' : 'New' }} List</q-toolbar-title>
                    <q-btn flat v-close-popup round dense icon="close"/>
                  </q-toolbar>
                </q-header>

                <q-page-container>
                  <q-page class="q-pa-sm">
                    <form-generator v-model="form_data" :fields="fields"></form-generator>
                    <q-toggle v-model="form_data.completeCard" label="Completes Card"></q-toggle>
                  </q-page>
                </q-page-container>

                <q-footer :class="$q.dark.mode ? 'bg-dark' : 'bg-white'" bordered>
                  <q-toolbar>
                    <q-btn color="primary" @click="saveList">Save</q-btn>
                  </q-toolbar>
                </q-footer>
              </q-layout>
            </q-dialog>
          </q-card>

          <q-card v-else :class="['list-card', 'shadow-10', $q.dark.mode ? 'bg-grey-9' : 'bg-grey-3']">
            <q-toolbar :style="`background-color: ${$lget(list, 'color.hexa', 'grey')}; color: ${textColor(list)};`">
              <q-toolbar-title @dblclick="handlePopupShow(`popup${index}`)">
                {{ list.name }}
                <q-popup-edit :ref="`popup${index}`"
                              v-model="list.name"
                              :validate="val => val.length > 0"
                              @save="editName(list, ...arguments)"
                              @before-show="handlePopup(`popup${index}`)"
                              @hide="popup_show = false">
                  <template v-slot="{ initialValue, value, validate, set, cancel }">
                    <q-input v-model="list.name"
                             autofocus
                             dense
                             hint="List Name"
                             :rules="[val => validate(value) || 'More than 0 chars required']">
                      <template v-slot:after>
                        <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel"/>
                        <q-btn flat dense color="positive" icon="check_circle" @click.stop="set"
                               :disable="validate(value) === false || initialValue === value"/>
                      </template>
                    </q-input>
                  </template>
                </q-popup-edit>
              </q-toolbar-title>

              <action-fab :item="list" @hide="hideList" @edit="editList" @delete="deleteList"></action-fab>
            </q-toolbar>

            <q-card-section style="max-height: 78vh;" class="scroll q-pa-sm">
              <draggable-tree v-model="list._fastjoin.cards"
                              @change="handleDragCard(list, ...arguments)"
                              class="card-drag"
                              v-bind="{attrs: {label_key: 'name', maxDepth: 1, group: 'card', childrenProp: ' '}}">
                <template v-slot="{ item: card }">
                  <card-card :card="card" :list="list" :board="clone_board"></card-card>
                </template>
              </draggable-tree>

            </q-card-section>

            <add-card :list="list" style="position: sticky; bottom: 0;"></add-card>
          </q-card>
        </template>
      </draggable-tree>
    </div>

    <div v-else>
      <ListView :board="board" :showMyTickets="showMyTickets"></ListView>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapState} from 'vuex';
  import {models} from '@feathersjs/vuex';

  import DraggableTree from '../../common/atoms/draggableTree/draggableTree';
  import actionFab from './actionFab';
  import addCard from '../forms/addCard';
  import cardCard from './cardCard';
  import ListView from 'components/taskManager/lists/listView/listView';

  export default {
    name: 'ListsList',
    components: {
      ListView,
      DraggableTree,
      actionFab,
      addCard,
      cardCard,
    },
    props: {
      board: {
        type: Object,
      },
    },
    data() {
      return {
        toHide: [],
        tempToHide: [],
        showMyTickets: false,
        popup_show: false,
        options: ['Card view', 'List view'],
        layout: 'Card view',
        clone_board: null,
        list_query: {
          query: {
            board: this.$lget(this.$route, 'params.board_id'),
          },
          $fastJoinCards: true,
        },
        list_form: false,
        clone_lists: [],
        form_data: {},
        lists_loaded: false,
      };
    },
    mounted() {
      this.$isLoading(true);
      this.loadLists(this.list_query).then(() => {
        this.$isLoading(false);
      }).catch((err) => {
        console.error(err);
        this.$isLoading(false);
      });
      if (this.$route.query.view === 'list') {
        this.layout = 'List view';
      }
    },
    watch: {
      board: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal) && !this.$route.params.board_id) {
            this.$router.push({
              name: this.$route.name,
              params: {...this.$route.params, board_id: newVal._id},
            }).catch((err) => {
              throw new Error(`list.vue -> watch -> board: ${err}.`);
            });
          }
        },
      },
      $route: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        async handler(to, from) {
          let board_id = this.$lget(to, 'params.board_id');
          if (board_id && !this.clone_board) {
            let board = await this.getBoard(board_id);
            if (!board) {
              try {
                board = await this.getBoardDb([board_id, {$fastJoinShared: true}]);
              } catch (e) {
                console.error('getBoardDb Error:', e);
              }
            }
            this.clone_board = board.clone();
            this.$lset(this.list_query, 'query.board', board_id);
            // console.log('clone_board', this.clone_board);
          }
        },
      },
      lists: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          // if (newVal && JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          // this.clone_lists = newVal;
          // }
          this.clone_lists = newVal;
        },
      },
      clone_lists: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          let new_btn_index = this.clone_lists.findIndex((item) => {
            return item._id === 0;
          });
          if (new_btn_index === -1) {
            this.clone_lists = newVal.concat([{_id: 0}]);
          }
        },
      },
      cardPatchPending(val) {
        this.$isLoading(val);
      },
      toHide: {
        immediate: true,
        handler(newVal) {
          if (JSON.stringify(newVal) !== JSON.stringify(this.tempToHide)) {
            this.toHide = this.$lorderBy(newVal, ['order', 'createdAt'], ['asc', 'asc']);

            // newVal.forEach(list => {
            //   // eslint-disable-next-line no-unused-vars
            //   let elements = document.getElementsByClassName(`nestable-item-${list._id}`);
            //   for (let el of elements) {
            //     el.style.display = 'none';
            //   }
            // });
          }
          this.tempToHide = Array.from(newVal);
        },
      },
    },
    computed: {
      ...mapState({
        lightSpring: 'lightSpring',
      }),
      ...mapGetters('lists', {
        findLists: 'find',
      }),
      ...mapGetters('boards', {
        getBoard: 'get',
      }),
      ...mapState('cards', {
        cardPatchPending: 'isPatchPending',
      }),
      titleCssVars() {
        return {
          '--title-bg-color': this.$q.dark.mode ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.16)',
          '--dark-bg-color': this.$q.dark.mode ? 'var(--q-color-dark)' : '#fff',
        };
      },
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
              palette: this.lightSpring,
            },
          },
        ];
      },
      lists() {
        return this.$lorderBy(this.findLists(this.list_query).data.map(list => list.clone()), ['order', 'createdAt'], ['asc', 'asc']).map(list => {
          return Object.assign(list, {
            _fastjoin: {
              ...list._fastjoin,
              cards: this.$lorderBy(this.$lget(list, '_fastjoin.cards', []), [
                card => {
                  switch (this.$lget(card, 'priority')) {
                    case 'critical': {
                      return 0;
                    }
                    case 'high': {
                      return 1;
                    }
                    case 'medium': {
                      return 2;
                    }
                    case 'low': {
                      return 4;
                    }
                    default: {
                      return 3;
                    }
                  }
                },
                'order',
                'createdAt',
              ], ['asc', 'asc', 'asc']),
            },
          });
        });
      },
    },
    methods: {
      ...mapActions('lists', {
        loadLists: 'find',
        removeList: 'remove',
      }),
      ...mapActions('boards', {
        getBoardDb: 'get',
      }),
      ...mapActions('cards', {
        patchCard: 'patch',
      }),
      handleViewChange(e) {
        if ((this.layout === 'List view' && e.target.innerHTML === 'List') || (this.layout === 'Card view' && e.target.innerHTML === 'Kanban')) return;
        e.target.innerHTML === 'List' ? this.layout = 'List view' : this.layout = 'Card view';
        this.$router.replace({
          name: 'lists',
          params: {board_id: this.$route.params.board_id},
          query: {view: this.layout === 'Card view' ? 'card' : 'list'},
        });
      },
      unHideList(list, idx) {
        this.toHide.splice(idx, 1);
        let elements = document.getElementsByClassName(`nestable-item-${list._id}`)[0];
        elements.classList.add('showing-anim');
        elements.style.display = 'block';
        setTimeout(() => {
          elements.classList.remove('showing-anim');
        }, 500);
      },
      hideList(list) {
        this.toHide.push(list);
        let elements = document.getElementsByClassName(`nestable-item-${list._id}`)[0];
        elements.classList.add('hiding-anim');
        setTimeout(() => {
          elements.style.display = 'none';
          elements.classList.remove('hiding-anim');
        }, 500);
      },
      handlePopup(ref) {
        if (!this.popup_show) this.$refs[ref].hide();
      },
      handlePopupShow(ref) {
        this.popup_show = true;
        this.$refs[ref].show();
      },
      textColor(item) {
        return this.$isHexDark(this.$lget(item, 'color.hexa', 'grey')) ? 'white' : 'black';
      },
      // // eslint-disable-next-line no-unused-vars
      // beforeMove ({ dragItem, pathFrom, pathTo }) {
      //   // Item 4 can not be nested more than one level
      //   if (dragItem._id === 0) {
      //     return false;
      //   }
      //   // All other items can be
      //   return true;
      // },
      async updateBoardName() {
        let board = await this.getBoard(this.clone_board._id);
        if (board.name !== this.clone_board.name) {
          this.clone_board.patch()
            .then(result => {
              this.$q.notify({
                type: 'positive',
                message: `Successfully Saved "${result.name}"`,
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
        }
      },
      async handleDragCard(list, value, options) {
        let pathTo = this.$lget(options, 'pathTo', []);
        if (pathTo && pathTo.length >= 1) {
          let list_ids = [list._id];
          await Promise.all(options.items.map((card, index) => {
            list_ids.push(card.list);
            return this.patchCard([card._id, {list: list._id, order: index}]);
          }));

          list_ids = [...new Set(list_ids)];

          await this.loadLists({
            query: {
              _id: list_ids,
            },
            $fastJoinCards: true,
          });
        }
      },
      // eslint-disable-next-line no-unused-vars
      handleDrag(value, options) {
        this.$isLoading(true);
        let new_btn_index = this.clone_lists.findIndex((item) => {
          return item._id === 0;
        });
        this.clone_lists.splice(new_btn_index, 1);
        Promise.all(this.clone_lists.map((list, index) => {
          if (list.order !== index + 1) {
            list.order = index + 1;
            let {Lists} = models.api;
            if (!(list instanceof Lists)) {
              let f_list = new models.api.Lists().clone();
              list = this.$lmergeWith(f_list, list, (obj_value, src_value) => {
                if (Array.isArray(obj_value)) {
                  return [...src_value];
                }
              });
            }
            return list.patch()
              .then(() => {
              })
              .catch(err => {
                console.log('list err:', err);
              });
          }
        })).then(() => {
          this.loadLists(this.list_query);
          this.$isLoading(false);
          Object.keys(this.$refs).forEach(ref => {
            if (/popup\d/.test(ref) && !this.popup_show) this.$refs[ref].hide();
          }, this);
        });
      },
      newList() {
        this.form_data = {};
        this.list_form = true;
      },
      editList(list) {
        this.form_data = list;
        this.list_form = true;
      },
      editName(item, value, initialValue) {
        if (value !== initialValue) {
          item.patch({
            name: value,
          })
            .then(res => {
              this.$q.notify({
                type: 'positive',
                message: `Successfully Saved "${res.name}"`,
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
        }
      },
      saveList() {
        this.$isLoading(true);
        let f_list = new models.api.Lists().clone();

        f_list = this.$lmergeWith(f_list, this.form_data, (obj_value, src_value) => {
          if (Array.isArray(obj_value)) {
            return [...src_value];
          }
        });

        f_list.board = this.clone_board._id;
        if ([null, undefined].includes(this.form_data.order)) f_list.order = this.clone_lists.length + 1;

        f_list.save()
          .then(res => {
            this.$isLoading(false);
            if (this.form_data._id) this.list_form = false;
            this.form_data = {};
            this.$q.notify({
              type: 'positive',
              message: `Successfully Saved "${res.name}"`,
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
          .catch(err => {
            this.$isLoading(false);
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
            console.error('this is err in catch in save method in list.vue: ', err);
            // console.log('this is f_list in catch in save method in list.vue: ', f_list);
          });
      },
      deleteList(list) {
        this.$q.dialog({
          title: 'Confirm',
          message: `Are you sure you want to remove "${list.name}"?`,
          ok: {
            push: true,
            color: 'negative',
          },
          cancel: true,
          persistent: true,
        }).onOk(() => {
          this.removeList(list._id)
            .then(result => {
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
              console.error('This is catch in deleteList: ', error);
            });
        });
      },
    },
  };
</script>

<style scoped lang="scss" src="./_list.scss">

</style>
