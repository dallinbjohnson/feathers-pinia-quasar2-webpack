<template>
  <div>
    <div class="row q-my-md text-h4">
      Ability Management
    </div>
    <div class="row q-mt-md">
      <q-input v-model="search" outlined rounded label="Search Rules" class="col-sm-6 col-md-4">
        <template v-slot:append>
          <q-icon name="search"/>
        </template>
      </q-input>
    </div>

    <q-table
      :data="irRolesAbilities"
      :columns="columns"
      no-data-label="No abilities created yet, go make one!"
      row-key="_id"
      v-model:expanded="expanded"
      title="Abilities"
      :loading="abilitiesLoading"
      class="q-mt-xl"
      flat
      bordered
      v-model:pagination="initialPagination"
      :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
      @request="updatePagination"
    >
      <template v-slot:body="props">
        <q-tr :props="props" @click.stop="props.expand = !props.expand" class="cursor-pointer">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div v-if="col.name !== 'Actions' && col.name !== 'active'">
              {{ col.value }}
            </div>
            <div v-if="col.name === 'Actions'">
              <q-btn
                color="secondary"
                icon-right="edit"
                no-caps
                flat
                dense
                @click.stop="$emit('editAbility', props.row)"
                class="q-mr-sm"
              />
              <q-btn
                color="negative"
                icon-right="delete"
                no-caps
                @click.stop="deleteAbility(props.row)"
                flat
                dense
              />
            </div>
            <div v-if="col.name === 'active'">
              <q-icon :name="col.value ? 'fas fa-check' : 'fas fa-ban'" :color="col.value ? 'positive' : 'negative'"></q-icon>
            </div>
          </q-td>
        </q-tr>
        <transition name="slide-fade">
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left" v-if="props.row._fastjoin.rules.length > 0">
              <div v-for="(rule,index) in props.row._fastjoin.rules" :key="index" style="display: grid; grid-template-columns: 1fr 1fr 1fr;border-bottom: 1px solid rgba(225, 225, 225, 0.8);" class="bg-white">
                <div>
                  Rule Name: {{ rule.name }}
                </div>
                <div>
                 {{ rule.note }}
                </div>
                <div>
                   In {{rule.inAbilities.length}} Abilities.
                </div>
              </div>
            </div>
            <div class="text-left" v-else>No Rules Associated with this Ability</div>
          </q-td>
        </q-tr>
        </transition>
      </template>

    </q-table>
  </div>
</template>

<script>

  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {mapState} from 'vuex';


  export default {
    name: 'AbilityTable',
    mounted() {
      this.initialPagination.rowsNumber = this.irRolesAbilitiesTotal;
    },
    watch: {
      irRolesAbilitiesTotal: {
        handler(newVal) {
          this.initialPagination.rowsNumber = newVal;
        }
      }
    },
    mixins: [
      makeFindPaginateMixin({
        service: 'ir-roles-abilities',
        name: 'ir-roles-abilities',
        qid: 'ir-roles-abilities',
        limit: 10,
        query() {
          return {name: {$regex: this.search.length ? `(?i).*${this.search}.*` : ''}, $sort: {createdAt: -1}};
        },
        params() {
          return {userJoin: true};
        }
      })
    ],
    data() {
      return {
        initialPagination: {
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 0,
        },
        search: '',
        expanded: [],
        columns: [
          {
            name: 'name',
            required: true,
            label: 'Name',
            align: 'left',
            field: 'name'
          },
          // {name: 'whitelist', align: 'center', label: 'Whitelist', field: 'whitelist', format: val => val.length > 0 ? val : 'None'},
          // {name: 'blacklist', align: 'center', label: 'BlackList', field: 'blacklist', format: val => val.length > 0 ? val : 'None'},
          {name: 'rules', label: 'Rules', field: row => this.$lget(row, 'rules.length', 0), align: 'center'},
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
      ...mapState('ir-roles-abilities', {abilitiesLoading: 'isFindPending'})
    },
    methods: {
      updatePagination(event) {
        this.initialPagination.rowsPerPage = event.pagination.rowsPerPage;
        this.initialPagination.page = event.pagination.page;
        this.irRolesAbilitiesLimit = event.pagination.rowsPerPage;
        this.irRolesAbilitiesHandlePageChange(event.pagination.page);
      },
      deleteAbility(event) {
        this.$q.dialog({
          title: `Delete Ability(${event.name})`,
          message: 'Are you sure you want to delete this ability? This action is irreversible and could effect current users.',
          ok: {
            push: true,
            color: 'negative',
            label: 'Delete'
          },
          cancel: {
            push: true,
            color: 'primary'
          },
        }).onOk(() => {
          event.remove({disableSoftDelete: true}).catch((err) => {
            console.log(err);
            this.$q.notify({
              type: 'negative',
              message: `Something went wrong deleting Ability ${event.name}, please refresh and try again.`
            });
          });
        }).onCancel(() => {

        });
      },
    }
  };
</script>

<style scoped>
  .slide-fade-enter-active {
    transition: all .5s ease;
  }
  .slide-fade-leave-active {
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(30px);
    opacity: 0;
  }
</style>
