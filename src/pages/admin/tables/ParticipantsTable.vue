<template>
  <f-data-table title="Participants"
                service="participants"
                :qid="qid"
                :limit="12"
                :query="query"
                :params="{
                    participantResolversQuery: {
                      owner: [
                        ['_id', 'name', 'avatar']
                      ],
                    }
                  }"
                :columns="columns"
                :remove-columns="removeColumns"
                :form-fields="formFields"
                create-title="Participant"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <template v-slot:expand="props">
      <template v-if="props.colName === 'rooms'">
        <rooms-table :remove-columns="['actions', 'streamGroups', 'participantEvents', 'participants']"
                     :query="{ _id: { $in: $lget(props, 'row.rooms', []) } }"
                     :qid="`roomsParticipantsAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </rooms-table>
      </template>

      <template v-if="props.colName === 'participantEvents'">
        <participant-events-table :remove-columns="['actions', 'rooms']"
                                  :query="{ _id: { $in: $lget(props, 'row.participantEvents', []) } }"
                                  :qid="`participantEventsParticipantsAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </participant-events-table>
      </template>
    </template>
  </f-data-table>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import RoomsTable from 'pages/admin/tables/RoomsTable';
  import ParticipantEventsTable from 'pages/admin/tables/ParticipantEventsTable';

  export default {
    name: 'ParticipantsTable',
    components: {ParticipantEventsTable, RoomsTable},
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
        default: 'participantsAdmin',
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'accounts',
        name: 'accounts',
        qid: 'accountsParticipantsAdmin',
        query() {
          return {
            $or: [
              // {
              //   participant: {$exists: false},
              // },
              {
                participant: null,
              },
              {
                participant: undefined,
              },
            ],
          };
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
            name: 'owner',
            label: 'Owner (Account)',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.owner.name', this.$lget(row, 'owner')),
            format: val => `${val}`,
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
            name: 'unseenChats',
            label: 'Unseen Chats',
            align: 'left',
            field: row => this.$lget(row, 'unseenChats', []).length,
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
            fieldType: 'SelectInput',
            path: 'owner',
            attrs: {
              label: 'Owner',
              'hide-selected': false,
              'fill-input': false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              options: this.accounts,
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
