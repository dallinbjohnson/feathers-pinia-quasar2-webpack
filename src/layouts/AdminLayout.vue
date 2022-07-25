<template>
  <q-layout view="hHh LpR fFf">
    <q-header class="text-grey-4 db-toolbar" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="leftShown = !leftShown"/>

        <q-btn flat
               :dense="smallScreen"
               :icon="`img:${require('../assets/logos/byld_iconalt_white.png')}`"
               to="/admin"/>

        <q-toolbar-title v-if="!smallScreen" style="padding-left: 4px;">
          <q-btn flat label="Admin" to="/admin"/>
          <q-btn flat label="Main Site" :to="{name: 'home'}"/>
        </q-toolbar-title>

        <q-space></q-space>


        <header-nav :dark="!$q.dark.isActive" @menuMini="menuMini = $event" @menuAutoExpand="menuAutoExpand = $event"></header-nav>

      </q-toolbar>
<!--      <q-toolbar v-if="smallScreen && showSearchToolbar">-->
<!--        <q-input :dark="true" v-model="searchQuery" debounce="500" dense filled placeholder="Search" clearable-->
<!--                 class="full-width">-->
<!--          <template v-slot:prepend>-->
<!--            <q-icon name="search"/>-->
<!--          </template>-->
<!--        </q-input>-->
<!--      </q-toolbar>-->
    </q-header>

    <menu-drawer v-model="leftShown" v-model:mini="menuMini" :auto-expand="menuAutoExpand">
      <template v-slot:menu>
        <menu-list :menu-items="menuItems"
                   v-on:expansionItemClick="menuMini = false"
                   active-class="text-primary"></menu-list>
      </template>
    </menu-drawer>

    <q-page-container>
      <transition :name="transitionName">
        <router-view :key="$route.fullPath"/>
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
  import MenuDrawer from 'components/menus/MenuDrawer.vue';
  import MenuList from 'components/menus/MenuList.vue';
  import HeaderNav from 'components/headers/headerNav';

  export default {
    name: 'MainLayout',
    components: {
      HeaderNav,
      MenuDrawer,
      MenuList,
    },
    props: {
      menuItems: {
        type: Array,
        default: () => [],
      },
      defaultRoute: {
        type: Object,
      },
    },
    data() {
      return {
        leftShown: true,
        transitionName: '',
        menuMini: false,
        menuAutoExpand: false,
      };
    },
    watch: {
      $route: {
        immediate: true,
        deep: true,
        handler(to) {
          if (to.path === '/admin' || to.path === '/admin/') this.$router.push(this.defaultRoute);
        },
      },
    },
    computed: {
      smallScreen() {
        return ['xs', 'sm'].includes(this.$q.screen.name);
      },
    },
  };
</script>

<style scoped lang="scss">
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
