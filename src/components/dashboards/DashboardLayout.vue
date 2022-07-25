<template>
  <div class="q-pa-none q-ma-none">
    <q-layout view="lHh Lpr lff" container :style="{'min-height': 'calc(100vh - 81px)', ...layoutStyles}"
              class="rounded-borders">
      <q-header :class="$q.dark.mode ? 'bg-dark' : 'bg-white'">

        <q-toolbar class="col-8 q-pa-lg text-primary">

          <q-toolbar-title>
            <slot name="page-toolbar" v-bind="activeLink">
              <span class="text-h4">
                {{ pageTitle }}
              </span>
            </slot>

          </q-toolbar-title>

          <slot name="close-drawer-btn">
            <q-btn
              flat
              dense
              icon="menu"
              aria-label="Menu"
              @click="drawer = !drawer"
            />
          </slot>

        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above
        :width="300"
        :breakpoint="1028"
        :content-class="$q.dark.mode ? 'bg-black-7':'bg-grey-3'"
      >
        <q-scroll-area class="fit">
          <q-list>
            <q-item class="q-py-md">
              <q-item-section>
                <slot name="side-menu-top" @active="clicked">

                </slot>
              </q-item-section>
              <q-item-section @click.stop="drawer=false" avatar class="q-mx-md lt-sm">
                <q-icon color="primary" size="md" name="close" />
              </q-item-section>
            </q-item>

            <template v-for="link in dashboardSideMenuLinks"
                      :key="link.title">
              <dashboard-menu-item @active="clicked"
                                   v-bind="link" />
            </template>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page class="q-pa-md column">
          <slot name="page-content">

          </slot>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import DashboardMenuItem from "./components/DashboardMenuItem";


export default {
  name: "dashboard-layout",
  components: { DashboardMenuItem },
  props: {
    dashboardSideMenuLinks: {
      type: Array,
      default() {
        return [];
      }
    },
    activeLink: {
      type: String
    },
    layoutStyles: {
      type: Object
    },
    hideDrawer: {
      type: Boolean
    }
  },
  data() {
    return {
      drawer: false,
      miniState: false
    };
  },
  watch: {
    hideDrawer: {
      immediate: true,
      handler(newValue) {
        this.drawer = !newValue;
      }
    }
  },
  computed: {
    pageTitle() {
      const activeTitle = this.dashboardSideMenuLinks.find((link) => link.path === this.activeLink);
      if (activeTitle) {
        return activeTitle["title"];
      }
      return "";
    }
  },
  methods: {
    clicked(link) {
      this.$emit("clicked-link", link);
      console.log(this.$q.screen);
      if (this.$q.screen.sm || this.$q.screen.xs) {
        this.drawer = false;
      }
      //
    }
  }
};
</script>
