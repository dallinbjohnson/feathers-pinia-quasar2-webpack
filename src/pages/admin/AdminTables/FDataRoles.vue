<template>
  <f-data-table title="Roles"
                service="ir-roles-roles"
                :qid="qid"
                :limit="5"
                :query="query"
                :params="{}"
                :columns="finalColumns"
                :form-fields="formFields"
                create-title="Role">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <template v-slot:expand="props">
      <template v-if="props.colName === 'abilityIds'">
        <f-data-abilities :query="{ _id: { $in: $lget(props, 'row.abilityIds', []) } }"
                          :qid="`rolesAbilitiesAdmin${$lget(props, 'row._id')}`"
                          :remove-fields="['inRoles', 'rules', 'applications', 'actions']">
<!--consider if remove-fields actually stops fields from rendering. is it possible the same qid could exist? unique row identifier should prevent this.-->
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </f-data-abilities>
      </template>

      <template v-if="props.colName === 'whitelist'">
        <f-data-whitelist :data="$lget(props, 'row.whitelist')"
                          :remove-fields="['applications']">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
        </f-data-whitelist>
      </template>

      <template v-if="props.colName === 'blacklist'">
        <f-data-blacklist :data="$lget(props, 'row.blacklist')"
                          :remove-fields="['applications']">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
        </f-data-blacklist>
      </template>

      <template v-if="props.colName === 'applications'">
        <f-data-applications :query="{ _id: { $in: $lget(props, 'row.applications', []) } }"
                             :qid="`rolesAppsAdmin${$lget(props, 'row._id')}`"
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
  import FDataAbilities from 'pages/admin/AdminTables/FDataAbilities';
  import FDataApplications from 'pages/admin/AdminTables/FDataApplications';
  import FDataWhitelist from 'pages/admin/AdminTables/FDataWhitelist';
  import FDataBlacklist from 'pages/admin/AdminTables/FDataBlacklist';

  export default {
    name: 'FDataRoles',
    components: {
      FDataApplications,
      FDataAbilities,
      FDataWhitelist,
      FDataBlacklist,
    },
    props: {
      query: {
        type: Object,
      },
      qid: {
        type: String,
        default: 'rolesAdmin',
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
            name: 'abilityIds',
            label: 'Abilities',
            align: 'left',
            field: row => this.$lget(row, 'abilityIds', []),
            format: val => val,
            isExpansion: true,
            sortable: true,
          },
          {
            name: 'whitelist',
            label: 'Whitelist',
            align: 'left',
            field: row => this.$lget(row, 'whitelist', []),
            format: val => val,
            isExpansion: true,
            sortable: true,
          },
          {
            name: 'blacklist',
            label: 'Blacklist',
            align: 'left',
            field: row => this.$lget(row, 'blacklist', []),
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
            path: 'abilityIds',
            service: 'ir-roles-abilities',
            qid: 'roleFormWhitelistAdmin',
            attrs: {
              label: 'Abilities',
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
