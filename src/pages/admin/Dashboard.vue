<template>
  <q-page class="q-ma-sm-lg q-ma-sm">
    <div class="flex items-center q-pa-md">
      <h3 class="q-ma-none">{{ $lget(currentDashboard, 'name', '') }}</h3>
      <q-space/>
      <q-btn-dropdown label="dashboard" :outline="$q.dark.mode">
        <q-list bordered>
          <q-item v-for="(dashboard, index) in dashboardList"
                  :key="index"
                  class="text-center"
                  clickable
                  :active="currentDashboardId === dashboard._id"
                  @click="currentDashboardId = dashboard._id">
            <q-item-section>{{ dashboard.name }}</q-item-section>
          </q-item>
          <q-item clickable
                  v-close-popup
                  @click="newDashboardDialog = true">
            <q-item-section style="display: flex; flex-direction: row; justify-content: center; align-items: center">
              <q-icon name="mdi-plus-thick" size="xs" class="q-mr-xs"/>
              <span class="text-bold">Create</span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

      <q-dialog v-model="newDashboardDialog">
        <q-card style="min-width: 30vw">
          <q-card-section>
            <q-input v-model="newDashboard.name"
                     label="Dashboard Name"
                     filled/>
          </q-card-section>
          <q-card-actions>
            <q-space/>
            <q-btn label="Create Dashboard"
                   color="primary"
                   v-close-popup
                   :disable="[null, undefined, ''].includes(newDashboard.name)"
                   @click="createDashboard"/>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <q-separator class="q-my-md" inset/>

    <div class="flex q-mt-lg">
      <create-report-dialog :current-dashboard="currentDashboard"></create-report-dialog>
    </div>
    <h4 v-if="[null, undefined, {}].includes(currentDashboard)" class="q-ma-none absolute-center">No Dashboard Selected</h4>
    <dashboard-report-list :current-dashboard="currentDashboard"></dashboard-report-list>
  </q-page>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import {makeFindPaginateMixin, routerMixin} from '@iy4u/common-client-lib';
  import {mapGetters} from 'vuex';
  import DashboardReportList from 'components/mainDashboard/DashboardReportList';
  import CreateReportDialog from 'components/mainDashboard/CreateReportDialog';

  export default {
    name: 'NewDashboard',
    components: {
      CreateReportDialog,
      DashboardReportList,
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 20,
        service: 'dashboards',
        name: 'dashboardList',
        qid: 'dashboardList',
        infinite: true,
        query() {
          return {
            $sort: {
              createdAt: -1,
            },
          };
        },
        params() {
          return {};
        },
      }),
      routerMixin({
        name: 'dashboardSelection',
        query() {
          return {
            currentDashboardId: this.currentDashboardId,
          };
        },
      }),
    ],
    data() {
      return {
        newDashboardDialog: false,
        currentDashboardId: undefined,

        newDashboard: new models.api.Dashboards().clone(),
      };
    },
    computed: {
      ...mapGetters('dashboards', {
        getStateDashboard: 'get'
      }),

      currentDashboard() {
        return this.getStateDashboard(this.currentDashboardId);
      },
    },
    methods: {
      createDashboard() {
        this.newDashboard.create()
          .then(res => {
            this.$q.notify({
              type: 'positive',
              message: `Dashboard created: "${res.name}"`,
              timeout: 10000,
              actions: [
                {
                  icon: 'close',
                  color: 'white',
                  handler: () => {
                  },
                },
              ],
            });

            this.currentDashboardId = res._id;
            this.newDashboard = new models.api.Dashboards().clone();
          })
          .catch(err => {
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
          });
      },
    },
  };
</script>

<style scoped>

</style>
