<template>
  <div
      @click="$emit('selectCard', card)"
      :class="`card ${$lget(selectedCard, '_id') === $lget(card, '_id') ? 'selected' : ''}`"
      :style="{
        marginLeft: $q.screen.gt.xs ? '20px' : '',
        width: '100%',
        borderLeft: `5px solid ${getCardColor(card)}`,
        backgroundColor: $q.dark.mode ? '#222222' : '#f0f0f0',
        ...cardCssVars,
      }">
    <div class="left">
      <q-icon v-clipboard:copy="$lget(card, '_id')"
              v-clipboard:success="clipboardSuccessHandler"
              v-clipboard:error="clipboardErrorHandler"
              @click.stop
              name="far fa-copy"
              size="xs"
              color="blue"
              @touchstart.stop="handleCopyMobile($lget(card, '_id'))">
        <q-tooltip>
          Copy to clipboard
        </q-tooltip>
      </q-icon>
      <div>{{ card.name }}</div>
    </div>
    <div class="center">
      <div v-if="$lget(card, '_fastjoin.owners', '')">
        <div style="background-color: #FFAF70" class="user-avatar cursor-pointer"
             v-for="(owner, ownerIdx) in card._fastjoin.owners" :key="ownerIdx">
          {{ owner.name ? owner.name[0] : owner.email[0] }}
          <q-tooltip>
            {{ owner.name || owner.email }}
          </q-tooltip>
        </div>
      </div>
      <div v-else>
        <div class="q-py-xs">No owners</div>
      </div>
    </div>
    <div class="right">
      <q-icon @click.stop="handleCardEdit(card)" class="cursor-pointer modify" size="xs" name="edit"></q-icon>
      <q-icon size="xs" class="q-ml-md cursor-pointer modify" @click.stop="deleteCard(card)" name="close"></q-icon>
    </div>
    <card-form-dialog @updatedCard="updateCard" v-if="card_dialog" v-model="card_dialog" :card="edit_card"
                      :board="board" @input="edit_card = undefined"></card-form-dialog>
  </div>
</template>

<script>

  import cardFormDialog from 'components/taskManager/lists/forms/cardFormDialog';
  import cardItemMixin from 'src/mixins/cardItemMixin';
  import {colorHelpers} from 'components/taskManager/mixins/colorHelper';

  export default {
    name: 'listItem',
    components: {
      cardFormDialog
    },
    mixins: [cardItemMixin(), colorHelpers],
    props: {
      card: {
        type: Object
      },
      selectedCard:{
        type: Object
      },
      board: {
        type: Object
      }
    },
    data(){
      return {
        edit_card: undefined,
        card_dialog: false,
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
          ;
        }
      }
    },
    computed: {
      cardCssVars() {
        return {
          '--selected-bg-color': this.$q.dark.mode ? 'purple' : '#dadfea'
        };
      },
    },
    methods: {
      // eslint-disable-next-line no-unused-vars
      updateCard(card){
        this.$emit('updatedCard', card);
      },
      handleCardEdit(card) {
        if (!this.card_dialog) {
          this.card_dialog = true;
          this.edit_card = card;
        } else {
          this.card_dialog = false;
          this.edit_card = undefined;
        }
      },
    }
  };
</script>

<style scoped lang="scss">
  .selected {
    background-color: var(--selected-bg-color) !important;
    transform: scale(1.05) !important;
  }
  .card {
    position: relative !important;

    .priority {
      position: absolute;
      right: 16px;
      text-transform: uppercase;
      font-size: 1.1em;
      font-weight: 500;
      color: red;
      top: 12px;
    }
    .owners {
      div {
        margin-top: 40px;
        font-size: 1.15em;
      }
      li {
        list-style-type: none;
        margin-left: -20px;
        color: #565657;
        font-size: 1em;
        font-weight: 350;
      }
      li:first-child {
        margin-top: -15px;
      }
    }
  }
  .list-view-wrapper {
    width: 100%;
    margin-left: 10px;
    display: flex;

    .left {
      width: 60%;
    }
    .left-menu {
      flex: .9;
    }
    .right-main {
      margin: 40px auto 0 auto;
      .card {
        width: 20vw;
      }
    }

    .list:first-child {
      margin-top: 0 !important;
    }

    .list {
      margin-top: 50px;

      span:first-child {
        font-size: 2.2em;
        font-weight: 390;
      }

      .card:hover {
        background-color: #eaebf3;
        transform: scale(1.03);
      }

      .card {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 1px 1px 4px 0px rgba(0, 0, 0, 0.10);
        margin: 8px 0;
        padding: 7px 8px;
        transition: 0.3s all;

        .modify {
          transition: 0.3s all;
        }
        .modify:hover {
          color: #00aaf1;
        }
        .modify:last-child:hover {
          color: red;
          transform: rotate(180deg);
        }

        .left {
          display: flex;

          .copy-icon {
            cursor: pointer;
          }

          div {
            margin-left: 15px;
          }
        }

        .center {
          display: flex;
          align-items: center;
          flex-direction: row-reverse;
          //width: 33%;

          .user-avatar {
            text-transform: uppercase;
            border-radius: 100%;
            margin-left: -8px;
            text-align: center;
            vertical-align: center;
            padding: 7px 12px;
            background-color: #60b500;
            width: fit-content;
            color: white;
            font-size: .9em;
            border: 2px solid white;
          }
        }
      }
    }
  }

  .slide-enter-active {
    transition: all .3s ease;
  }
  .slide-leave-active {
    transition: all .2s ease-in-out;
  }
  .slide-enter, .slide-leave-to {
    transform: translateX(100px);
    margin-right: -20vw;
    opacity: 0;
  }
</style>
