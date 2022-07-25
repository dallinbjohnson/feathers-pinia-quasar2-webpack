<template>
  <div :id="elementData._id"
       @click.stop="!previewing ? currentElement = {...elementData, treePath, index, pathToMe} : ''"
       :style="{...$lget(elementData, 'styles', {}), padding: '0', margin: '0', position: 'relative', 'background-color': 'none', border: 'none'}"
       :class="[...$lget(elementData, '_fastjoin.classes', []).map(cl => cl.name.replace('.', '')), !isEditing ? showBorder ? 'inactive': '' : 'editing']">
    <editing-options v-if="isEditing && !previewing"
                     :parent="$lget(treePath, [0])"
                     :type="elementData._type"
                     @jumpToParent="currentElement = $event"/>
    <q-card flat :style="{...$lget(elementData, 'styles', {}) }">
      <q-card-section>
        <q-input v-bind="$attrs['input-attrs']" v-model="form.subject" label="Subject"/>
      </q-card-section>
      <q-card-section>
        <q-input v-bind="$attrs['input-attrs']" type="textarea" v-model="form.html" label="Message"/>
      </q-card-section>
      <q-card-section style="width: 100%; display: flex; justify-content: flex-end">
        <q-btn @click="sendEmail"
               :style="{...$lget(elementData, 'button-attrs.styles', {})}"
               :size="$lget(elementData, 'button-attrs.size', '16px')"
               :label="$lget(elementData, 'button-attrs.label', 'Send')"
               v-bind="$lget(elementData, 'button-attrs', {})"/>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import editingOptions from 'components/editingOptions/editingOptions';

  export default {
    name: 'contactForm',
    inheritAttrs: false,
    components: {
      editingOptions,
    },
    props: {
      previewing: Boolean,
      treePath: Array,
      pathToMe: String,
      element: Object,
      index: Number,
      editing: Boolean,
      focus: {
        type: Boolean,
        default: false,
      },
      showBorder: {
        type: Boolean,
      },
    },
    data() {
      return {
        elementData: {},
        form: {
          from: '',
          to: '',
          subject: '',
          html: '',
        },
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          this.elementData = this.$lcloneDeep(newVal);
        },
      },
    },
    computed: {
      ...mapGetters('auth', {
        user: 'user',
      }),
      feathersAxios() {
        return this.$axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.$store.state.auth.accessToken,
          },
        });
      },
      isEditing() {
        return this.$lget(this.currentElement, '_id', false) === this.$lget(this.elementData, '_id', true) && !this.previewing;
      },
      currentElement: {
        get() {
          return this.$store.getters.getCurrentElement;
        },
        set(element) {
          this.$store.dispatch('setCurrentElement', element);
        },
      },
    },
    methods: {
      sendEmail() {
        if (this.previewing) {
          if (this.$lget(this.elementData, 'to')) {
            console.log('sending.....');
            const data = {
              value: {
                from: this.user.email,
                to: this.$lget(this.elementData, 'to', ''),
                subject: this.form.subject,
                html: this.form.html,
              },
              action: 'emailTemplateForm',
            };
            this.feathersAxios.post('/wpb-mailer-management', data)
              .then(res => {
                this.form.subject = '';
                this.form.html = '';
                this.$q.notify({
                  type: 'positive',
                  message: this.$lget(this.elementData, 'successMessage', 'Successfully Sent'),
                });
                console.log('it worked homie dont stress', res);
              })
              .catch(err => {
                this.$q.notify({
                  type: 'negative',
                  message: 'Error sending message',
                });
                console.error('sum ting wong', err);
              });
          } else {
            this.$q.notify({
              type: 'negative',
              message: 'Destination not specified',
            });
          }
        } else {
          this.currentElement = {
            ...this.elementData,
            treePath: this.treePath,
            index: this.index,
            pathToMe: this.pathToMe,
          };
        }
      },
    },
  };
</script>

<style scoped>

</style>
