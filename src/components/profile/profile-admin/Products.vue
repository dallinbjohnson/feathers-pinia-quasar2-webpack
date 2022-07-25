<template>
  <q-page id="FDataTablePage" class="q-pa-md">
    <div>

      <f-data-table title="Products"
                    service="products"
                    :qid="qid"
                    :limit="12"
                    :query="query"
                    :params="params"
                    :columns="finalColumns"
                    :form-fields="formFields"
                    create-title="Product"
                    @pagination-changed="setPagination"
      >

        <template v-slot:expand="props">

          <template v-if="props.colName === 'priceBooks'">
            <price-books
              :remove-fields="['product']"
              :query="{ _id: { $in: $lget(props, 'row.inventoryItems', []) } }"
              :qid="`priceBooksAdmin${$lget(props, ['row','_id'])}`"
            >
              <template v-slot:btn-toggle>
                <div></div>
              </template>
              <template v-slot:dialogBtn>
                <div></div>
              </template>
            </price-books>
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
  import {capitalize, kebabize} from '@iy4u/common-client-lib/src/utils';
  import InventoryItems from 'components/profile/profile-admin/InventoryItems';
  import PriceBooks from 'components/profile/profile-admin/PriceBooks';
  // import RelatedAccountsTable from 'pages/admin/Accounts/AccountSlots/RelatedAccountsTable';

  export default {
    name: 'Products',
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
        default: 'productsAdmin',
      },
    },
    components: {
      PriceBooks,
      InventoryItems,
      FDataTable,
      // RelatedAccountsTable,
    },
    mixins: [ // gl-classes // gl-departments

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
          'products_fJoinHookResolversQuery': {
            priceBooks: true,
            inventoryItems: [
              []
            ]
          }
        };
      },
      columns() {
        return [
          {
            name: 'title',
            label: 'Title',
            align: 'left',
            field: row => this.$lget(row, 'title'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'description',
            label: 'Description',
            align: 'left',
            field: row => this.$lget(row, 'description'),
            format: val => val,
            sortable: true,
            style: (this.$q.screen !== 'sm') || (this.$q.screen !== 'xs') ? 'white-space: normal !important; min-width:300px;': ''
          },
          {
            name: 'priceBooks',
            label: 'Price Books',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin','priceBooks'],[]),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'inventoryItems',
            label: 'inventory-items',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin','inventoryItems'],[]),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'createdAt',
            label: 'Created At',
            align: 'left',
            field: row => date.formatDate(row.createdAt, 'DD-MM-YYYY hh:mm A'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'updatedAt',
            label: 'Updated At',
            align: 'left',
            field: row => date.formatDate(row.updatedAt, 'DD-MM-YYYY hh:mm A'),
            format: val => val,
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
            path: 'title',
            attrs: {
              label: 'Title',
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
            fieldType: 'TextInput',
            path: 'description',
            attrs: {
              label: 'Description',
              type: 'textarea',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
            },
            'div-attrs': {
              class: 'col-12',
            },
          },

        ];
      },
    },
    methods: {
      capitalize, kebabize,
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
      formatDate(yourDate) {
        return date.formatDate(yourDate, 'DD-MM-YYYY hh:mm A');
      },
    },
  };
</script>

<style scoped lang="scss">
  .q-table td, .q-table th {
    /* don't shorten cell contents */
    white-space: normal !important;
  }
</style>
