<template>
  <div>
    <q-btn icon="mdi-view-grid-plus" label="Add Widget">
      <q-menu>
        <q-list>
          <q-item clickable
                  v-close-popup
                  @click="addNumberDialog = true">
            <q-item-section>Number</q-item-section>
          </q-item>
          <q-item clickable
                  v-close-popup
                  @click="addDoughnutDialog = true">
            <q-item-section>Doughnut Chart</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>

    <q-dialog v-model="addNumberDialog" @hide="reportField = { label: '', value: '' }; widgetWidth = 'half'; resetId()">
      <q-card style="width: 30vw">
        <q-card-section>
          <report-field-select v-model="selectedReportPath"
                               :options="reportOptions"
                               label="Report"
                               emit-value
                               map-options/>
        </q-card-section>
        <q-card-section>
          <q-tabs
            v-model="selectType"
            dense
            narrow-indicator
            align="left"
            @input="reportField = { label: '', value: '' }"
          >
            <q-tab name="field">
              field
            </q-tab>
            <q-separator vertical inset/>
            <q-tab name="calculate">
              calculate
            </q-tab>
          </q-tabs>
        </q-card-section>

        <q-card-section v-if="selectType === 'field'">
          <report-field-select v-model="reportField"
                               :options="reportFieldOptions"
                               :loading="updatingReportFieldOptions"
                               label="Report Field"></report-field-select>
        </q-card-section>

        <q-card-section v-if="selectType === 'calculate'">
          <q-input v-model="reportField.label" label="Report Field Name" filled></q-input>
          <pal-calculator :options="reportFieldOptions" @calculated="reportField.value = $event"></pal-calculator>
        </q-card-section>
        <q-card-actions>
          <div class="text-center">
            Widget Width
            <q-tabs
              v-model="widgetWidth"
              dense
              narrow-indicator
              align="left"
            >
              <q-tab name="half"
                     class="q-px-sm"
                     style="font-size: small">
                half
              </q-tab>
              <q-separator vertical inset/>
              <q-tab name="full"
                     class="q-px-sm"
                     style="font-size: small">
                full
              </q-tab>
            </q-tabs>
          </div>
          <q-space/>
          <q-btn @click="$emit('add-number-widget', {schema: newNumberWidget, value: reportField.value})"
                 color="primary"
                 :disable="[null, undefined, ''].includes(reportField.label) || [null, undefined, ''].includes(reportField.value)"
                 v-close-popup>Add</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="addDoughnutDialog" @hide="reportFieldMultiple = []; resetId()">
      <q-card style="width: 30vw">
        <q-card-section>
          <report-field-select v-model="selectedReportPath"
                               :options="reportOptions"
                               label="Report"
                               emit-value
                               map-options/>
        </q-card-section>
        <q-card-section>
          <report-field-select v-model="reportFieldMultiple"
                               :options="reportFieldOptions"
                               label="Report Fields"
                               :loading="updatingReportFieldOptions"
                               clearable
                               multiple/>
        </q-card-section>
        <q-card-actions>
          <q-space/>
          <q-btn @click="$emit('add-doughnut-widget', {schema: newDoughnutWidget, selection: reportFieldMultiple})"
                 color="primary"
                 :disable="[null, undefined, []].includes(reportFieldMultiple)"
                 v-close-popup>Add</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import ReportFieldSelect from 'components/mainDashboard/ReportFieldSelect';
  import {v4 as uuidv4} from 'uuid';
  import PalCalculator from 'components/mainDashboard/PalCalculator';

  export default {
    name: 'AddWidget',
    components: {PalCalculator, ReportFieldSelect},
    props: {
      options: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        addNumberDialog: false,
        addDoughnutDialog: false,
        selectType: 'field',
        selectedReportPath: 'quickbooks/reports/profit-and-loss',
        reportOptions: [
          {
            label: 'Profit And Loss',
            value: 'quickbooks/reports/profit-and-loss',
          },
          {
            label: 'Balance Sheet',
            value: 'quickbooks/reports/balance-sheet',
          },
          {
            label: 'Aged Payable Detail',
            value: 'quickbooks/reports/aged-payable-detail',
          },
        ],
        reportFieldOptions: [],
        reportField: {
          label: '',
          value: ''
        },
        reportFieldMultiple: [],
        widgetWidth: 'half',
        updatingReportFieldOptions: false,

        newId: uuidv4(),
      };
    },
    watch: {
      selectedReportPath: {
        immediate: true,
        // deep: true,
        async handler(newVal) {
          this.updatingReportFieldOptions = true;
          const data = await this.$feathersClient.service(newVal).find({});
          this.updatingReportFieldOptions = false;
          this.reportFieldOptions = [];
          this.$lget(data, 'Rows.Row', []).forEach(i => {
            this.reportFieldOptions.push({
              label: i.Summary.ColData[0].value,
              value: Number(i.Summary.ColData[1].value),
            });
          });
        },
      },
    },
    computed: {
      newNumberWidget() {
        return {
          id: this.newId,
          type: 'DbNumber',
          // cspan: 8,
          cspan: this.widgetWidth === 'half' ? 8 : 16,
          properties: {
            title: this.reportField.label,
            // subtitle: `As of ${this.$lget(this.profitAndLoss, 'Header.StartPeriod', '')}`,
            icon: 'fa fa-dollar-sign',
            format: '%.2f',
          },
        };
      },
      newDoughnutWidget() {
        return {
          id: this.newId,
          type: 'DbChartjsDoughnut',
          cspan: 16,
          height: 250,
          // properties: {
          //   options: {
          //     title: {display: true, text: 'Requests by method', position: 'top'},
          //     legend: { position: 'right' }
          //   }
          // }
        };
      },
    },
    methods: {
      resetId() {
        this.newId = uuidv4();
      },
    },
  };
</script>

<style scoped>

</style>
