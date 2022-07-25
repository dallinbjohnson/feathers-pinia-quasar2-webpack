<template>
  <f-data-table title="Participant Events"
                service="participant-events"
                :qid="qid"
                :limit="12"
                :query="query"
                :params="{
                    participantEventResolversQuery: {
                      event: [
                        ['_id', 'name']
                      ]
                    }
                  }"
                :columns="columns"
                :remove-columns="removeColumns"
                :form-fields="formFields"
                create-title="Participant Event"
                @input="updateFormData($event)">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <template v-slot:expand="props">
      <template v-if="props.colName === 'rooms'">
        <rooms-table :remove-columns="['actions', 'streamGroups', 'participantEvents', 'participants']"
                     :query="{ _id: { $in: $lget(props, 'row.rooms', []) } }"
                     :qid="`roomsParticipantEventsAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </rooms-table>
      </template>
    </template>
  </f-data-table>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import RoomsTable from 'pages/admin/tables/RoomsTable';

  export default {
    name: 'ParticipantEventsTable',
    components: {RoomsTable},
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
        }
      },
      qid: {
        type: String,
        default: 'participantEventsAdmin',
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'events',
        name: 'events',
        qid: 'eventsParticipantEventsAdmin',
        query() {
          return {};
        },
        params() {
          return {
            debounce: 500,
          };
        },
      }),
    ],
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
            name: 'event',
            label: 'Event',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.event.name', this.$lget(row, 'event')),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'role',
            label: 'Role',
            align: 'left',
            field: row => this.$lget(row, 'role'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'invited',
            label: 'Invited',
            align: 'left',
            field: row => this.$lget(row, 'invited'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'acknowledged',
            label: 'Acknowledged',
            align: 'left',
            field: row => this.$lget(row, 'acknowledged'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'attended',
            label: 'Attended',
            align: 'left',
            field: row => this.$lget(row, 'attended'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'rooms',
            label: 'Rooms',
            align: 'left',
            field: row => this.$lget(row, 'rooms', []),
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
              label: 'Name',
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
            fieldType: 'SelectInput',
            path: 'role',
            attrs: {
              label: 'Role',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              options: [
                'host',
                'co-host',
                'guest',
              ],
            },
            'div-attrs': {
              class: 'col-12'
            }
          },
          {
            fieldType: 'SelectInput',
            path: 'event',
            attrs: {
              label: 'Event',
              'hide-selected': false,
              'fill-input': false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              options: this.events,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ];
      },
    },

    methods: {
      updateFormData(e) {
        this.formData = e;
        this.$lset(this.formData, 'data.invited', true);
        console.log(this.formData);
      },
    },
  };
</script>

<style scoped>

</style>
