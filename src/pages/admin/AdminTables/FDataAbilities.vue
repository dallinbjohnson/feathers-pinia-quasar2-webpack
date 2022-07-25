<template>
  <f-data-table title="Abilities"
                service="ir-roles-abilities"
                :qid="qid"
                :limit="5"
                :query="query"
                :params="{}"
                :columns="finalColumns"
                :form-fields="formFields"
                create-title="Ability">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>
    <template v-slot:expand="props">
      <template v-if="props.colName === 'inRoles'">
        <f-data-roles :query="{ _id: { $in: $lget(props, 'row.inRoles', []) } }"
                      :qid="`abilitiesRolesAdmin${$lget(props, 'row._id')}`"
                      :remove-fields="['abilityIds', 'whitelist', 'blacklist', 'applications', 'environment', 'actions']">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </f-data-roles>
      </template>
      <template v-if="props.colName === 'rules'">
        <f-data-rules :query="{ _id: { $in: $lget(props, 'row.rules', []) } }"
                      :qid="`abilitiesRulesAdmin${$lget(props, 'row._id')}`"
                      :remove-fields="['inAbilities', 'applications', 'actions']">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </f-data-rules>
      </template>
      <template v-if="props.colName === 'applications'">
        <f-data-applications :query="{ _id: { $in: $lget(props, 'row.applications', []) } }"
                             :qid="`abilitiesAppsAdmin${$lget(props, 'row._id')}`"
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
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import FDataRoles from 'pages/admin/AdminTables/FDataRoles';
  import FDataRules from 'pages/admin/AdminTables/FDataRules';
  import FDataApplications from 'pages/admin/AdminTables/FDataApplications';

  export default {
    name: 'FDataAbilities',
    components: {
      FDataRules,
      FDataRoles,
      FDataApplications,
    },
    props: {
      query: {
        type: Object,
      },
      qid: {
        type: String,
        default: 'abilitiesAdmin',
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
          },
          {
            name: 'inRoles',
            label: 'Roles',
            align: 'left',
            field: row => this.$lget(row, 'inRoles', []),
            //the field may have been done wrong
            format: val => val,
            isExpansion: true,
            sortable: true,
          },
          {
            name: 'rules',
            label: 'Rules',
            align: 'left',
            field: row => this.$lget(row, 'rules', []),
            format: val => val,
            isExpansion: true,
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
            fieldType: 'FgSearchInput',
            path: 'inRoles',
            service: 'ir-roles-roles',
            qid: 'abilityFormRolesAdmin',
            attrs: {
              label: 'Roles',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              'hide-selected': false,
              'emit-value': true,
              'map-options': true,
              'option-label': 'name',
              'option-value': '_id',
              multiple: true,
              'use-chips': true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'FgSearchInput',
            path: 'rules',
            service: 'ir-roles-rules',
            qid: 'abilityFormRulesAdmin',
            attrs: {
              label: 'Rules',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              'hide-selected': false,
              'emit-value': true,
              'map-options': true,
              'option-label': 'name',
              'option-value': '_id',
              multiple: true,
              'use-chips': true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'ToggleMe',
            path: 'active',
            attrs: {
              label: 'active',
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
  };
</script>

<style scoped>

</style>
