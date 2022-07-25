<template>
  <f-data-table title="Applications"
                service="applications"
                :qid="qid"
                :limit="5"
                :query="query"
                :params="{}"
                :columns="finalColumns"
                :form-fields="formFields"
                create-title="Application">
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
  import {coreFieldsConfig} from 'src/utils/coreFieldsConfig';

  export default {
    name: 'FDataApplications',
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
          return ['applications'];
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
            name: 'features',
            label: 'Features',
            align: 'left',
            field: row => this.$lget(row, 'features'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'hosts',
            label: 'Hosts',
            align: 'left',
            field: row => this.$lget(row, 'hosts'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'environments',
            label: 'Environments',
            align: 'left',
            field: row => this.$lget(row, 'environments'),
            format: val => val,
            sortable: true,
          },
          ...coreFieldsConfig,
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
