<template>
  <div>
    <q-btn v-if="![null, undefined, {}].includes(currentDashboard)"
           label="Create Report"
           icon="mdi-file-plus"
           :outline="$q.dark.mode"
           @click="createReportDialog = true"/>

    <q-dialog v-model="createReportDialog" full-height>
      <q-card style="min-width: 50vw; display: flex; flex-direction: column">
        <q-card-section class="flex items-center q-pa-md">
          <!--            <h4 class="q-ma-none">New Report</h4>-->
          <q-input v-model="newReport.name"
                   style="flex: 1"
                   filled
                   label="Report Name"
                   :rules="[val => !!val || 'Report name is required']"/>
          <q-btn icon="close" class="q-ml-md" flat dense v-close-popup/>
        </q-card-section>
        <q-scroll-area class="q-px-sm" style="height: 100%">
          <h4 v-if="!newReport.widgets.length" class="q-ma-none absolute-center">Click "Add Widget" to get
            started!</h4>
          <div v-if="ready && newReport.widgets.length" class="flex">
            <div v-for="(widget, index) in newReport.widgets.map(w => w.widget)"
                 :key="index"
                 :style="[{position: 'relative'}, widget.cspan === 8 ? {width: '50%'} : {width: '100%'}]">
              <db-dashboard :dbspec="{
                                layout: {
                                  type: 'grid',
                                },
                                widgets: [tempWidget(widget)],
                              }"
                            :dbdata="dbdata"
                            :dark="$q.dark.mode"></db-dashboard>
              <div class="flex" style="position: absolute; bottom: 5px; right: 5px">
                <q-btn icon="mdi-minus-box-outline"
                       color="negative"
                       dense
                       flat
                       @click="newReport.widgets.splice(index, 1)"/>
                <!--                  <q-btn icon="more_vert"-->
                <!--                         dense-->
                <!--                         flat/>-->
              </div>
            </div>
          </div>
        </q-scroll-area>
        <q-card-actions>
          <add-widget :options="easyToReadArr"
                      @add-number-widget="addNumberWidget"
                      @add-doughnut-widget="addDoughnutWidget"></add-widget>
          <q-btn v-if="newReport.widgets.length"
                 label="Clear Widgets"
                 color="negative"
                 flat
                 @click="newReport.widgets = []"/>
          <q-space/>
          <div>
            <q-btn label="Save Report"
                   color="primary"
                   v-close-popup
                   :disable="[null, undefined, ''].includes(newReport.name) || !newReport.widgets.length"
                   @click="saveReport"/>
            <q-tooltip v-if="[null, undefined, ''].includes(newReport.name) || !newReport.widgets.length">
              The report needs {{
                [null, undefined, ''].includes(newReport.name) && !newReport.widgets.length ? 'widgets and a name'
                  : [null, undefined, ''].includes(newReport.name) ? 'a name'
                    : !newReport.widgets.length ? 'widgets' : ''
              }}!
            </q-tooltip>
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {DbData} from 'dashblocks';
  import {models} from '@feathersjs/vuex';
  import AddWidget from 'components/mainDashboard/AddWidget';

  export default {
    name: 'CreateReportDialog',
    components: {AddWidget},
    props: {
      currentDashboard: {
        type: Object,
      }
    },
    data() {
      return {
        profitAndLoss: {},
        createReportDialog: false,

        newReport: new models.api.DashboardReports().clone(),

        // dashblocks
        dbdata: new DbData(),
        ready: false,
      };
    },
    mounted() {
      this.$feathersClient.service('quickbooks/reports/profit-and-loss').find({})
        .then(res => {
          this.profitAndLoss = res;

          // dashblocks
          this.ready = true;
        })
        .catch(err => {
          console.log(err);
        });
    },
    computed: {
      easyToReadArr() {
        let newArr = [];
        this.$lget(this.profitAndLoss, 'Rows.Row', []).forEach(i => {
          newArr.push({
            label: i.Summary.ColData[0].value,
            value: Number(i.Summary.ColData[1].value),
          });
        });
        return newArr;
      },
    },
    methods: {
      tempWidget(widget) {
        const newTemp = Object.assign({}, widget);
        if (newTemp.cspan === 8) {
          newTemp.cspan = 16;
        }
        return newTemp;
      },
      saveReport() {
        if (this.currentDashboard) {
          this.$lget(this.newReport, 'dashboards', []).push(this.currentDashboard._id);

          this.newReport.create()
            .then(res => {
              this.$q.notify({
                type: 'positive',
                message: `Report created: "${res.name}"`,
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

              this.newReport = new models.api.DashboardReports().clone();
            })
            .catch(err => {
              console.log('saveReport err: ', err);
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
        }
      },

      addNumberWidget(newWidget) {
        this.$lget(this.newReport, 'widgets', []).push({
          widget: newWidget.schema,
          value: newWidget.value,
        });

        // for the temporary stuff that shows up in the dialog
        this.dbdata.setWData(newWidget.schema.id, {
          value: newWidget.value,
        });
      },
      addDoughnutWidget(newWidget) {
        this.$lget(this.newReport, 'widgets', []).push({
          widget: newWidget.schema,
          value: newWidget.selection,
        });

        // for the temporary stuff that shows up in the dialog
        const newLabels = this.$lget(newWidget, 'selection', []).map(i => i.label);
        const newValues = this.$lget(newWidget, 'selection', []).map(i => Number(i.value));

        this.dbdata.setWData(newWidget.schema.id, {
          data: {
            labels: newLabels,
            datasets: [
              {
                data: newValues,
              },
            ],
          },
        });
      },
    },
  };
</script>

<style scoped>

</style>
