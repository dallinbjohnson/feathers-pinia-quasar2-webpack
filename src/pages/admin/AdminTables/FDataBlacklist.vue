<template>
  <data-table :title="title"
              :data="data"
              :columns="finalColumns">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <!--    <template v-slot:expand="props">-->
    <!--      -->
    <!--    </template>-->
  </data-table>
</template>

<script>
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';
  import DataTable from 'components/common/molecules/DataTable/DataTable';

  export default {
    name: 'FDataBlacklist',
    components: {DataTable},
    props: {
      title: {
        type: String,
        default: 'Blacklist',
      },
      data: {
        type: Array,
        required: true,
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
          ...commonFieldsConfig,
          // {
          //   name: 'actions',
          //   label: 'Actions',
          //   align: 'center',
          //   required: true,
          // },
        ];
      },
      finalColumns() {
        let arr = Array.from(this.columns);
        this.removeFields.forEach(item => {
          arr = arr.filter(obj => obj.name !== item);
        });
        return arr;
      },
    }
  };
</script>

<style scoped>

</style>
