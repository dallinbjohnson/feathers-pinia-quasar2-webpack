<template>
  <data-table :title="title"
              :data="data"
              :columns="finalColumns">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>
  </data-table>
</template>

<script>
  import DataTable from 'components/common/molecules/DataTable/DataTable';

  export default {
    name: 'PhonesDataTable',
    components: {
      DataTable,
    },
    props: {
      title: {
        type: String,
        default: 'Phones',
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
            name: 'phoneType',
            label: 'Phone Type',
            align: 'left',
            field: row => this.$lget(row, 'phoneType'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'number',
            label: 'Number',
            align: 'left',
            field: row => this.$lget(row, 'number.international'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'type',
            label: 'Type',
            align: 'left',
            field: row => this.$lget(row, 'type'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'regionCode',
            label: 'Region Code',
            align: 'left',
            field: row => this.$lget(row, 'regionCode'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'country',
            label: 'Country',
            align: 'left',
            field: row => this.$lget(row, 'country.name'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'valid',
            label: 'Valid',
            align: 'left',
            field: row => this.$lget(row, 'valid'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'canBeInternationallyDialled',
            label: 'Can Be Internationally Dialled',
            align: 'left',
            field: row => this.$lget(row, 'canBeInternationallyDialled'),
            format: val => val,
            sortable: true,
          },
          {
            name: 'possibility',
            label: 'Possibility',
            align: 'left',
            field: row => this.$lget(row, 'possibility'),
            format: val => val,
            sortable: true,
            hidden: true,
          },
          {
            name: 'possible',
            label: 'Possible',
            align: 'left',
            field: row => this.$lget(row, 'possible'),
            format: val => val,
            sortable: true,
            hidden: true,
          },
          {
            name: 'isValid',
            label: 'Is Valid',
            align: 'left',
            field: row => this.$lget(row, 'isValid'),
            format: val => val,
            sortable: true,
            hidden: true,
          },
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
    },
  };
</script>

<style scoped>

</style>
