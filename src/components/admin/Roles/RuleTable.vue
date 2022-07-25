<template>
  <div class="q-pa-md">
    <div class="row q-my-md text-h4">
      Rule Management
    </div>
    <div class="row justify-between items-center">
      <div class="col-sm-12 col-md-4">
        <q-input v-model="search" outlined rounded label="Search Rules">
          <template v-slot:append>
            <q-icon name="search"/>
          </template>
        </q-input>
      </div>
      <div class="q-my-md">
        <div class="flex justify-end">
          <div>
            <q-btn icon="fas fa-pencil-ruler" class="text-primary text-weight-bold" label="Create Custom Rule"
                   @click="createRuleDialog = !createRuleDialog"></q-btn>
          </div>
        </div>
      </div>
    </div>
    <q-table
      :data="irRolesRules"
      :columns="columns"
      no-data-label="No rules created yet, go make one!"
      row-key="_id"
      title="Roles"
      :loading="rulesLoading"
      class="q-mt-sm"
      v-model:pagination="initialPagination"
      :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
      @request="updatePagination"
      :visible-columns="visibleColumns"
    >
      <template v-slot:top>
        <div class="sourceSansProBold">
          Rules
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
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <div v-if="col.name !== 'Actions' && col.name !== 'active' && col.name !== 'conditions'">
              {{ col.value }}
            </div>
            <div v-if="col.name === 'Actions'">
              <q-btn
                color="secondary"
                icon-right="edit"
                no-caps
                flat
                dense
                @click.stop="editingRule = props.row, createRuleDialog = true"
                class="q-mr-sm"
              />
              <q-btn
                color="negative"
                icon-right="delete"
                no-caps
                @click.stop="deleteRule(props.row)"
                flat
                dense
              />
            </div>
            <div v-if="col.name === 'active'">
              <q-icon :name="col.value ? 'fas fa-check' : 'fas fa-ban'" :color="col.value ? 'positive' : 'negative'"></q-icon>
            </div>
            <div v-if="col.name === 'conditions'">
              <q-btn v-if="Object.keys(props.row.conditions).length > 0" icon="visibility" @click.stop="props.expand = !props.expand" flat size="md"></q-btn>
            </div>
          </q-td>
        </q-tr>
        <transition name="slide-fade">
          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left q-card--bordered" v-if="Object.keys(props.row.conditions).length > 0">
                <div>
                  <vue-json-pretty :data="props.row.conditions"></vue-json-pretty>
                </div>
              </div>
              <div class="text-left" v-else>No Conditions Associated with this Rule</div>
            </q-td>
          </q-tr>
        </transition>
      </template>
    </q-table>
    <q-dialog v-model="createRuleDialog" @hide="refreshEditRule">
      <add-rule-form @close="refreshTable" :ruleToEdit="editingRule"></add-rule-form>
    </q-dialog>
  </div>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {mapState} from 'vuex';
  import addRuleForm from 'components/admin/Roles/addRuleForm';
  import {models} from '@feathersjs/vuex';
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

  export default {
    name: 'RuleTable',
    mounted(){
      this.initialPagination.rowsNumber = this.irRolesRulesTotal;
    },
    components: {
      VueJsonPretty,
      addRuleForm
    },
    mixins: [
      makeFindPaginateMixin({
        service: 'ir-roles-rules',
        name: 'ir-roles-rules',
        qid: 'ir-roles-rules',
        limit: 25,
        query() {
          return {name: {$regex: this.search.length ? `(?i).*${this.search}.*` : ''}, $sort: {createdAt: -1}};
        },
        params() {
          return {userJoin: true};
        }
      })
    ],
    watch: {
      irRolesRulesTotal: {
        handler(newVal) {
          this.initialPagination.rowsNumber = newVal;
        }
      }
    },
    data() {
      return {
        editingRule: new models.api.IrRolesRules().clone(),
        createRuleDialog: false,
        initialPagination: {
          page: 1,
          rowsPerPage: 25,
          rowsNumber: 0,
        },
        search: '',
        visibleColumns: [ 'name', 'abilityIds', 'subject', 'action','active', 'conditions','createdBy', 'createdAt', 'Actions' ],
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
            align: 'center',
            label: 'In Abilities',
            field: row => this.$lget(row, 'inAbilities', []).length,
          },
          // {name: 'whitelist', align: 'center', label: 'Whitelist', field: 'whitelist', format: val => val.length > 0 ? val : 'None'},
          // {name: 'blacklist', align: 'center', label: 'BlackList', field: 'blacklist', format: val => val.length > 0 ? val : 'None'},
          {name: 'subject', label: 'Subjects', field: row => this.$lget(row, 'subject', ''), align: 'center'},
          {name: 'action', label: 'Actions', field: row => this.$lget(row, 'action', []).join(', '), align: 'center'},
          {
            name: 'conditions',
            label: 'Conditions',
            align: 'center',
            field: 'conditions'
          },
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
      ...mapState('ir-roles-rules', {rulesLoading: 'isFindPending'}),
    },
    methods: {
      refreshTable(){
        this.createRuleDialog = false;
        this.irRolesRulesRefresh();
      },
      refreshEditRule(){
        this.editingRule = new models.api.IrRolesRules().clone();
      },
      updatePagination(event) {
        this.initialPagination.rowsPerPage = event.pagination.rowsPerPage;
        this.initialPagination.page = event.pagination.page;
        this.irRolesRulesLimit = event.pagination.rowsPerPage;
        this.irRolesRulesHandlePageChange(event.pagination.page);
      },
      deleteRule(rule){
        this.$q.dialog({
          title: `Delete Rule(${rule.name})`,
          message: `Are you sure you want to delete this rule? This rule is currently used by ${rule.inAbilities.length} abilities.`,
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
          this.$isLoading(true);
          let deleteRule = new models.api.IrRolesRules(rule).clone();
          deleteRule.remove().then(() => {
            this.$isLoading(false);
            this.$q.notify({type: 'positive', message: 'Role Deleted'});
          }).catch(() => {
            this.$isLoading(false);
            this.$q.notify({type: 'negative', message: 'Something went wrong, please refresh and try again.'});
          });
        }).onCancel(() => {

        });

      },
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
