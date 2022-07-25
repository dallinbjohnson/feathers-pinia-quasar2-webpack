<template>
  <div
    :class="hover ? {'AccountCardOld': true, 'hover-on-desktop': $q.platform.is.desktop} : {'AccountCardOld': true}">
    <!--    Above class could probably be written better-->
    <q-card :square="square" class="main-card"
            :style="{backgroundImage: `url(${$lget(account, 'banner.raw.file', '')})`, ...cardCssVars}">
      <q-avatar class="profile-pic bg-secondary">
        <img v-if="$lget(account, 'avatar.raw.file')" :src="$lget(account, 'avatar.raw.file')">
      </q-avatar>
      <div class="flex items-center">
        <h3 class="account-name q-ma-none q-mb-sm ellipsis text-white q-pr-xs"
            style="flex: 1; text-shadow: 1px 1px 3px black">{{ $lget(account, 'name', 'No Name Found') }}</h3>
        <q-btn
          flat
          dense
          class="q-mx-md text-white"
          style="text-shadow: 1px 1px 3px black"
          @click="openDialog">
          <span class="edit-label">edit account</span>
          <q-icon name="edit" style="margin-left: 5px"/>
        </q-btn>
      </div>
      <q-btn-dropdown v-if="$q.screen.lt.sm"
                      color="primary"
                      :label="tab ? tab.split('-').join(' ') : 'Account Settings'">
        <q-tabs class="bg-primary text-white"
                v-model="tab"
                align="left"
                vertical
                switch-indicator
                inline-label>
          <q-tab name="addresses" v-close-popup @click="tabClick('addresses')">
            <q-icon class="q-mr-sm" name="fas fa-location-arrow"/>
            <span>Addresses</span>
          </q-tab>
          <q-tab name="social-links" v-close-popup @click="tabClick('social-links')">
            <q-icon class="q-mr-sm" name="fab fa-instagram"/>
            <span>Social Links</span>
          </q-tab>
          <q-tab name="my-wallet" v-close-popup @click="tabClick('my-wallet')">
            <q-icon class="q-mr-sm" name="fas fa-wallet"/>
            <span>My Wallets</span>
          </q-tab>
          <q-tab name="phone-numbers" v-close-popup @click="tabClick('phone-numbers')">
            <q-icon class="q-mr-sm" name="fas fa-phone-alt"/>
            <span>Phone Numbers</span>
          </q-tab>
          <q-tab name="accounts" v-close-popup @click="tabClick('accounts')">
            <q-icon class="q-mr-sm" name="mdi-account-circle"/>
            <span>Accounts</span>
          </q-tab>
          <q-tab name="qb_connections" v-close-popup @click="tabClick('qb_connections')">
            <q-icon class="q-mr-sm" name="fas fa-file-invoice"/>
            <span>Quickbook Connections</span>
          </q-tab>
        </q-tabs>
      </q-btn-dropdown>
      <q-tabs v-else
              class="bottom-bar bg-primary text-white"
              v-model="tab"
              align="left"
              inline-label>
        <q-tab name="addresses" @click="tabClick('addresses')">
          <q-icon size="xs" class="tab-icon" name="sp:location_icon"/>
          <span class="tab-label">Addresses</span>
        </q-tab>
        <q-tab name="social-links" @click="tabClick('social-links')">
          <q-icon size="xs" class="tab-icon" name="sp:socialLinks"/>
          <span class="tab-label">Social Links</span>
        </q-tab>
        <q-tab name="my-wallet" @click="tabClick('my-wallet')">
          <q-icon size="xs" class="tab-icon" name="sp:walletIcon_1"/>
          <span class="tab-label">My Wallets</span>
        </q-tab>
        <q-tab name="phone-numbers" @click="tabClick('phone-numbers')">
          <q-icon size="xs" class="tab-icon" name="fas fa-phone-alt"/>
          <span class="tab-label">Phone Numbers</span>
        </q-tab>
        <q-tab name="accounts" @click="tabClick('accounts')">
          <q-icon size="sm" class="tab-icon" name="sp:personIcon_1"/>
          <span class="tab-label">Accounts</span>
        </q-tab>
        <q-tab name="qb_connections" @click="tabClick('qb_connections')">
<!--          <q-icon size="xs" class="tab-icon" :name="`img:${require('@iy4u/common-client-lib/src/assets/icons/svg/quickBooksIcon.svg')}`"/>-->
          <q-icon size="xs" class="tab-icon" name="sp:quickBooksIcon"/>
          <span class="tab-label">Quickbook Connections</span>
        </q-tab>
      </q-tabs>
    </q-card>
    <q-slide-transition>
      <div v-show="tab !== null">
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel class="q-px-none" name="addresses">
            <div style="text-align: center; font-size: 2.1em;">Addresses</div>
            <my-addresses :value="value"/>
          </q-tab-panel>

          <q-tab-panel name="social-links">
            <div style="text-align: center; font-size: 2.1em;">Social Links</div>
            <social-links :value="value"/>
          </q-tab-panel>

          <q-tab-panel name="my-wallet">
            <div style="text-align: center; font-size: 2.1em;">My Wallets</div>
            <my-wallets :value="value"/>
          </q-tab-panel>

          <q-tab-panel name="phone-numbers">
            <div class="text-h6">Phone Numbers</div>
            <account-phones :value="value"/>
          </q-tab-panel>

          <q-tab-panel name="accounts">
            <div :style="{display: 'flex', 'flex-wrap': 'wrap', 'flex-direction': $q.screen.lt.sm ? 'column' : undefined}">
              <div style="flex: 1;">
                <div style="text-align: center; font-size: 2.1em;">Owners</div>
                <owners :value="value"/>
              </div>

              <div class="q-px-md">
                <q-separator vertical style="height: 100%;" />
              </div>

              <div style="flex: 1;">
                <div style="text-align: center; font-size: 2.1em;">Members</div>
                <members :value="value"/>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="qb_connections">
            <div style="text-align: center; font-size: 2.1em;">Quickbook Connections</div>
            <my-companies-list :value="value"/>
          </q-tab-panel>
        </q-tab-panels>

      </div>
    </q-slide-transition>

    <q-dialog v-model="editAccountDio">
      <q-card style="min-width: 30vw; padding: 10px; border-top: 25px solid var(--q-color-primary)">
        <q-card-section>
          <form-generator v-model="formData" :fields="fields" useQform v-model:valid="valid"></form-generator>
          <p class="q-ma-none text-caption" style="opacity: 0.7">
            {{ $lget(formData, 'account.description') ? $lget(formData, 'account.description').length : 0 }}/255
          </p>
        </q-card-section>
        <q-card-actions align="right" class="q-mt-md">
          <q-btn label="Cancel" v-close-popup color="red"/>
          <q-btn label="Save Account"
                 :disable="!valid"
                 v-close-popup
                 color="primary"
                 @click="saveAccount"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import MyAddresses from 'components/profile/ProfileOld/MyAddresses';
  import SocialLinks from 'components/profile/ProfileOld/SocialLinks';
  import AccountPhones from 'components/profile/ProfileOld/AccountPhones';
  // import ProfilePhone from 'components/profile/ProfilePhone';
  import Members from 'components/profile/ProfileOld/Members';
  import Owners from 'components/profile/ProfileOld/Owners';
  import MyWallets from '@iy4u/common-client-lib/src/components/banks/MyWalletsOld';

  import MyCompaniesList from 'components/profile/ProfileOld/MyCompaniesOld/MyCompaniesList';
  import {routerMixin} from '@iy4u/common-client-lib';
  import {models} from '@feathersjs/vuex';

  export default {
    name: 'AccountCardOld',
    components: {
      Owners,
      MyWallets,
      MyAddresses,
      SocialLinks,
      AccountPhones,
      MyCompaniesList,
      Members,
    },
    props: {
      value: {
        type: Object,
        required: true,
      },
      hover: {
        type: Boolean,
        required: false,
        default: false,
      },
      square: {
        type: Boolean,
        default: false,
      },
      routerMixinRun: {
        type: Boolean,
        default: false,
      },
    },
    mixins: [
      routerMixin({
        name: 'AccountCard',
        runWhen() {
          return this.routerMixinRun;
        },
        query() {
          return {
            tab: this.tab,
          };
        },
      }),
    ],
    data() {
      return {
        tab: null,
        editAccountDio: false,
        formData: {
          account: new models.api.Accounts().clone(),
        },
        valid: false,
      };
    },

    computed: {
      cardCssVars() {
        return {
          '--card-bg-color': this.$q.dark.mode ? '#2f2f2f' : 'var(--q-color-accent)'
        };
      },
      account() {
        return this.$lget(this.value, 'account', {});
      },

      fields() {
        return [
          {
            fieldType: 'ImageSelect',
            path: 'account.avatar',
            attrs: {
              stylePanelLayout: null,
            },
            'label-attrs': {
              'v-text': 'Account Avatar',
              style: 'font-size: 20px; margin-top: -5px',
            },
            'div-attrs': {
              class: 'col-6',
            },
          },
          {
            fieldType: 'ImageSelect',
            path: 'account.banner',
            attrs: {
              stylePanelLayout: null,
              imageCropAspectRatio: '3:1',
            },
            'label-attrs': {
              'v-text': 'Account Banner',
              style: 'font-size: 20px; margin-top: -5px',
            },
            'div-attrs': {
              class: 'col-6',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'account.name',
            attrs: {
              label: 'Name',
              type: 'text',
              filled: true,
              'bg-color': 'secondary',
              'label-color': 'white',
              color: 'accent',
              clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'account.description',
            attrs: {
              label: 'Description',
              type: 'textarea',
              filled: true,
              'bg-color': 'secondary',
              'label-color': 'white',
              color: 'accent',
              clearable: true,
              'clear-icon': 'close',
              maxlength: 255,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ];
      },
    },
    methods: {
      tabClick(tab) {
        if (tab === this.tab) {
          this.tab = null;
        }
      },
      openDialog() {
        this.$lset(this.formData, 'account', this.account);
        this.editAccountDio = true;
      },

      async saveAccount() {
        if (this.formData.account && Object.keys(this.formData.account).length) {
          try {
            this.$lset(this.formData, 'account.avatar', this.$lget(this.formData, 'account.avatar.0', null));
            this.$lset(this.formData, 'account.banner', this.$lget(this.formData, 'account.banner.0', null));
            this.$lset(this.formData, 'account.email', this.$authUser.email); // could be a problem if users can edit other user's accounts
            this.$lget(this.formData, 'account.logins.ownedBy', []).push(this.$activeLogin._id);
            let account = await this.formData.account.save({
              data: {
                name: this.$lget(this.formData, 'account.name'),
                description: this.$lget(this.formData, 'account.description'),
                avatar: this.$lget(this.formData, 'account.avatar'),
                banner: this.$lget(this.formData, 'account.banner'),
                email: this.$lget(this.formData, 'account.email'),
                logins: this.$lget(this.formData, 'account.logins'),
              },
              userJoin: true,
            });
            this.formData = {
              account: new models.api.Accounts().clone(),
            };
            this.newAccountDio = false;
            // this.accountsRefresh;

            this.$q.notify({
              type: 'positive',
              message: `Successfully Saved "${account.name}"`,
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          } catch (err) {
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
          }
        }
      },
    },
  };
</script>

<style scoped lang="scss" src="_AccountCard.old.scss">

</style>
