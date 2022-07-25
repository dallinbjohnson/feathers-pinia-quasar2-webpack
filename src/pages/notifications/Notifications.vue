<template>
  <q-page id="Notifications" class="q-mx-sm-md flex flex-center">
    <drawered-cards title="Notifications">
      <template v-slot:leftDrawer>
        <q-list bordered padding class="q-pa-sm rounded-borders text-primary">
          <q-item clickable
                  v-ripple
                  :active="link === 'unread'"
                  @click="link = 'unread'"
                  active-class="my-menu-link"
                  style="border-radius: 2em;">
            <q-item-section avatar>
              <q-icon name="fas fa-envelope"/>
            </q-item-section>

            <q-item-section>Unread</q-item-section>
          </q-item>

          <q-item clickable
                  v-ripple
                  :active="link === 'all'"
                  @click="link = 'all'"
                  active-class="my-menu-link">
            <q-item-section avatar>
              <q-icon name="fas fa-inbox"/>
            </q-item-section>

            <q-item-section>All</q-item-section>
          </q-item>

          <q-item clickable
                  v-ripple
                  :active="link === 'trash'"
                  @click="link = 'trash'"
                  active-class="my-menu-link">
            <q-item-section avatar>
              <q-icon name="fas fa-trash-alt"/>
            </q-item-section>

            <q-item-section>Trash</q-item-section>
          </q-item>
        </q-list>
      </template>

      <q-list bordered class="rounded-borders">
        <q-item>
          <q-toolbar>
            <q-select borderless v-model="model" :options="options">
              <q-checkbox v-model="checkAll"/>
            </q-select>
            <q-space/>
            <div class="text-h4 text-uppercase">{{ link }}</div>
            <q-space/>
            <q-btn flat round dense icon="more_vert"/>
          </q-toolbar>
        </q-item>


        <template v-if="link === 'unread'">
          <q-item :active="check1 === true" active-class="active-notification-selected" class="notification-unread" clickable>
            <q-item-section side top>
              <q-checkbox v-model="check1"/>
            </q-item-section>

            <q-item-section avatar top>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar2.jpg">
              </q-avatar>
            </q-item-section>

            <q-item-section top class="col-2 gt-sm">
              <q-item-label class="q-mt-sm">Janet Smith</q-item-label>
              <q-item-label caption lines="1">24 min ago</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium" lines="1">Lunch this week?</q-item-label>
              <q-item-label caption lines="2">
                <span class="text-weight-bold">IonRev Development Team</span>
                -- I'll be in your neighborhood doing errands this week. Do you want me to bring you some lunch?
              </q-item-label>
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="delete"/>
                <q-btn class="gt-xs" size="12px" flat dense round icon="done"/>
                <q-btn size="12px" flat dense round icon="more_vert"/>
              </div>
            </q-item-section>
          </q-item>

          <q-separator spaced/>

          <q-item clickable>
            <q-item-section side top>
              <q-checkbox v-model="check2"/>
            </q-item-section>

            <q-item-section avatar top>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar4.jpg">
              </q-avatar>
            </q-item-section>

            <q-item-section top class="col-2 gt-sm">
              <q-item-label class="q-mt-sm">John Doe</q-item-label>
              <q-item-label caption lines="1">
                <!--              <span>john.doe@example.org</span>-->

                <!--              <svg class="q-mx-sm" xmlns="http://www.w3.org/2000/svg" width="4" height="8" viewBox="0 0 4 4">-->
                <!--                <path id="dot" d="M2,0A2,2,0,1,1,0,2,2,2,0,0,1,2,0Z" fill="#a5a5a5"/>-->
                <!--              </svg>-->

                <span>Yesterday, at 11:24 AM</span>
              </q-item-label>
            </q-item-section>

            <q-item-section top>
              <q-item-label lines="1">
                <span class="text-weight-medium" lines="1">Dont forget to save your work after 10 min</span>
              </q-item-label>
              <q-item-label caption lines="2">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid, et, ut? Accusamus at beatae
                blanditiis
                cupiditate dolor dolorum eligendi, impedit, minus modi mollitia perferendis placeat provident quam, quis
                similique temporibus.
              </q-item-label>
            </q-item-section>

            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn class="gt-xs" size="12px" flat dense round icon="delete"/>
                <q-btn class="gt-xs" size="12px" flat dense round icon="done"/>
                <q-btn size="12px" flat dense round icon="more_vert"/>
              </div>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </drawered-cards>
  </q-page>
</template>

<script>
  import DraweredCards from 'components/common/atoms/layouts/draweredCards/draweredCards';

  const contacts = [{
    id: 1,
    name: 'Ruddy Jedrzej',
    email: 'rjedrzej0@discuz.net',
    avatar: 'avatar1.jpg',
  }, {
    id: 2,
    name: 'Mallorie Alessandrini',
    email: 'malessandrini1@marketwatch.com',
    letter: 'M',
  }, {
    id: 3,
    name: 'Elisabetta Wicklen',
    email: 'ewicklen2@microsoft.com',
    avatar: 'avatar5.jpg',
  }, {
    id: 4,
    name: 'Seka Fawdrey',
    email: 'sfawdrey3@wired.com',
    letter: 'S',
  }];

  const offline = [{
    id: 5,
    name: 'Janet Smith',
    email: 'janet@smith.com',
    avatar: 'avatar2.jpg',
  }, {
    id: 6,
    name: 'Winfield Stapforth',
    email: 'wstapforth5@pcworld.com',
    avatar: 'avatar6.jpg',
  }, {
    id: 7,
    name: 'John Doe',
    email: 'john.doe@example.org',
    avatar: 'avatar4.jpg',
  }];

  export default {
    name: 'Notifications',
    components: {DraweredCards},
    data() {
      return {
        link: 'unread',
        checkAll: false,
        check1: false,
        check2: false,
        model: null,
        options: [],
        contacts,
        offline,
      };
    },
    watch: {
      checkAll(newValue, oldValue) {
        if (newValue && !oldValue) {
          this.check1 = true;
          this.check2 = true;
        }
        if (!newValue && oldValue) {
          this.check1 = false;
          this.check2 = false;
        }
      },
    },
  };
</script>

<style scoped lang="scss" src="./_Notifications.scss">

</style>
