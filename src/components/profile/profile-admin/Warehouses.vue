<template>
  <q-page id="FDataTablePage" class="q-pa-md">
    <div>

      <f-data-table title="Warehouses"
                    service="warehouses"
                    qid="warehouses"
                    :limit="12"
                    :query="{}"
                    :params="params"
                    :columns="columns"
                    :form-fields="formFields"
                    create-title="Warehouse"
                    @pagination-changed="setPagination">

<!--        <template v-slot:expand="props">

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
        </template>-->
      </f-data-table>
    </div>
  </q-page>
</template>

<script>
  // import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import FDataTable from '@iy4u/common-client-lib/src/components/common/molecules/feathers/FDataTable/FDataTable';
  import {date} from 'quasar';
  // import RelatedAccountsTable from 'pages/admin/Accounts/AccountSlots/RelatedAccountsTable';

  export default {
    name: 'Warehouses',
    components: {
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
      params() {
        return {
          userJoin: true,
        };
      },
      columns() {
        return [
          {
            name: 'text',
            label: 'Text',
            align: 'left',
            field: row => this.$lget(row, 'text'),
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
        ];
      },
    },
    watch: {

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
