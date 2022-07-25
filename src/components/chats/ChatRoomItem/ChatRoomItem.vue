<template>
  <q-item class="ChatRoomItem q-mb-sm"
          clickable
          v-ripple
          :active="currentRoom === room._id"
          @click="selectRoom(room)"
          :active-class="$q.dark.mode ? 'bg-primary text-white' : 'bg-accent'"
          style="border-radius: 2em;">
    <q-item-section avatar>
      <q-avatar v-if="room.directMessage">
        <img v-if="$lget(dmAccount, 'avatar.raw.file')" :src="$lget(dmAccount, 'avatar.raw.file')" :alt="dmAccount.name">
        <template v-else>{{ $lget(dmAccount, 'name', '').charAt(0) }}</template>
      </q-avatar>
      <q-avatar v-else>
        <q-icon name="fas fa-users"></q-icon>
      </q-avatar>
    </q-item-section>

    <q-item-section>
      <q-item-label v-if="['', null, undefined].includes(room.name)" lines="2">
        {{ participantNames(room) }}
      </q-item-label>
      <q-item-label v-else lines="2">{{ room.name }}</q-item-label>
    </q-item-section>

    <q-item-section v-if="unseenCount"
                    style="display: flex; flex-direction: row; align-items: center">
      <q-space/>
      <q-badge>{{ unseenCount }}</q-badge>
    </q-item-section>

    <q-item-section v-if="!room.directMessage" side>
<!--      v-if may need to be removed in the future-->
      <q-btn round dense flat icon="more_vert" @click.stop>
        <q-menu>
          <q-list>
            <q-item v-if="!room.directMessage"
                    clickable
                    dense
                    v-close-popup
                    class="flex justify-start items-center"
                    @click="roomNameDialog = true; newName = room.name">
              <q-icon size="xs" name="mdi-form-textbox" class="q-mr-sm"/>
              {{ room.name ? 'Change' : 'Add' }} Name
            </q-item>
            <q-item clickable
                    dense
                    v-close-popup
                    class="flex justify-start items-center"
                    @click="addMembersDialog = true">
              <q-icon size="xs" name="mdi-account-multiple-plus" class="q-mr-sm"/>
              Add Members
            </q-item>
            <q-item clickable
                    dense
                    v-close-popup
                    class="flex justify-start items-center text-negative"
                    @click="leaveRoom">
              <q-icon size="xs" name="mdi-exit-run" class="q-mr-sm"/>
              Leave Room
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>

      <q-dialog v-model="roomNameDialog" @hide="newName = ''">
        <q-card style="min-width: 30vw">
          <q-card-section class="bg-primary flex items-center">
            <h5 class="q-ma-none text-white">Edit Room Name</h5>
            <q-space/>
            <q-btn icon="close" color="white" dense flat v-close-popup/>
          </q-card-section>
          <q-card-section>
            <q-form class="flex items-center" @submit="updateRoomName">
              <q-input v-model="newName"
                       filled
                       label="Room Name"
                       style="flex: 1"/>
              <q-btn icon="edit"
                     class="q-ml-md"
                     color="primary"
                     flat
                     dense
                     :loading="isPatchPending"
                     type="submit"/>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="addMembersDialog" @hide="newMembers = null">
        <q-card style="min-width: 30vw">
          <q-card-section class="bg-primary flex items-center">
            <h5 class="q-ma-none text-white">Add Members to {{room.name ? room.name : 'Room'}}</h5>
            <q-space/>
            <q-btn icon="close" color="white" dense flat v-close-popup/>
          </q-card-section>
          <q-card-section>
            <q-form class="flex items-center" @submit="addMembers">
<!--              <account-search v-model="newMembers"-->
<!--                              :multiple="true"-->
<!--                              :filter-out="[$activeAccount._id, ...participantAccountIDs]"></account-search>-->
              <account-search-component v-model="newMembers"
                              :multiple="true"
                              :filter-out="[$activeAccount._id, ...participantAccountIDs]"></account-search-component>
              <q-btn icon="add"
                     class="q-ml-md"
                     color="primary"
                     flat
                     dense
                     :loading="isPatchPending"
                     type="submit"/>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-item-section>
  </q-item>
</template>

<script>
  import {mapGetters, mapState} from 'vuex';
  // import AccountSearch from 'components/profile/ProfileOld/AccountSearch';
  import AccountSearchComponent from '@iy4u/common-client-lib/src/components/profile/accounts/AccountSearch';

  export default {
    name: 'ChatRoomItem',
    components: {
      // AccountSearch,
      AccountSearchComponent,
    },
    props: {
      value: {
        type: Object,
      },
      currentRoom: {
        type: String,
      }
    },
    data() {
      return {
        roomNameDialog: false,
        addMembersDialog: false,
        newName: '',
        newMembers: null,
      };
    },
    mounted() {
      if (this.$route.query.currentRoom === this.room._id) {
        this.selectRoom(this.room);
      }
    },
    computed: {
      ...mapState('rooms', {
        isPatchPending: 'isPatchPending',
      }),
      ...mapGetters('participants', {
        getParticipant: 'get',
      }),

      room() {
        return this.$lget(this.value, 'room', {});
      },
      myParticipant() {
        return this.getParticipant(this.$lget(this.$activeAccount, 'participant', ''));
      },
      unseenCount() {
        return this.room.chats.filter((chat) => this.$lget(this.myParticipant, 'unseenChats', []).includes(chat)).length;
      },
      dmAccount() {
        const dmParticipant = Object.assign({}, ...this.room._fastjoin.participants.filter(i => i._id !== this.$activeAccount.participant));
        return this.$lget(dmParticipant, '_fastjoin.owner');
      },
      participantAccountIDs() {
        let pAccounts = [];
        this.room._fastjoin.participants.forEach(p => {
          pAccounts.push(p._fastjoin.owner._id);
        });
        return pAccounts;
      },
    },
    methods: {
      updateRoomName() {
        if (!this.room.directMessage) {
          this.room.patch({
            data: {
              name: this.newName,
            },
          })
            .then(res => {
              this.$q.notify({
                type: 'positive',
                message: `Updated room name${res.name ? ` to "${res.name}"` : ''}`,
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
              this.newName = '';
              this.roomNameDialog = false;
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
            });
        }
      },
      addMembers() {
        if (!this.room.directMessage) {
          this.room.patch({
            data: {
              $addToSet: {
                participants: this.newMembers.map(i => i.participant)
              }
            },
          })
            .then(res => {
              this.$q.notify({
                type: 'positive',
                message: `Added members to ${res.name ? res.name : 'room'}`,
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
              this.newMembers = null;
              this.addMembersDialog = false;
              this.$emit('refresh-rooms');
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
            });
        }
      },
      leaveRoom() {
        this.$q.dialog({
          title: 'Leave Room?',
          message: `Are you sure you want to leave ${this.room.name ? `"${this.room.name}"` : 'this room'}?`,
          ok: {
            push: true,
            color: 'primary',
          },
          cancel: {
            color: 'negative',
            push: true,
            outline: true,
          },
          persistent: true,
        }).onOk(() => {
          if (!this.room.directMessage) {
            this.room.patch({
              data: {
                $pull: {
                  participants: this.$activeAccount.participant,
                }
              },
            })
              .then(res => {
                this.$q.notify({
                  type: 'positive',
                  message: `Left ${res.name ? `"${res.name}"` : 'room'}`,
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
                this.$emit('refresh-rooms');
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
              });
          }
        });
      },
      participantNames(room) {
        let names = [];
        room._fastjoin.participants.forEach(p => {
          if (p._id !== this.$activeAccount.participant) {
            names.push(p._fastjoin.owner.name);
          }
        });
        return names.join(', ');
      },
      selectRoom(room) {
        this.$emit('select-room', room);
      },
    },
  };
</script>

<style scoped lang="scss" src="./_ChatRoomItem.scss">

</style>
