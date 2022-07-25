<template>
  <div>

    <div class="filter-bar q-mb-lg">
      <q-input rounded outlined v-model="inputVal" label>
        <template v-slot:prepend>
          <q-icon name="fas fa-search" size="xs" class="cursor-pointer q-ml-sm"/>
        </template>
        <template v-slot:label>
          <div class="q-ml-sm">Search Email</div>
        </template>
        <template v-slot:append>
          <q-icon name="fas fa-times" @click="inputVal = ''" size="xs" class="cursor-pointer q-mr-sm"/>
        </template>
      </q-input>

      <div>
        <q-btn color="primary" outline rounded icon="add" label="Add user" @click="$emit('addUser')"/>
        <q-btn @click="assignRolesDio = true" color="primary" class="q-ml-md"
               :class="selected.length ? '' : 'inactive'" outline rounded icon="fas fa-lock" label="Assign roles">
          <q-tooltip>Must have a user(s) selected</q-tooltip>
        </q-btn>
        <q-btn @click="applyFilters = !applyFilters" icon="fas fa-filter" rounded size="sm" color="primary" class="q-ml-md q-pa-xs">
          <q-tooltip>Toggle filters</q-tooltip>
        </q-btn>
      </div>
    </div>

<!--    <div style="height: 70px;" :style="{opacity: applyFilters ? '1' : '0'}">-->
<!--      <div>Filter</div>-->
<!--    </div>-->

    <div v-if="applyFilters" class="q-mb-lg">
      <UserManagementFilter @queryChange="handleQueryChange" :roles="roles"></UserManagementFilter>
    </div>

    <q-table
      ref="table"
      :data="tableUsers"
      :columns="columns"
      row-key="name"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected="selected"
      :loading="usersLoading"
      @selection="selectAll"
      v-model:pagination="initialPagination"
      :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
      @request="updatePagination"
    >
      <template v-slot:body-selection="props">
        <q-checkbox @input="handleCheckbox(props.row)"
                    :value="selected.filter(sel => sel._id === props.row._id).length ? true : false"/>
      </template>
      <template v-slot:body-cell-Actions="props">
        <q-td :props="props">
          <q-btn
            color="secondary"
            icon-right="edit"
            no-caps
            flat
            dense
            @click="$emit('startEdit', props.row)"
            class="q-mr-sm"
          />
          <q-btn
            color="negative"
            icon-right="delete"
            @click="deleteUser(props.row)"
            no-caps
            flat
            dense
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="assignRolesDio">
      <q-card :style="{borderTop: '25px solid var(--q-color-primary)', width: '45vw'}" class="q-px-md q-py-sm">
        <q-card-section class="text-h6" style="font-size: 1.5em;">
          Update roles
        </q-card-section>
        <q-card-section v-for="(user, idx) of selected" :key="idx" class="user-wrapper">
          <div>{{ user.email }}</div>
          <q-select style="flex: .7" multiple use-chips v-model="user.roles" :options="roles" label="Select role"
                    map-options emit-value option-value="_id" option-label="name">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">No Roles created</q-item-section>
              </q-item>
            </template>
            <!--            <template v-slot:option="scope">-->
            <!--              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">-->
            <!--                {{ scope.opt.name }}-->
            <!--              </q-item>-->
            <!--            </template>-->
            <!--            <template v-slot:selected-item="scope">-->
            <!--&lt;!&ndash;              <q-chip>{{ scope.opt.name }}</q-chip>&ndash;&gt;-->
            <!--              <q-chip @remove="test(user, scope.opt)" removable color="primary" text-color="white">-->
            <!--                {{ scope.opt.name }}-->
            <!--              </q-chip>-->
            <!--            </template>-->
          </q-select>
        </q-card-section>
        <q-card-actions align="right" class="q-mt-sm">
          <q-btn v-close-popup flat rounded color="primary" label="Cancel"/>
          <q-btn @click="saveRoles" unelevated rounded color="primary" label="Save changes"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="deleteDio">
      <q-card style="border-top: 25px solid red" class="q-py-sm q-px-md">
        <q-card-section>
          <div class="text-h5" style="font-size: 1.4em;">
            Are you sure you wish to delete {{ $lget(userToDelete, 'email', '') }}?
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup flat rounded color="red" label="Cancel"/>
          <q-btn @click.stop="removeUser" unelevated rounded color="secondary" label="Delete"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {mapGetters, mapActions, mapState} from 'vuex';
  import UserManagementFilter from 'components/admin/UserManagement/UserManagementFilter';

  export default {
    name: 'UserManagementTable',
    components: {UserManagementFilter},
    props: {
      tableFields: {
        type: Array,
        required: true,
      },
      roles: {
        type: Array,
        default: () => [],
      },
    },
    mounted(){
      this.initialPagination.rowsNumber = this.usersTotal;
    },
    mixins: [makeFindPaginateMixin({
      service: 'users',
      name: 'users',
      qid: 'users',
      query(){
        return this.finalQuery;
      }
    })],
    data() {
      return {
        selected: [],
        inputVal: '',
        lastIndex: 0,
        assignRolesDio: false,
        deleteDio: false,
        userToDelete: null,
        applyFilters: false,
        initialPagination: {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0
        },
        rolesQuery: [],
        isVerifiedQuery: null
      };
    },
    watch: {
      usersTotal: {
        handler(newVal){
          this.initialPagination.rowsNumber = newVal;
        }
      },
    },
    computed: {
      ...mapGetters('auth', {
        user: 'user',
      }),
      ...mapState('users', {
        usersLoading: 'isFindPending'
      }),
      finalQuery() {
        let q = {
          email: {$regex: this.inputVal.length ? `(?i).*${this.inputVal}.*` : '.*.*'},
          roles: this.rolesQuery.length ? {$in: this.rolesQuery} : {},
          isVerified: this.isVerifiedQuery !== null ? this.isVerifiedQuery : null
        };
        if(this.isVerifiedQuery === null) delete q.isVerified;
        if(!this.rolesQuery.length) delete q.roles;
        return q;
      },
      columns() {
        return [...this.tableFields, 'Actions'].map(field => {
          if (typeof field === 'string') {
            let fieldCap = field.charAt(0).toUpperCase() + field.slice(1);
            if (field === 'createdAt' || field === 'updatedAt' || field === 'deletedAt') {
              return {name: field, label: fieldCap, align: 'left', field: field, format: val => `${new Date(val) !== 'Invalid Date' ? new Date(val).toLocaleString('en-US') : val}`,};
            } else if (Array.isArray(this.$lget(this.users[0], `${field}`))) {
              return {name: field, label: fieldCap, align: 'left', field: field, format: val => val.join(', ')};
            } else {
              return {name: field, label: fieldCap, align: 'left', field: field};
            }
          } else if (typeof field === 'object') {
            let idx = field.path.indexOf('.');
            let first = field.path.slice(0, idx);
            let second = field.path.slice(idx + 1);
            let fieldCap = field.name.charAt(0).toUpperCase() + field.name.slice(1);
            return {
              name: field.name, label: fieldCap, align: 'left', format: val => {
                if(Array.isArray(val)) {
                  return val.join(', ');
                }
                return val;
              }, field: row => {
                if(this.$lget(row[first], `${second}`)) {
                  return row[first][second].map(f => f.name);
                }
              },
            };
          }
        });
      },
      tableUsers() {
        let returnArr = [];
        this.users.forEach(user => {
          returnArr.push(Object.assign({}, user));
        });
        return returnArr;
      },
    },
    methods: {
      ...mapActions('users', {
        patchUser: 'patch',
        extraRemoveUser: 'remove'
      }),
      // eslint-disable-next-line no-unused-vars
      handleQueryChange(newQuery) {
        this.rolesQuery = newQuery.roles;
        this.isVerifiedQuery = newQuery.isVerified;
      },
      updatePagination(event) {
        this.initialPagination.rowsPerPage = event.pagination.rowsPerPage;
        this.initialPagination.page = event.pagination.page;
        this.usersLimit = event.pagination.rowsPerPage;
        this.usersHandlePageChange(event.pagination.page);
      },
      removeUser() {
        this.extraRemoveUser(this.userToDelete._id).then(res => {
          this.deleteDio = false;
          this.userToDelete = {};
          this.$q.notify({
            message: res.email + ' deleted',
            color: 'positive'
          });
        }).catch(() => {
          this.$q.notify({
            message: 'Something went wrong on our end',
            color: 'negative'
          });
        });
      },
      deleteUser(user) {
        this.userToDelete = user;
        this.deleteDio = true;
      },
      getSelectedString() {
        return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.users.length}`;
      },
      saveRoles() {
        Promise.all(this.selected.map(sel => {
          this.patchUser([sel._id, {
            roles: sel.roles,
          }]);
        })).then(res => console.log(res)).catch(err => console.log(err));
      },
      selectAll() {
        this.selected.length ? this.selected = [] : this.selected = this.users;
      },
      handleCheckbox(user) {
        if (this.selected.includes(user)) {
          this.selected = this.selected.filter(sel => sel._id !== user._id);
        } else {
          this.selected.push(user);
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .filter-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .inactive {
    opacity: .5 !important;
  }

  .user-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
</style>
