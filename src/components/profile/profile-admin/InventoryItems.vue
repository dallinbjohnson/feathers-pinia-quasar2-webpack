<template>
  <q-page id="FDataTablePage" class="q-pa-md">
    <div>

      <f-data-table title="Inventory Items"
                    service="inventory-items"
                    :qid="qid"
                    :limit="12"
                    :query="query"
                    :params="params"
                    :columns="finalColumns"
                    :form-fields="formFields"
                    create-title="Inventory Item"
                    @pagination-changed="setPagination">

<!--        <template v-slot:expand="props">
          <template v-if="props.colName === 'counts'">
            <pre>{{ $lget(props, ['row', '_fastjoin', 'counts']) }}</pre>
          </template>

        </template>
    -->

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
    name: 'InventoryItems',
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
        default: 'inventoryItemAdmin',
      },
    },
    components: {
      FDataTable,
      // RelatedAccountsTable,
    },
    mixins: [ // gl-classes // gl-departments
      makeFindPaginateMixin({
        limit: 12,
        service: 'inventories',
        name: 'inventories',
        qid: 'inventories',
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
        service: 'products',
        name: 'products',
        qid: 'products',
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
          'inventory-items_fJoinHookResolversQuery': {
            inventory: true,
            product: true,
            counts: true,
          },
        };
      },
      columns() {
        return [
          {
            name: 'product',
            label: 'Product',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'product', 'title']),
            format: val => val,
            sortable: true,
          },
          {
            name: 'inventory',
            label: 'Inventory',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'inventory', 'name']),
            format: val => val,
            sortable: true,
          },
          {
            name: 'quantity',
            label: 'Quantity',
            align: 'left',
            field: row => this.$lget(row, 'quantity'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'quantityDate',
            label: 'Quantity Date',
            align: 'left',
            field: row => date.formatDate(row.quantityDate, 'DD-MM-YYYY hh:mm A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'counts',
            label: 'Counts',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'counts'], []),
            format: val => val,
            sortable: true,
            isExpansion: true,
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
          {
            fieldType: 'SelectInput',
            path: 'product',
            attrs: {
              label: 'Product',
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
              options: this.products,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'SelectInput',
            path: 'inventory',
            attrs: {
              label: 'Inventory',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              'use-chips': true,
              options: this.inventories,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'TextInput',
            path: 'quantity',
            attrs: {
              label: 'Quantity',
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
            fieldType: 'CtkDatePicker',
            path: 'quantityDate',
            attrs: {
              label: 'Quantity Date',
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
