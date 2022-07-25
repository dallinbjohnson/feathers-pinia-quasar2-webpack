<template>
  <f-data-table title="Lists"
                service="lists"
                :qid="qid"
                :limit="12"
                :query="query"
                :params="{
                    listResolversQuery: {
                      board: [
                        ['_id', 'name']
                      ],
                    }
                  }"
                :columns="columns"
                :remove-columns="removeColumns"
                :form-fields="formFields"
                create-title="List"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <template v-slot:expand="props">
      <template v-if="props.colName === 'cards'">
        <cards-table :remove-columns="['actions', 'owners', 'tags', 'cardEvents', 'children', 'comments', 'list']"
                     :query="{ _id: { $in: $lget(props, 'row.cards', []) } }"
                     :qid="`cardsListsAdmin${$lget(props, 'row._id')}`">
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
  import CardsTable from 'pages/admin/tables/CardsTable';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';

  export default {
    name: 'ListsTable',
    components: {CardsTable},
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
        default: 'listsAdmin',
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'boards',
        name: 'boards',
        qid: 'boardsListsAdmin',
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
            name: 'color',
            label: 'Color',
            align: 'left',
            isColor: true,
            field: row => this.$lget(row, 'color.hex'),
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
            name: 'order',
            label: 'Order',
            align: 'left',
            field: row => this.$lget(row, 'order'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'board',
            label: 'Board',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.board.name', this.$lget(row, 'board')),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'cards',
            label: 'Cards',
            align: 'left',
            field: row => this.$lget(row, 'cards', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'completeCard',
            label: 'Complete Card',
            align: 'left',
            field: row => this.$lget(row, 'completeCard'),
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
            fieldType: 'NumberInput',
            path: 'order',
            attrs: {
              min: 1,
              center: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'ColorPicker',
            path: 'color',
            // attrs: {
            //   palette: this.lightSpring,
            // },
          },
          {
            fieldType: 'ToggleMe',
            path: 'completeCard',
            attrs: {
              mode: 'acs-toggle',
              label: 'List completes card?',
              // 'toggle-indeterminate': true,
              'checked-text': 'YES',
              'unchecked-text': 'NO',
              dense: true,
              style: {
                'justify-content': 'center',
                display: 'flex',
              },
              'left-label': true,
              'attrs-label': {
                style: {
                  'font-size': '20px',
                },
              },
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'board',
            attrs: {
              label: 'Board',
              'hide-selected': false,
              'fill-input': false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              options: this.boards,
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
