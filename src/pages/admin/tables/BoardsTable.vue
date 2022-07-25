<template>
  <f-data-table title="Boards"
                service="boards"
                :qid="qid"
                :limit="12"
                :query="query"
                :params="{
                    boardResolversQuery: {
                      shared: [
                        ['_id', 'name', 'avatar']
                      ]
                    }
                  }"
                :columns="columns"
                :remove-columns="removeColumns"
                :form-fields="formFields"
                create-title="Board"
                @input="formData = $event">
    <template v-for="slot in Object.keys($slots)"
              v-slot:[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps"></slot>
    </template>

    <template v-slot:expand="props">
      <template v-if="props.colName === 'lists'">
        <lists-table :remove-columns="['actions', 'board', 'cards']"
                     :query="{ _id: { $in: $lget(props, 'row.lists', []) } }"
                     :qid="`listsBoardsAdmin${$lget(props, 'row._id')}`">
          <template v-slot:btn-toggle>
            <div></div>
          </template>
          <template v-slot:dialogBtn>
            <div></div>
          </template>
        </lists-table>
      </template>

      <template v-if="props.colName === 'shared'">
        <q-table :data="$lget(props, 'row._fastjoin.shared')" :pagination="{rowsPerPage: 10}"></q-table>
      </template>
    </template>
  </f-data-table>
</template>

<script>
  import ListsTable from 'pages/admin/tables/ListsTable';
  import {commonFieldsConfig} from 'src/utils/commonFieldsConfig';

  export default {
    name: 'BoardsTable',
    components: {ListsTable},
    props: {
      removeColumns: {
        type: Array,
        default() {
          return [];
        },
      },
      query: {
        type: Object,
        default() {
          return {};
        }
      },
      qid: {
        type: String,
        default: 'boardsAdmin',
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
            label: '_id',
            align: 'left',
            field: row => this.$lget(row, '_id'),
            format: val => `${val}`,
            sortable: true,
            hidden: true,
          },
          {
            name: 'color',
            label: 'Color',
            align: 'left',
            isColor: true,
            field: row => this.$lget(row, 'color.hex'),
            format: val => `${val}`,
            sortable: true,
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
            name: 'order',
            label: 'Order',
            align: 'left',
            field: row => this.$lget(row, 'order'),
            format: val => `${val}`,
            sortable: true,
          },
          {
            name: 'lists',
            label: 'Lists',
            align: 'left',
            field: row => this.$lget(row, 'lists', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'shared',
            label: 'Shared',
            align: 'left',
            field: row => this.$lget(row, '_fastjoin.shared', []),
            format: val => val,
            sortable: true,
            isExpansion: true,
          },
          {
            name: 'onServerAt',
            label: 'On Server At',
            align: 'left',
            field: row => this.$lget(row, 'onServerAt'),
            format: val => `${val}`,
            sortable: true,
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

      formFields() {
        return [
          {
            fieldType: 'TextInput',
            path: 'name',
            attrs: {
              label: 'name',
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
            fieldType: 'NumberInput',
            path: 'order',
            attrs: {
              min: 1,
              center: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'ColorPicker',
            path: 'color',
            // attrs: {
            //   palette: this.softAutomn,
            // },
          },
        ];
      },
    },
  };
</script>

<style scoped>

</style>
