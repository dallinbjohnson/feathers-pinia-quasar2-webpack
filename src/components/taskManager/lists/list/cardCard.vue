<template>
  <q-card style="width: 100%; margin: 5px 2px 5px 2px;"
          :class="card.priority ? (card.priority === 'low' ? 'card-bg-yellow' : (card.priority === 'medium' ? 'card-bg-orange' : card.priority === 'high' ? 'card-bg-red' : 'card-bg-darkred')) : 'card-bg-gray'">
    <q-card-section :class="`flex ${$lget(card, 'owners', []).length > 0 ? 'q-pb-none' : ''}`"
                    style="align-items: center;">
      <span style="position: absolute; top: 0; left: 5px; font-size: 10pt;">
        <q-icon v-clipboard:copy="card.name"
                v-clipboard:success="clipboardSuccessHandler"
                v-clipboard:error="clipboardErrorHandler"
                name="far fa-copy"
                size="xs"
                class="hover-copy"
                @touchstart.stop="handleCopyMobile(card._id)"></q-icon>
          <q-badge v-if="$lget($activeAccount, 'unseenTasks', []).includes(card._id)"
                   id="newBadge"
                   class="q-ml-sm"
                   align="middle">
            <q-intersection @visibility="markAsSeen">new!</q-intersection>
          </q-badge>
      </span>
      <span style="position: absolute; top: 0; left: 25px; font-size: 10pt;"
            v-if="$lget(card, 'children.length', 0) > 0">
        <q-icon
          name="fas fa-code-branch"
          size="xs"
          class="hover-copy"
          @click="showChildren"
        >
          <q-tooltip>
            Has {{ $lget(card, 'children.length', '') }} SubTasks
          </q-tooltip>
          </q-icon>
      </span>
      <div style="position: absolute; top: 0; right: 0;" v-if="!$lget(card,'completed',false)">
        <q-btn size="sm" flat round icon="edit" @click.stop="handleCardEdit(card)"
               @touchstart.stop="handleCardEdit(card)"></q-btn>
        <q-btn size="sm" flat round icon="close" @click.stop="deleteCard(card)"
               @touchstart.stop="deleteCard(card)"></q-btn>
      </div>
      <span @dblclick="handlePopupShow">
        <span style="font-size: 13pt; margin-left: -10px">{{ card.name }}
          <q-icon v-if="card.completed" name="check" color="positive">
          </q-icon>
          <br>
          <p v-if="card.completedAt">Completed at: {{ getDateFormat(card.completedAt, 'MM-DD-YYYY') }}
            <q-btn
              v-if="card.completedAt" icon="more_vert" flat dense>
              <q-menu>
                <q-item clickable v-close-popup dense @click="boardDialog=true">Send to another board</q-item>
              </q-menu>
            </q-btn>
          </p>
        </span>
        <q-popup-edit ref="popup"
                      v-model="edit_card.name"
                      :validate="val => val.length > 0"
                      @save="editCardName(edit_card, ...arguments)"
                      @before-show="handlePopup"
                      @hide="popup_show = false">
          <template v-slot="{ initialValue, value, validate, set, cancel }">
            <q-input
              autofocus
              dense
              v-model="edit_card.name"
              hint="Card Name"
              :rules="[val => validate(value) || 'More than 0 chars required']">
              <template v-slot:after>
                <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel"/>
                <q-btn flat dense color="positive" icon="check_circle" @click.stop="set"
                       :disable="validate(value) === false || initialValue === value"/>
              </template>
            </q-input>
          </template>
        </q-popup-edit>
      </span>
      <q-space></q-space>
    </q-card-section>
    <q-card-section v-if="$lget(card, '_fastjoin.owners', []).length > 0" class="q-pa-none" style="text-align: right">
      <template>
        <q-chip v-for="(owner, index) in $lget(card, '_fastjoin.owners', [])" :key="index" size="sm">
          <q-avatar v-if="$lget(owner, 'image')" size="sm">
            <img :src="$lget(owner, 'image', 'https://cdn.quasar.dev/img/boy-avatar.png')">
          </q-avatar>
          <q-avatar v-else size="sm" color="primary" text-color="white">
            {{ (owner.name || owner.email).charAt(0).toUpperCase() }}
          </q-avatar>
          {{ owner.name || owner.email }}
        </q-chip>
      </template>
    </q-card-section>
    <q-card-section v-if="$lget(card, 'children.length', 0) > 0 && showChild" class="q-pa-none">
      <transition name="slide-fade">
        <div class="cursor-pointer">
          <div v-for="(childcard,index) in cards" :key="index" class="q-ml-sm q-my-xs">
            <card-card :card="childcard" :list="list" :board="board"></card-card>
          </div>
        </div>
      </transition>
    </q-card-section>

    <card-form-dialog v-model="card_dialog" :card="edit_card"
                      :board="board" :list="list" @input="edit_card = {}"></card-form-dialog>

    <!--    Board Dialog  -->
    <q-dialog v-model="boardDialog">
      <board-export :card="card"/>
    </q-dialog>
  </q-card>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex';
  import cardFormDialog from '../forms/cardFormDialog';
  import cardItemMixin from 'src/mixins/cardItemMixin';
  import BoardExport from 'components/taskManager/boards/forms/BoardExport';

  export default {
    name: 'cardCard',
    components: {
      cardFormDialog,
      BoardExport,
    },
    mixins: [cardItemMixin()],
    props: {
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
        card_dialog: false,
        edit_card: {},
        popup_show: false,
        showChild: false,
        boardDialog: false,
      };
    },
    watch: {
      card: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            if (this.edit_card) {
              this.edit_card = newVal;
            }
          }
        },
      },
    },
    computed: {
      ...mapGetters('cards', {
        findCards: 'find',
      }),
      cards() {
        return this.findCards({query: {_id: {$in: this.card.children}}}).data;
      },
    },
    methods: {
      ...mapActions('cards', {
        patchCard: 'patch',
      }),
      ...mapActions('cards', {
        loadCards: 'find',
      }),

      markAsSeen(isVisible) {
        if (isVisible && this.$lget(this.$activeAccount, 'unseenTasks', []).includes(this.card._id)) {
          console.log('pull id from unseenTasks arr');
          // maybe do some transition thing?
          // document.getElementById('newBadge').classList.add('remove-badge');
          this.$activeAccount.patch({
            data: {
              $pull: {
                unseenTasks: this.card._id,
              },
            },
          }).then(() => {
            console.log(`removed ${this.card.name} from unseenTasks`);
          });
        }
      },
      showChildren() {
        this.loadCards({
          query: {_id: {$in: this.card.children}},
          $fastJoinCardCommentsUser: true,
        }).then(() => {
          this.showChild = !this.showChild;
        }).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: 'Couldn\'t load subtasks, please refresh and try again',
            timeout: 30000,
          });
          console.error(err);
        });
      },
      // eslint-disable-next-line no-unused-vars
      handlePopup() {
        if (!this.popup_show) this.$refs.popup.hide();
      },
      handlePopupShow() {
        this.popup_show = true;
        this.$refs.popup.show();
      },
      handleCardEdit(card) {
        if (!this.card_dialog) {
          this.card_dialog = true;
          this.edit_card = card;
        } else {
          this.card_dialog = false;
          this.edit_card = {};
        }
      },
      editCardName(item, value, initialValue) {
        if (value !== initialValue) {
          this.patchCard([item._id, {
            name: value,
          }])
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
    },
  };
</script>

<style scoped lang="scss">
  .card-bg-yellow {
    border-top: 8px solid #ffe043;
  }

  .card-bg-orange {
    border-top: 8px solid #f1a329;
  }

  .card-bg-red {
    border-top: 8px solid #fc733c;
    /*border: 2px solid #fc733c;*/
  }

  .card-bg-darkred {
    /*border: 2px solid #b70000;*/
    border-top: 8px solid #b70000;
  }

  .card-bg-gray {
    border-top: 8px solid #BDBDBD;
  }

  .hover-copy {
    color: var(--q-color-primary);
    cursor: pointer;
  }

  .hover-copy:hover {
    color: var(--q-color-accent);
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s ease;
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    transform: translateY(100px);
    opacity: 0;
  }
</style>
