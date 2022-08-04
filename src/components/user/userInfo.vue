<template>
  <div id="user-info" :style="$q.screen.lt.sm ? 'width: 70vw;' : $q.screen.lt.md ? 'width: 45vw;' : 'width: 27vw;'">
    <q-list :style="$q.screen.lt.sm ? 'width: 70vw;' : $q.screen.lt.md ? 'width: 45vw;' : 'width: 27vw;'">
      <q-card v-if="$q.screen.gt.xs" class="my-card shadow-0" :style="{borderRadius: 'none'}">
        <q-img style="max-height: 120px;" :src="$lget(activeAccount, 'banner.raw.file', '')"/>

        <q-card-section class="q-pt-xs">
          <random-avatar
            size="xl"
            class="absolute shadow-1"
            style="top: 0; right: 12px; transform: translateY(-50%); background-color: #eeeeee; border-radius: 50%;"
            :user="activeAccount"
            :menu="false"></random-avatar>

          <div class="row no-wrap items-center">
            <div class="col text-grey text-caption">
              {{ $lget(activeAccount, 'email', '') }}
            </div>
          </div>
          <div class="row no-wrap items-center">
            <div class="col text-h5 ellipsis">
              {{ $lget(activeAccount, 'name', '') }}
            </div>
            <div class="col-auto text-positive text-caption row no-wrap items-center">
              <q-icon class="q-px-xs" name="check"/>
              <span class="text-positive">Active</span>
            </div>
          </div>

        </q-card-section>
      </q-card>

      <q-separator v-if="$q.screen.gt.xs"/>

      <div class="q-px-md text-overline">Links</div>
      <q-item v-if="(!$lisEmpty($authUser) && this.$can('route', 'admin'))" class="q-py-xs q-px-md" clickable v-ripple
              v-close-popup :to="{path: '/admin'}">
        <q-item-section v-if="$q.screen.gt.xs" avatar>
          <q-icon name="fas fa-users-cog"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">
            Admin
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-py-xs q-px-md" clickable v-ripple v-close-popup :to="{path: '/my-account'}">
        <q-item-section v-if="$q.screen.gt.xs" avatar>
          <q-icon name="mdi-account"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">
            My Account
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-py-xs q-px-md" clickable v-ripple v-close-popup :to="{name: 'messages'}">
        <q-item-section v-if="$q.screen.gt.xs" avatar>
          <q-icon name="email"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">
            Messages
          </q-item-label>
        </q-item-section>
        <q-item-section side>
<!--          <q-badge v-if="$lget(activeAccount, 'stats.messageCount')"-->
<!--                   color="red"-->
<!--                   :label="$lget(activeAccount, 'stats.messageCount')"/>-->
          <q-badge v-if="$lget(activeAccount, 'unseenMessages', []).length"
                   color="red"
                   :label="$lget(activeAccount, 'unseenMessages', []).length"/>
        </q-item-section>
      </q-item>

      <q-item class="q-py-xs q-px-md" clickable v-ripple v-close-popup :to="{name: 'chats'}">
        <q-item-section v-if="$q.screen.gt.xs" avatar>
          <q-icon name="fas fa-comments"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">
            Chats
          </q-item-label>
        </q-item-section>
        <q-item-section side>
<!--          <q-badge v-if="$lget(activeAccount, 'stats.chatCount')"-->
<!--                   color="red"-->
<!--                   :label="$lget(activeAccount, 'stats.chatCount')"/>-->
          <q-badge v-if="$lget(activeAccount, 'unseenChats', []).length"
                   color="red"
                   :label="$lget(activeAccount, 'unseenChats', []).length"/>
        </q-item-section>
      </q-item>

      <q-item class="q-py-xs q-px-md" clickable v-ripple v-close-popup :to="{name: 'boards'}">
        <q-item-section v-if="$q.screen.gt.xs" avatar>
          <q-icon name="task"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">
            Tasks
          </q-item-label>
        </q-item-section>
        <q-item-section side>
<!--          <q-badge v-if="$lget(activeAccount, 'stats.taskCount')"-->
<!--                   color="red"-->
<!--                   :label="$lget(activeAccount, 'stats.taskCount')"/>-->
          <q-badge v-if="$lget(activeAccount, 'unseenTasks', []).length"
                   color="red"
                   :label="$lget(activeAccount, 'unseenTasks', []).length"/>
        </q-item-section>
      </q-item>

      <q-separator/>

      <div class="q-px-md text-overline">Other Accounts</div>
      <q-item class="q-py-xs"
              v-for="(inactiveAccount, index) in inactiveAccounts"
              :key="index"
              @click="switchAccount(inactiveAccount)"
              clickable
              v-ripple>
        <q-item-section class="q-mx-sm q-px-md flex" flat style="width: 100%;">
          <div class="text-h6" style="display: flex; align-items: center;">
            {{ $lget(inactiveAccount, 'name', '') }}
          </div>
        </q-item-section>
        <q-item-section avatar>
          <random-avatar
            size="xl"
            :user="inactiveAccount"
            :menu="false"></random-avatar>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>
          <q-btn @click="manageAccounts = true">Manage Accounts</q-btn>
        </q-item-section>
      </q-item>

      <q-separator spaced/>

      <q-item class="q-py-xs q-px-md" clickable v-ripple v-close-popup>
        <q-item-section v-if="$q.screen.gt.xs" avatar>
          <q-icon name="mdi-help-box"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">
            Help
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple v-close-popup @click="$router.push({name: 'changePassword'})">
        <q-item-section avatar>
          <q-icon name="mdi-form-textbox-password"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">
            Manage Password
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item class="q-py-xs q-px-md" clickable v-ripple v-close-popup @click="$router.push({name: 'logout'})">
        <q-item-section v-if="$q.screen.gt.xs" avatar>
          <q-icon name="mdi-logout"></q-icon>
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">
            Log Out
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="manageAccounts"
              :maximized="$q.screen.lt.sm"
              full-height
              full-width
              transition-show="rotate"
              transition-hide="rotate">
      <q-card>
        <q-toolbar>

          <q-toolbar-title><span class="text-weight-bold">Manage Accounts</span></q-toolbar-title>

          <q-btn flat round dense icon="close" v-close-popup/>
        </q-toolbar>
          <my-accounts></my-accounts>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import RandomAvatar from 'components/profile/RandomAvatar/RandomAvatar';
  import {mapGetters} from 'vuex';
  import MyAccounts from '../profile/MyAccounts';

  export default {
    name: 'UserInfo',
    components: {
      MyAccounts,
      RandomAvatar,
    },
    props: {
      data: {
        type: Object,
      },
    },
    data() {
      return {
        manageAccounts: false,
        user: null,
        oldUser: null,
      };
    },
    watch: {
      isPatchLogins(newVal) {
        this.$isLoading(newVal);
      },
    },
    computed: {
      ...mapGetters('logins', {
        isPatchLoginsPendingById: 'isPatchPendingById',
      }),
      isPatchLogins() {
        return this.isPatchLoginsPendingById(this.$lget(this.$store.getters['auth/activeLogin'], '_id'));
      },
      accounts() {
        return this.$lget(this.data, 'accounts', []).map(account => account.clone());
      },
      activeAccount() {
        let active = this.$lget(this.data, 'activeAccount', undefined);
        return active ? active.clone() : active;
      },
      inactiveAccounts() {
        const self = this;
        return this.accounts.filter(function (account) {
          return account._id !== self.$lget(self, 'activeAccount._id', 'activeAccount');
        });
      },
    },
    methods: {
      switchAccount(acct) {
        let newAccount = {
          'accounts.owns.active': acct._id,
        };
        this.oldUser = Object.assign({}, this.$authUser);
        this.$store.getters['auth/activeLogin'].patch({
          data: newAccount,
          loginsResolversQuery: {
            accounts: true,
          },
        })
          .then(() => {
            // TODO: this commit needs to be rethought.
            this.$store.commit('auth/setActiveAccount', acct);
            this.$q.notify({
              type: 'positive',
              message: `Successfully switch account to "${acct.name}"`,
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          })
          .catch(err => {
            this.$q.notify({
              type: 'negative',
              message: err.message,
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          });
      },
    },
  };
</script>

<style scoped lang="scss">
  #user-info {
  }
</style>
