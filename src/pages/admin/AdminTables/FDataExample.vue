<template>
  <q-page id="FDataTablePage" class="q-pa-md">
    <f-data-table title="Rules"
                  service="ir-roles-rules"
                  qid="rulesAdmin"
                  :limit="12"
                  :query="{}"
                  :params="{}"
                  :columns="columns"
                  :form-fields="formFields"
                  create-title="Rule"
                  @input="formData = $event">
      <template v-slot:expand="props">
        <template v-if="props.colName === 'conditions'">
          <vue-json-pretty :data="props.row.conditions"></vue-json-pretty>
        </template>
      </template>
      <template v-slot:dialog-card-section="props">
        <template v-if="props.colName === 'conditions'">
          <vue-json-pretty :data="props.row.conditions"></vue-json-pretty>
        </template>
      </template>
    </f-data-table>
  </q-page>
</template>

<script>
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {date} from 'quasar';

  export default {
    name: 'FDataTablePage',
    components: {
      VueJsonPretty,
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'ir-roles-abilities',
        name: 'abilities',
        qid: 'rolesAbilitiesExampleAdmin',
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
        formData: {},
      };
    },
    computed: {
      columns() {
        return [
          {
            name: 'name',
            label: 'Name',
            align: 'left',
            field: row => row.name,
            format: val => `${val}`,
            sortable: true,
            required: true,
          },
          {
            name: 'note',
            label: 'Notes',
            align: 'left',
            field: row => row.note,
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'subject',
            label: 'Subject',
            align: 'left',
            field: row => row.subject,
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'action',
            label: 'Actions',
            align: 'left',
            field: row => row.action || [],
            format: val => val.length ? val.join(', ') : 'undefined',
            sortable: true,
          },
          {
            name: 'fields',
            label: 'Fields',
            align: 'left',
            field: row => row.fields || [],
            format: val => val.length ? val.join(', ') : 'undefined',
            sortable: true,
          },
          {
            name: 'conditions',
            label: 'Conditions',
            align: 'left',
            field: row => row.conditions || {},
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'reason',
            label: 'Reason',
            align: 'left',
            field: row => row.reason,
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'inverted',
            label: 'Inverted',
            align: 'left',
            field: row => row.inverted,
            format: val => val,
            sortable: true,
          },
          {
            name: 'active',
            label: 'Active',
            align: 'left',
            field: row => row.active,
            format: val => val,
            sortable: true,
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
        let fields = [
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
            fieldType: 'TextInput',
            path: 'note',
            attrs: {
              label: 'Notes',
              type: 'textarea',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              'bottom-slots': true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'subject',
            attrs: {
              label: 'Subject',
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
            path: 'reason',
            attrs: {
              label: 'Reason',
              type: 'text',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              'bottom-slots': true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'ToggleMe',
            path: 'inverted',
            attrs: {
              mode: 'acs-toggle',
              label: 'inverted?',
              // 'toggle-indeterminate': true,
              'checked-text': 'YES',
              'unchecked-text': 'NO',
              dense: true,
              style: {
                'justify-content': 'space-between',
                display: 'flex',
              },
              'left-label': true,
              'attrs-label': {
                class: {
                  'text-uppercase': true,
                },
                style: {
                  'font-size': '20px',
                  // 'font-weight': 700,
                },
              },
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'ToggleMe',
            path: 'active',
            attrs: {
              mode: 'acs-toggle',
              label: 'active?',
              // 'toggle-indeterminate': true,
              'checked-text': 'YES',
              'unchecked-text': 'NO',
              dense: true,
              style: {
                'justify-content': 'space-between',
                display: 'flex',
              },
              'left-label': true,
              'attrs-label': {
                class: {
                  'text-uppercase': true,
                },
                style: {
                  'font-size': '20px',
                  // 'font-weight': 700,
                },
              },
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ];

        if (this.$lget(this.formData, 'active', true)) {
          fields.push({
            fieldType: 'SelectInput',
            path: 'inAbilities',
            attrs: {
              label: 'Abilities',
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
              options: this.abilities,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          });
        }
        return fields;
      },
    },
  };
</script>

<style scoped>

</style>
