<template>
  <div id="DataTable" :style="{...cssVars}" v-bind="$attrs['div-attrs']">
    <q-table :title="title"
             :data="data"
             :columns="columns"
             v-model:selected="selected"
             :visible-columns="visibleColumns"
             v-model:expanded="expanded"
             :filter="search"
             :grid="grid"
             v-bind="$attrs['attrs']">
      <template v-for="slot in Object.keys($slots)"
                v-slot:[slot]="slotProps">
        <slot :name="slot" v-bind="slotProps"></slot>
      </template>
      <template v-slot:top-right>
        <slot name="top-right">
          <div style="display: flex; justify-content: space-evenly; align-items: center; flex-wrap: wrap; gap: 15px">
            <slot name="search">
              <q-input outlined dense debounce="300" v-model="search" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
            </slot>

            <slot name="btn-toggle">
              <q-btn-toggle v-model="grid"
                            v-bind="$attrs['q-btn-toggle-attrs']"
                            :options="[
                              {icon: 'fas fa-th-large', value: true, slot: 'grid'},
                              {icon: 'fas fa-th-list', value: false, slot: 'table'}
                            ]">
                <template v-slot:grid>
                  <q-tooltip content-style="font-size: 10pt">Grid</q-tooltip>
                </template>

                <template v-slot:table>
                  <q-tooltip content-style="font-size: 10pt">Table</q-tooltip>
                </template>
              </q-btn-toggle>
            </slot>

            <slot name="hide-columns-select">
              <q-select v-model="visibleColumns"
                        multiple
                        outlined
                        dense
                        options-dense
                        display-value="Hide Columns"
                        emit-value
                        map-options
                        :options="columns.reduce((acc, col) => {
                          if (!['actions'].includes(col.name) && !col.required) {
                            acc.push({label: col.label, value: col.name});
                          }
                          return acc;
                        }, [])"
                        options-selected-class="text-primary"
                        options-cover
                        style="min-width: 150px">
                <template v-slot:prepend>
                  <q-icon name="fas fa-filter"/>
                </template>
              </q-select>
            </slot>
          </div>
        </slot>
      </template>

      <template v-slot:header-selection="props">
        <q-checkbox dense v-model="props.selected"/>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-checkbox dense v-model="props.selected"/>
          </q-td>
          <q-td v-for="col in props.cols"
                :key="col.name"
                :props="props">
            <span v-if="col.isExpansion">
              <q-btn size="sm"
                     color="primary"
                     round
                     @click="setExpanded(props, col.name)"
                     :icon="props.expand && $lget(expandMeta,`${props.pageIndex}.expandKey`) === col.name ? 'remove' : 'add'">
                <q-badge v-if="col.value && typeof col.value === 'object'"
                         color="black"
                         text-color="white"
                         :label="Array.isArray(col.value) ?  col.value.length : Object.keys(col.value).length"
                         floating
                         transparent
                         rounded/>
              </q-btn>
            </span>
            <span v-else-if="col.name === 'actions'">
              <q-btn color="primary"
                     icon-right="edit"
                     no-caps
                     flat
                     dense
                     class="q-mr-sm"
                     @click="editDialog(props)"/>
            <q-btn color="negative"
                   icon-right="delete"
                   no-caps
                   flat
                   dense
                   @click="removeData(props)"/>
            </span>
            <span v-else-if="typeof col.value === 'boolean'">
              <q-icon :name="col.value ? 'check_circle' : 'cancel'"
                      size="sm"
                      :color="col.value ? 'green' : 'red'"></q-icon>
            </span>
            <span v-else-if="col.value && Object.keys(col.value).includes('raw') || col.isImg">
              <q-avatar color="grey" text-color="white">
                <img :src="$lget(col.value, 'raw.file', col.value || '')"/>
              </q-avatar>
            </span>
            <span v-else-if="col.isColor">
              <q-avatar square size="xs" :style="{'width': '30px', 'background-color': col.value}">
                <q-tooltip anchor="bottom left" self="center middle" content-style="font-size: 10pt">
                  {{ col.value }}
                </q-tooltip>
              </q-avatar>
            </span>
            <span v-else-if="col.isIcon">
              <q-icon :name="col.value" size="sm">
                <q-tooltip anchor="bottom right" self="center middle" content-style="font-size: 10pt">
                  {{ col.value }}
                </q-tooltip>
              </q-icon>
            </span>
            <span v-else style="white-space: normal;">
              <v-clamp autoresize :max-lines="1" :max-height="24"
                       @clampchange="$set(isClamped, col.name + props.pageIndex, $event)">
                {{ col.value }}
              </v-clamp>
              <q-tooltip v-if="isClamped[col.name + props.pageIndex]"
                         content-style="font-size: 14pt;"
                         transition-show="scale"
                         transition-hide="scale"
                         max-width="400px">
                {{ col.value }}
              </q-tooltip>
            </span>
          </q-td>
        </q-tr>
        <q-tr v-if="props.expand" :props="props" class="expand">
          <q-td colspan="100%">
            <slot name="expand"
                  v-bind="{...props, col: props.cols.find(col => col.name === $lget(expandMeta,`${props.pageIndex}.expandKey`)), colName: $lget(expandMeta,`${props.pageIndex}.expandKey`)}"></slot>
          </q-td>
        </q-tr>
      </template>

      <template v-slot:item="props">
        <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
             :style="props.selected ? 'transform: scale(0.95);' : ''">
          <q-card :class="props.selected ? 'bg-grey-2' : ''">
            <q-card-section class="flex">
              <q-checkbox dense v-model="props.selected" :label="`${$lget(props, `row.${rootFieldPath}`, '')}`"/>

              <q-space></q-space>

              <q-btn color="primary"
                     icon-right="edit"
                     no-caps
                     flat
                     dense
                     class="q-mr-sm"
                     @click="editDialog(props)"/>
              <q-btn color="negative"
                     icon-right="delete"
                     no-caps
                     flat
                     dense
                     @click="removeData(props)"/>
            </q-card-section>
            <q-separator/>
            <q-list dense>
              <div v-for="col in props.cols" :key="col.name">
                <q-btn v-if="col.isExpansion"
                       align="left"
                       class="full-width"
                       flat
                       @click="setExpanded(props, col.name)">
                  {{ col.label }}

                  <q-space></q-space>

                  <span v-if="col.value && typeof col.value === 'object'">
                    {{ Array.isArray(col.value) ? col.value.length : Object.keys(col.value).length }}
                  </span>

                  <q-dialog :value="props.expand && $lget(expandMeta,`${props.pageIndex}.expandKey`) === col.name"
                            @hide="setExpanded(props, col.name)"
                            full-height
                            full-width>
                    <slot name="dialog"
                          v-bind="{...props, col, colName: $lget(expandMeta,`${props.pageIndex}.expandKey`)}">
                      <q-card>
                        <q-toolbar class="bg-primary text-white shadow-2">
                          <q-toolbar-title>{{ col.label }}</q-toolbar-title>
                          <q-btn flat v-close-popup round dense icon="close"/>
                        </q-toolbar>

                        <q-card-section style="max-height: 90vh;" class="scroll">
                          <slot name="dialog-card-section"
                                v-bind="{...props, col, colName: $lget(expandMeta,`${props.pageIndex}.expandKey`)}">
                            <slot name="expand"
                                  v-bind="{...props, col, colName: $lget(expandMeta,`${props.pageIndex}.expandKey`)}"></slot>
                          </slot>
                        </q-card-section>
                      </q-card>
                    </slot>
                  </q-dialog>
                </q-btn>
                <template v-else-if="col.name === 'actions'">
                </template>
                <q-item v-else-if="typeof col.value === 'boolean'">
                  <q-item-section>
                    <q-item-label>{{ col.label }}:</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon :name="col.value ? 'check_circle' : 'cancel'"
                            size="sm"
                            :color="col.value ? 'green' : 'red'"></q-icon>
                  </q-item-section>
                </q-item>
                <q-item v-else-if="col.value && Object.keys(col.value).includes('raw') || col.isImg">
                  <q-item-section>
                    <q-item-label>{{ col.label }}:</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-avatar color="grey" text-color="white">
                      <img :src="$lget(col.value, 'raw.file', col.value || '')"/>
                    </q-avatar>
                  </q-item-section>
                </q-item>
                <q-item v-else-if="col.isColor">
                  <q-item-section>
                    <q-item-label>{{ col.label }}:</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-avatar square size="xs" :style="{'width': '30px', 'background-color': col.value}">
                      <q-tooltip anchor="bottom left" self="center middle" content-style="font-size: 10pt">
                        {{ col.value }}
                      </q-tooltip>
                    </q-avatar>
                  </q-item-section>
                </q-item>
                <q-item v-else-if="col.isIcon">
                  <q-item-section>
                    <q-item-label>{{ col.label }}:</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-icon :name="col.value" size="sm">
                      <q-tooltip anchor="bottom right" self="center middle" content-style="font-size: 10pt">
                        {{ col.value }}
                      </q-tooltip>
                    </q-icon>
                  </q-item-section>
                </q-item>
                <q-item v-else>
                  <q-item-section>
                    <q-item-label>{{ col.label }}:</q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label caption style="text-align: right;">
                      <span style="white-space: normal;">
                        <v-clamp autoresize :max-lines="1" :max-height="24"
                                 @clampchange="$set(isClamped, col.name + props.pageIndex, $event)">
                          {{ col.value }}
                        </v-clamp>
                        <q-tooltip v-if="isClamped[col.name + props.pageIndex]"
                                   content-style="font-size: 14pt;"
                                   transition-show="scale"
                                   transition-hide="scale"
                                   max-width="400px">
                          {{ col.value }}
                        </q-tooltip>
                      </span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-card>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
  // import {routerMixin} from '@iy4u/common-client-lib';

  import VClamp from 'vue-clamp';

  export default {
    name: 'DataTable',
    inheritAttrs: false,
    components: {
      VClamp,
    },
    props: {
      title: {
        type: String,
      },
      data: {
        type: Array,
        default() {
          return [];
        },
      },
      columns: {
        type: Array,
        default() {
          return [];
        },
      },
      rootFieldPath: {
        type: String,
        default: 'name',
      },
      routerMixinRun: {
        type: Boolean,
        default: true,
      },
    },
    mixins: [
      // routerMixin({
      //   name: 'FDataTable',
      //   runWhen() {
      //     return this.routerMixinRun;
      //   },
      //   parseQuery(val, key) {
      //     if (['expandMeta', 'expanded', 'grid'].indexOf(key) !== -1) {
      //       return JSON.parse(val);
      //     } else {
      //       return val;
      //     }
      //   },
      //   query() {
      //     return {
      //       expandMeta: JSON.stringify(this.expandMeta),
      //       expanded: JSON.stringify(this.expanded),
      //       grid: JSON.stringify(this.grid),
      //     };
      //   },
      // }),
    ],
    data() {
      return {
        isClamped: {},
        grid: false,
        expanded: [],
        expandMeta: {},
        search: '',
        selected: [],
        visibleColumns: this.columns.reduce((acc, col) => {
          if (!['actions'].includes(col.name) && !col.required && !this.$lget(col, 'hidden')) {
            acc.push(col.name);
          }
          return acc;
        }, []),
      };
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          this.$lset(newVal, 'attrs.row-key', this.$lget(newVal, 'attrs.row-key', '_id'));
          this.$lset(newVal, 'attrs.grid-header', this.$lget(newVal, 'attrs.grid-header', true));
          this.$lset(newVal, 'attrs.dense', this.$lget(newVal, 'attrs.dense', true));
          this.$lset(newVal, 'attrs.color', this.$lget(newVal, 'attrs.color', 'primary'));
          this.$lset(newVal, 'attrs.class', this.$lget(newVal, 'attrs.class', 'my-sticky-header-column-table'));
          this.$lset(newVal, 'attrs.card-container-class', this.$lget(newVal, 'attrs.card-container-class', 'grid-content'));
          this.$lset(newVal, 'attrs.rows-per-page-options', this.$lget(newVal, 'attrs.rows-per-page-options', [5, 12, 25, 50, 100, 200, 0]));
          this.$lset(newVal, 'attrs.selection', this.$lget(newVal, 'attrs.selection', 'multiple'));

          // div-attrs defaults
          // this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));

          // q-btn-toggle-attrs defaults
          this.$lset(newVal, 'q-btn-toggle-attrs.no-caps', this.$lget(newVal, 'q-btn-toggle-attrs.no-caps', true));
          this.$lset(newVal, 'q-btn-toggle-attrs.rounded', this.$lget(newVal, 'q-btn-toggle-attrs.rounded', true));
          this.$lset(newVal, 'q-btn-toggle-attrs.unelevated', this.$lget(newVal, 'q-btn-toggle-attrs.unelevated', true));
          this.$lset(newVal, 'q-btn-toggle-attrs.toggle-color', this.$lget(newVal, 'q-btn-toggle-attrs.toggle-color', 'primary'));
          this.$lset(newVal, 'q-btn-toggle-attrs.text-color', this.$lget(newVal, 'q-btn-toggle-attrs.text-color', 'primary'));
          this.$lset(newVal, 'q-btn-toggle-attrs.class', this.$lget(newVal, 'q-btn-toggle-attrs.class', 'q-mr-lg'));
          this.$lset(newVal, 'q-btn-toggle-attrs.style', this.$lget(newVal, 'q-btn-toggle-attrs.style', 'border: 1px solid var(--q-color-primary);'));
        },
      },
    },
    computed: {
      cssVars() {
        return {
          '--table-bg': this.$q.dark.isActive ? 'var(--q-color-dark)' : ' #fff',
        };
      },
    },
    methods: {
      setExpanded(props, key) {
        if (this.$lget(this.expandMeta, `${props.pageIndex}.expandKey`) === key) {
          props.expand = false;
          this.expandMeta = Object.assign({}, this.$lset(this.expandMeta, `${props.pageIndex}.expandKey`, null));
        } else {
          props.expand = true;
          if (this.$lget(props, 'val._id')) this.expanded.push(this.$lget(props, 'val._id'));
          this.expandMeta = Object.assign({}, this.$lset(this.expandMeta, `${props.pageIndex}.expandKey`, key));
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  #DataTable::v-deep {
    .q-table__card.my-sticky-header-column-table {
      max-height: calc(100vh - 70px);

      td:first-child {
        background-color: var(--table-bg);
      }

      tr th {
        position: sticky;
        z-index: 2;
        background-color: var(--table-bg);
      }

      thead tr:first-child th {
        top: 0;
        z-index: 1;
      }

      tr:first-child th:first-child {
        z-index: 3;
      }

      td:first-child {
        z-index: 1;
      }

      td:first-child, th:first-child {
        position: sticky;
        left: 0;
      }

      .expand td, .expand th {
        position: relative;
        left: inherit;
        z-index: inherit;
      }
    }
  }
</style>
