<template>
  <f-data-table title="Devices"
                service="devices"
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
    <template v-slot:btn-toggle>
      <div></div>
    </template>
    <template v-slot:dialogBtn>
      <div></div>
    </template>
  </f-data-table>
</template>

<script>
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';

  export default {
    name: 'FDataDevices',
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
    mounted() {
      console.log('this is propData: ', this.propData);
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
            name: 'fingerprints',
            label: 'Fingerprints',
            align: 'left',
            field: row => this.$lget(row, 'fingerprints'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'counter',
            label: 'Counter',
            align: 'left',
            field: row => this.$lget(row, 'counter'),
            format: val => `${val}`,
            sortable: true,
          },
          // {
          //   name: 'publicKey',
          //   label: 'Public Key',
          //   align: 'left',
          //   field: row => this.$lget(row, 'publicKey'),
          //   format: val => `${val}`,
          //   sortable: true,
          //   hidden: true,
          // },
          // {
          //   name: 'activeKey',
          //   label: 'Active Key',
          //   align: 'left',
          //   field: row => this.$lget(row, 'activeKey', []),
          //   format: val => val,
          //   sortable: true,
          //   hidden: true,
          // },
          // {
          //   name: 'keys',
          //   label: 'Keys',
          //   align: 'left',
          //   field: row => this.$lget(row, 'keys'),
          //   format: val => val,
          //   sortable: true,
          // isExpansion: true,
          //   hidden: true,
          // },
          {
            name: 'user',
            label: 'User',
            align: 'left',
            field: row => this.$lget(row, 'user'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'users',
            label: 'Users',
            align: 'left',
            field: row => this.$lget(row, 'users', []),
            format: val => val,
            isExpansion: true,
            sortable: true,
          },
          {
            name: 'lastRoute',
            label: 'Last Route',
            align: 'left',
            field: row => this.$lget(row, 'lastRoute'),
            //consider adding empty object as default
            format: val => val,
            sortable: true,
            isExpansion: true,
            hidden: true,
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
      }
    },
  };
</script>

<style scoped>

</style>
