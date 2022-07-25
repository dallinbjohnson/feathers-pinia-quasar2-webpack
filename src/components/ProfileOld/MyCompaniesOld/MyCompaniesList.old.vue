<template>
  <div :class="`${companies.length ? ($q.screen.sm || $q.screen.xs) ?'column': 'row': ''} q-gutter-lg q-pa-md`">

    <add-company class="col" :value="value" :style="companies.length ? 'max-width: 450px;': 'max-width: 450px;'"/>

    <div class="col" v-for="company in companies" :key="$lget(company,'_id')">
      <div class="box column items-center justify-center q-pa-xl" style=" position: relative">
        <div class="q-pa-md" style="width: 100%;">
          <p class="text-center text-h4 text-primary text-bold">{{ $lget(company, 'name') }}</p>
          <q-img :src="require('assets/quickbooks-logo.png')"/>
          <p class="text-center text-h5 text-positive text-bold">Company</p>
        </div>
        <div class="full-width row justify-end q-gutter-md q-ma-sm" style="position: absolute; bottom: 0; right: 1rem;">
          <q-radio v-model="defaultConnection"
                   checked-icon="task_alt"
                   unchecked-icon="panorama_fish_eye"
                   :val="company._id"
                   label="Default"/>

          <q-space/>

          <q-btn flat color="primary" icon="edit" label="edit" @click="openEditCompanyDialog(company)"/>
          <q-btn flat color="primary" icon="fas fa-trash" @click="remove(company)"/>
        </div>
      </div>
    </div>

    <q-inner-loading :showing="isFindCompaniesPending">
      <q-spinner-gears size="50px" color="primary"/>
    </q-inner-loading>

    <q-dialog v-model="openEditCompany">
      <q-card>
        <q-card-section>
          <div class="text-h6">Edit Company</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <form-generator v-model="formData" :fields="fields" useQform v-model:valid="valid"></form-generator>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup/>
          <q-btn label="Save" color="primary" @click="save" :disable="!valid || sending" :loading="sending"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import AddCompany from 'components/profile/ProfileOld/MyCompaniesOld/MyCompaniesOld';
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  // import {models} from '@feathersjs/vuex';

  export default {
    name: 'MyCompaniesListOld',
    components: {AddCompany},
    props: {
      value: {
        type: Object,
        required: true,
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 5,
        service: 'companies',
        name: 'companies',
        qid: 'companies',
        infinite: true,
        query() {
          const accountQuery = {_id: {$in: this.$lget(this.value, ['account', 'quickbooks', 'connections'], [])}};
          return {
            ...accountQuery,
          };
        },
        params() {
          return {
            'quickbooks/companies_fJoinHookResolversQuery': {
              accounts: true,
            },
          };
        },
      }),
      makeFindPaginateMixin({
        limit: 5,
        service: 'accounts',
        name: 'accounts',
        qid: 'accounts',
        infinite: true,
        query() {
          return {
            // ...this.localQuery
          };
        },
        params() {
          return {
            // 'accounts_fJoinHookResolversQuery': {
            //   quickbooksConnections: true,
            // },
          };
        },
      }),
    ],
    data() {
      return {
        localCompaniesQuery: {},
        openEditCompany: false,
        formData: undefined,
        valid: false,
        sending: false,
        defaultConnection: undefined,
      };
    },
    watch: {
      'value.account': {
        immediate: true,
        deep: true,
        handler(newVal) {
          let defaultConnection = this.$lget(newVal, 'quickbooks.defaultConnection');
          if (defaultConnection) {
            this.defaultConnection = defaultConnection;
          }
        },
      },
      defaultConnection(newVal) {
        let account = this.$lget(this.value, 'account');
        if (account && newVal !== this.$lget(account, 'quickbooks.defaultConnection', 'defaultConnection')) {
          account.patch({
            data: {
              'quickbooks.defaultConnection': newVal,
            },
          });
        }
      },
    },
    computed: {
      fields() {
        return [
          {
            fieldType: 'TextInput',
            path: 'name',
            attrs: {
              label: 'Name',
              type: 'text',
              filled: true,
              // 'bg-color': 'secondary',
              // 'label-color': 'white',
              // color: 'accent',
              clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'accounts',
            attrs: {
              label: 'Accounts',
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
              options: this.accounts,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
        ];
      },
    },
    methods: {
      openEditCompanyDialog(value) {
        this.openEditCompany = true;
        this.formData = value;
      },
      async save() {
        try {
          this.sending = true;
          await this.formData.save();
          this.$q.notify({
            message: `${this.$lget(this.formData, 'name')} company edited`,
            color: 'green-4',
            textColor: 'white',
            icon: 'sp:quickBooksIcon',
          });
          this.clear();

        } catch (e) {
          this.$q.notify({
            message: e.message,
            color: 'negative',
            textColor: 'white',
            icon: 'warning',
          });
          this.sending = false;
        }
      },
      clear() {
        this.sending = false;
        this.openEditCompany = false;
        this.formData = undefined;
      },
      async remove(data) {
        this.$q.dialog({
          title: 'Confirm',
          message: `Would you like to delete this company from your ${this.$lget(this.value, ['account', 'name'])} account?`,
          ok: {
            push: true,
            color: 'primary',
          },
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          // console.log('>>>> OK')
          try {
            await data.patch({
              data: {
                $pull: {
                  accounts: this.$lget(this.value, 'account._id'),
                },
              },
            });
            this.$q.notify({
              message: ` The ${this.$lget(data, 'name')} company was successfully removed.`,
              color: 'green-4',
              textColor: 'white',
              icon: '',
            });
          } catch (e) {
            this.$q.notify({
              message: e.message,
              color: 'negative',
              textColor: 'white',
              icon: 'warning',
            });
          }
        }).onOk(async () => {
          // console.log('>>>> second OK catcher')
        }).onCancel(() => {
          this.clear();
        }).onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  .box {
    max-width: 450px;
    height: calc(100% + 1vh);
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.25);
    transition: 0.2s all;

    &:hover {
      background-color: #edeff3;
      transform: scale(1.05);
      cursor: pointer;
    }
  }
</style>
