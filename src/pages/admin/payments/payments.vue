<template>
  <q-page id="Payments" class="q-pa-md">
    <f-data-table title="Payments"
                  service="payments"
                  qid="paymentsAdmin"
                  :limit="12"
                  :query="{}"
                  :params="{
                    paymentsResolversQuery: {
                      paymentDetails: {
                        args: [],
                        store: [['_id', 'name']],
                        account: [['_id', 'name']],
                        card: [['_id', 'name']],
                      }
                    }
                  }"
                  :columns="columns"
                  :form-fields="formFields"
                  create-title="Payment">
      <template v-slot:expand="props">
        <template v-if="props.colName === 'paymentDetails'">
          <data-table :title="props.col.label" :data="props.col.value" :columns="paymentDetailsColumns" root-field-path="amount"></data-table>
        </template>
      </template>
    </f-data-table>
  </q-page>
</template>

<script>
  import {date} from 'quasar';
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import DataTable from 'components/common/molecules/DataTable/DataTable';

  export default {
    name: 'Payments',
    components: {
      DataTable,
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'boards',
        name: 'boards',
        qid: 'paymentsBoardAdmin',
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
        service: 'board-templates',
        name: 'boardTemplates',
        qid: 'paymentsBoardTemplatesAdmin',
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
        qid: 'paymentsAccountAdmin',
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
        service: 'stores',
        name: 'stores',
        qid: 'paymentsStoreAdmin',
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
        qid: 'paymentsCardAdmin',
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
    computed: {
      paymentDetailsColumns() {
        return [
          {
            name: 'amount',
            label: 'Amount',
            align: 'left',
            field: row => this.$lget(row, 'amount'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'paidAmount',
            label: 'Paid Amount',
            align: 'left',
            field: row => this.$lget(row, 'paidAmount'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'memo',
            label: 'Memo',
            align: 'left',
            field: row => this.$lget(row, 'memo'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'store',
            label: 'Store',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.store'),
            format: val => val.name,
            sortable: true,
          },
          {
            name: 'account',
            label: 'Account',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.account'),
            format: val => val.name,
            sortable: true,
          },
          {
            name: 'card',
            label: 'Card',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.card'),
            format: val => val.name,
            sortable: true,
          },
          {
            name: 'externalRef',
            label: 'External Reference',
            align: 'left',
            field: row => this.$lget(row, 'externalRef'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'externalRefDate',
            label: 'External Reference Date',
            align: 'left',
            field: row => this.$lget(row, 'externalRefDate'),
            format: val => `${val}`,
            sortable: true,
          },
        ];
      },
      columns() {
        return [
          {
            name: 'referenceNumber',
            label: 'Reference Number',
            align: 'left',
            field: row => this.$lget(row, 'referenceNumber'),
            format: val => val,
            sortable: true,
            required: true,
          },
          {
            name: 'memo',
            label: 'Memo',
            align: 'left',
            field: row => this.$lget(row, 'memo'),
            format: val => `${val}`,
            sortable: true,
            required: true,
          },
          {
            name: 'boardTemplate',
            label: 'Board Template',
            align: 'left',
            field: row => this.$lget(row, 'boardTemplate'),
            format: val => `${val}`,
            sortable: true,
            required: true,
          },
          {
            name: 'board',
            label: 'Board',
            align: 'left',
            field: row => this.$lget(row, 'board'),
            format: val => `${val}`,
            sortable: true,
            required: true,
          },
          {
            name: 'paymentDetails',
            label: 'Payment Details',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.paymentDetails'),
            format: val => val,
            sortable: true,
            required: true,
            isExpansion: true,
          },
          {
            name: 'createdBy',
            label: 'Created By',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.createdBy.email'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'updatedBy',
            label: 'Updated By',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.updatedBy.email'),
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
            path: 'referenceNumber',
            attrs: {
              label: 'Reference Number',
              type: 'text',
              filled: true,
              color: 'primary',
              clearable: true,
              'clear-icon': 'close',
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'memo',
            attrs: {
              label: 'Memo',
              type: 'textarea',
              filled: true,
              color: 'primary',
              clearable: true,
              'clear-icon': 'close',
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
              color: 'primary',
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'use-chips': true,
              'bottom-slots': true,
              options: this.boards,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'SelectInput',
            path: 'boardTemplate',
            attrs: {
              label: 'Board Template',
              'hide-selected': false,
              'fill-input': false,
              color: 'primary',
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'use-chips': true,
              'bottom-slots': true,
              options: this.boardTemplates,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'GroupLayoutDialog',
            label: 'Payment Details',
            path: 'paymentDetails',
            return_object_no_key: true,
            'btn-attrs': {
              label: 'Add Payment Details',
            },
            'div-attrs': {
              class: 'col-12 flex flex-center',
            },
            // 'dialog-attrs': {
            //   'full-width': true,
            // },
            templateFormFields: [
              {
                fieldType: 'FormsetGenerator',
                label: 'Payment Details:',
                itemLabel: 'Payment Detail',
                add_form_btn_text: 'Payment Detail',
                path: 'paymentDetails',
                templateFormFields: [
                  {
                    fieldType: 'NumberInput',
                    path: 'amount',
                    label: 'Amount',
                    attrs: {
                      min: 0,
                    },
                  },
                  {
                    fieldType: 'NumberInput',
                    path: 'paidAmount',
                    label: 'Paid Amount',
                    attrs: {
                      min: 0,
                    },
                  },
                  {
                    fieldType: 'CtkDatePicker',
                    path: 'paidDate',
                    attrs: {
                      label: 'Paid Date',
                      formatted: 'MMM DD, YYYY - h:mm A',
                      rules: [
                        (input) => {
                          return !!input;
                        },
                      ],
                    },
                    slots: ['prepend'],
                    'div-attrs': {
                      class: 'col-12',
                    },
                  },
                  {
                    fieldType: 'TextInput',
                    path: 'memo',
                    attrs: {
                      label: 'Memo',
                      type: 'textarea',
                      filled: true,
                      color: 'primary',
                      clearable: true,
                      'clear-icon': 'close',
                    },
                    'div-attrs': {
                      class: 'col-12',
                    },
                  },
                  {
                    fieldType: 'SelectInput',
                    path: 'account',
                    attrs: {
                      label: 'Account',
                      'hide-selected': false,
                      'fill-input': false,
                      color: 'primary',
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
                  {
                    fieldType: 'SelectInput',
                    path: 'store',
                    attrs: {
                      label: 'Store',
                      'hide-selected': false,
                      'fill-input': false,
                      color: 'primary',
                      'dropdown-icon': 'fas fa-chevron-down',
                      'emit-value': true,
                      'map-options': true,
                      'option-value': '_id',
                      'option-label': 'name',
                      'use-chips': true,
                      'bottom-slots': true,
                      options: this.stores,
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
                      color: 'primary',
                      'dropdown-icon': 'fas fa-chevron-down',
                      'emit-value': true,
                      'map-options': true,
                      'option-value': '_id',
                      'option-label': 'name',
                      'use-chips': true,
                      'bottom-slots': true,
                      options: this.cards,
                    },
                    'div-attrs': {
                      class: 'col-12',
                    },
                    // slots: [/*'selected-item', 'option'*/],
                  },
                  {
                    fieldType: 'TextInput',
                    path: 'externalRef',
                    attrs: {
                      label: 'External Ref Id',
                      type: 'text',
                      filled: true,
                      color: 'primary',
                      clearable: true,
                      'clear-icon': 'close',
                    },
                    'div-attrs': {
                      class: 'col-12',
                    },
                  },
                  {
                    fieldType: 'CtkDatePicker',
                    path: 'externalRefDate',
                    attrs: {
                      label: 'External Ref Id Date',
                      formatted: 'MMM DD, YYYY - h:mm A',
                      rules: [
                        (input) => {
                          return !!input;
                        },
                      ],
                    },
                    slots: ['prepend'],
                    'div-attrs': {
                      class: 'col-12',
                    },
                  },
                ],
              },
            ],
          },
        ];
      },
    },
  };
</script>

<style scoped lang="scss">
  #Payments {
  }
</style>
