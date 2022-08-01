<template>
  <div id="ChatMessage">
    <q-chat-message :sent="$lget(chat, 'sender') === $lget($activeAccount, 'participant')"
                    :stamp="`${humanizedDate} ${editedTag}`"
                    :avatar="$lget(chat, '_fastjoin.sender._fastjoin.owner.avatar.raw.file')"
                    :text-color="$lget(chat, 'sender') === $lget($activeAccount, 'participant') ? 'white' : $q.dark.mode ? 'white' : 'black'"
                    :bg-color="$lget(chat, 'sender') === $lget($activeAccount, 'participant') ? 'primary' : $q.dark.mode ? 'grey-9' : 'accent'"
                    :text="isDeleting ? [] : [$lget(chat, 'text')]">
      <q-spinner v-if="isDeleting" size="1.5em"/>

      <template v-slot:name>
        <q-icon v-if="$lget(chat, 'sender') === $lget($activeAccount, 'participant')"
                class="cursor-pointer"
                name="more_horiz">
          <q-menu>
            <q-list>
              <q-item clickable
                      dense
                      v-close-popup
                      class="flex justify-between items-center"
                      @click="editBtn">
                Edit
                <q-icon name="edit" class="q-ml-sm"/>
              </q-item>
              <q-item clickable
                      dense
                      v-close-popup
                      class="flex justify-between items-center"
                      @click="deleteChat">
                Delete
                <q-icon name="delete" class="q-ml-sm"/>
              </q-item>
            </q-list>
          </q-menu>
        </q-icon>
        {{ $lget(chat, 'sender') === $lget($activeAccount, 'participant') ? 'me' : $lget(chat, '_fastjoin.sender._fastjoin.owner.name') }}
        <slot name="newBadge"></slot>
      </template>
    </q-chat-message>

    <q-dialog v-model="isEditing">
      <q-card bordered flat style="overflow: hidden;">
        <q-bar :class="['q-py-lg', $q.dark.mode ? 'bg-dark' : 'bg-white']" style="border-bottom: 1px solid rgba(0, 0, 0, 0.12);">
          <h5 class="q-ma-none text-primary">Update Message</h5>
          <q-space/>
          <q-btn icon="close" dense flat v-close-popup/>
        </q-bar>
        <q-editor v-model="editorText"
                  flat
                  min-height="3rem"
                  max-height="300px"
                  @keydown.enter.exact.prevent.stop
                  @keydown.enter.exact="updateChat"
                  :definitions="{
                  upload: {
                    tip: 'Upload an image',
                    icon: 'photo',
                    handler: insertImg
                  },
                }"
                  :toolbar="[...toolbar, ['upload',  'fullscreen']]"/>
        <q-linear-progress v-if="isPatchPending" size="xs" rounded indeterminate color="secondary"/>
        <q-bar :class="$q.dark.mode ? 'bg-dark' : 'bg-white'" style="border-top: 1px solid rgba(0, 0, 0, 0.12);">
          <q-space/>
          <q-btn :disable="isPatchPending" dense flat icon="send" color="blue" @click="updateChat"/>
        </q-bar>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {date} from 'quasar';
  import {mapState} from 'vuex';

  export default {
    name: 'ChatMessage',
    props: {
      value: {
        type: Object,
        required: true,
      },
      toolbar: {
        type: Array,
        required: true,
      }
    },
    data() {
      return {
        isDeleting: false,
        isEditing: false,
        editorText: '',
      };
    },
    computed: {
      ...mapState('chats', {
        isPatchPending: 'isPatchPending',
      }),

      chat() {
        return this.$lget(this.value, 'chat', {});
      },

      humanizedDate() {
        // return date.formatDate(this.$lget(this.chat, 'createdAt'), 'MMM DD, YYYY - h:mm A');
        return date.formatDate(this.$lget(this.chat, 'createdAt'), 'h:mm A');
      },
      editedTag() {
        if (this.$lget(this.chat, 'createdAt') !== this.$lget(this.chat, 'updatedAt') && !this.isDeleting) return '- (edited)';
        return '';
      },
    },
    methods: {
      editBtn() {
        this.isEditing = true;
        this.editorText = this.$lget(this.chat, 'text');
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

      updateChat() {
        this.chat.patch({
          data: {
            text: this.editorText,
          }
        })
          .then(() => {
            this.isEditing = false;

            this.$q.notify({
              type: 'positive',
              message: 'Chat Updated',
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
          })
          .catch(err => {
            this.isEditing = false;

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
      },

      deleteChat() {
        this.isDeleting = true;

        this.chat.remove()
          .then(() => {
            this.isDeleting = false;

            this.$q.notify({
              type: 'positive',
              message: 'Chat Deleted',
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
          })
          .catch(err => {
            this.isDeleting = false;

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
  };
</script>

<style scoped lang="scss">
  #ChatMessage:deep {
    p, h4, h5, h6 {
      margin: 0;
    }
  }
</style>
