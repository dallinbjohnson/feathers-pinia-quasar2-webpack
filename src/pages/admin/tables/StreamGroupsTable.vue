<template>
  <f-data-table title="Stream Groups"
                service="stream-groups"
                :qid="qid"
                :limit="12"
                :query="query"
                :params="{
                    streamGroupResolversQuery: {
                      room: [
                        ['_id', 'name']
                      ]
                    }
                  }"
                :columns="columns"
                :remove-columns="removeColumns"
                :form-fields="formFields"
                create-title="Stream Group"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <template v-slot:expand="props">
      <template v-if="props.colName === 'streams'">
        <streams-table :remove-columns="['actions', 'viewers', 'blocked', 'streamGroup', 'tags', 'streamData']"
                       :query="{ _id: { $in: $lget(props, 'row.streams', []) } }"
                       :qid="`streamsStreamGroupsAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </streams-table>
      </template>
    </template>
  </f-data-table>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import StreamsTable from 'pages/admin/tables/StreamsTable';

  export default {
    name: 'StreamGroupsTable',
    components: {StreamsTable},
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
        default: 'streamGroupsAdmin',
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'rooms',
        name: 'rooms',
        qid: 'roomsStreamGroupsAdmin',
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
            name: 'room',
            label: 'Room',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.room.name', this.$lget(row, 'room')),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'streams',
            label: 'Streams',
            align: 'left',
            field: row => this.$lget(row, 'streams', []),
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
            path: 'room',
            attrs: {
              label: 'Room',
              'hide-selected': false,
              'fill-input': false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              options: this.rooms,
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
