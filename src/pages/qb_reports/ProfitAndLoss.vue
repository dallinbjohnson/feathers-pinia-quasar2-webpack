<template>
  <dashboard-layout
    :dashboard-side-menu-links="reportsLinks"
    @clicked-link="link=$event"
  >
    <template #side-menu-top>
      <q-btn class="q-mb-md q-mt-xs fill-width"
             rounded
             size="md"
             icon="fas fa-business-time"
             :outline="$q.dark.mode"
             label="Specify Date"
             @click="openDatePicker"
      />
    </template>
    <template v-if="reports" #page-toolbar>
      <q-item>
        <q-item-section top>
          <q-item-label lines="1">
            <span :class="`text-weight-medium ${($q.screen.xs || $q.screen.sm)? 'text-h6': 'text-h3'}`">{{
                $lget(reports, ['Header', 'ReportName'])
              }}</span>
          </q-item-label>

          <q-item-label style="margin-top:-0.2rem; font-size: 7pt" class=" q-mt-none text-bold" caption
                        lines="1">
            <div :class="`text-weight-medium ${($q.screen.xs || $q.screen.sm)? 'text-h6': 'text-h5'}`">
              {{(link.replace('-',' '))}}
            </div>
            <div>{{ $lget(reports, ['Header', 'StartPeriod']) }} to {{ $lget(reports, ['Header', 'EndPeriod']) }}</div>

          </q-item-label>

        </q-item-section>
      </q-item>
    </template>
    <template #page-content>
      <q-linear-progress v-if="fetching" query :color="$q.dark.mode?'accent':'primary'" class="q-mt-sm" reverse/>

      <report-item-list :data="reports"/>
      <inbox-dialog v-model="showDatePicker" style="display: flex" :title="`${$lget(reports, ['Header', 'ReportBasis'])} As Of:`">
        <q-card flat square>
          <q-card-section>

            <q-date
              v-model="end_date"
              landscape
              mask="YYYY-MM-DD"
            />

          </q-card-section>
        </q-card>
      </inbox-dialog>
    </template>
<!--    <template #close-drawer-btn>
      <transition
        v-if="!$q.screen.xs"
        appear
        enter-active-class="animated fadeOut"
        leave-active-class="animated fadeIn"
      >
        <span/>
      </transition>

    </template>-->

  </dashboard-layout>
</template>

<script>
  import DashboardLayout from 'components/dashboards/DashboardLayout';
  import api from 'src/api/feathers-client';
  import {capitalize, kebabize, singularize} from '@iy4u/common-client-lib/src/utils';
  import reportsLinks from 'pages/qb_reports/helpers/queryLinks';
  import InboxDialog from 'pages/messages/components/inbox-dialog';
  import { date } from 'quasar';
  import ReportItemList from 'pages/qb_reports/components/ReportItemList';

  export default {
    name: 'profit-and-loss',
    components: {ReportItemList, InboxDialog,  DashboardLayout},
    data() {
      return {
        showFilters: false,
        reports: {},
        link: 'Today',
        reportsLinks: reportsLinks,
        showDatePicker: false,
        end_date: undefined,
        splitterModel: 50,
        fetching: false,
      };
    },
    async mounted() {
      try {
        await this.fetchReports();
      } catch (err) {
        throw new Error(err);
      }
    },
    computed: {
      query() {
        const active = this.reportsLinks.find(item=>item.path===this.link);
        console.log('active', active);
        return this.$lget(active,'query',{});
      }
    },

    watch: {
      query: {
        immediate: true,
        deep: true,
        async handler(newValue){
          this.fetching = true;
          this.reports = await api.service('quickbooks/reports/profit-and-loss').find({
            query: newValue
          });
          this.fetching =false;
        }
      },
      end_date:{
        deep: true,
        async handler(newValue){
          this.fetching = true;
          this.reports = await api.service('quickbooks/reports/profit-and-loss').find({
            query: {
              start_date: this.$lget(this.reports, ['Header', 'StartPeriod']),
              end_date: this.makeDate(newValue)
            }
          });
          this.fetching = false;
        }
      }
    },

    methods: {
      capitalize, kebabize, singularize,
      openDatePicker(){
        this.end_date = this.$lget(this.reports, ['Header', 'EndPeriod']);
        this.showDatePicker=true;
      },
      makeDate(someDate){
        return date.formatDate(new Date(someDate), 'YYYY-MM-DD');
      },
      async fetchReports() {
        try {
          this.fetching = true;
          this.reports = await api.service('quickbooks/reports/profit-and-loss').find({
            query:{
              date_macro: 'Last Fiscal Quarter'
            }
          });
          this.fetching = false;
        } catch (e) {
          this.$q.notify({
            message: e.message,
            color: 'negative',
            textColor: 'white',
            icon: 'warning',
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>

  .item-row{
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 90%;
    @media (max-width: $breakpoint-xs-max) {
      width: 80%;
    }
  }
</style>
