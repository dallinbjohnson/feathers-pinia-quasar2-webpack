<template>
  <div id="RandomAvatar">
    <q-avatar :size="size">
      <template v-if="defaultToLetter">
        <q-img v-if="$lget(user, 'avatar.raw.file')" :src="$lget(user, 'avatar.raw.file')"/>
        <span :class="['full-width full-height flex justify-center items-center', $q.dark.mode ? 'bg-grey-9' : 'bg-accent']">
          {{ $lget(user, 'name', '').charAt(0) }}
        </span>
      </template>
      <q-img v-else :src="getGenericAvatar"/>
    </q-avatar>
  </div>
</template>

<script>
  // import NavList from 'components/NavList/NavList';
  // import ThemePicker from 'pages/themePicker/themePicker';

  export default {
    name: 'RandomAvatar',
    components: {
      // NavList,
      // ThemePicker,
    },
    props: {
      defaultToLetter: {
        type: Boolean,
        default: true,
      },
      user: {
        type: Object,
        required: false,
        default() {
          return {};
        },
      },
      size: {
        type: String,
        default: '45px',
      },
      logout: {
        type: Function,
        required: false,
      },
      menu: {
        type: Boolean,
        required: false,
        default() {
          return true;
        },
      },
      items: {
        type: Array,
        required: false,
        default(props) {
          return [
            {
              icon: 'fa fa-id-card',
              text: 'Profile',
              dest: '/profile',
              display: props.user,
            },
            {icon: 'fa fa-history', text: 'Requests', dest: '', display: props.user},
            {icon: 'logout', text: 'Logout', dest: '/logout', display: props.user},
          ];
        },
      },
    },
    data() {
      return {
        themeDio: false,
        mobileData: true,
        bluetooth: false,
        rightDrawerOpen: false,
        genericAvatars: [],
      };
    },
    computed: {
      navItems() {
        return [
          {
            // label: 'My Home',
            children: [
              {
                label: 'Profile',
                // icon: '',
                to: {name: 'profile', params: {id: this.$authUser._id}},
              },
              // {
              //   label: 'cards',
              //   // icon: '',
              //   to: {name: 'my-cards'},
              // },
              {
                label: 'Tally',
                // icon: '',
                to: {name: 'tally'},
              },
              {
                label: 'Card Shop',
                // icon: '',
                to: {name: 'profile-cards', params: {id: this.$authUser._id, defaultCategory: 'all'}},
              },
              {
                label: 'Awards',
                // icon: '',
                to: {name: 'awards'},
              },
              {
                label: 'Account',
                // icon: '',
                to: {name: 'account'},
              },
              {
                label: 'Preferences',
                // icon: '',
                to: {name: 'preferences'},
              },
              {
                label: 'Sign Out',
                // icon: '',
                to: {name: 'logout'},
              },
              // {
              //   label: 'Breaks',
              //   // icon: '',
              //   to: {name: 'my-breaks'},
              // },
              // {
              //   label: 'Cards',
              //   // icon: '',
              //   to: {name: 'my-cards'},
              // },
              // {
              //   label: 'Tiers',
              //   // icon: '',
              //   to: {name: 'my-tiers'},
              // },
              // {
              //   label: 'Auctions',
              //   // icon: 'fas fa-store',
              //   to: {name: 'my-auctions'},
              // },
            ],
          },
        ];
      },
      getGenericAvatar() {
        let avatar = this.$lget(this.user, 'avatar.raw.file');
        if (avatar) return avatar;
        // eslint-disable-next-line no-undef
        this.importAllGenericAvatar(require.context('src/assets/avatars/', true, /\.png$/));
        return this.genericAvatars[Math.floor(Math.random() * this.genericAvatars.length)].pathLong;
      },
    },
    methods: {
      importAllGenericAvatar(r) {
        r.keys().forEach(key => (
          this.genericAvatars.push(
            {
              pathLong: r(key),
              pathShort: key,
            })
        ));
      },
      handleDarkModeToggle(val) {
        if (typeof val === 'boolean') {
          this.$q.dark.set(val);
          if (this.user) {
            let payload = {
              'theme.darkMode': val,
            };
            this.user.patch({data: payload})
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
    },
  };
</script>

<style scoped lang="scss" src="./_RandomAvatar.scss">

</style>
