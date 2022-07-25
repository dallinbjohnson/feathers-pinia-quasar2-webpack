<template>
  <div class="list-view-wrapper">
    <div class="left-menu">
      <div class="list" v-for="(list, idx) in lists" :key="idx">
        <span :style="{borderBottom: `4px solid ${$lget(list, 'color.hex', 'grey')}`, padding: '3px'}">{{
            list.name
          }}</span>
        <div class="q-mb-lg"></div>
        <div v-for="(card, cardIdx) in list._fastjoin.cards" :key="cardIdx">
          <list-item @updatedCard="updateSelected" :board="board" :selectedCard="selectedCard" :card="card"
                     @selectCard="selectCard"></list-item>
        </div>
        <add-card v-if="!showMyTickets"
                  :style="{'margin-left': $q.screen.gt.xs ? '20px' : '', backgroundColor: $q.dark.mode ? 'var(--q-color-primary) !important' : '#ebf0f9 !important'}"
                  class="add-card"
                  :list="list"></add-card>
      </div>
    </div>
    <transition name="slide">
      <div class="right-main" id="rightMenu">
        <transition name="slide">
          <q-card v-if="$q.screen.gt.sm && Object.keys(selectedCard).length > 0" class="card">
            <div
              :style="{color: `${selectedCard.priority ? (selectedCard.priority === 'low' ? '#d8b81d' : (selectedCard.priority === 'medium' ? '#ffa612' : selectedCard.priority === 'high' ? '#ff692f' : '#9c0000')) : '#525252'}`}"
              class="priority">{{ selectedCard.priority ? selectedCard.priority : 'no' }} priority
            </div>
            <q-card-section>
              <div class="text-h4 q-mt-lg">{{ selectedCard.name }}</div>
              <div>{{ selectedCard.description || 'No description' }}</div>
              <div class="owners">
                <div>Owners:</div>
                <ul v-if="$lget(selectedCard, '_fastjoin.owners', '')">
                  <li v-for="(owner, idx) of selectedCard._fastjoin.owners" :key="idx">
                    {{ owner.name || owner.email }}
                  </li>
                </ul>
                <ul v-else>
                  <li>No owners</li>
                </ul>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <span class="text-h6">Active for </span><span>{{ selectedCard.createdAt | daysPast }} days</span>
              <br/>
              <span class="text-h6">Created on </span><span>{{ selectedCard.createdAt | format }}</span>
              <!--            <span class="text-h6">Modified on </span><span>{{ selectedCard.updatedAt | format }}</span>-->
            </q-card-section>
          </q-card>
        </transition>
      </div>
    </transition>

    <q-dialog v-model="dialogOnSmall" @before-hide="selectedCard = {}">
      <q-card class="card">
        <div class="flex justify-between items-center q-pa-md">
          <div
            :style="[{'text-transform': 'uppercase', 'font-size': '1.1em', 'font-weight': 500}, {color: `${selectedCard.priority ? (selectedCard.priority === 'low' ? '#d8b81d' : (selectedCard.priority === 'medium' ? '#ffa612' : selectedCard.priority === 'high' ? '#ff692f' : '#9c0000')) : '#525252'}`}]">{{ selectedCard.priority ? selectedCard.priority : 'no' }} priority
          </div>
          <q-btn icon="close" flat dense v-close-popup/>
        </div>
        <q-card-section>
          <div class="text-h4 q-mt-lg">{{ selectedCard.name }}</div>
          <div>{{ selectedCard.description || 'No description' }}</div>
          <div class="owners">
            <div>Owners:</div>
            <ul v-if="$lget(selectedCard, '_fastjoin.owners', '')">
              <li v-for="(owner, idx) of selectedCard._fastjoin.owners" :key="idx">
                {{ owner.name || owner.email }}
              </li>
            </ul>
            <ul v-else>
              <li>No owners</li>
            </ul>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <span class="text-h6">Active for </span><span>{{ selectedCard.createdAt | daysPast }} days</span>
          <br/>
          <span class="text-h6">Created on </span><span>{{ selectedCard.createdAt | format }}</span>
          <!--            <span class="text-h6">Modified on </span><span>{{ selectedCard.updatedAt | format }}</span>-->
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

  import {mapActions, mapGetters} from 'vuex';
  import dateFormat from '../../../../helpers/dateFormat';
  import addCard from 'components/taskManager/lists/forms/addCard';
  import ListItem from 'components/taskManager/lists/listView/listItem';

  export default {
    name: 'listView',
    components: {
      ListItem,
      addCard,
    },
    props: {
      showMyTickets: {
        type: Boolean,
      },
      board: {
        type: Object,
      },
    },
    mounted() {
      this.loadLists(this.list_query);
    },
    data() {
      return {
        selectedCard: {},
        editCard: false,
        list_query: {
          query: {
            board: this.$lget(this.$route, 'params.board_id'),
          },
          $fastJoinCards: true,
        },

        dialogOnSmall: false,
      };
    },
    filters: {
      format(date) {
        return dateFormat(date);
      },
      daysPast(date) {
        let diffInTime = new Date().getTime() - new Date(date).getTime();
        let diffInDays = diffInTime / (1000 * 3600 * 24);
        return diffInDays < 1 ? 0 : diffInDays.toFixed(0);
      },
    },
    computed: {
      ...mapGetters('lists', {
        getLists: 'find',
      }),
      ...mapGetters('auth', {
        user: 'user',
      }),
      lists() {
        if (!this.showMyTickets) {
          return this.$lorderBy(this.getLists(this.list_query).data.map(card => card.clone()), ['order', 'createdAt'], ['asc', 'asc']).map(card => {
            return card;
          });
        } else {
          let cards = this.getLists({query: {createdBy: this.user._id}});
          let newList = [{
            name: 'My Tickets',
            color: {hex: '#00aaf1'},
            _fastjoin: {cards: []},
          }];
          cards.data.forEach(card => {
            card._fastjoin.cards.forEach(card => {
              newList[0]._fastjoin.cards.push(card);
            });
          });
          return newList;
        }
      },
    },
    methods: {
      ...mapActions('lists', {
        loadLists: 'find',
      }),
      updateSelected(card) {
        this.selectedCard = card;
      },
      selectCard(card) {
        if (this.$q.screen.sm || this.$q.screen.lt.sm) {
          this.dialogOnSmall = true;
        }
        let el = document.getElementById('rightMenu');
        let scrollHeight = window.scrollY;
        el.style.marginTop = `${scrollHeight + 50}px`;
        if (card.name === this.selectedCard.name) {
          this.selectedCard = {};
          return;
        }
        this.selectedCard = card;
      },
    },
  };
</script>

<style scoped lang="scss">
  .add-card {
    text-align: center !important;

    .add-icon {
      margin: 0 auto;
    }
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
    height: 110vh;

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
        //transform: scale(1.03);
      }

      .card {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #f0f0f0;
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
    margin-right: -20vw;
    opacity: 0;
  }
</style>
