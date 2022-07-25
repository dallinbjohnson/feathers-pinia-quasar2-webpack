<template>
  <f-data-table title="Verifiers"
                service="users"
                :qid="qid"
                :limit="5"
                :query="query"
                :params="{}"
                :columns="finalColumns">
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
    <!--addresses table-->
    <!--phones table-->
    <template v-slot:expand="props">
      <template v-if="props.colName === 'roles'">
        <f-data-roles :query="{ _id: { $in: $lget(props, 'row.roles', []) } }"
                      :qid="`verifiersRolesAdmin${$lget(props, 'row._id')}`"
                      :remove-fields="['abilityIds', 'whitelist', 'blacklist', 'applications', 'environment', 'actions']"/>
      </template>
      <template v-if="props.colName === 'applications'">
        <f-data-applications :query="{ _id: { $in: $lget(props, 'row.applications', []) } }"
                             :qid="`verifiersAppsAdmin${$lget(props, 'row._id')}`"
                             :remove-fields="['features', 'hosts', 'environments', 'actions']"/>
      </template>
      <template v-if="props.colName === 'devices'">
        <f-data-devices :query="{ _id: { $in: $lget(props, 'row.devices', []) } }"
                        :qid="`verifiersDevicesAdmin${$lget(props, 'row._id')}`"
                        :remove-fields="['users', 'user', 'applications', 'actions']"/>
      </template>
      <template v-if="props.colName === 'verifiers'">
        <f-data-verifiers :query="{ _id: { $in: $lget(props, 'row.verifiers', []) } }"
                          :qid="`verifiersVerifiersAdmin${$lget(props, 'row._id')}`"
                          :remove-fields="['applications']"/>
      </template>
      <template v-if="props.colName === 'logins'">
        <f-data-logins :prop-data="$lget(props, 'row.logins', [])"
                       :query="{ _id: { $in: $lget(props, 'row.logins.ids', []) } }"
                       :qid="`verifiersLoginsAdmin${$lget(props, 'row._id')}`"
                       :remove-fields="['roles', 'devices', 'verifiers', 'user', 'applications', 'actions']"/>
      </template>
      <!--settings table-->
      <!--updatedByHistory table-->
    </template>
  </f-data-table>
</template>

<script>
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import FDataRoles from 'pages/admin/AdminTables/FDataRoles';
  import FDataApplications from 'pages/admin/AdminTables/FDataApplications';
  import FDataDevices from 'pages/admin/AdminTables/FDataDevices';
  import FDataLogins from 'pages/admin/AdminTables/FDataLogins';

  export default {
    name: 'FDataVerifiers',
    components: {
      FDataLogins,
      FDataDevices,
      FDataApplications,
      FDataRoles,
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
            format: val => val.map(item => item.formatted),
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
          // {
          //   name: 'roles',
          //   label: 'Roles',
          //   align: 'left',
          //   field: row => this.$lget(row, 'roles', []),
          //   format: val => val,
          //   sortable: true,
          //   isExpansion: true,
          // },
          // {
          //   name: 'devices',
          //   label: 'Devices',
          //   align: 'left',
          //   field: row => this.$lget(row, 'devices', []),
          //   format: val => val,
          //   sortable: true,
          //   isExpansion: true,
          // },
          // {
          //   name: 'verifiers',
          //   label: 'Verifiers',
          //   align: 'left',
          //   field: row => this.$lget(row, 'verifiers', []),
          //   format: val => val,
          //   sortable: true,
          //   isExpansion: true,
          // },
          {
            name: 'isVerified',
            label: 'Is Verified',
            align: 'left',
            field: row => this.$lget(row, 'isVerified'),
            format: val => val,
            sortable: true,
          },
          // {
          //   name: 'logins',
          //   label: 'Logins',
          //   align: 'left',
          //   field: row => this.$lget(row, 'logins.ids', []),
          //   format: val => val,
          //   sortable: true,
          //   isExpansion: true,
          // },
          {
            name: 'settings',
            label: 'Settings',
            align: 'left',
            field: row => this.$lget(row, 'settings', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          ...commonFieldsConfig,
        ];
      },
      finalColumns() {
        let arr = Array.from(this.columns);
        this.removeFields.forEach(item => {
          arr = arr.filter(obj => obj.name !== item);
        });
        return arr;
      },
    },
  };
</script>

<style scoped>

</style>
