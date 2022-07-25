<template>
  <div :class="menu ? 'full_width' : `row q-py-md justify-around`">

    <template v-if="!menu">

      <div v-for="(item, i) in items" :key="`item-${i}`">
        <a v-if="item.show" :href="item.href" style="text-decoration: none" @click="item.click()">
          <q-btn
            v-bind="{
              disable: !item.href,
              dense: true,
              color: dark ? 'white' : item.color,
              flat: true,
              size: size,
              label: item.label,
              icon: item.icon,
              ...$attrs.btnAttrs
            }"
          />
        </a>
      </div>

    </template>
    <template v-else>
      <q-card flat style="width: 100%;">
        <q-list separator class="text-dark">
          <div v-for="(item, i) in items" :key="`item-${i}`">
            <a v-if="item.show" :href="item.href" style="text-decoration: none;" @click="item.click()">
              <q-item clickable style="width: 100%;">
                <q-item-section avatar>
                  <q-icon :color="item.color" :name="item.icon"></q-icon>
                </q-item-section>
                <q-item-section v-if="!item.noLabel">
                  <q-item-label class="text-dark">{{item.label}}</q-item-label>
                </q-item-section>
              </q-item>
            </a>
          </div>
        </q-list>
      </q-card>
    </template>
  </div>
</template>

<script>
  // import {models} from '@feathersjs/vuex';

  export default {
    name: 'ContactStrip',
    props: {
      addContacts: Boolean,
      menu: Boolean,
      size: { type: String, default: 'sm' },
      video: Boolean,
      noText: Boolean,
      hidePhone: Boolean,
      hideSms: Boolean,
      hideEmail: Boolean,
      dark: Boolean,
      value: Object,
      small: Boolean,
      phonePath: { type: String, default: 'phone.number.e164' },
      smsPath: { type: String, default: 'phone.number.e164' },
      emailPath: { type: String, default: 'email' },
      smsAttrs: { required: false },
      phoneAttrs: { required: false },
      emailAttrs: { required: false },
    },
    data() {
      return {
        showText: false,
        showCall: false,
        showEmail: false
      };
    },
    computed: {
      items() {
        let basic = [
          {
            show: !this.hideSms,
            noLabel: this.noText,
            label: this.showText ? this.$lget(this.value, this.smsPath) : 'Text',
            icon: 'mdi-message',
            href: `sms: ${this.$lget(this.value, this.smsPath)}`,
            color: this.$lget(this.smsAttrs, 'color', 'primary'),
            click: () => {
              this.showText = !this.showText;
            }
          },
          {
            show: !this.hidePhone,
            noLabel: this.noText,
            label: this.showCall ? this.$lget(this.value, this.phonePath) : 'Call',
            icon: 'mdi-phone',
            href: `tel: ${this.$lget(this.value, this.phonePath)}`,
            color: this.$lget(this.phoneAttrs, 'color', 'secondary'),
            click: () => {
              this.showCall = !this.showCall;
            }
          },
          {
            show: !this.hideEmail,
            noLabel: this.noText,
            label: this.showEmail ? this.$lget(this.value, this.emailPath) : 'Email',
            icon: 'mdi-email',
            href: `mailto: ${this.$lget(this.value, this.emailPath)}`,
            color: this.$lget(this.emailAttrs, 'color', 'accent'),
            click: () => {
              this.showEmail = !this.showEmail;
            }
          }
        ];
        if(this.addContacts) return [...basic, ...this.addContacts];
        else return basic;
      }
    },
    methods: {
      requestVideoChat() {
        console.log('uncomment me');
        // if(this.$lget(this.$route, 'query.contactId', false)){
        //   new models.api.Chatroom({description: 'Chat Request'}).create().then((res) => {
        //     let chatRoom = {
        //       roomId: res._id,
        //       contactRequesting: this.$route.query.contactId,
        //       supportRequested: this.value.name,
        //       host: this.$lget(this.host, '_id'),
        //     };
        //     new models.api.VideoRequests(chatRoom).create().then(() => {
        //       this.$successNotify('Request has been sent to ' + this.value.name + '. We will notify you when they accept.');
        //     }).catch((err) => {
        //       console.log(err);
        //     });
        //   }).catch((err) => {
        //     console.log(err);
        //   });

        // }

      }
    }
  };
</script>

<style scoped lang="scss">
  .full_width {
    width: 100%;
  }
</style>
