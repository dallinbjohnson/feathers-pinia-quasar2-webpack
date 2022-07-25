<template>
  <div class="q-pa-none q-ma-none">
    <q-layout view="lHh Lpr lff" container style="min-height:100vh;" class="shadow-2 rounded-borders">
      <q-header class="bg-white">

        <q-toolbar class="col-8 q-pa-lg text-primary">

          <q-toolbar-title>
            <slot name="page-toolbar" v-bind="activeLink">
              <span class="text-h4">
                {{ pageTitle }}
              </span>
            </slot>

          </q-toolbar-title>

          <!--          <div class="text-light text-h6">
                      <q-btn flat label="logout" outline @click="clientLogout"/>
                      <q-avatar>
                        <q-img src="~assets/logo.png"/>
                      </q-avatar>
                      itpomi
                    </div>-->
          <q-btn
            flat
            dense
            icon="menu"
            aria-label="Menu"
            @click="drawer = !drawer"
          />

        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="300"
        :breakpoint="1028"
        content-class="bg-grey-3"
      >
        <q-scroll-area class="fit">
          <q-list padding>
            <q-item class="q-py-md">
              <q-item-section>
                <q-btn no-caps color="primary" outline icon="add" class="column q-gutter-none"
                       @click="activeLink='add'">
                  <span class="q-my-none test-bold">Create a business profile</span>
                </q-btn>
              </q-item-section>
              <q-item-section @click.stop="drawer=false" avatar class="q-mx-md lt-sm">
                <q-icon color="primary" size="md" name="close"/>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input placeholder="Filter Wallets" icon="search"/>
              </q-item-section>
            </q-item>
            <template
              v-for="link in bankLinks"
            >
              <bank-link
                @active="activeLink=$event"
                v-bind="link"
                :key="link.title"
              />
            </template>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page class="q-pa-md column">
          <slot name="content"></slot>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
  // import {models} from '@feathersjs/vuex';
  // import {mapGetters, mapActions} from 'vuex';


  export default {
    name: 'MessageLayout',
    mixins: [

    ],
    data() {
      return {
        drawer: false,
        miniState: false,
        activeLink: 'add',
        bankLinks: [
          {
            icon: 'fas fa-money-check-alt',
            title: 'Wallet Name',
            path: 'wallet',
            caption: '5400 available',
          },
        ],
        activeAccount: undefined,
        // accounts: [],
      };
    },

    computed: {
      pageTitle() {
        const activeTitle = this.bankLinks.find((link) => link.path === this.activeLink);
        if (activeTitle) {
          return activeTitle['title'];
        }
        return '';
      },
      // ...mapGetters('banks', {
      //   getBankFromState: 'get',
      // }),
      // bank() {
      //   const id = this.$route.path.split('/').slice(-1)[0];
      //   return this.getBankFromState(id)|| {};
      // },
    },

    methods: {
      // ...mapActions('accounts', {
      //   findAccounts: 'find',
      // }),
      // async allAccounts() {
      //   try {
      //     const bank = this.$route.path.split('/').slice(-1)[0];
      //     const accountsResponse = await this.findAccounts({
      //       query: {
      //         bank,
      //       },
      //     });
      //     this.accounts = accountsResponse.data;
      //   } catch (e) {
      //     console.log(e);
      //   }
      // },
      navigateAccounts(bankId, accountId) {
        // const id = this.$route.path.split('/').slice(-1)[0];
        // if (id !== accountId) {
        //   this.$router.push(`/banks/${bankId}/accounts/${accountId}`);
        // }
        console.log({bankId, accountId});
      },
    },
  };
</script>
