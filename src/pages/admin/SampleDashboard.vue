<template>
  <q-page id="admin-dashboard" class="ub-page">
    <q-toolbar flat>
      <q-space />

      <q-btn-dropdown rounded id="dash-menu" v-model="menuIsOpen"
                      :text-color="$q.dark.isActive ? '' : 'dark'" unelevated outline no-caps>
        <template v-slot:label>
          <div class="row items-center no-wrap">
            <div class="text-center text-bold q-pa-sm">
              {{ activeComponent.label }}
            </div>
          </div>
        </template>
        <q-list bordered padding class="rounded-borders text-primary">
          <q-item
            v-for="(menuItem, idx) in dashMenu"
            :key="idx"
            clickable
            v-ripple
            :active="menuItem.label === activeComponent.label"
            @click="activeComponent = menuItem"
            active-class="active-menu"
          >
            <q-item-section avatar>
              <q-icon :name="menuItem.icon" />
            </q-item-section>

            <q-item-section>{{menuItem.label}}</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

    </q-toolbar>

    <keep-alive>
      <component v-bind:is="activeComponent.component"></component>
    </keep-alive>
<!--    <default-admin-dashboard></default-admin-dashboard>-->
  </q-page>
</template>

<script>

  // import DefaultAdminDashboard from 'components/admin/Dashboards';
  export default {
    name: 'AdminDashboard',
    // components: {DefaultAdminDashboard},
    data() {
      return {
        menuIsOpen: false,
        activeComponent: {
          label: 'Main',
          component: () => import('components/admin/Dashboards/index')
        },
        dashMenu: [
          {
            label: 'Main',
            icon: 'fas fa-chart-bar',
            component: () => import('components/admin/Dashboards/index')
          },
          {
            label: 'Sample One',
            icon: 'fas fa-chart-bar',
            component: () => import('components/admin/Dashboards/sample-one')
          },
          {
            label: 'Sample Two',
            icon: 'fas fa-chart-bar',
            component: () => import('components/admin/Dashboards/sample-two')
          },
          {
            label: 'Sample Three',
            icon: 'fas fa-chart-bar',
            component: () => import('components/admin/Dashboards/sample-three')
          },
          {
            label: 'Sample Four',
            icon: 'fas fa-chart-bar',
            component: () => import('components/admin/Dashboards/sample-four')
          },
        ],
      };
    },
  };
</script>

<style scoped lang="scss">
  #admin-dashboard {

  }
</style>
