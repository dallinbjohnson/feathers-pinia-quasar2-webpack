<template>
  <f-data-table title="Rooms"
                service="rooms"
                :qid="qid"
                :limit="12"
                :query="query"
                :params="{}"
                :columns="columns"
                :remove-columns="removeColumns"
                :form-fields="formFields"
                create-title="Room"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <template v-slot:expand="props">
      <template v-if="props.colName === 'streamGroups'">
        <stream-groups-table :remove-columns="['actions', 'streams', 'room']"
                             :query="{ _id: { $in: $lget(props, 'row.streamGroups', []) } }"
                             :qid="`streamGroupsRoomsAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </stream-groups-table>
      </template>

      <template v-if="props.colName === 'participantEvents'">
        <participant-events-table :remove-columns="['actions', 'rooms']"
                                  :query="{ _id: { $in: $lget(props, 'row.participantEvents', []) } }"
                                  :qid="`participantEventsRoomsAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </participant-events-table>
      </template>

      <template v-if="props.colName === 'participants'">
        <participants-table :remove-columns="['actions', 'rooms', 'participantEvents']"
                            :query="{ _id: { $in: $lget(props, 'row.participants', []) } }"
                            :qid="`participantsRoomsAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </participants-table>
      </template>
    </template>
  </f-data-table>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import ParticipantsTable from 'pages/admin/tables/ParticipantsTable';
  import StreamGroupsTable from 'pages/admin/tables/StreamGroupsTable';
  import ParticipantEventsTable from 'pages/admin/tables/ParticipantEventsTable';

  export default {
    name: 'RoomsTable',
    components: {ParticipantEventsTable, StreamGroupsTable, ParticipantsTable},
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
        default: 'roomsAdmin',
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'participants',
        name: 'participants',
        qid: 'participantsRoomsAdmin',
        query() {
          return {};
        },
        params() {
          return {
            debounce: 500,
            participantResolversQuery: {
              owner: [
                ['_id', 'name'],
              ],
            },
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
            name: 'chats',
            label: '# of Chats',
            align: 'left',
            field: row => this.$lget(row, 'chats', []).length,
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'streamGroups',
            label: 'Stream Groups',
            align: 'left',
            field: row => this.$lget(row, 'streamGroups', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
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
            name: 'participants',
            label: 'Participants',
            align: 'left',
            field: row => this.$lget(row, 'participants', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'directMessage',
            label: 'Direct Message',
            align: 'left',
            field: row => this.$lget(row, 'directMessage'),
            format: val => val,
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
              label: 'Name',
              type: 'text',
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
            path: 'participants',
            attrs: {
              label: 'Participants',
              'hide-selected': false,
              'fill-input': false,
              multiple: true,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': (item) => this.$lget(item, '_fastjoin.owner.name', '---'),
              'use-chips': true,
              'bottom-slots': true,
              options: this.participants,
            },
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
