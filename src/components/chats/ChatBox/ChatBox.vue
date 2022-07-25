<template>
  <div class="ChatBox flex column q-pa-sm" style="height: calc(100vh - 184px); overflow: hidden; width: 100%">
    <div class="scroll-list">
      <q-scroll-area ref="messages"
                     style="height: 100%;"
                     content-style="padding: 24px;"
                     content-active-style="padding: 24px;"
                     bar-style="width: 0"
                     :thumb-style="{width: 0}">
        <h3 v-if="!chatsClone.length"
            :class="['absolute-center', !$q.dark.mode ? 'text-primary' : '']"
            style="margin: 0; text-align: center;">
          No Messages
        </h3>
        <div v-for="(chatsArrays, groupDate, index) in groupedChats" :key="index">
          <div class="date-line-line q-mb-md q-mt-lg" :style="{...dateCssVars}">
            <span class="date-line-text">{{ groupDate }}</span>
          </div>
          <div v-for="(chat, index) in chatsArrays.slice().reverse()"
               :key="index">
            <chat-message :toolbar="toolbar"
                          :value="{chat}">
              <template v-slot:newBadge>
                <q-badge v-if="$lget(myParticipant, 'unseenChats', []).includes(chat._id)" class="q-ml-sm">
                  <q-intersection @visibility="addToSeen($event, chat)">new!</q-intersection>
                </q-badge>
              </template>
            </chat-message>
          </div>
        </div>

        <q-intersection @visibility="paginateChats">
          <div class="flex justify-center items-center">
            <q-spinner-dots v-if="isFindChatsListPending" size="4em"/>
          </div>
        </q-intersection>
      </q-scroll-area>
    </div>

    <q-card v-if="room" bordered flat style="overflow: hidden; width: 100%">
      <q-editor v-model="newChat.text"
                style="max-width: 100%"
                :content-style="{overflowWrap: 'break-word'}"
                flat
                min-height="3rem"
                max-height="300px"
                @keydown.enter.exact.prevent.stop
                @keydown.enter.exact="addChat"
                :definitions="{
                  upload: {
                    tip: 'Upload an image',
                    icon: 'photo',
                    handler: insertImg
                  },
                }"
                :toolbar="[...toolbar, ['upload', 'fullscreen', 'viewsource']]"/>
      <q-linear-progress v-if="isCreatePending" size="xs" rounded indeterminate color="secondary"/>
      <q-bar :class="$q.dark.mode ? 'bg-dark' : 'bg-white'" style="border-top: 1px solid rgba(0, 0, 0, 0.12);">
        <p class="no-margin" style="font-size: 0.7em; opacity: 0.6">
          shift + return to add a new line
        </p>
        <q-space/>
        <q-btn :disable="isCreatePending" dense flat icon="send" color="blue" @click="addChat"/>
      </q-bar>
    </q-card>
  </div>
</template>

<script>
  import ChatMessage from 'components/chats/ChatMessage';
  import {models} from '@feathersjs/vuex';
  import {makeFindPaginateMixin, lodash} from '@iy4u/common-client-lib';
  import {mapGetters, mapState} from 'vuex';
  import {date /*QSpinnerCube*/} from 'quasar';
  const {$ldebounce, $lgroupBy} = lodash;

  export default {
    name: 'ChatBox',
    components: {ChatMessage},
    props: {
      value: {
        type: Object,
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 20,
        service: 'chats',
        name: 'chatsList',
        qid: 'chatsList',
        infinite: true,
        query() {
          return {
            $sort: {
              createdAt: -1,
            },
            room: this.$lget(this.room, '_id', null),
          };
        },
        params() {
          return {
            chatResolversQuery: {
              sender: [
                ['_id', 'owner'],
                {
                  participantResolversQuery: {
                    owner: [
                      ['_id', 'name', 'avatar'],
                    ],
                  },
                },
              ],
            },
          };
        },
      }),
    ],
    data() {
      return {
        newChat: new models.api.Chats().clone(),
        initBottom: false,
        seenArr: [],

        toolbar: [
          [
            {
              icon: this.$q.iconSet.editor.formatting,
              options: ['bold', 'italic', 'strike', 'underline'],
            },
          ],
          [
            {
              icon: 'text_fields',
              options: ['p', 'code', 'unordered', 'ordered', 'h4', 'h5', 'h6'],
              list: 'no-icons',
              fixedLabel: true,
            },
          ],
          [
            {
              icon: this.$q.iconSet.editor.align,
              fixedLabel: true,
              options: ['left', 'center', 'right', 'justify'],
            },
          ],
          [
            {
              icon: 'handyman',
              fixedLabel: true,
              options: ['undo', 'redo', 'removeFormat', 'hr', 'link'],
            },
          ],
        ],
      };
    },
    // watch: {
    //   isFindChatsListPending(newVal) {
    //     this.$isLoading(newVal, {spinner: QSpinnerCube});
    //   },
    // },
    computed: {
      ...mapState('chats', {
        isPatchPending: 'isPatchPending',
        isCreatePending: 'isCreatePending',
        isUpdatePending: 'isUpdatePending',
      }),
      ...mapGetters('participants', {
        getParticipant: 'get',
      }),

      dateCssVars() {
        return {
          '--date-bg-color': this.$q.dark.mode ? 'var(--q-color-dark)' : 'white',
        };
      },
      room() {
        return this.$lget(this.value, 'room', {});
      },
      myParticipant() {
        return this.getParticipant(this.$lget(this.$activeAccount, 'participant', ''));
      },
      chatsClone() {
        return this.chatsList.map(item => item.clone());
      },
      groupedChats() {
        this.chatsClone.forEach((element) => {
          const jsDate = new Date(this.$lget(element, 'createdAt'));
          const exactDate = new Date(jsDate.getFullYear(), jsDate.getMonth(), jsDate.getDate());
          // console.log('exactDate', exactDate);
          element.groupDate = date.formatDate(exactDate, 'MMM DD, YYYY');
        });
        return $lgroupBy(this.chatsClone, 'groupDate');
      },
    },
    methods: {
      paginateChats(isVisible) {
        if (isVisible) {
          if (this.chatsListTotal
            && this.chatsList.length < this.chatsListTotal
            && !this.isFindChatsListPending) {
            this.chatsListCurrentPage += 1;
          }
        }
      },
      addToSeen(isVisible, chat) {
        if (isVisible) {
          this.seenArr.push(chat);
          this.debounceSeen(this.seenArr);
        }
      },
      debounceSeen: $ldebounce(async function (seenArr) {
        for (const chat of seenArr) {
          if (this.$lget(this.myParticipant, 'unseenChats', []).includes(chat._id)) {
            console.log('markAsSeen in chats: ', chat.text);
            await this.myParticipant.patch({
              data: {
                $pull: {
                  unseenChats: chat._id,
                },
              },
            }).then(() => {
              console.log('removed chat from unseenChats');
            });
          }
        }
        this.seenArr = [];
      }, 500, {'maxWait': 1000}),

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
            this.newChat.text += html;
          };
          reader.readAsDataURL(file);
        };
        input.click();
      },
      addChat() {
        if (!this.isCreatePending) {
          if (this.$lget(this.newChat, 'text', '') !== '') {
            this.$lset(this.newChat, 'sender', this.$activeAccount.participant);
            this.$lset(this.newChat, 'room', this.room._id);

            this.newChat.create()
              .then(() => {
                this.newChat = new models.api.Chats().clone();
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
        }
      },
    },
  };
</script>

<style scoped lang="scss" src="./_ChatBox.scss">

</style>
