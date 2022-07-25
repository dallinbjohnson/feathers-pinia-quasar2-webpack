<template>
  <data-table :title="title"
              :data="data"
              :columns="finalColumns">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>
<!--    <template v-slot:body-cell-icon="socialProps">-->
<!--      <q-td :props="socialProps">-->
<!--        <q-icon :name="socialProps.row.icon" size="sm">-->
<!--          <q-tooltip anchor="bottom right" self="center middle" content-style="font-size: 10pt">-->
<!--            {{ socialProps.row.icon }}-->
<!--          </q-tooltip>-->
<!--        </q-icon>-->
<!--      </q-td>-->
<!--    </template>-->
<!--    <template v-slot:body-cell-color="socialProps">-->
<!--      <q-td :props="socialProps">-->
<!--        <q-avatar square size="xs" :style="{'width': '30px', 'background-color': socialProps.row.color}">-->
<!--          <q-tooltip anchor="bottom left" self="center middle" content-style="font-size: 10pt">-->
<!--            {{ socialProps.row.color }}-->
<!--          </q-tooltip>-->
<!--        </q-avatar>-->
<!--      </q-td>-->
<!--    </template>-->
  </data-table>
</template>

<script>
  import DataTable from 'components/common/molecules/DataTable/DataTable';
  export default {
    name: 'SocialLinksDataTable',
    components: {DataTable},
    props: {
      title: {
        type: String,
        default: 'Social Links',
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
          // {
          //   name: '_id',
          //   label: '_Id',
          //   align: 'left',
          //   field: row => this.$lget(row, '_id'),
          //   format: val => `${val}`,
          //   sortable: true,
          //   hidden: true,
          // },
          {
            name: 'icon',
            label: 'Icon',
            align: 'left',
            field: row => this.$lget(row, 'icon'),
            format: val => val,
            isIcon: true,
            sortable: true,
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
            name: 'description',
            label: 'Description',
            align: 'left',
            field: row => this.$lget(row, 'description', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'url',
            label: 'URL',
            align: 'left',
            field: row => this.$lget(row, 'url', 'N/A'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'color',
            label: 'Color',
            align: 'left',
            field: row => this.$lget(row, 'color', 'N/A'),
            format: val => `${val}`,
            isColor: true,
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
  };
</script>
