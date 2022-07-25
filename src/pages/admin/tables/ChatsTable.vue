<template>
  <f-data-table title="Chats"
                service="chats"
                :qid="qid"
                :limit="12"
                :query="query"
                :params="{
                    chatResolversQuery: {
                      sender: [
                        ['_id', 'owner'],
                        {
                          participantResolversQuery: {
                            owner: [
                              ['_id', 'name', 'avatar'],
                            ],
                          },
                        },
                      ],
                      room: [
                        ['_id', 'name']
                      ],
                    }
                  }"
                :columns="columns"
                :remove-columns="removeColumns"
                :form-fields="formFields"
                create-title="Chat"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <template v-slot:expand="props">
      <template v-if="props.colName === 'images'">
        {{ $lget(props, 'row.images', []) }}
      </template>

      <template v-if="props.colName === 'videos'">
        {{ $lget(props, 'row.videos', []) }}
      </template>

      <template v-if="props.colName === 'children'">
        <chats-table :remove-columns="['actions', 'children', 'parent']"
                     :query="{ _id: { $in: $lget(props, 'row.children', []) } }"
                     :qid="`childrenChatsAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </chats-table>
      </template>
    </template>
  </f-data-table>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';

  export default {
    name: 'ChatsTable',
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
        default: 'chatsAdmin',
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'rooms',
        name: 'rooms',
        qid: 'roomsChatsAdmin',
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
            name: 'sender',
            label: 'Sender',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.sender._fastjoin.owner.name', this.$lget(row, 'sender')),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'text',
            label: 'Text',
            align: 'left',
            field: row => this.$lget(row, 'text'),
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
            name: 'images',
            label: 'Images',
            align: 'left',
            field: row => this.$lget(row, 'images', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'videos',
            label: 'Videos',
            align: 'left',
            field: row => this.$lget(row, 'videos', []),
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
            path: 'text',
            attrs: {
              label: 'Text',
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
            path: 'room',
            attrs: {
              label: 'Room',
              'hide-selected': false,
              'fill-input': false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': (item) => this.$lget(item, 'name', this.$lget(item, '_id', '---')),
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
