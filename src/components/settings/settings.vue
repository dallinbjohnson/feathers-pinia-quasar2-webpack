<template>
  <div style="max-width: 350px">
    <q-bar class="bg-none">
      Settings
      <q-space/>
      <q-btn dense flat round icon="close" @click="onClose"/>
    </q-bar>

    <div class="q-pa-md">
      <q-list padding>
        <!--<q-item tag="label" v-ripple>
          <q-item-section side top>
            <q-checkbox v-model="check1" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Notifications</q-item-label>
            <q-item-label caption>
              Notify me about updates to apps or games that I downloaded
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section side top>
            <q-checkbox v-model="check2" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Sound</q-item-label>
            <q-item-label caption>
              Auto-update apps at anytime. Data charges may apply
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section side top>
            <q-checkbox v-model="check3" />
          </q-item-section>

          <q-item-section>
            <q-item-label>Auto-add widgets</q-item-label>
            <q-item-label caption>
              Automatically add home screen widgets
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item-label header>Notifications</q-item-label>
        -->

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Dark Mode</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle :value="$q.dark.mode"
                      @input="handleDarkModeToggle"
                      icon="brightness_medium"/>
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Minimize Menu</q-item-label>
            <q-item-label caption>Minimize menu sidebar</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle v-model="menuMini" icon="menu"/>
          </q-item-section>
        </q-item>

        <q-item tag="label" v-ripple>
          <q-item-section>
            <q-item-label>Auto-Expand Menu</q-item-label>
            <q-item-label caption>Auto-expand menu when hovering</q-item-label>
          </q-item-section>
          <q-item-section side top>
            <q-toggle v-model="menuAutoExpand" icon="menu"/>
          </q-item-section>
        </q-item>

        <q-separator spaced/>
        <q-item-label header>Other settings</q-item-label>

        <q-item>
          <q-item-section side>
            <q-icon color="teal" name="volume_down"/>
          </q-item-section>
          <q-item-section>
            <q-slider v-model="volume" :min="0" :max="100" label color="teal"/>
          </q-item-section>
          <q-item-section side>
            <q-icon color="teal" name="volume_up"/>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <q-icon color="deep-orange" name="brightness_medium"/>
          </q-item-section>
          <q-item-section>
            <q-slider v-model="brightness" :min="0" :max="10" label color="deep-orange"/>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section side>
            <q-icon color="primary" name="mic"/>
          </q-item-section>
          <q-item-section>
            <q-slider v-model="mic" :min="0" :max="50" label/>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>


  export default {
    name: 'Settings',
    props: {
      mini: {
        type: Boolean,
      },
      autoExpand: {
        type: Boolean,
      },
    },
    data() {
      return {
        dark: false,
        dashboardColorScheme: 'dashboardColorScheme',


        schemeSelectorShown: false,
        colorSchemaOptions: ['default', 'Grafana', 'Tableau', 'Diverging', 'Categorical', 'Warm', 'Cool', 'Calm', 'Fancy', 'Colorblind Friendly'],

        lightColors: [],
        darkColors: [],

        check1: true,
        check2: false,
        check3: false,

        notif1: true,
        notif2: true,
        notif3: false,
      };
    },
    computed: {
      menuMini: {
        get() {
          return this.mini;
        },
        set(val) {
          this.$emit('update:mini', val);
        }
      },
      menuAutoExpand: {
        get() {
          return this.autoExpand;
        },
        set(val) {
          this.$emit('update:autoExpand', val);
        }
      },
      volume: {
        get() {
          return 12;
        },
        set(val) {
          console.log('volume:', val);
        }
      },
      brightness: {
        get() {
          return 3;
        },
        set(val) {
          console.log('brightness:', val);
        }
      },
      mic: {
        get() {
          return 8;
        },
        set(val) {
          console.log('mic:', val);
        }
      },
    },
    methods: {
      handleDarkModeToggle(val) {
        if (typeof val === 'boolean') {
          this.$q.dark.set(val);
          if (this.$authUser) {
            let payload = {
              'settings.theme.darkMode': val,
            };
            this.$authUser.patch({data: payload})
              .then(res => {
                this.$q.notify({
                  type: 'positive',
                  message: `Successfully Updated "${res.email}" Dark Mode theme`,
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
          }
        }
      },
      onClose() {
        this.$emit('close');
      },
    },
  };
</script>
