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
    name: 'AddressesDataTable',
    components: {
      DataTable,
    },
    props: {
      title: {
        type: String,
        default: 'Addresses',
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
            field: row => this.$lget(row, 'name', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'formatted',
            label: 'Formatted',
            align: 'left',
            field: row => this.$lget(row, 'formatted', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'address1',
            label: 'Address One',
            align: 'left',
            field: row => this.$lget(row, 'address1', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'address2',
            label: 'Address Two',
            align: 'left',
            field: row => this.$lget(row, 'address2', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'region',
            label: 'Region',
            align: 'left',
            field: row => this.$lget(row, 'region', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'city',
            label: 'City',
            align: 'left',
            field: row => this.$lget(row, 'city', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'postal',
            label: 'Postal',
            align: 'left',
            field: row => this.$lget(row, 'postal', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'country',
            label: 'Country',
            align: 'left',
            field: row => this.$lget(row, 'country', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'latitude',
            label: 'Latitude',
            align: 'left',
            field: row => this.$lget(row, 'latitude', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'longitude',
            label: 'Longitude',
            align: 'left',
            field: row => this.$lget(row, 'longitude', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'type',
            label: 'Type',
            align: 'left',
            field: row => this.$lget(row, 'type'),
            format: val => `${this.keysArray(val).filter(item => item)}` || 'NA',
            sortable: true,
          },
          {
            name: 'default',
            label: 'Default',
            align: 'left',
            field: row => this.$lget(row, 'tags', false),
            format: val => {
              let filteredArr = this.keysArray(val).filter(item => item);
              return filteredArr.length ? `Default ${filteredArr}` : 'N/A';
            },
            sortable: true,
          },
          {
            name: 'googleAddress',
            label: 'Google Address',
            align: 'left',
            field: row => this.$lget(row, 'googleAddress.formatted_address', 'N/A'),
            format: val => `${val}`,
            sortable: true,
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
    methods: {
      keysArray(type) {
        let arr = [];
        for (const key in type) {
          if (type[key]) {
            const newKey = key[0].toUpperCase() + key.slice(1);
            arr.push(newKey);
          }
        }
        return arr;
      },
    }
  };
</script>

<style scoped>

</style>
