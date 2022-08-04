<template>
  <q-layout view="hHh LpR fff">
    <q-header bordered elevated class="bg-transparent">
      <q-toolbar :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
                 :style="{ height: scrollY > 100 ? '50px' : '80px', transition: 'all .3s ease-out' }">
        <div class="full-width row items-center">
          <q-btn v-if="!$lisEmpty($authUser)" color="primary" dense flat round icon="menu" @click="leftShown = !leftShown"/>

          <q-btn flat padding="0" color="primary" class="q-ml-sm-lg">
              <q-img @click="$router.push({name: 'home'})"
                     :style="{ width: 'clamp(30px, 12vw, 50px)' }"
                     :src="logo"></q-img>
          </q-btn>
          <q-space/>
          <header-nav @menuMini="menuMini = $event" @menuAutoExpand="menuAutoExpand = $event"></header-nav>
        </div>
      </q-toolbar>
    </q-header>

    <menu-drawer v-if="!$lisEmpty($authUser)" v-model="leftShown" v-model:mini="menuMini" :auto-expand="menuAutoExpand">
      <template v-slot:menu>
        <menu-list :menu-items="menuItems"
                   v-on:expansionItemClick="menuMini = false"
                   active-class="text-primary"></menu-list>
      </template>
    </menu-drawer>

    <q-page-container>
      <router-view :key="$route.path"/>
    </q-page-container>

    <q-footer v-if="$lisEmpty($authUser)">
<!--      <contact-footer :contact="contact">-->
<!--        <template v-slot:left>-->
<!--          <div class="row justify-center items-center full-height">-->
<!--            <q-img style="width: 60px;" :src="logo"></q-img>-->
<!--            <div class="text-md text-mb-md text-primary">&nbsp;|&nbsp;<b>BYLD</b> with us today</div>-->
<!--          </div>-->
<!--        </template>-->
<!--      </contact-footer>-->
    </q-footer>
  </q-layout>
</template>

<script>
  /* eslint-disable no-undef */
  import { defineComponent } from 'vue';

  // import ContactFooter from 'components/footers/ContactFooter';
  // import FlipXTransition from 'components/common/transitions/FlipXTransition';
  import headerNav from 'components/headers/headerNav';
  import MenuDrawer from 'components/menus/MenuDrawer.vue';
  import MenuList from 'components/menus/MenuList.vue';

  export default defineComponent({
    name: 'MainLayout',
    components: {
      headerNav,
      // FlipXTransition,
      // ContactFooter,
      MenuDrawer,
      MenuList,
    },
    data() {
      return {
        scrollY: 0,
        leftShown: false,
        menuMini: false,
        menuAutoExpand: false,
      };
    },
    mounted() {
      window.addEventListener('scroll', () => {
        this.scrollY = window.scrollY;
      });
    },
    computed: {
      menuItems() {
        return [
          {
            title: 'Home',
            icon: 'fas fa-home',
            to: {name: 'home'},
          },
          {
            title: 'Websites',
            icon: 'fas fa-sitemap',
            to: {name: 'projects'},
          },
        ];
      },
      contact() {
        return {
          email: 'support@website-builder.com',
          phone: '+18019950674',
        };
      },
      logo_dark() {
        let logo = require('../assets/logos/byld_iconalt_white.png');
        return logo;
      },
      logo() {
        let logo = require('../assets/logos/byld_iconalt.png');
        return logo;
      },
      fullLogo() {
        return require('../assets/logos/bc_full_white.png');
      },
    },
  });
</script>

<style scoped lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,300;1,400&display=swap');

  //body {
  //  background: black;
  //  font-family: 'Poppins', sans-serif;
  //}

  .__logo {
    position: fixed;
    transition: all .3s ease-out;
  }

  .top_logo {
    top: 90px;
    left: 50%;
    transform: translate(-50%, 0);
    //background: var(--q-color-primary);
    //background: rgba(255,255,255,.3);
    border-radius: 10px;
    width: 150px;
    height: 150px;
    //box-shadow: 0px 2px 6px rgba(0,0,0,.2);
    padding-bottom: 10px;
  }

  .sm_logo {
    width: 85px;
  }
</style>
