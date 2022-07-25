<template>
  <q-page id="FDataTablePage" class="q-pa-md">
    <div>

      <f-data-table title="Inventories"
                    service="inventories"
                    qid="inventories"
                    :limit="12"
                    :query="{}"
                    :params="params"
                    :columns="columns"
                    :form-fields="formFields"
                    create-title="Inventory"
                    @pagination-changed="setPagination">

        <template v-slot:expand="props">

          <template v-if="props.colName === 'counts'">
            <pre>{{ $lget(props, ['row', '_fastjoin', 'counts']) }}</pre>

          </template>
          <template v-if="props.colName === 'skus'">
            <div class="q-pa-md">
              <q-table
                title="SKUs"
                :data="$lget(props, ['row', 'skus'])"
              />
            </div>
          </template>
          <template v-if="props.colName === 'inventoryItems'">
            <inventory-items :remove-fields="['counts','product']"
                             :query="{ _id: { $in: $lget(props, 'row.inventoryItems', []) } }"
                             :qid="`inventoryItemsAdmin${$lget(props, ['row','_id'])}`"
            >
              <template v-slot:btn-toggle>
                <div></div>
              </template>
              <template v-slot:dialogBtn>
                <div></div>
              </template>

            </inventory-items>
          </template>
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
  import InventoryItems from 'components/profile/profile-admin/InventoryItems';
  // import RelatedAccountsTable from 'pages/admin/Accounts/AccountSlots/RelatedAccountsTable';

  export default {
    name: 'Inventories',
    components: {
      InventoryItems,
      FDataTable,
      // RelatedAccountsTable,
    },
    mixins: [ // gl-classes // gl-departments
      makeFindPaginateMixin({
        limit: 12,
        service: 'warehouses',
        name: 'warehouses',
        qid: 'warehouses',
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
        service: 'counts',
        name: 'counts',
        qid: 'counts',
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
      params() {
        return {
          userJoin: true,
          'inventories_fJoinHookResolversQuery': {
            warehouse: true,
            counts: true,
            inventoryItems: true,
          },
        };
      },
      columns() {
        return [
          {
            name: 'name',
            label: 'Name',
            align: 'left',
            field: row => this.$lget(row, 'name'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'warehouse',
            label: 'Warehouse',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'warehouse', 'text']),
            format: val => val,
            sortable: true,
          },
          {
            name: 'skus',
            label: 'SkUs',
            align: 'left',
            field: row => this.$lget(row, 'skus',[]),
            format: val => val,
            sortable: true,
            isExpansion: true,
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
            name: 'inventoryItems',
            label: 'Inventory Items',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'inventoryItems'], []),
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
            path: 'warehouse',
            attrs: {
              label: 'Warehouse',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'text',
              'bottom-slots': true,
              options: this.warehouses,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'SelectInput',
            path: 'counts',
            attrs: {
              label: 'Counts',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              'hide-selected': false,
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'description',
              required: true,
              multiple: true,
              'use-chips': true,
              options: this.counts,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'FormsetGenerator',
            label: 'SKUs:',
            itemLabel: 'SKU',
            add_form_btn_text: '',
            path: 'skus',
            attrs: {
              style: 'display: flex; justify-content: space-between;',
            },
            templateFormFields: [
              {
                fieldType: 'SelectInput',
                path: 'standard',
                attrs: {
                  label: 'Type',
                  filled: true,
                  clearable: true,
                  'clear-icon': 'close',
                  rules: [val => !!val || 'Required'],
                  options: [
                    'GS1 QR Code',
                    'GS1-128', 'ITF-14',
                    'GS1 Omnidirectional',
                    'GS1 Expanded',
                    'GS1 Stacked Omnidirectional',
                    'GS1 Expanded Stacked',
                    'GS1 Truncated',
                    'GS1 Limited',
                    'GS1 Stacked',
                    'EAN-2',
                    'EAN-E',
                    'EAN-5',
                    'EAN-8',
                    'EAN-13',
                    'UPC-A',
                    'Custom',
                  ],
                },
                'div-attrs': {
                  class: 'col-12',
                },
              },
              {
                fieldType: 'TextInput',
                path: 'version',
                attrs: {
                  label: 'Version',
                  type: 'text',
                  filled: true,
                  clearable: true,
                  'clear-icon': 'close',
                  required: true,
                },
                'div-attrs': {
                  class: 'col-6',
                },
              },
              {
                fieldType: 'TextInput',
                path: 'value',
                attrs: {
                  label: 'Value',
                  type: 'text',
                  filled: true,
                  clearable: true,
                  'clear-icon': 'close',
                  required: true,
                },
                'div-attrs': {
                  class: 'col-6',
                },
              },
            ],
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
