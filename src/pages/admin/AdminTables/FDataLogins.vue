<template>
  <f-data-table title="Logins"
                service="logins"
                :qid="qid"
                :limit="5"
                :query="{...query, $select: '-password'}"
                :params="{}"
                :columns="finalColumns"
                :form-fields="formFields"
                create-title="Role">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>
    <template v-slot:btn-toggle>
      <div></div>
    </template>
    <template v-slot:dialogBtn>
      <div></div>
    </template>
    <template v-slot:expand="props">
      <template v-if="props.colName === 'addresses'">
        <addresses-data-table title="Addresses" :data="$lget(props, 'row.addresses', [])">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
        </addresses-data-table>
      </template>
      <template v-if="props.colName === 'phones'">
        <phones-data-table title="Phones" :data="$lget(props, 'col.value', [])">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
        </phones-data-table>
      </template>
      <template v-if="props.colName === 'roles'">
        <f-data-roles :query="{ _id: { $in: $lget(props, 'row.roles', []) } }"
                      :qid="`loginsRolesAdmin${$lget(props, 'row._id')}`"
                      :remove-fields="['abilityIds', 'whitelist', 'blacklist', 'applications', 'environment', 'actions']"/>
      </template>
      <template v-if="props.colName === 'devices'">
        <f-data-devices :query="{ _id: { $in: $lget(props, 'row.devices', []) } }"
                        :qid="`loginsDevicesAdmin${$lget(props, 'row._id')}`"
                        :remove-fields="['users', 'user', 'applications', 'actions']">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </f-data-devices>
      </template>
      <template v-if="props.colName === 'verifiers'">
        <f-data-verifiers :query="{ _id: { $in: $lget(props, 'row.verifiers', []) } }"
                          :qid="`loginsVerifiersAdmin${$lget(props, 'row._id')}`"
                          :remove-fields="['applications']"/>
      </template>
      <template v-if="props.colName === 'user'">
        <f-data-users :query="{ _id: { $in: $lget(props, 'row.user', []) } }"
                      :qid="`loginsUserAdmin${$lget(props, 'row._id')}`"
                      :remove-fields="['roles', 'devices', 'verifiers', 'logins', 'applications', 'environment']">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </f-data-users>
      </template>
      <template v-if="props.colName === 'settings'">
        <vue-json-pretty :data="props.row.settings"/>
      </template>
      <template v-if="props.colName === 'applications'">
        <f-data-applications :query="{ _id: { $in: $lget(props, 'row.applications', []) } }"
                             :qid="`loginsAppsAdmin${$lget(props, 'row._id')}`"
                             :remove-fields="['features', 'hosts', 'environments', 'actions']"/>
      </template>
    </template>
  </f-data-table>
</template>

<script>
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import FDataRoles from 'pages/admin/AdminTables/FDataRoles';
  import FDataApplications from 'pages/admin/AdminTables/FDataApplications';
  import AddressesDataTable from 'pages/admin/AdminTables/AddressesDataTable';
  import PhonesDataTable from 'pages/admin/AdminTables/PhonesDataTable';
  import FDataDevices from 'pages/admin/AdminTables/FDataDevices';
  import FDataVerifiers from 'pages/admin/AdminTables/FDataVerifiers';
  import FDataUsers from 'pages/admin/AdminTables/FDataUsers';

  export default {
    name: 'FDataLogins',
    components: {
      VueJsonPretty,
      FDataUsers,
      FDataVerifiers,
      FDataDevices,
      PhonesDataTable,
      AddressesDataTable,
      FDataApplications,
      FDataRoles,
    },
    props: {
      query: {
        type: Object,
      },
      propData: {
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
    mounted() {
      console.log('this is propData: ', this.propData);
    },
    computed: {
      columns() {
        return [
          {
            name: 'avatar',
            label: 'Avatar',
            align: 'left',
            field: row => this.$lget(row, 'avatar.raw.file', ''),
            format: val => `${val}`,
            isImg: true,
          },
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
            name: 'email',
            label: 'Email',
            align: 'left',
            field: row => this.$lget(row, 'email'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'addresses',
            label: 'Addresses',
            align: 'left',
            field: row => this.$lget(row, 'addresses', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'phones',
            label: 'Phone Numbers',
            align: 'left',
            field: row => this.$lget(row, 'phones', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'roles',
            label: 'Roles',
            align: 'left',
            field: row => this.$lget(row, 'roles', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'devices',
            label: 'Devices',
            align: 'left',
            field: row => this.$lget(row, 'devices', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'verifiers',
            label: 'Verifiers',
            align: 'left',
            field: row => this.$lget(row, 'verifiers', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'isVerified',
            label: 'Is Verified',
            align: 'left',
            field: row => this.$lget(row, 'isVerified'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'user',
            label: 'User',
            align: 'left',
            field: row => this.$lget(row, 'user', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'settings',
            label: 'Settings',
            align: 'left',
            field: row => this.$lget(row, 'settings', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'recentlyUsed',
            label: 'Recently Used',
            align: 'left',
            field: row => this.$lget(row, '_id') === this.$lget(this.propData, 'active'),
            format: val => !!val,
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
        return [];
      },
    },
  };
</script>

<style scoped>

</style>
