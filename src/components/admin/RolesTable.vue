<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-sm-12 col-md-4">
        <q-input v-model="search" outlined rounded label="Search Roles">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </div>
    </div>
    <q-table
      :data="irRolesRoles"
      :columns="columns"
      no-data-label="No roles created yet, go make one!"
      row-key="_id"
      title="Roles"
      :loading="rolesLoading"
      class="q-mt-xl"
      v-model:pagination="initialPagination"
      :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
      @request="updatePagination"
      :visible-columns="visibleColumns"
    >
      <template v-slot:top>
        <div class="sourceSansProBold">
          Roles
        </div>

        <q-space />

        <q-select
          v-model="visibleColumns"
          multiple
          outlined
          dense
          options-dense
          display-value="Hide Columns"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          options-cover
          style="min-width: 150px"
        >
          <template v-slot:prepend>
            <q-icon name="fas fa-filter" />
          </template>
        </q-select>
      </template>
      <template v-slot:body-cell-active="props">
        <q-td :props="props">
          <q-icon :name="props.row.active ? 'check_circle' : 'cancel'" size="sm"
                  :color="props.row.active ? 'green' : 'red'"></q-icon>
        </q-td>
      </template>
      <template v-slot:body-cell-Actions="props">
        <q-td :props="props">
          <q-btn
            color="secondary"
            icon-right="edit"
            no-caps
            flat
            dense
            @click.stop="$emit('editRole', props.row)"
            class="q-mr-sm"
          />
          <q-btn
            color="negative"
            icon-right="delete"
            no-caps
            @click.stop="$emit('deleteRole', props.row)"
            flat
            dense
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {mapState} from 'vuex';

  export default {
    name: 'RolesTable',
    mounted(){
      this.initialPagination.rowsNumber = this.irRolesRolesTotal;
    },
    mixins: [
      makeFindPaginateMixin({
        service: 'ir-roles-roles',
        name: 'ir-roles-roles',
        qid: 'ir-roles-roles',
        limit: 10,
        query() {
          return {name: {$regex: this.search.length ? `(?i).*${this.search}.*` : ''}, $sort: {createdAt: -1}};
        },
        params() {
          return {userJoin: true, withAbilities: true};
        }
      })
    ],
    watch: {
      irRolesRolesTotal: {
        handler(newVal) {
          this.initialPagination.rowsNumber = newVal;
        }
      }
    },
    data() {
      return {
        initialPagination: {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0,
        },
        search: '',
        visibleColumns: [ 'name', 'abilityIds', 'active', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt', 'Actions' ],
        columns: [
          {
            name: 'name',
            required: true,
            label: 'Name',
            align: 'left',
            field: 'name'
          },
          {
            name: 'abilityIds',
            align: 'left',
            label: 'Abilities',
            field: row => this.$lget(row, '_fastjoin.abilities', []).length > 0 ? this.$lget(row, '_fastjoin.abilities', []).map((abil) => {
              return abil.name;
            }).join(', ') : 'None'
          },
          // {name: 'whitelist', align: 'center', label: 'Whitelist', field: 'whitelist', format: val => val.length > 0 ? val : 'None'},
          // {name: 'blacklist', align: 'center', label: 'BlackList', field: 'blacklist', format: val => val.length > 0 ? val : 'None'},
          {name: 'active', label: 'Active', field: 'active', align: 'center'},
          {name: 'createdBy', label: 'Created By', field: row => this.$lget(row, '_fastjoin.createdBy'), align: 'left'},
          {name: 'updatedBy', label: 'Updated By', field: row => this.$lget(row, '_fastjoin.updatedBy'), align: 'left'},
          {
            name: 'createdAt',
            label: 'Created At',
            field: 'createdAt',
            format: val => `${new Date(val).toLocaleString('en-US')}`,
            align: 'left'
          },
          {
            name: 'updatedAt',
            label: 'Last Updated',
            field: 'updatedAt',
            format: val => `${new Date(val).toLocaleString('en-US')}`,
            align: 'left'
          },
          {name: 'Actions', label: 'Actions', field: 'Actions', align: 'left'},
        ],
      };
    },
    computed: {
      ...mapState('ir-roles-roles', {rolesLoading: 'isFindPending'}),
    },
    methods: {
      updatePagination(event) {
        this.initialPagination.rowsPerPage = event.pagination.rowsPerPage;
        this.initialPagination.page = event.pagination.page;
        this.irRolesRolesLimit = event.pagination.rowsPerPage;
        this.irRolesRolesHandlePageChange(event.pagination.page);
      }
    }
  };
</script>

<style scoped>
  .sourceSansProBold {
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 600;
    font-size: 1.7em;
  }
</style>
