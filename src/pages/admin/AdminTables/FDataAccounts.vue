<template>
  <f-data-table :title="title"
                service="accounts"
                :qid="qid"
                :limit="5"
                :query="query"
                :params="{}"
                :columns="finalColumns"
                :form-fields="formFields"
                create-title="Account"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>
    <template v-slot:default="{data, btnAttrs, toggleDialog}">
      <q-btn :icon="$lget(data, 'icon', $lget(btnAttrs, 'icon'))" @click="toggleDialog" v-bind="btnAttrs"/>
    </template>
    <template v-slot:append>
      <div>%</div>
    </template>
    <template v-slot:expand="props">
      <template v-if="props.colName === 'addresses'">
        <addresses-data-table title="Addresses" :data="$lget(props, 'row.addresses', [])">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
        </addresses-data-table>
      </template>
      <template v-if="props.colName === 'socialLinks'">
        <social-links-data-table :data="$lget(props, 'row.socialLinks', [])">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
        </social-links-data-table>
      </template>
      <template v-if="props.colName === 'phones'">
        <phones-data-table title="Phones" :data="$lget(props, 'col.value', [])">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
        </phones-data-table>
      </template>
      <template v-if="props.colName === 'description'">
        {{ $lget(props, 'row.description') }}
      </template>
      <template v-if="props.colName === 'members'">
        <f-data-accounts title="Members"
                         :query="{ _id: { $in: $lget(props, 'row.membership.members', []) } }"
                         :qid="`accountsMembersAdmin${$lget(props, 'row._id')}`"
                         :remove-fields="['members', 'owners', 'quickbooksConnections', 'wallets', 'applications', 'actions']">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </f-data-accounts>
      </template>
      <template v-if="props.colName === 'owners'">
        <f-data-accounts title="Owners"
                         :query="{ _id: { $in: $lget(props, 'row.ownership.owners', []).map(item => item.id) } }"
                         :qid="`accountsOwnersAdmin${$lget(props, 'row._id')}`"
                         :remove-fields="['members', 'owners', 'quickbooksConnections', 'wallets', 'applications', 'actions']">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </f-data-accounts>
      </template>
      <template v-if="props.colName === 'quickbooksConnections' ">
<!--        <my-companies-list :value="{account: props.row}"/>-->
        <companies-list-component :value="{account: props.row}"/>
      </template>

      <template v-if="props.colName === 'wallets' ">
        <my-wallets :value="{account: props.row}"/>
      </template>

      <template v-if="props.colName === 'applications'">
        <f-data-applications :query="{ _id: { $in: $lget(props, 'row.applications', []) } }"
                             :qid="`rolesApplicationsAdmin${$lget(props, 'row._id')}`"
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
  import FDataApplications from 'pages/admin/AdminTables/FDataApplications';
  // import MyCompaniesList from 'components/profile/ProfileOld/MyCompanies/MyCompaniesList';
  import CompaniesListComponent from '@iy4u/common-client-lib/src/components/profile/companies/CompaniesList';
  import SocialLinksDataTable from 'pages/admin/Accounts/AccountSlots/SocialLinksDataTable';
  import AddressesDataTable from 'pages/admin/AdminTables/AddressesDataTable';
  import PhonesDataTable from 'pages/admin/AdminTables/PhonesDataTable';

  export default {
    name: 'FDataAccounts',
    components: {
      PhonesDataTable,
      AddressesDataTable,
      // MyCompaniesList,
      CompaniesListComponent,
      FDataApplications,
      SocialLinksDataTable,
    },
    props: {
      title: {
        type: String,
        default: 'Accounts',
      },
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
    data() {
      return {
        badDataErrLog: [],
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
            format: val => val.map(item => item.formatted),
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'phones',
            label: 'Phone Numbers',
            align: 'left',
            field: row => this.filterNull(this.$lget(row, 'phones', [])),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'socialLinks',
            label: 'Social Links',
            align: 'left',
            field: row => this.$lget(row, 'socialLinks', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'description',
            label: 'Description',
            align: 'left',
            field: row => this.$lget(row, 'description', ''),
            format: val => `${val}`,
            // format: val => val,
            sortable: true,
            hidden: true,
          },
          {
            name: 'members',
            label: 'Members',
            align: 'left',
            field: row => this.$lget(row, 'membership.members', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'owners',
            label: 'Owners',
            align: 'left',
            field: row => this.$lget(row, 'ownership.owners', []),
            format: val => val.map(item => item.id),
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'quickbooksConnections',
            label: 'Quickbooks',
            align: 'left',
            field: row => this.$lget(row, 'quickbooks.connections', []),
            format: val => val.map(item => item.id),
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'wallets',
            label: 'Wallets',
            align: 'left',
            field: row => this.$lget(row, ['wallets', 'ids'], []),
            format: val => val.map(item => item.id),
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
            fieldType: 'TextInput',
            path: 'email',
            attrs: {
              label: 'Email',
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
            fieldType: 'SocialLinkPicker',
            label: 'Social Links:',
            add_form_btn_text: 'Social Link',
            path: 'socialLinks',
            attrs: {
              style: 'display: flex; justify-content: space-between;',
            },
          },
          {
            fieldType: 'FormsetGenerator',
            label: 'Owners:',
            itemLabel: 'Owner',
            add_form_btn_text: 'Owner',
            path: 'ownership.owners',
            attrs: {
              style: 'display: flex; justify-content: space-between;',
            },
            templateFormFields: [
              {
                fieldType: 'FgSearchInput',
                path: 'id',
                service: 'accounts',
                qid: 'accountFormOwnersAdmin',
                attrs: {
                  label: 'Owner',
                  filled: true,
                  clearable: true,
                  'clear-icon': 'close',
                  'hide-selected': false,
                  'emit-value': true,
                  'map-options': true,
                  'option-label': 'name',
                  'option-value': '_id',
                  'reactive-rules': true,
                  rules: [val => !!val || 'Owner is Required'],
                  multiple: false,
                  // 'use-chips': true,
                },
                'div-attrs': {
                  class: 'col-12',
                },
              },
              {
                fieldType: 'TextInput',
                path: 'percent',
                attrs: {
                  label: 'Percent',
                  type: 'number',
                  min: 0,
                  max: 100,
                  // suffix: '%',
                  filled: true,
                  clearable: true,
                  'clear-icon': 'close',
                  // required: true,
                  'reactive-rules': true,
                  rules: [val => (self.$lget(self.formData, 'ownership.owners', []).length === 0 || val && val <= 100) || 'Invalid'],
                },
                'div-attrs': {
                  class: 'col-12',
                },
                slots: ['append'],
              },
            ],
          },
          {
            fieldType: 'FgSearchInput',
            path: 'membership.members',
            service: 'accounts',
            qid: 'accountFormMembersAdmin',
            attrs: {
              label: 'Members',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              'hide-selected': false,
              'emit-value': true,
              'map-options': true,
              'option-label': 'name',
              'option-value': '_id',
              required: true,
              multiple: true,
              'use-chips': true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'description',
            attrs: {
              label: 'Description',
              type: 'textarea',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              // required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
        ];
      },
    },
    methods: {
      filterNull(arr, colLabel, rowName) {
        if (arr.includes(null)) {

          let nullCount = 0;
          arr.forEach(item => item === null ? nullCount++ : null);
          if (!this.badDataErrLog.includes(colLabel) && colLabel && rowName) {
            this.badDataErrLog.push(colLabel);
            this.$q.notify({
              type: 'negative',
              timeout: 10000,
              message: `Error: Could not display ${nullCount} of ${rowName}'s ${colLabel}`,
            });
          }

          return arr.filter(item => item !== null);
        }
        return arr;
      },
      // availablePercent(val) {
      //   let percentUsed = 0;
      //   this.$lget(this.formData, 'data.ownership.owners', []).forEach(item => {
      //     percentUsed = percentUsed + item.percent;
      //   });
      //   console.log('this is available percent: ', 100 - percentUsed);
      //   console.log('this is formdata in available percent: ', this.formData);
      //   return val && val < 100 - percentUsed || 'Invalid Percent';
      // }
    },
  };
</script>

<style scoped lang="scss">
</style>

<!--<style lang="scss">-->
<!--  #MyAccountsAdmin {-->
<!--    #FormGenerator {-->
<!--      #FormsetGenerator {-->
<!--        .q-card {-->
<!--          //box-shadow: unset;-->
<!--          max-height: 300px;-->
<!--          overflow-y: scroll;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--</style>-->
