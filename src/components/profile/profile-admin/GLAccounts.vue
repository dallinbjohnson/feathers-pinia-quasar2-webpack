<template>
  <q-page id="FDataTablePage" class="q-pa-md">
    <div>

      <f-data-table title="GL Accounts"
                    service="gl-accounts"
                    qid="glAccounts"
                    :limit="12"
                    :query="{}"
                    :params="params"
                    :columns="columns"
                    :form-fields="formFields"
                    create-title="GL Account"
                    @pagination-changed="setPagination">

        <template v-slot:expand="props">

          <template v-if="props.colName === 'children'">
            <q-table flat :data="$lget(props,['row','_fastjoin','children'])" :visible-columns="['name','createdAt','updatedAt']" />
          </template>


        </template>
        <template v-slot:dialog-card-section="props">
          <template v-if="props.colName === 'children'">

            <q-table grid flat :data="$lget(props,['row','_fastjoin','children'])" :visible-columns="['name','createdAt','updatedAt']">

                <template #item="scope">
                  <q-card class="q-ma-md" bordered>
                    <q-card-section>
                      <q-list dense>
                        <template v-for="(key) in Object.keys(scope.colsMap)" :key="key">
                          <q-item>
                            <q-item-section>
                              <q-item-label header class="text-bold text-capitalize">
                                {{ capitalize(kebabize(key).replace('-', ' ')) }}
                              </q-item-label>
                            </q-item-section>
                            <q-item-section side>

                              <q-item-label v-if="key ==='createdAt' || key ==='updatedAt'">
                                {{ formatDate($lget(scope, ['row', key])) }}
                              </q-item-label>

                              <q-item-label v-if="key==='name'">
                                {{ $lget(scope, ['row', key]) }}
                              </q-item-label>

                            </q-item-section>
                          </q-item>

                        </template>
                      </q-list>
                    </q-card-section>
                  </q-card>
                </template>
            </q-table>
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
  import {capitalize, kebabize} from '@iy4u/common-client-lib/src/utils';
  // import RelatedAccountsTable from 'pages/admin/Accounts/AccountSlots/RelatedAccountsTable';

  export default {
    name: 'MyGLClasses',
    components: {
      FDataTable,
      // RelatedAccountsTable,
    },
    mixins: [ // gl-classes // gl-departments
      makeFindPaginateMixin({
        limit: 12,
        service: 'gl-accounts',
        name: 'glAccounts',
        qid: 'glAccounts',
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
          'gl-accounts_fJoinHookResolversQuery': {
            parent: [['_id','name']],
            children: [['name','createdAt', 'updatedAt']]
          },
          userJoin: true,
        };
      },
      columns() {
        return [
          {
            name: 'name',
            label: 'Name',
            align: 'left',
            field: row => this.$lget(row, 'name'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'parent',
            label: 'Parent',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'parent','name']),
            format: val => val,
            sortable: true,
          },
          {
            name: 'children',
            label: 'Children',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'children'],[]),
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
            path: 'parent',
            attrs: {
              label: 'Parent',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              options: this.glAccounts,
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

<style scoped>

</style>
