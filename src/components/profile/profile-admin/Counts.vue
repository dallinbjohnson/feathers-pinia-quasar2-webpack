<template>
  <q-page id="FDataTablePage" class="q-pa-md">
    <div>

      <f-data-table title="Counts"
                    service="counts"
                    qid="counts"
                    :limit="12"
                    :query="{}"
                    :params="params"
                    :columns="columns"
                    :form-fields="formFields"
                    create-title="Count"
                    @pagination-changed="setPagination">


                <template v-slot:expand="props">

                  <template v-if="props.colName === 'countInventoryItems'">
                    <count-inventory-items
                      :remove-fields="['count']"
                      :query="{ _id: { $in: $lget(props, 'row.countInventoryItems', []) } }"
                      :qid="`countInventoryItemsAdmin${$lget(props, ['row','_id'])}`"
                    >
                      <template v-slot:btn-toggle>
                        <div></div>
                      </template>
                      <template v-slot:hide-columns-select>
                        <div></div>
                      </template>
                    </count-inventory-items>
<!--                    <inventory-items

                    >
                      <template v-slot:btn-toggle>
                        <div></div>
                      </template>
                      <template v-slot:dialogBtn>
                        <div></div>
                      </template>

                    </inventory-items>-->
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
  import CountInventoryItems from 'components/profile/profile-admin/CountInventoryItems';
  // import RelatedAccountsTable from 'pages/admin/Accounts/AccountSlots/RelatedAccountsTable';

  export default {
    name: 'Counts',
    components: {
      CountInventoryItems,
      FDataTable,
      // RelatedAccountsTable,
    },
    mixins: [ // gl-classes // gl-departments
      makeFindPaginateMixin({
        limit: 12,
        service: 'board-templates',
        name: 'boardTemplates',
        qid: 'boardTemplates',
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
        service: 'boards',
        name: 'boards',
        qid: 'boards',
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
          'counts_fJoinHookResolversQuery':{
            boardTemplate: true,
            board: true,
            inventory: true,
          }
        };
      },
      columns() {
        return [
          {
            name: 'description',
            label: 'Description',
            align: 'left',
            field: row => this.$lget(row, 'description'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'boardTemplate',
            label: 'Board Template',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin','boardTemplate','name']),
            format: val => val,
            sortable: true,
          },
          {
            name: 'board',
            label: 'Board',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin','board','name']),
            format: val => val,
            sortable: true,
          },
          {
            name: 'inventory',
            label: 'Inventory',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin','inventory','name']),
            format: val => val,
            sortable: true,
          },
          {
            name: 'countInventoryItems',
            label: 'Inventory Count',
            align: 'left',
            field: row => this.$lget(row, ['countInventoryItems']),
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
            path: 'description',
            attrs: {
              label: 'Description',
              type: 'textarea',
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
            path: 'boardTemplate',
            attrs: {
              label: 'Board Template',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              options: this.boardTemplates,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'SelectInput',
            path: 'board',
            attrs: {
              label: 'Board',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              options: this.boards,
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
              options: this.inventories,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },

        ];
      },
    },

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
