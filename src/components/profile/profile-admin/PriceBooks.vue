<template>
  <q-page id="FDataTablePage" class="q-pa-md">
    <div>

      <f-data-table title="Price Books"
                    service="price-books"
                    qid="priceBooks"
                    :limit="12"
                    :query="{}"
                    :params="params"
                    :columns="columns"
                    :form-fields="formFields"
                    create-title="PriceBook"
                    @pagination-changed="setPagination">

        <template v-slot:expand="props">

          <template v-if="props.colName === 'products'">

            <q-table
              flat
              :data="matchData(props.row)">
              <template v-slot:top-right>
                <q-input outlined borderless dense debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-input>
              </template>
              <template #body-cell="scope">
                <q-td v-if="scope.col.name === 'product' ">
                  <div>
                    <span class="text-primary text-bold">Title: </span>
                    <div>{{ scope.row[scope.col.name]['title'] }}</div>
                  </div>
                  <div>
                    <span class="text-primary text-bold ">Description: </span>
                    <div style="max-width: 80vw; word-break: break-all;">
                      {{ scope.row[scope.col.name]['description'] }}
                    </div>
                  </div>
                </q-td>
                <q-td v-else class="text-right">
                  $ {{ scope.row[scope.col.name] }}
                </q-td>
              </template>
            </q-table>
          </template>

        </template>
        <template v-slot:dialog-card-section="props">
          <template v-if="props.colName === 'products'">

            <q-table grid :data="matchData(props.row)">
              <template v-slot:top-right>
                <q-input outlined borderless dense debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search"/>
                  </template>
                </q-input>
              </template>
              <template #item="props">
                <q-card class="q-ma-md full-width" flat bordered>
                  <q-card-section horizontal>
                    <q-card-section class="q-pt-xs col-7">
                      <div class="text-h5 q-mt-sm q-mb-xs">{{ $lget(props, ['row', 'product', 'title']) }}</div>
                      <div class="text-caption text-grey">
                        {{ $lget(props, ['row', 'product', 'description']) }}
                      </div>
                    </q-card-section>

                    <q-card-section class="col-5 flex flex-center">
                      <h4> {{ $lget(props, ['row', 'price']) }}</h4>
                    </q-card-section>
                  </q-card-section>

                  <!--                  <q-separator />-->

                  <!--                  <q-card-actions>-->
                  <!--                    <q-btn flat round icon="event" />-->
                  <!--                    <q-btn flat>-->
                  <!--                      7:30PM-->
                  <!--                    </q-btn>-->
                  <!--                    <q-btn flat color="primary">-->
                  <!--                      Reserve-->
                  <!--                    </q-btn>-->
                  <!--                  </q-card-actions>-->
                </q-card>
              </template>
            </q-table>
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
  // import RelatedAccountsTable from 'pages/admin/Accounts/AccountSlots/RelatedAccountsTable';

  export default {
    name: 'PriceBooks',
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
        default: 'priceBooksAdmin',
      },
    },
    components: {
      FDataTable,
      // RelatedAccountsTable,
    },
    mixins: [ // gl-classes // gl-departments

    ],
    data() {
      return {
        localCompaniesQuery: {},
        filter: '',
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
          productsResolversQuery: {
            products: true,
          },
        };
      },
      columns() {
        return [
          {
            name: 'description',
            label: 'Description',
            align: 'left',
            field: row => this.$lget(row, 'description', ''),
            format: val => val,
            sortable: true,
          },
          {
            name: 'products',
            label: 'Products',
            align: 'left',
            field: row => this.$lget(row, ['_fastjoin', 'products'], ''),
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
            fieldType: 'PriceListSelect',
            path: 'products',
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
      matchData(row) {
        const allData = this.$lget(row, ['_fastjoin', 'products']);
        const filter = (value) => {
          return this.$lget(value, ['product', 'title'], '').includes(this.filter)
            || this.$lget(value, ['product', 'description'], '').includes(this.filter)
            || this.$lget(value,['price'])&& this.$lget(value,['price']).toString().includes(this.filter);
        };
        return allData.filter(prod => filter(prod));
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
