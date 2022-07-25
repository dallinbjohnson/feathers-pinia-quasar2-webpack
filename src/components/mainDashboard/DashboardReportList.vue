<template>
  <div>
    <h4 v-if="!dashboardReports.length && currentDashboard && !isFindDashboardReportsPending"
        class="q-ma-none absolute-center">No Reports</h4>
    <div v-for="(report, index) in dashboardReports" :key="index">
      <div class="flex justify-between items-center q-pa-md">
        <h4 class="q-ma-none">{{ report.name }}</h4>
        <h4 class="q-ma-none" style="opacity: 0.5">{{ formattedCreateDate(report) }}</h4>
        <!--        <div class="text-right">-->
        <!--          <h4 class="q-ma-none" style="opacity: 0.5">{{ formattedCreateDate(report).date }}</h4>-->
        <!--          <h5 class="q-ma-none" style="opacity: 0.5">{{ formattedCreateDate(report).time }}</h5>-->
        <!--        </div>-->
      </div>
      <db-dashboard v-if="ready"
                    :dbspec="dbSpec(report)"
                    :dbdata="dbdata"
                    :dark="$q.dark.mode"></db-dashboard>
      <q-separator v-if="index !== (dashboardReports.length - 1)" class="q-my-xl" inset/>
    </div>
    <div class="flex justify-center">
      <q-spinner v-if="isFindDashboardReportsPending" size="3em" class="absolute-center"/>
    </div>
  </div>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {date} from 'quasar';
  import {DbData} from 'dashblocks';

  export default {
    name: 'DashboardReportList',
    props: {
      currentDashboard: {
        type: Object,
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 20,
        service: 'dashboard-reports',
        name: 'dashboardReports',
        qid: 'dashboardReports',
        infinite: true,
        query() {
          return {
            $sort: {
              createdAt: -1,
            },
            _id: {
              $in: this.$lget(this.currentDashboard, 'reports', []),
            }
          };
        },
        params() {
          return {};
        },
      }),
    ],
    data() {
      return {
        // dashblocks
        dbdata: new DbData(),
        ready: false,
      };
    },
    watch: {
      dashboardReports: {
        immediate: true,
        handler(newValue) {
          if (newValue) {
            this.populateWidgets();
            this.ready = true;
          }
        }
      },
    },
    methods: {
      formattedCreateDate(report) {
        return date.formatDate(report.createdAt, 'MMM D, YYYY - h:mm A');
        // return {
        //   date: date.formatDate(report.createdAt, 'MMM D, YYYY'),
        //   time: date.formatDate(report.createdAt, 'h:mm A'),
        // };
      },
      dbSpec(report) {
        return {
          layout: {
            type: 'grid',
          },
          colorScheme: 'default',
          widgets: report.widgets.map(w => w.widget),
        };
      },
      populateWidgets() {
        this.dashboardReports.forEach(r => {
          r.widgets.forEach(w => {
            if (w.widget.type === 'DbNumber') {
              this.dbdata.setWData(w.widget.id, {
                value: w.value,
              });
            } else if (w.widget.type === 'DbChartjsDoughnut') {
              const newLabels = this.$lget(w, 'value', []).map(i => i.label);
              const newValues = this.$lget(w, 'value', []).map(i => Number(i.value));

              this.dbdata.setWData(w.widget.id, {
                data: {
                  labels: newLabels,
                  datasets: [
                    {
                      data: newValues,
                    },
                  ],
                },
              });
            }
          });
        });
      },
    },
  };
</script>

<style scoped>

</style>
