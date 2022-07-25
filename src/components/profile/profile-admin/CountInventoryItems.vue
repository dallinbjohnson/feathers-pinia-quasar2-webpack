<template>
  <q-page id="FDataTablePage" class="q-pa-md">
    <div>

      <f-data-table title="Inventory Count"
                    service="count-inventory-items"
                    :qid="qid"
                    :limit="12"
                    :query="query"
                    :params="params"
                    :columns="finalColumns"
                    :form-fields="formFields"
                    create-title="Inventory Count"
                    @pagination-changed="setPagination">

<!--        <template v-slot:expand="props">
          <template v-if="props.colName === 'counts'">
            <pre>{{ $lget(props, ['row', '_fastjoin', 'counts']) }}</pre>
          </template>

        </template>-->

        <template v-for="slot in Object.keys($slots)"
                  v-slot:[slot]="slotProps">
          <slot :name="slot" v-bind="slotProps"></slot>
        </template>

      </f-data-table>
    </div>
  </q-page>
</template>

<script>
  // import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import FDataTable from '@iy4u/common-client-lib/src/components/common/molecules/feathers/FDataTable/FDataTable';
  import {date} from 'quasar';
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  // import RelatedAccountsTable from 'pages/admin/Accounts/AccountSlots/RelatedAccountsTable';

  export default {
    name: 'CountInventoryItems',
    props: {
      removeFields: {
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
        default: 'countInventoryItemAdmin',
      },
    },
    components: {
      FDataTable,
      // RelatedAccountsTable,
    },
    mixins: [ // gl-classes // gl-departments
      makeFindPaginateMixin({
        limit: 12,
        service: 'inventory-items',
        name: 'inventoryItems',
        qid: 'inventoryItems',
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
        service: 'cards',
        name: 'cards',
        qid: 'cards',
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
        name: 'accounts',
        qid: 'accounts',
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
        localCompaniesQuery: {},
      };
    },
    computed: {

      finalColumns() {
        let arr = Array.from(this.columns);
        this.removeFields.forEach(item => {
          arr = arr.filter(obj => obj.name !== item);
        });
        return arr;
      },

      params() {
        return {
          userJoin: true,
          'count-inventory-items_fJoinHookResolversQuery': {
            inventory: true,
            card: true
          },
          accountsResolversQuery: {
            countedBy: true,
            adjustedBy: true
          }
        };
      },
      columns() {
        return [
          // {
          //   name: 'inventoryItem',
          //   label: 'Inventory Item',
          //   align: 'left',
          //   field: row => this.$lget(row, ['_fastjoin', 'inventoryItem', 'title']),
          //   format: val => val,
          //   sortable: true,
          // },
          // {
          //   name: 'count',
          //   label: 'Count',
          //   align: 'left',
          //   field: row => this.$lget(row, ['_fastjoin', 'count', 'description']),
          //   format: val => val,
          //   sortable: true,
          // },
          {
            name: 'card',
            label: 'Card',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'card', 'name']),
            format: val => val,
            sortable: true,
          },
          {
            name: 'inventoryQuantity',
            label: 'Inventory Quantity',
            align: 'left',
            field: row => this.$lget(row, 'inventoryQuantity'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'actualQuantity',
            label: 'Actual Quantity',
            align: 'left',
            field: row => this.$lget(row, 'actualQuantity'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'adjustment',
            label: 'Adjustment',
            align: 'left',
            field: row => this.$lget(row, 'adjustment'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'countedBy',
            label: 'Counted By',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin','countedBy']),
            format: val => val,
            sortable: true,
          },{
            name: 'adjustedBy',
            label: 'Adjustment By',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin','adjustedBy']),
            format: val => val,
            sortable: true,
          },

          {
            name: ' adjustedDate',
            label: 'Adjusted At',
            align: 'left',
            field: row => date.formatDate(row.adjustedDate, 'DD-MM-YYYY hh:mm A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'createdAt',
            label: 'Created At',
            align: 'left',
            field: row => date.formatDate(row.createdAt, 'DD-MM-YYYY hh:mm A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'updatedAt',
            label: 'Updated At',
            align: 'left',
            field: row => date.formatDate(row.updatedAt, 'DD-MM-YYYY hh:mm A'),
            format: val => `${val}`,
            sortable: true,
          },
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
          // {
          //   fieldType: 'TextInput',
          //   path: 'count',
          //   attrs: {
          //     label: 'Count',
          //     type: 'text',
          //     filled: true,
          //     clearable: true,
          //     'clear-icon': 'close',
          //     required: true,
          //     value: this.qid
          //   },
          //   'div-attrs': {
          //     class: 'col-12',
          //   },
          // },
          {
            fieldType: 'SelectInput',
            path: 'inventoryItem',
            attrs: {
              label: 'Inventory Item',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'title',
              'bottom-slots': true,
              'use-chips': true,
              options: this.inventoryItems,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'SelectInput',
            path: 'card',
            attrs: {
              label: 'Card',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              // 'use-chips': true,
              options: this.cards,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'TextInput',
            path: 'inventoryQuantity',
            attrs: {
              label: 'Inventory Quantity',
              type: 'number',
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
            path: 'actualQuantity',
            attrs: {
              label: 'Actual Quantity',
              type: 'number',
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
            fieldType: 'CountedByListSelect',
            path: 'countedBy',
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'adjustment',
            attrs: {
              label: 'Adjustment',
              type: 'number',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              // required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'adjustedBy',
            attrs: {
              label: 'Adjusted By',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              // 'use-chips': true,
              options: this.accounts,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'CtkDatePicker',
            path: 'adjustedDate',
            attrs: {
              label: 'Adjustment Date',
              'only-date': true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },

        ];
      },
    },
    watch: {},

    methods: {
      setPagination(newVal) {
        this[`${this.$lget(newVal, 'service')}Limit`] = newVal.pagination.rowsPerPage === 0 ? this[`${this.$lget(newVal, 'service')}Total`] : newVal.pagination.rowsPerPage;
        this[`${this.$lget(newVal, 'service')}CurrentPage`] = newVal.pagination.page;
        this.pagination = newVal.pagination;

        if (newVal.pagination.sortBy) {
          this.sort = {[newVal.pagination.sortBy]: newVal.pagination.descending ? -1 : 1};
        } else {
          this.sort = {
            createdAt: -1,
          };
        }
      },
    },
  };
</script>

<style scoped>

</style>
