<template>
  <f-data-table title="Cards"
                service="cards"
                :qid="qid"
                :limit="12"
                :query="query"
                :params="{
                    cardResolversQuery: {
                      list: [
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
                create-title="Card"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <template v-slot:expand="props">
      <template v-if="props.colName === 'owners'">
        <f-data-table title="Owners"
                      service="accounts"
                      qid="ownersCardsAdmin"
                      :limit="12"
                      :query="{ _id: { $in: $lget(props, 'row.owners', []) } }"
                      :params="{}"
                      :columns="ownerColumns">
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

      <template v-if="props.colName === 'comments'">
        <q-table :data="$lget(props, 'row.comments', [])"
                 :columns="[
                     {
                       name: 'comment',
                       label: 'Comment',
                       align: 'left',
                       field: row => $lget(row, 'comment'),
                       format: val => `${val}`,
                     },
                     {
                       name: 'createdBy',
                       label: 'Created By',
                       align: 'left',
                       field: row => $lget(row, '_fastjoin.createdBy.email', 'N/A'),
                       format: val => `${val}`,
                     },
                   ]"
                 :pagination="{rowsPerPage: 10}"></q-table>
      </template>

      <template v-if="props.colName === 'cardEvents'">
        <card-events-table :remove-columns="['actions', 'card']"
                           :query="{ _id: { $in: $lget(props, 'row.cardEvents', []) } }"
                           :qid="`cardEventsCardsAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </card-events-table>
      </template>

      <template v-if="props.colName === 'children'">
        <cards-table :remove-columns="['actions', 'owners', 'tags', 'cardEvents', 'children', 'parent', 'comments', 'list']"
                     :query="{ _id: { $in: $lget(props, 'row.children', []) } }"
                     :qid="`childrenCardsAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </cards-table>
      </template>
    </template>
  </f-data-table>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import CardEventsTable from 'pages/admin/tables/CardEventsTable';

  export default {
    name: 'CardsTable',
    components: {CardEventsTable},
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
        default: 'cardsAdmin',
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'lists',
        name: 'lists',
        qid: 'listsCardsAdmin',
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
            name: 'priority',
            label: 'Priority',
            align: 'left',
            field: row => this.$lget(row, 'priority'),
            format: val => `${val}`,
            sortable: true,
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
            name: 'description',
            label: 'Description',
            align: 'left',
            field: row => this.$lget(row, 'description'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'category',
            label: 'Category',
            align: 'left',
            field: row => this.$lget(row, 'category'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'order',
            label: 'Order',
            align: 'left',
            field: row => this.$lget(row, 'order'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'list',
            label: 'List',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.list.name', this.$lget(row, 'list')),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'owners',
            label: 'Owners',
            align: 'left',
            field: row => this.$lget(row, 'owners', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
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
            name: 'comments',
            label: 'Comments',
            align: 'left',
            field: row => this.$lget(row, 'comments', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'cardEvents',
            label: 'Card Events',
            align: 'left',
            field: row => this.$lget(row, 'cardEvents', []),
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
            name: 'completed',
            label: 'Completed',
            align: 'left',
            field: row => this.$lget(row, 'completed'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'completedAt',
            label: 'Completed At',
            align: 'left',
            field: row => this.$lget(row, 'completedAt'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'onServerAt',
            label: 'On Server At',
            align: 'left',
            field: row => this.$lget(row, 'onServerAt'),
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

      ownerColumns() {
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
            name: 'email',
            label: 'Email',
            align: 'left',
            field: row => this.$lget(row, 'email'),
            format: val => `${val}`,
            sortable: true,
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
            fieldType: 'EditorInput',
            path: 'description',
            label: 'Description',
            attrs: {
              toolbar: [
                [
                  {
                    icon: this.$q.iconSet.editor.formatting,
                    options: [
                      'bold',
                      'italic',
                      'strike',
                      'underline',
                    ],
                  },
                ],
                [
                  {
                    icon: this.$q.iconSet.editor.heading,
                    fixedLabel: true,
                    list: 'no-icons',
                    options: [
                      'h4',
                      'h5',
                      'h6',
                      'p',
                      'code',
                      'unordered',
                      'ordered',
                    ],
                  },
                ],
                [
                  {
                    icon: this.$q.iconSet.editor.align,
                    fixedLabel: true,
                    options: ['left', 'center', 'right', 'justify'],
                  },
                ],
                [
                  {
                    icon: this.$q.iconSet.uploader.upload,
                    options: ['insert_img', 'insert_video_url'],
                  },
                ],
                [
                  {
                    icon: 'handyman',
                    fixedLabel: true,
                    options: ['undo', 'redo', 'removeFormat', 'hr', 'link', 'viewsource'],
                  },
                ],
                ['fullscreen'],
              ],
            },
          },
          {
            fieldType: 'selectInput',
            path: 'priority',
            attrs: {
              label: 'Priority',
              'clear-icon': 'close',
              'map-options': true,
              'emit-value': true,
              options: [
                {label: 'Low', value: 'low'},
                {label: 'Medium', value: 'medium'},
                {label: 'High', value: 'high'},
                {label: 'Critical', value: 'critical'},
              ],
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'selectInput',
            path: 'category',
            attrs: {
              label: 'Category',
              'clear-icon': 'close',
              'emit-value': true,
              options: [{label: 'Lead', value: 'lead'}, {
                label: 'Task',
                value: 'task',
              }, {label: 'Question', value: 'question'}, {label: 'Research', value: 'research'}, {
                label: 'Other',
                value: 'other',
              }],
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'list',
            attrs: {
              label: 'List',
              'hide-selected': false,
              'fill-input': false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              options: this.lists,
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
