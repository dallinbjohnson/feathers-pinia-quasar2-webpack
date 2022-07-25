<template>
  <div class="ChatRoomList">
    <q-list padding class="q-pa-sm rounded-borders text-primary" style="max-width: 280px;">
      <q-expansion-item v-model="expandedContacts"
                        switch-toggle-side>
        <template v-slot:header>
          <q-item-section>
            PEOPLE
          </q-item-section>

          <q-item-section side>
            <div class="flex">
              <q-btn round dense flat icon="add" @click.stop="createDMDialog = true"/>

              <q-dialog v-model="createDMDialog">
                <q-card style="min-width: 30vw; padding: 10px; border-top: 25px solid var(--q-color-primary)">
<!--                  <account-search v-model="accountSelection"-->
<!--                                  :filter-out="[$activeAccount._id]"></account-search>-->
                  <account-search-component v-model="accountSelection"
                                  :filter-out="[$activeAccount._id]"></account-search-component>
                  <q-card-actions align="right" class="q-mt-md">
                    <q-btn label="Cancel" v-close-popup color="red"/>
                    <q-btn label="Add"
                           :disable="roomBeingCreated || accountSelection === null || accountSelection === []"
                           :loading="roomBeingCreated"
                           color="primary"
                           @click="createDM"/>
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
          </q-item-section>
        </template>

        <div v-for="(room, index) in directMessages"
             :key="index">
          <chat-room-item :value="{room}"
                          :current-room="currentRoom"
                          @select-room="selectRoom"
                          @refresh-rooms="roomsListRefresh"></chat-room-item>
        </div>
      </q-expansion-item>

      <q-separator spaced/>

      <q-expansion-item v-model="expandedRooms"
                        switch-toggle-side>
        <template v-slot:header>
          <q-item-section>
            ROOMS
          </q-item-section>

          <q-item-section side>
            <div class="flex">
              <q-btn round dense flat icon="add" @click.stop="createRoomDialog = true"/>

              <q-dialog v-model="createRoomDialog">
                <q-card style="min-width: 30vw; padding: 10px; border-top: 25px solid var(--q-color-primary)">
                  <q-input v-model="newRoomName"
                           label="Room Name"
                           filled
                           class="q-mb-md"/>
<!--                  <account-search v-model="accountSelection"-->
<!--                                  :multiple="true"-->
<!--                                  :filter-out="[$activeAccount._id]"></account-search>-->
                  <account-search-component v-model="accountSelection"
                                  :multiple="true"
                                  :filter-out="[$activeAccount._id]"></account-search-component>
                  <q-card-actions align="right" class="q-mt-md">
                    <q-btn label="Cancel" v-close-popup color="red"/>
                    <q-btn label="Add"
                           :disable="roomBeingCreated || accountSelection === null || accountSelection === []"
                           :loading="roomBeingCreated"
                           color="primary"
                           @click="createRoom"/>
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </div>
          </q-item-section>
        </template>

        <div v-for="(room, index) in rooms"
             :key="index">
          <chat-room-item :value="{room}"
                          :current-room="currentRoom"
                          @select-room="selectRoom"
                          @refresh-rooms="roomsListRefresh"></chat-room-item>
        </div>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<script>
  // import AccountSearch from 'components/profile/ProfileOld/AccountSearch';
  import AccountSearchComponent from '@iy4u/common-client-lib/src/components/profile/accounts/AccountSearch';
  import {models} from '@feathersjs/vuex';
  import {mapActions} from 'vuex';
  import {makeFindPaginateMixin, routerMixin /*routerMixin*/} from '@iy4u/common-client-lib';
  import ChatRoomItem from 'components/chats/ChatRoomItem/ChatRoomItem';

  export default {
    name: 'ChatRoomList',
    components: {
      ChatRoomItem,
      // AccountSearch,
      AccountSearchComponent,
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 20,
        service: 'rooms',
        name: 'roomsList',
        qid: 'roomsList',
        infinite: true,
        advanced: true,
        query() {
          return {
            $sort: {
              updatedAt: -1,
            },
            participants: this.$lget(this.$activeAccount, 'participant', null),
            $or: [
              {
                participantEvents: {$size: 0},
              },
              {
                participantEvents: {$exists: false},
              },
              {
                participantEvents: null,
              },
            ],
          };
        },
        params() {
          return {
            roomResolversQuery: {
              participants: [
                ['_id', 'owner', 'unseenChats'],
                {
                  participantResolversQuery: {
                    owner: [
                      ['_id', 'name', 'avatar'],
                    ],
                  },
                },
              ],
              chats: [
                [false],
              ],
            },
          };
        },
      }),
      routerMixin({
        name: 'roomSelection',
        query() {
          return {
            currentRoom: this.currentRoom,
          };
        },
      }),
    ],
    data() {
      return {
        expandedContacts: false,
        expandedRooms: true,
        currentRoom: null,
        createRoomDialog: false,
        createDMDialog: false,
        accountSelection: null,
        newRoomName: '',

        roomBeingCreated: false,

        newRoom: new models.api.Rooms().clone(),
      };
    },
    computed: {
      roomsClone() {
        return this.roomsList.map(item => item.clone());
      },
      directMessages() {
        return this.roomsClone.filter(i => i.directMessage);
      },
      rooms() {
        return this.roomsClone.filter(i => !i.directMessage);
      },
    },
    methods: {
      ...mapActions('rooms', {
        findRooms: 'find',
      }),

      selectRoom(room) {
        this.currentRoom = room._id;
        this.$emit('select-room', room);
      },
      async createDM() {
        this.roomBeingCreated = true;

        this.$lset(this.newRoom, 'participants', [this.$activeAccount.participant, this.accountSelection.participant]);
        this.$lset(this.newRoom, 'directMessage', true);

        const compareRoom = await this.findRooms({
          query: {
            participants: {
              $all: this.$lget(this.newRoom, 'participants'),
              $size: this.$lget(this.newRoom, 'participants', []).length,
            },
            directMessage: true,
            $or: [
              {
                participantEvents: {$size: 0},
              },
              {
                participantEvents: {$exists: false},
              },
              {
                participantEvents: null,
              },
            ],
          },
          paginate: false,
        });

        if (compareRoom.length) {
          this.$q.notify({
            type: 'negative',
            message: `Messages with "${this.accountSelection.name}" already started.`,
            timeout: 10000,
            actions: [
              {
                icon: 'close',
                color: 'white',
                handler: () => {
                },
              },
            ],
          });

          this.newRoom = new models.api.Rooms().clone();
          this.createDMDialog = false;
          this.roomBeingCreated = false;
        } else if (!Object.keys(this.newRoom.participants.map(item => item)).includes('owner')) {
          //consider changing if condition to (this.newRoom.participants.includes(undefined))
          this.$q.notify({
            type: 'negative',
            message: 'Cannot create room for nonexistent participant or account.',
            timeout: 10000,
            actions: [
              {
                icon: 'close',
                color: 'white',
                handler: () => {
                },
              },
            ],
          });

          this.newRoom = new models.api.Rooms().clone();
          this.createDMDialog = false;
          this.roomBeingCreated = false;
        } else {
          this.newRoom.save()
            .then(() => {
              this.$q.notify({
                type: 'positive',
                message: `Successfully Started Message with "${this.accountSelection.name}".`,
                timeout: 10000,
                actions: [
                  {
                    icon: 'close',
                    color: 'white',
                    handler: () => {
                    },
                  },
                ],
              });

              this.newRoom = new models.api.Rooms().clone();
              this.createDMDialog = false;
              this.roomBeingCreated = false;
            })
            .catch(err => {
              this.$q.notify({
                type: 'negative',
                message: err.message,
                timeout: 30000,
                actions: [
                  {
                    icon: 'close',
                    color: 'white',
                    handler: () => {
                    },
                  },
                ],
              });
              this.roomBeingCreated = false;
            });
        }
      },
      async createRoom() {
        this.roomBeingCreated = true;

        this.$lset(this.newRoom, 'participants', [this.$activeAccount.participant, ...this.accountSelection.map(i => i.participant)]);
        this.$lset(this.newRoom, 'name', this.newRoomName);

        const compareRoom = await this.findRooms({
          query: {
            participants: {
              $all: this.$lget(this.newRoom, 'participants'),
              $size: this.$lget(this.newRoom, 'participants', []).length,
            },
            directMessage: {
              $ne: true
            },
            $or: [
              {
                participantEvents: {$size: 0},
              },
              {
                participantEvents: {$exists: false},
              },
              {
                participantEvents: null,
              },
            ],
          },
          paginate: false,
        });

        if (compareRoom.length) {
          this.$q.notify({
            type: 'negative',
            message: `Messages with "${this.accountSelection.map((account) => this.$lget(account, 'name'))}" already started.`,
            timeout: 10000,
            actions: [
              {
                icon: 'close',
                color: 'white',
                handler: () => {
                },
              },
            ],
          });

          this.newRoom = new models.api.Rooms().clone();
          this.createRoomDialog = false;
          this.roomBeingCreated = false;
        } else if (!Object.keys(this.newRoom.participants.map(item => item)).includes('owner')) {
          //consider changing if condition to (this.newRoom.participants.includes(undefined))
          this.$q.notify({
            type: 'negative',
            message: 'Cannot create room for nonexistent participant or account.',
            timeout: 10000,
            actions: [
              {
                icon: 'close',
                color: 'white',
                handler: () => {
                },
              },
            ],
          });

          this.newRoom = new models.api.Rooms().clone();
          this.createDMDialog = false;
          this.roomBeingCreated = false;
        } else {
          this.newRoom.save()
            .then(() => {
              this.$q.notify({
                type: 'positive',
                message: `Successfully Started Room with "${this.accountSelection.map((account) => this.$lget(account, 'name'))}".`,
                timeout: 10000,
                actions: [
                  {
                    icon: 'close',
                    color: 'white',
                    handler: () => {
                    },
                  },
                ],
              });

              this.newRoom = new models.api.Rooms().clone();
              this.createRoomDialog = false;
              this.roomBeingCreated = false;
            })
            .catch(err => {
              this.$q.notify({
                type: 'negative',
                message: err.message,
                timeout: 30000,
                actions: [
                  {
                    icon: 'close',
                    color: 'white',
                    handler: () => {
                    },
                  },
                ],
              });
              this.roomBeingCreated = false;
            });
        }
      },
    },
  };
</script>

<style scoped lang="scss" src="./_ChatRoomList.scss">

</style>
