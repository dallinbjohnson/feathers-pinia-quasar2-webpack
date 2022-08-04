<template>
  <div id="header-nav" class="flex">

    <template v-if="!$lisEmpty($authUser)">
<!--      <q-btn v-if="smallScreen"-->
<!--             :text-color="showSearchToolbar ? 'accent' : 'dark'"-->
<!--             dense-->
<!--             unelevated-->
<!--             icon="search"-->
<!--             class="q-ma-xs"-->
<!--             @click="showSearchToolbar = !showSearchToolbar"></q-btn>-->

<!--      <q-input v-if="!smallScreen" v-model="searchQuery" :dark="$q.dark.isActive || dark"  debounce="500" dense filled placeholder="Search"-->
<!--               clearable class="col-md-3">-->
<!--        <template v-slot:prepend>-->
<!--          <q-icon name="search"/>-->
<!--        </template>-->
<!--      </q-input>-->

      <q-btn :text-color="$q.dark.isActive || dark ? '' : 'dark'" dense unelevated icon="mdi-bell" class="q-ma-xs">
        <q-badge color="red" floating>5</q-badge>
        <q-menu v-model="messagesOpen" self="top middle">
          <notifications @close="messagesOpen = false"></notifications>
        </q-menu>
      </q-btn>

      <q-btn-dropdown v-model="settingsOpen"
                      :text-color="$q.dark.isActive || dark ? '' : 'dark'"
                      dense
                      unelevated
                      menu-self="top middle"
                      dropdown-icon="settings"
                      class="ub-btn-dropdown-bare q-ma-xs">
        <settings v-model:mini="menuMini" v-model:auto-expand="menuAutoExpand" @close="settingsOpen = false"></settings>
      </q-btn-dropdown>

      <q-btn-dropdown id="user-menu" :content-style="{ 'max-height': 'unset', height: '100%' }" v-model="userInfoOpen"
                      :text-color="$q.dark.isActive || dark ? '' : 'dark'" unelevated no-caps>
        <template v-slot:label>
          <div class="row items-center no-wrap">
            <random-avatar :user="$lget($store.getters, 'auth/activeAccount', {})" :menu="false" size="md"></random-avatar>
            <div v-if="!smallScreen" class="text-center text-bold q-pa-sm">
              {{ $lget($store.getters, 'auth/activeAccount.name', $lget($store.getters, 'auth/activeAccount.email', '')) }}
            </div>
          </div>
        </template>
<!--        <user-info :data="loginAccountData"></user-info>-->
      </q-btn-dropdown>
    </template>

    <template v-else>
      <template v-if="$q.screen.gt.sm">
        <q-btn @click="clickers('about')" :style="btnStyle" :size="btnSz" color="primary" flat
               label="About"></q-btn>
        <q-btn @click="clickers('results')" :style="btnStyle" :size="btnSz" color="primary" flat
               label="Results"></q-btn>
        <q-btn @click="clickers('contact')" :style="btnStyle" :size="btnSz" color="primary" flat
               label="Contact"></q-btn>
        <q-btn v-if="$lisEmpty($authUser)" @click="clickers('login')" :style="btnStyle" :size="btnSz" icon="mdi-finance"
               color="primary" rounded push label="Login"></q-btn>
        <q-btn v-if="!$lisEmpty($authUser)" @click="clickers('logout')" :style="btnStyle" :size="btnSz"
               icon="mdi-finance"
               color="primary" rounded push label="Logout"></q-btn>
      </template>
      <template v-else>
        <q-btn flat color="primary" icon="mdi-menu">
          <q-menu>
            <q-list>
              <q-item v-for="item in [ 'about', 'results', 'contact', `${$lisEmpty($authUser) ? 'login' : 'logout'}`]"
                      :key="item" clickable
                      @click="clickers(item)">
                <q-item-section>
                  <q-item-label header class="text-uppercase">{{ item }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </template>

  </div>
</template>

<script>

  import RandomAvatar from 'components/profile/RandomAvatar/RandomAvatar';
  import Settings from 'components/settings/settings';
  import Notifications from 'components/notifications/Notifications';
  // import UserInfo from 'components/user/userInfo.vue';

  export default {
    components: {
      Settings,
      // UserInfo,
      Notifications,
      RandomAvatar,
    },
    name: 'HeaderNav',
    props: {
      dark: {
        type: Boolean,
        default() {
          return false;
        }
      },
    },
    data() {
      return {
        scrollY: 0,
        btnStyle: 'transition: all .3s ease-out',
        searchQuery: '',
        showSearchToolbar: false,
        userInfoOpen: false,
        settingsOpen: false,
        messagesOpen: false,
        menuMini: false,
        menuAutoExpand: false,
      };
    },
    computed: {
      btnSz() {
        return this.scrollY > 100 ? 'sm' : 'md';
      },
      smallScreen() {
        return ['xs'].includes(this.$q.screen.name);
      },
      loginAccountData() {
        return {
          accounts: this.$lget(this.$store.state, 'auth.accounts', []),
          activeAccount: this.$lget(this.$store.getters, 'auth/activeAccount', undefined)
        };
      },
    },
    watch: {
      menuMini: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal) {
          if (!this.$lisNil(newVal) && newVal !== oldVal) {
            this.$emit('menuMini', newVal);
          }
        },
      },
      menuAutoExpand: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal) {
          if (!this.$lisNil(newVal) && newVal !== oldVal) {
            this.$emit('menuAutoExpand', newVal);
          }
        },
      },
    },
    methods: {
      clickers(val) {
        const events = {
          contact: () => window.scrollTo({
            top: document.getElementById('page-Contact').offsetTop,
            behavior: 'smooth',
          }),
          results: () => {
            window.scrollTo({
              top: document.getElementById('page-Sparks').offsetTop,
              behavior: 'smooth',
            });
          },
          about: () => {
            window.scrollTo({
              top: document.getElementById('page-Services').offsetTop,
              behavior: 'smooth',
            });
          },
          login: () => {
            this.$routerPreserve({name: 'login'});
          },
          logout: () => {
            this.$routerPreserve({name: 'logout'});
          },
        };
        events[val]();
      },
    },
  };
</script>

<style scoped lang="scss">
  #header-nav {

  }
  .menu-content {

  }

</style>
