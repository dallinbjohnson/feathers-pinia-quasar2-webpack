<template>
  <div class="bg-transparent full-width q-pa-sm">
    <q-table title="Counted By" flat :data="accountQtyList" table-class="full-width self-center ">
      <template  #header-cell="props">

        <q-th v-if="props.col.name==='id'" :props="props">
          account
        </q-th>
        <q-th v-else :props="props">
          {{
            props.col.name
          }}
        </q-th>

      </template>
      <template #body-cell="props">
        <td v-if="props.col.name === 'id'">
          {{ $lget(accounts.find(account => account._id === $lget(props.row, 'id')), 'name') }}

        </td>
        <td v-else-if="props.col.name === 'actions'">
          <div class="row q-gutter-sm">
            <q-btn flat color="primary" dense icon="edit" @click="edit(props.row)"/>
            <q-btn flat color="negative" dense icon="delete" @click="remove(props.row)"/>
          </div>
        </td>
        <td v-else>
          {{ props.row[props.col.name] }}
        </td>

      </template>
        <template #no-data>
          <div/>
        </template>
      <template #top-right>
        <q-btn v-if="options.length > 0" icon="add"  @click="openDialog" outline color="primary"/>
      </template>
    </q-table>
    <q-dialog v-model="open" position="right">
      <q-card style="max-width: 300px;">
        <q-card-section>
          <form-generator v-model="accountQty" :fields="fields" v-model:valid="valid"/>
        </q-card-section>
        <q-card-actions>
          <q-btn label="Save" color="primary" @click="save"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="openRemove" persistent position="right">
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white"/>
          <div class="q-ml-sm">
            You are about to delete the count tally for
            {{ $lget(accounts.find(account => account._id === $lget(accountQtyToRemove, 'id')), 'name') }}
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" @click="cancelRemove"/>
          <q-btn label="Go Ahead" color="primary" v-close-popup @click="confirmRemove"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';

  export default {
    name: 'counted-by-list-select',
    props: {
      value: {
        type: Array,
        default() {
          return [
            /*{
              product : {
                _id: 'fdgghegut',
                title: 'Dog'
              },
              price: 4000
            }*/
          ];
        },
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'accounts',
        name: 'accounts',
        qid: 'accounts',
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
        accountQty: {
          id: undefined,
          quantity: undefined,
        },
        valid: false,
        open: false,
        accountQtyList: [],
        openRemove: false,
        accountQtyToRemove: undefined,
        options: [],
      };
    },
    watch: {
      value: {
        immediate: true,
        deep: true,
        handler(newVal) {

          this.accountQtyList = newVal.map( accountQty => {
            const {id, quantity} = accountQty;
            return {id, quantity, actions: id};
          });
          const listedAccounts = newVal.map(accountQty => accountQty.id);
          this.options = this.accounts.filter(account => !listedAccounts.includes(account._id));
        },
      },
      accounts: {
        immediate: false,
        deep: true,
        handler(newVal) {
          this.options = newVal;
        },
      },
    },
    computed: {

      fields() {
        return [
          {
            fieldType: 'SelectInput',
            path: 'id',
            attrs: {
              label: 'Account',
              'hide-selected': false,
              'fill-input': false,
              multiple: false,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'bottom-slots': true,
              options: this.options,
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'TextInput',
            path: 'quantity',
            attrs: {
              label: 'Qty',
              type: 'number',
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
    methods: {
      openDialog() {
        this.open = true;
        this.accountQty = {
          id: undefined,
          quantity: undefined,
        };
      },
      save() {
        const {id, quantity} = this.accountQty;
        const index = this.accountQtyList.findIndex(object => object.id === id);
        if (index === -1) {
          this.accountQtyList.push({id, quantity, actions: id});
        } else {
          this.accountQtyList.map(obj => {
            if (obj.id === id) {
              obj.quantity = quantity;
            }
          });
        }
        this.accountQty = {
          id: undefined,
          quantity: undefined,
        };
        this.$emit('input', this.accountQtyList);
      },
      edit(value) {
        this.options = this.accounts;
        this.accountQty = Object.assign({}, value);
        this.open = true;
      },
      remove(value) {
        this.accountQtyToRemove = Object.assign({}, value);
        this.openRemove = true;
      },
      cancelRemove() {
        this.accountQtyToRemove = undefined;
        this.openRemove = false;
      },
      confirmRemove() {
        this.accountQtyList = this.accountQtyList.filter(item => item['id'] !== this.accountQtyToRemove['id']);
        console.log( this.accountQtyToRemove  );
        this.accountQtyToRemove = undefined;
        this.openRemove = false;
      },
    },
  };
</script>

<style scoped>

</style>
