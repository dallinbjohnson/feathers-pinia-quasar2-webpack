<template>
  <f-data-table title="Events"
                service="events"
                :qid="qid"
                :limit="12"
                :query="query"
                :params="{
                    eventResolversQuery: {
                      eventTemplate: [
                        ['_id', 'name']
                      ],
                      parent: [
                        ['_id', 'name']
                      ]
                    }
                  }"
                :columns="columns"
                :remove-columns="removeColumns"
                :form-fields="formFields"
                create-title="Event"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <template v-slot:expand="props">
      <template v-if="props.colName === 'participantEvents'">
        <participant-events-table :remove-columns="['actions', 'rooms']"
                                  :query="{ _id: { $in: $lget(props, 'row.participantEvents', []) } }"
                                  :qid="`participantEventsEventsAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </participant-events-table>
      </template>

      <template v-if="props.colName === 'children'">
        <events-table :remove-columns="['actions', 'children', 'parent', 'participantEvents']"
                      :query="{ _id: { $in: $lget(props, 'row.children', []) } }"
                      :qid="`childrenEventsAdmin${$lget(props, 'row._id')}`">
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
  import {date} from 'quasar';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import ParticipantEventsTable from 'pages/admin/tables/ParticipantEventsTable';

  export default {
    name: 'EventsTable',
    components: {ParticipantEventsTable},
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
        default: 'eventsAdmin',
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
            name: 'eventTemplate',
            label: 'Event Template',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.eventTemplate.name', this.$lget(row, 'eventTemplate', '')),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'participantEvents',
            label: 'Participant Events',
            align: 'left',
            field: row => this.$lget(row, 'participantEvents', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'children',
            label: 'Children',
            align: 'left',
            field: row => this.$lget(row, 'children', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'parent',
            label: 'Parent',
            align: 'left',
            field: row => {
              return {
                name: this.$lget(row, '_fastjoin.parent.name'),
                id: this.$lget(row, 'parent'),
              };
            },
            format: val => `${val.name ? val.name : ''} ${val.id ? `(${val.id})` : ''}`,
            sortable: true,
          },
          {
            name: 'subjectId',
            label: 'Subject ID',
            align: 'left',
            field: row => this.$lget(row, 'subjectId'),
            format: val => `${val}`,
            sortable: true,
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
