<template>
  <q-page id="FDataTablePage" class="q-pa-md">
    <f-data-table title="Stores"
                  service="stores"
                  qid="stores"
                  :limit="12"
                  :query="{}"
                  :params="{
                   'stores_fJoinHookResolversQuery': {
                      product: true,
                      quickbooksConnection: true,
                      glClass: true,
                      glDepartment: true,
                      saleReps: [['_id','name','email','avatar']]
                    },
                    'storesResolversQuery': {
                      members: [['_id','name','email','avatar']],
                      owners: [['_id','name','email','avatar']],
                    },
                    userJoin: true,
                  }"
                  :columns="columns"
                  :form-fields="formFields"
                  create-title="Store"
                  @pagination-changed="setPagination">

      <template v-slot:expand="props">

        <template v-if="props.colName === 'saleReps'">
          <related-accounts-table :props="props" path="_fastjoin.saleReps"/>
        </template>

        <template v-if="props.colName === 'members'">
          <related-accounts-table :props="props" path="_fastjoin.membership.members"/>
        </template>
        <template v-if="props.colName === 'owners'">
          <related-accounts-table :props="props" path="_fastjoin.ownership.owners"/>
        </template>

      </template>
      <template v-slot:dialog-card-section="props">
        <template v-if="props.colName === 'saleReps'">
          <related-accounts-table :props="props" path="row"/>
        </template>
        <template v-if="props.colName === 'members'">
          <related-accounts-table :props="props" path="_fastjoin.membership.members"/>
        </template>
        <template v-if="props.colName === 'owners'">
          <related-accounts-table :props="props" path="_fastjoin.ownership.owners"/>
        </template>
      </template>
    </f-data-table>
  </q-page>
</template>

<script>
  // import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import RelatedAccountsTable from 'pages/admin/Accounts/AccountSlots/RelatedAccountsTable';

  export default {
    name: 'MyStores',
    components: {
      RelatedAccountsTable,
    },
    mixins: [ // gl-classes // gl-departments
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
      makeFindPaginateMixin({
        limit: 5,
        service: 'companies',
        name: 'companies',
        qid: 'companies',
        infinite: true,
        query() {
          return {
            ...this.localCompaniesQuery,
          };
        },
        params() {
          return {
            'quickbooks/companies_fJoinHookResolversQuery': {
              accounts: true,
            },
          };
        },
      }),

      makeFindPaginateMixin({
        limit: 12,
        service: 'gl-departments',
        name: 'glDepartments',
        qid: 'glDepartments',
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
        service: 'gl-classes',
        name: 'glClasses',
        qid: 'glClasses',
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
            name: 'product',
            label: 'Product',
            align: 'left',
            field: (row) => this.$lget(row, ['_fastjoin', 'product', 'title']),
            format: val => val,
            sortable: true,
            required: true,
          },
          {
            name: 'quickbooksConnection',
            label: 'Quickbooks Connection',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'quickbooksConnection', 'name']),
            format: val => val,
            sortable: true,
          },
          {
            name: 'glClass',
            label: 'GL Class',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'glClass', 'name']),
            format: val => val,
            sortable: true,
          },
          {
            name: 'glDepartment',
            label: 'GLDepartment',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'glDepartment', 'name']),
            format: val => val,
            sortable: true,
          },
          {
            name: 'saleReps',
            label: 'Sale Reps',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'saleReps'], []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'owners',
            label: 'Store Owners',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'ownership', 'owners'], []),
            format: val => val.map(item => item.id),
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'members',
            label: 'Store Members',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'membership', 'members'], []),
            format: val => val,
            sortable: true,
            isExpansion: true,
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
            fieldType: 'SelectOrAdd',
            path: 'product',
            modelName: 'Products',
            serviceToAdd: 'products',
            serviceToAddIcon: 'fab fa-product-hunt',
            serviceToAddOptionsMapping: {
              label: 'title',
              description: 'description',
              avatar: 'image',
            },
            serviceToAddFields: [
              {
                fieldType: 'TextInput',
                path: 'title',
                attrs: {
                  label: 'Title',
                  type: 'text',
                  filled: true,
                  clearable: false,
                  'clear-icon': 'close',
                  maxlength: 255,
                  required: true,
                  'lazy-rules': true,
                  rules: [val => val && val.length >= 3 || 'Title should be at least 3 characters'],
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
                  maxlength: 255,
                  required: true,
                  'lazy-rules': true,
                  rules: [val => val && val.length >= 10 || 'Description should be at least 10 characters'],
                },
                'div-attrs': {
                  class: 'col-12',
                },

              },
            ],
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
              // 'use-chips': true,
              'options-selected-class': '',
              'bottom-slots': true,
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
            path: 'quickbooksConnection',
            attrs: {
              label: 'Quickbooks Connection',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              // 'use-chips': true,
              'bottom-slots': true,
              options: this.companies,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'SelectOrAdd',
            path: 'glClass',
            modelName: 'GlClasses',
            serviceToAdd: 'gl-classes',
            serviceToAddIcon: 'fab fa-product-hunt',
            serviceToAddOptionsMapping: {
              label: 'name',
            },
            serviceToAddFields: [
              {
                fieldType: 'TextInput',
                path: 'name',
                attrs: {
                  label: 'Name',
                  type: 'text',
                  filled: true,
                  clearable: false,
                  'clear-icon': 'close',
                  maxlength: 255,
                  required: true,
                  'lazy-rules': true,
                  rules: [val => val && val.length >= 3 || 'Name should be at least 3 characters'],
                },
                'div-attrs': {
                  class: 'col-12',
                },
              },
            ],
            attrs: {
              label: 'GL Class',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              // 'use-chips': true,
              'options-selected-class': '',
              'bottom-slots': true,
              options: this.glClasses,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'SelectOrAdd',
            path: 'glDepartment',
            modelName: 'GLDepartments',
            serviceToAdd: 'gl-departments',
            serviceToAddIcon: 'fab fa-product-hunt',
            serviceToAddOptionsMapping: {
              label: 'name',
            },
            serviceToAddFields: [
              {
                fieldType: 'TextInput',
                path: 'name',
                attrs: {
                  label: 'Name',
                  type: 'text',
                  filled: true,
                  clearable: false,
                  'clear-icon': 'close',
                  maxlength: 255,
                  required: true,
                  'lazy-rules': true,
                  rules: [val => val && val.length >= 3 || 'Name should be at least 3 characters'],
                },
                'div-attrs': {
                  class: 'col-12',
                },
              },
            ],
            attrs: {
              label: 'GL Department',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              // 'use-chips': true,
              'options-selected-class': '',
              'bottom-slots': true,
              options: this.glDepartments,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'SelectInput',
            path: 'saleReps',
            attrs: {
              label: 'Sales Reps',
              'hide-selected': false,
              'fill-input': false,
              multiple: true,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'use-chips': true,
              'bottom-slots': true,
              options: this.accounts,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          // {
          //   fieldType: 'SelectInput',
          //   path: 'ownership.owners',
          //   attrs: {
          //     label: 'Owners',
          //     'hide-selected': false,
          //     'fill-input': false,
          //     multiple: true,
          //     'dropdown-icon': 'fas fa-chevron-down',
          //     'emit-value': true,
          //     'map-options': true,
          //     'option-value': '_id',
          //     'option-label': 'name',
          //     'use-chips': true,
          //     'bottom-slots': true,
          //     options: this.accounts,
          //   },
          //   'div-attrs': {
          //     class: 'col-12',
          //   },
          //   // slots: [/*'selected-item', 'option'*/],
          // },
          {
            fieldType: 'SelectInput',
            path: 'membership',
            attrs: {
              label: 'Members',
              'hide-selected': false,
              'fill-input': false,
              multiple: true,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'use-chips': true,
              'bottom-slots': true,
              options: this.accounts,
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
    watch: {
      $activeAccount: {
        immediate: true,
        deep: true,
        handler(newVal) {
          this.$lset(this.localCompaniesQuery, ['_id', '$in'], this.$lget(newVal, ['quickbooks', 'connections'], []));
          this.localCompaniesQuery = Object.assign({}, this.localCompaniesQuery);
        },
      },
    },

    methods: {
      setPagination(newVal) {
        console.log('working: ', newVal.pagination);
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
