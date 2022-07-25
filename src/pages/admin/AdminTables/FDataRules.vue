<template>
  <f-data-table title="Rules"
                service="ir-roles-rules"
                :qid="qid"
                :limit="5"
                :query="query"
                :params="{}"
                :columns="finalColumns"
                :form-fields="formFields"
                create-title="Rule">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>
    <template v-slot:expand="props">
      <template v-if="props.colName === 'conditions'">
        <vue-json-pretty :data="props.row.conditions"></vue-json-pretty>
      </template>
      <template v-if="props.colName === 'inAbilities'">
        <f-data-abilities :query="{ _id: { $in: $lget(props, 'row.inAbilities', []) } }"
                          :qid="`rulesAbilitiesAdmin${$lget(props, 'row._id')}`"
                          :remove-fields="['inRoles', 'rules', 'applications', 'actions']">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </f-data-abilities>
      </template>
      <template v-if="props.colName === 'applications'">
        <f-data-applications :query="{ _id: { $in: $lget(props, 'row.applications', []) } }"
                             :qid="`rulesAppsAdmin${$lget(props, 'row._id')}`"
                             :remove-fields="['features', 'hosts', 'environments', 'actions']">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </f-data-applications>
      </template>
    </template>
  </f-data-table>
</template>

<script>
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import FDataAbilities from 'pages/admin/AdminTables/FDataAbilities';
  import FDataApplications from 'pages/admin/AdminTables/FDataApplications';

  export default {
    name: 'FDataRules',
    components: {
      VueJsonPretty,
      FDataAbilities,
      FDataApplications,
    },
    props: {
      query: {
        type: Object,
      },
      qid: {
        type: String,
      },
      removeFields: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    computed: {
      columns() {
        return [
          {
            name: '_id',
            label: '_Id',
            align: 'left',
            field: row => this.$lget(row, '_id'),
            format: val => `${val}`,
            sortable: true,
            hidden: true,
          },
          {
            name: 'name',
            label: 'Name',
            align: 'left',
            field: row => this.$lget(row, 'name'),
            format: val => `${val}`,
            sortable: true,
            required: true,
          },
          {
            name: 'inAbilities',
            label: 'Abilities',
            align: 'left',
            field: row => this.$lget(row, 'inAbilities', []),
            //the field may have been done wrong
            format: val => val,
            isExpansion: true,
            sortable: true,
          },
          {
            name: 'note',
            label: 'Notes',
            align: 'left',
            field: row => this.$lget(row, 'note', ''),
            format: val => `${val}`,
            //isExpansion: true,
            sortable: true,
          },
          {
            name: 'subject',
            label: 'Subject',
            align: 'left',
            field: row => this.$lget(row, 'subject', ''),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'action',
            label: 'Actions',
            align: 'left',
            field: row => this.$lget(row, 'action', []),
            format: val => val.length ? val.join(', ') : 'undefined',
            sortable: true,
          },
          {
            name: 'fields',
            label: 'Fields',
            align: 'left',
            field: row => this.$lget(row, 'fields', []),
            format: val => val.length ? val.join(', ') : 'undefined',
            sortable: true,
          },
          {
            name: 'conditions',
            label: 'Conditions',
            align: 'left',
            field: row => this.$lget(row, 'conditions', {}),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'reason',
            label: 'Reason',
            align: 'left',
            field: row => this.$lget(row, 'reason', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'inverted',
            label: 'Inverted',
            align: 'left',
            field: row => this.$lget(row, 'inverted'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'active',
            label: 'Active',
            align: 'left',
            field: row => this.$lget(row, 'active'),
            format: val => val,
            sortable: true,
          },
          ...commonFieldsConfig,
          {
            name: 'actions',
            label: 'Actions',
            align: 'center',
            required: true,
          },
        ];
      },
      finalColumns() {
        let arr = Array.from(this.columns);
        this.removeFields.forEach(item => {
          arr = arr.filter(obj => obj.name !== item);
        });
        return arr;
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
            fieldType: 'FgSearchInput',
            path: 'inAbilities',
            service: 'ir-roles-abilities',
            qid: 'roleFormWhitelistAdmin',
            attrs: {
              label: 'Abilities',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              'hide-selected': false,
              //'fill-input': false,
              //'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-label': 'name',
              'option-value': '_id',
              multiple: true,
              'use-chips': true,
              //'bottom-slots': true,
              // options: this.abilities,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },);
        }
        return fields;
      },
    },
  };
</script>

<style scoped>

</style>
