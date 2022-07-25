<template>
  <f-data-table title="Streams"
                service="streams"
                :qid="qid"
                :limit="12"
                :query="query"
                :params="{
                    streamResolversQuery: {
                      streamGroup: [
                        ['_id', 'name']
                      ],
                      host: [
                        ['_id', 'name']
                      ]
                    }
                  }"
                :columns="columns"
                :remove-columns="removeColumns"
                :form-fields="formFields"
                create-title="Stream"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <template v-slot:expand="props">
      <template v-if="props.colName === 'viewers'">
        <f-data-table title="Viewers"
                      service="accounts"
                      qid="viewersStreamsAdmin"
                      :limit="12"
                      :query="{ _id: { $in: $lget(props, 'row.viewers', []) } }"
                      :params="{}"
                      :columns="accountColumns">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </f-data-table>
      </template>

      <template v-if="props.colName === 'blocked'">
        <f-data-table title="Blocked"
                      service="accounts"
                      qid="blockedStreamsAdmin"
                      :limit="12"
                      :query="{ _id: { $in: $lget(props, 'row.blocked', []) } }"
                      :params="{}"
                      :columns="accountColumns">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </f-data-table>
      </template>

      <template v-if="props.colName === 'tags'">
        <div v-if="!$lget(props, 'row.tags', []).length">No Tags</div>
        <q-chip v-for="(tag, index) in $lget(props, 'row.tags', [])"
                :key="index"
                color="primary"
                text-color="white">
          {{ tag }}
        </q-chip>
      </template>

      <template v-if="props.colName === 'streamData'">
        <q-table :data="$lget(props, 'row.streamData', [])"
                 :pagination="{rowsPerPage: 10}"></q-table>
      </template>
    </template>
  </f-data-table>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {date} from 'quasar';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';

  export default {
    name: 'StreamsTable',
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
        default: 'streamsAdmin',
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'stream-groups',
        name: 'streamGroups',
        qid: 'streamGroupsStreamsAdmin',
        query() {
          return {};
        },
        params() {
          return {
            debounce: 500,
          };
        },
      }),
      makeFindPaginateMixin({
        limit: 12,
        service: 'accounts',
        name: 'hosts',
        qid: 'hostsStreamsAdmin',
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
            name: 'title',
            label: 'Title',
            align: 'left',
            field: row => this.$lget(row, 'title'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'description',
            label: 'Description',
            align: 'left',
            field: row => this.$lget(row, 'description'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'host',
            label: 'Host',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.host.name', this.$lget(row, 'host')),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'live',
            label: 'Live',
            align: 'left',
            field: row => this.$lget(row, 'live'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'viewers',
            label: 'Viewers',
            align: 'left',
            field: row => this.$lget(row, 'viewers', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'blocked',
            label: 'Blocked',
            align: 'left',
            field: row => this.$lget(row, 'blocked', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'streamGroup',
            label: 'Stream Group',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.streamGroup.name', this.$lget(row, 'streamGroup')),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'started',
            label: 'Started',
            align: 'left',
            field: row => date.formatDate(this.$lget(row, 'started'), 'DD-MM-YYYY hh:mm A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'ended',
            label: 'Ended',
            align: 'left',
            field: row => date.formatDate(this.$lget(row, 'ended'), 'DD-MM-YYYY hh:mm A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'tags',
            label: 'Tags',
            align: 'left',
            field: row => this.$lget(row, 'tags', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'streamId',
            label: 'Stream ID',
            align: 'left',
            field: row => this.$lget(row, 'streamId'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'streamStatus',
            label: 'Stream Status',
            align: 'left',
            field: row => this.$lget(row, 'streamStatus'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'streamData',
            label: 'Stream Data',
            align: 'left',
            field: row => this.$lget(row, 'streamData', []),
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

      accountColumns() {
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
        ];
      },

      formFields() {
        return [
          {
            fieldType: 'TextInput',
            path: 'title',
            attrs: {
              label: 'Title',
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
            fieldType: 'TextInput',
            path: 'description',
            attrs: {
              label: 'description',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              type: 'textarea'
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'streamGroup',
            attrs: {
              label: 'Stream Group',
              'hide-selected': false,
              'fill-input': false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              options: this.streamGroups,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'host',
            attrs: {
              label: 'Host',
              'hide-selected': false,
              'fill-input': false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              options: this.hosts,
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
