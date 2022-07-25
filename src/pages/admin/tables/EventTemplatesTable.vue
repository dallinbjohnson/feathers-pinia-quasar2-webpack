<template>
  <f-data-table title="Event Templates"
                service="event-templates"
                :qid="qid"
                :limit="12"
                :query="query"
                :params="{}"
                :columns="columns"
                :remove-columns="removeColumns"
                :form-fields="formFields"
                create-title="Event Template"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <template v-slot:expand="props">
      <template v-if="props.colName === 'events'">
        <events-table :remove-columns="['actions', 'children', 'participantEvents']"
                      :query="{ _id: { $in: $lget(props, 'row.events', []) } }"
                      :qid="`eventsEventTemplatesAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </events-table>
      </template>
    </template>
  </f-data-table>
</template>

<script>
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import {date} from 'quasar';
  import EventsTable from 'pages/admin/tables/EventsTable';

  export default {
    name: 'EventTemplatesTable',
    components: {EventsTable},
    props: {
      removeColumns: {
        type: Array,
        default() {
          return [];
        },
      },
      query: {
        type: Object,
        default() {
          return {};
        },
      },
      qid: {
        type: String,
        default: 'eventTemplatesAdmin',
      },
    },
    data() {
      return {
        formData: {},
      };
    },
    computed: {
      columns() {
        return [
          {
            name: '_id',
            label: '_id',
            align: 'left',
            field: row => this.$lget(row, '_id'),
            format: val => `${val}`,
            sortable: true,
            hidden: true,
          },
          {
            name: 'name',
            label: 'Name',
            align: 'left',
            field: row => this.$lget(row, 'name'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'startDate',
            label: 'Start Date',
            align: 'left',
            field: row => date.formatDate(this.$lget(row, 'startDate'), 'DD-MM-YYYY hh:mm A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'endDate',
            label: 'End Date',
            align: 'left',
            field: row => date.formatDate(this.$lget(row, 'endDate'), 'DD-MM-YYYY hh:mm A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'events',
            label: 'Events',
            align: 'left',
            field: row => this.$lget(row, 'events', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },

          ...commonFieldsConfig,

          {
            name: 'actions',
            label: 'Actions',
            align: 'center',
            required: true,
          },
        ];
      },

      formFields() {
        return [
          {
            fieldType: 'TextInput',
            path: 'name',
            attrs: {
              label: 'name',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'CtkDatePicker',
            path: 'startDate',
            attrs: {
              label: 'Start Date',
              formatted: 'MMM DD, YYYY - h:mm A',
              rules: [
                (input) => {
                  return !!input;
                },
              ],
            },
            slots: ['prepend'],
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'CtkDatePicker',
            path: 'endDate',
            attrs: {
              label: 'End Date',
              formatted: 'MMM DD, YYYY - h:mm A',
              rules: [
                (input) => {
                  return !!input;
                },
              ],
            },
            slots: ['prepend'],
            'div-attrs': {
              class: 'col-12',
            },
          },
        ];
      },
    },
  };
</script>

<style scoped>

</style>
