<template>
  <f-data-table title="Users"
                service="users"
                :qid="qid"
                :limit="5"
                :query="query"
                :params="{}"
                :columns="finalColumns"
                :form-fields="formFields"
                create-title="User"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
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
                      :qid="`userRolesAdmin${$lget(props, 'row._id')}`"
                      :remove-fields="['abilityIds', 'whitelist', 'blacklist', 'applications', 'environment', 'actions']">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </f-data-roles>
      </template>
      <template v-if="props.colName === 'devices'">
        <f-data-devices :query="{ _id: { $in: $lget(props, 'row.devices', []) } }"
                        :qid="`userDevicesAdmin${$lget(props, 'row._id')}`"
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
                          :qid="`userVerifiersAdmin${$lget(props, 'row._id')}`"
                          :remove-fields="['applications']"/>
      </template>
      <template v-if="props.colName === 'logins'">
        <f-data-logins :prop-data="$lget(props, 'row.logins', [])"
                       :query="{ _id: { $in: $lget(props, 'row.logins.ids', []) } }"
                       :qid="`userLoginsAdmin${$lget(props, 'row._id')}`"
                       :remove-fields="['roles', 'devices', 'verifiers', 'user', 'applications', 'actions']"/>
      </template>
      <template v-if="props.colName === 'settings'">
        <!--Add Table-->
        <vue-json-pretty :data="props.row.settings"/>
        <!--create custom form generator component for settings-->
      </template>
      <template v-if="props.colName === 'applications'">
        <f-data-applications :query="{ _id: { $in: $lget(props, 'row.applications', []) } }"
                             :qid="`userAppsAdmin${$lget(props, 'row._id')}`"
                             :remove-fields="['features', 'hosts', 'environments', 'actions']"/>
      </template>
      <template v-if="props.colName === 'updatedByHistory'">
        <!--Add Table-->
        <q-table :data="$lget(props, 'row.updatedByHistory')"></q-table>
      </template>
      <!--Do we need to bring over avatars, banners, and images?-->
      <!--Also add edit avatar, banners and images to add or update form-->
    </template>
  </f-data-table>
</template>

<script>
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import FDataApplications from 'pages/admin/AdminTables/FDataApplications';
  import FDataLogins from 'pages/admin/AdminTables/FDataLogins';
  import FDataRoles from 'pages/admin/AdminTables/FDataRoles';
  import FDataDevices from 'pages/admin/AdminTables/FDataDevices';
  import FDataVerifiers from 'pages/admin/AdminTables/FDataVerifiers';
  import PhonesDataTable from 'pages/admin/AdminTables/PhonesDataTable';
  import AddressesDataTable from 'pages/admin/AdminTables/AddressesDataTable';

  export default {
    name: 'FDataUsers',
    components: {
      VueJsonPretty,
      AddressesDataTable,
      PhonesDataTable,
      FDataVerifiers,
      FDataDevices,
      FDataRoles,
      FDataLogins,
      FDataApplications,
    },
    props: {
      query: {
        type: Object,
      },
      qid: {
        type: String,
        default: 'usersAdmin',
      },
      removeFields: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {
        formData: {},
      };
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
            name: 'avatar',
            label: 'Avatar',
            align: 'left',
            field: row => this.$lget(row, 'avatar.raw.file', ''),
            format: val => `${val}`,
            isImg: true,
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
            name: 'logins',
            label: 'Logins',
            align: 'left',
            field: row => this.$lget(row, 'logins.ids', []),
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
        let self = this;
        return [
          {
            fieldType: 'ImageSelect',
            path: 'avatar',
            attrs: {
              // stylePanelLayout: null,
              imageCropAspectRatio: null,
            },
            'label-attrs': {
              'v-text': 'User avatar',
              style: 'font-size: 20px; margin-top: -5px',
            },
            'div-attrs': {
              class: 'col-6',
            },
          },
          {
            fieldType: 'ImageSelect',
            path: 'banner',
            attrs: {
              stylePanelLayout: null,
              imageCropAspectRatio: null,
            },
            'label-attrs': {
              'v-text': 'User banner',
              style: 'font-size: 20px; margin-top: -5px',
            },
            'div-attrs': {
              class: 'col-6',
            },
          },
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
            fieldType: 'FormsetGenerator',
            label: 'Addresses:',
            itemLabel: 'Address',
            add_form_btn_text: 'Address',
            path: 'addresses',
            attrs: {
              style: 'display: flex; justify-content: space-between;',
            },
            templateFormFields: [
              {
                fieldType: 'PlacesAutoComplete',
                path: 'addresses',
                return_object_no_key: true,
                attrs: {
                  label: 'Address',
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
            ],
          },
          {
            fieldType: 'FormsetGenerator',
            label: 'Phones:',
            itemLabel: 'Phone',
            add_form_btn_text: 'Phone',
            path: 'phones',
            attrs: {
              style: 'display: flex; justify-content: space-between;',
            },
            templateFormFields: [
              {
                fieldType: 'SelectInput',
                path: 'phoneType',
                attrs: {
                  label: 'Type',
                  filled: true,
                  clearable: true,
                  'clear-icon': 'close',
                  rules: [val => self.$lget(self.formData, 'phones', []).length === 0 || !!val || 'Required'],
                  options: [
                    'To Be Changed 1', //Need to Change
                    'To Be Changed 2', //Need to Change
                    'To Be Changed 3', //Need to Change
                  ],
                },
                // 'div-attrs': {
                //   class: 'col-12'
                // }
              },
              {
                fieldType: 'PhoneInput',
                id: 'user-phones',
                path: 'phone',
                return_object_no_key: true,
                attrs: {
                  inputOptions: {
                    placeholder: 'Phone',
                  },
                },
                'q-field-attrs': {
                  rules: [val => self.$lget(self.formData, 'phones', []).length === 0 || this.$lget(val, 'isValid') || 'Invalid Number'],
                },
              },
            ],
          },
          {
            fieldType: 'FgSearchInput',
            path: 'roles',
            service: 'ir-roles-roles',
            qid: 'userFormRolesAdmin',
            // searchField: '',
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
            path: 'applications',
            service: 'applications',
            qid: 'userFormAppAdmin',
            // searchField: '',
            attrs: {
              label: 'Applications',
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
          // {
          //   fieldType: 'TextInput',
          //   path: 'about',
          //   attrs: {
          //     label: 'About',
          //     type: 'textarea',
          //     filled: true,
          //     color: 'primary',
          //     clearable: true,
          //     'clear-icon': 'close',
          //   },
          //   'div-attrs': {
          //     class: 'col-12',
          //   },
          // },
        ];
      },
    },
  };
</script>

<style scoped>

</style>
