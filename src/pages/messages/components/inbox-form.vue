<template>
  <q-card square flat class="form">
    <q-card-section style="position:absolute; bottom: 5rem; top:1rem; width:100%;">
      <accounts-filter
        v-if="!isReply"
        autofocus
        :label="placeholder.to"
        @focus="placeholder.to='To:'"
        @blur="placeholder.to='Recipients:'"
        hint="Search recipients by name or email"
        v-model="form.to"
      />
      <div class="row q-gutter-sm items-center justify-end">
        <q-input v-if="!isReply" hint="Search by subject" label="Subject:" v-model="form.subject" style="flex: 1;"
                 dense/>
      </div>
      <div style="position:relative; height: 70%;">
        <q-editor
          flat
          square
          style="position:absolute; bottom: 0; top: 0; left: 0; right: 0"
          class="scroll q-mt-md"
          v-model="form.body"
          :definitions="{
        save: {
          tip: 'Save your work',
          icon: 'save',
          handler: saveWork
        },
        upload: {
          tip: 'Upload attachment(s)',
          icon: 'attachment',
          handler: uploadIt
        }
      }"
          :toolbar="[
               [
      {
        label: 'Align',
        icon: 'fas fa-align-left',
        fixedLabel: true,
        options: ['left', 'center', 'right', 'justify']
      }
    ],
        ['bold', 'italic', 'strike', 'underline'],
        ['upload', 'save']
      ]"
        />
      </div>
      <q-dialog id="dia" v-model="uploadDialog">
        <q-card dark flat square bordered class="dia-card">
          <q-card-section class="row q-gutter-md no-wrap justify-between">
            <q-btn @click="addAttachment" color="primary" label="Attachment" icon="add" :disabled="!validAttachment"/>

            <q-space/>

            <q-btn dense flat icon="close" v-close-popup>
              <q-tooltip>Close</q-tooltip>
            </q-btn>
          </q-card-section>

          <q-card-section>
            <form-generator
              v-model="attachmentForm"
              :fields="attachmentFields"
              useQform
              v-model:valid="validAttachment"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-card-section>
    <q-card-actions class="form-controls q-pa-sm" align="between">

      <div class="row q-gutter-md">
        <q-btn @click="send" color="primary" label="Send" icon-right="send" :disabled="!validForm && sending"
               :loading="sending">
          <q-tooltip>
            Send message
          </q-tooltip>
        </q-btn>
        <q-btn flat v-if="form.attachments.length" :label="form.attachments.length" icon-right="attachment"></q-btn>
      </div>
      <q-btn-group flat class=" row q-gutter-sm">
        <q-checkbox class="text-caption" v-model="form.isExternal" :true-value="true" label="Is External Mail"/>
        <!--         <q-btn icon="fas fa-trash-alt">
                   <q-tooltip>
                     Discard draft
                   </q-tooltip>
                 </q-btn>-->
      </q-btn-group>

    </q-card-actions>
  </q-card>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import AccountsFilter from 'pages/messages/components/accounts-filter';

  export default {
    name: 'inbox-form',
    components: {AccountsFilter},
    props: {
      message: {
        type: Object,
      },
      isReply: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        uploadDialog: false,
        placeholder: {
          to: 'Recipients: ',
        },
        form: new models.api.Messages().clone(),
        attachmentForm: {attachments: []},
        sending: false,
        validAttachment: false,
      };
    },
    watch: {
      message: {
        immediate: true,
        deep: true,
        handler: function (newVal) {
          if (newVal) {
            this.form = new models.api.Messages().clone({...newVal});
          } else {
            this.form = new models.api.Messages().clone();
          }
        },
      },
      attachmentForm: {
        immediate: true,
        deep: true,
        handler: function (newVal) {
          this.validAttachment = this.$lget(newVal, ['attachments'], []).length > 0;
        },
      },
    },

    computed: {
      attachmentFields() {
        return [{
          fieldType: 'ImageSelect',
          path: 'attachments',
          attrs: {
            stylePanelLayout: null,
            allowMultiple: true,
            allowReplace: false,
            checkValidity: true,
            credits: '',
            labelIdle: '<span class="column text-grey-7"><a style="font-size:0.8rem;"  class="q-mt-sm q-mb-xs">DRAG & DROP OR</a>  <a style="border-radius:1rem; font-size:0.6rem;" class="q-pa-sm text-primary text-xs bg-white q-pa-xs"> browse photo</a> </span>',
          },
          'label-attrs': {
            'v-text': 'Upload Attachments',
            class: 'text-bold q-my-sm',
          },
          'div-attrs': {
            class: 'col-12  text-caption column items-center q-pa-none text-center',
          },
        }];
      },
      validForm() {
        const hasRecipient = this.$lget(this.form, 'to', '').length > 0;
        const hasBody = this.$lget(this.form, 'body', '').length > 10;
        const hasSubject = this.$lget(this.form, 'subject', '').length > 5;
        return hasRecipient && hasSubject && hasBody;
      },
    },
    methods: {

      saveWork() {
        this.$q.notify({
          message: 'Saved your text to local storage',
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
        });
      },
      uploadIt() {
        this.uploadDialog = true;
      },
      addAttachment() {
        this.form.attachments = this.attachmentForm.attachments.map(
          attachment => ({
            filename: this.$lget(attachment, ['raw', 'name']),
            path: this.$lget(attachment, ['raw', 'file']),
            href: this.$lget(attachment, ['raw', 'file']),
          }),
        );
        console.log(this.form.attachments);
        this.uploadDialog = false;
        this.$q.notify({
          message: `added ${this.$lget(this.form, 'attachments', []).length} ${this.$lget(this.form, 'attachments', []).length > 1 ? 'attachments' : 'attachment'} `,
          color: 'green-4',
          textColor: 'white',
          icon: 'attachment',
        });
      },
      async send() {
        try {
          this.sending = true;
          await this.form.save();
          this.sending = false;
          this.$q.notify({
            message: `Message with subject ${this.$lget(this.form, 'subject', '')} sent`,
            color: 'green-4',
            textColor: 'white',
            icon: 'attachment',
          });
          this.form = new models.api.Messages().clone();
          this.sending = false;
          this.$emit('sent');
        } catch (e) {
          this.sending = false;
          this.$q.notify({
            message: e.message,
            color: 'negative',
            textColor: 'white',
            icon: 'warning',
          });
          this.sending = false;
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .form {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 96%;
    max-width: 99%;
    overflow-x: hidden !important;
    margin: 0;
  }

  .form-controls {
    margin-left: -0.6rem;
    position: absolute;
    bottom: 1rem;
    width: 100%
  }

  .dia {
    max-height: 40rem;

    .q-dialog__inner {
      position: relative;
      overflow-x: hidden !important;
    }
  }

  .dia-card {
    max-height: 35.5rem;
    position: absolute;
    right: 0;
    bottom: 0;
    margin: 50vh auto 0;
  }

  .dia-mob {
    min-height: 75vh;
  }
</style>
