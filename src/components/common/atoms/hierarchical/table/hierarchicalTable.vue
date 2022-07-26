<template>
    <span id="hierarchical-table">
        <q-markup-table :separator="separator" :dense="dense" :dark="dark" :flat="flat" :bordered="bordered"
                        :square="square" :class="classes" :wrap-cells="wrapCells">
            <thead>
              <tr>
                <th v-for="(col, idx) in columns" :key="idx" @click="col.sortable ? sortBy(col) : null"
                    :class="'text-'+col.align">
                      {{ col.label }}
                  <q-icon v-if="col.sorted"
                          :name="col.sortDirection==='asc' ? 'arrow_upward' : 'arrow_downward'"></q-icon>
                </th>
              </tr>
            </thead>
            <tbody>
            <template v-if="hasDefaultSlot">
              <tr v-for="(item ,index)  in (arrayTreeObj)" :key="index">
                <slot name="body" :item="item" :toggle="toggle" :setPadding="setPadding"
                      :iconName="iconName">
                </slot>
              </tr>
            </template>
            <template v-if="!hasDefaultSlot">
              <tr v-for="(item, index)  in (arrayTreeObj)" :key="index">

                <td data-th="Name" v-for="(col, col_index) in columns" :key="col_index" :class="'text-' + col.align">
                    <div :style="col_index === 0 ? setPadding(item) : {'padding-left':'30px'}"
                         :class="iconName(item)!=='done'?'q-pl-lg':''">
                        <q-btn @click="col_index === 0 ? toggle(item) : {}"
                               v-if="iconName(item) !== 'done' && col_index == 0"
                               :icon="iconName(item)" flat dense>
                        </q-btn>
                        <span class="q-ml-sm">{{ item[col.field] }}</span>
                    </div>
                </td>
              </tr>
            </template>
            </tbody>
        </q-markup-table>
    </span>
</template>

<script>
  export default {
    name: 'HierarchicalTable',
    props: {
      columns: {
        type: Array,
        default() {
          return [];
        },
      },
      data: {
        type: Array,
        default() {
          return [];
        },
      },
      separator: {
        type: String,
        validator: (val) => ['horizontal', 'vertical', 'cell', 'none'].includes(val),
        default: 'horizontal',
      },
      wrapCells: {
        type: Boolean,
        default() {
          return false;
        },
      },
      dense: {
        type: Boolean,
        default() {
          return false;
        },
      },
      dark: {
        type: Boolean,
      },
      flat: {
        type: Boolean,
        default() {
          return false;
        },
      },
      bordered: {
        type: Boolean,
        default() {
          return false;
        },
      },
      square: {
        type: Boolean,
        default() {
          return false;
        },
      },
      classes: {
        type: [Array, String],
      },
      defaultExpandAll: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
    data() {
      return {
        leftDrawerOpen: false,
        isExpanded: true,
        selectedRowID: {},
        itemId: null,
        temp_data: [],
        temp_index: 1,
        first_call: false,
      };
    },
    watch: {
      selectedIDRow: function (val) {
        if (this.selectedRowID != null) {
          this.$set(this.selectedRowID, '_index', val);
        }
      },
    },
    methods: {
      recursive(obj, newObj, level, itemId, isExpend, first_call) {
        let vm = this;
        obj.forEach(function (o) {
          if (o.children && o.children.length !== 0) {
            o.level = level;
            o.leaf = false;
            o.sortDirection = 'none';
            o.sorted = false;
            o['_index'] = vm.temp_index;
            vm.temp_index = vm.temp_index + 1;
            if (first_call) {
              o.expend = true;
            }
            newObj.push(o);
            if (o._index == itemId) {
              o.expend = isExpend;
            }
            if (o.expend === true) {
              vm.recursive(o.children, newObj, o.level + 1, itemId, isExpend, first_call);
            }
          } else {
            o.level = level;
            o.leaf = true;
            o.sortDirection = 'none';
            o.sorted = false;
            o['_index'] = vm.temp_index;
            vm.temp_index = vm.temp_index + 1;
            newObj.push(o);
            return false;
          }
        });
      },
      iconName(item) {
        if (item.expend === true) {
          return 'remove';
        }
        if (item.children && item.children.length > 0) {
          return 'add';
        }
        return 'done';
      },
      toggle(item) {
        let vm = this;
        vm.itemId = item._index;
        item.leaf = false;
        //show  sub items after click on + (more)
        if (
          item.leaf === false &&
          typeof item.expend === 'undefined' &&
          typeof item.children !== 'undefined'
        ) {
          if (item.children.length !== 0) {
            vm.recursive(item.children, [], item.level + 1, item._index, item.expend, false);
          }
        }
        if (item.expend === true && item.children !== undefined) {
          // eslint-disable-next-line no-unused-vars
          let __subindex = 0;
          item.children.forEach(function (o) {
            o.expend = undefined;
            vm.setUndefined(o);
          });
          item['expend'] = undefined;
          item['leaf'] = false;
          vm.itemId = null;
        }
      },
      setPadding(item) {
        return `padding-left: ${item.level * 30}px;`;
      },
      setUndefined(item) {
        let vm = this;
        if ({}.propertyIsEnumerable.call(item, 'children')) {
          item.children.forEach(function (o) {
            o.expend = undefined;
            vm.setUndefined(o);
          });
        }
      },
      sortBy(col) {
        if (col.sortDirection === 'asc') {
          this.sort_recursive(this.data, col, true);
          col.sortDirection = 'desc';
          col.arrow_downward = 'arrow_downward';
        } else {
          this.sort_recursive(this.data, col, false);
          col.sortDirection = 'asc';
        }
        col.sorted = true;
        this.resetSorting(col);
      },
      sort_recursive(elements, col, descending) {
        elements.sort(this.sort_by(col, descending));
        for (let i = 0; i < elements.length; i++) {
          if ({}.propertyIsEnumerable.call(elements[i], 'children')) {
            this.sort_recursive(elements[i].children, col, descending);
          }
        }
      },
      sort_by(col, descending) {
        let direction = !descending ? 1 : -1;
        if (col.sortingType === 'custom' && typeof col.sortingFunc === 'function') {
          return function (a, b) {
            return col.sortingFunc(a, b) * direction;
          };
        }
        let key = function (x) {
          if (!{}.propertyIsEnumerable.call(x, col.field)) {
            return '';
          }
          return (x[col.field] === null ? '' : x[col.field].toLowerCase());
        };
        switch (col.sortingType) {
          case 'number':
            key = function (x) {
              return parseFloat(x[col.field]);
            };
            break;
          case 'date':
            key = function (x) {
              return new Date(x[col.field]);
            };
            break;
        }
        return function (a, b) {
          return a = key(a), b = key(b), direction * ((a > b) - (b > a));
        };
      },
      resetSorting(sortedCol) {
        let arraySize = this.columns.length;
        for (let i = 0; i < arraySize; i++) {
          let col = this.columns[i];
          if (col.field !== sortedCol.field) {
            col.sorted = false;
            col.sortDirection = 'none';
          }
        }
      },
    },
    computed: {
      arrayTreeObj() {
        let vm = this;
        let newObj = [];
        vm.temp_data = [];
        vm.temp_index = 1;
        vm.recursive(vm.data, newObj, 0, vm.itemId, vm.isExpanded, vm.first_call);
        vm.first_call = false;
        return newObj;
      },
      hasDefaultSlot() {
        return {}.propertyIsEnumerable.call(this.$slots, 'body');
      },
    },
    created() {
      if (this.defaultExpandAll) {
        this.first_call = true;
      }
    },
  };
</script>

<style scoped lang="scss" src="./_hierarchicalTable.scss">
</style>
