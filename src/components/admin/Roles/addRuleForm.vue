<template>
  <q-card style="min-width: 300px;max-width: 850px;width: 100%;height: 100%;" class="q-pa-md">
    <q-form @submit="createRule">
      <q-card-section class="col-sm-12 bg-primary text-white sourceSansProBold">
        <div>Create Rule
          <q-icon name="fas fa-gavel" class="q-ml-sm"></q-icon>
        </div>
      </q-card-section>
      <q-card-section class="col-sm-12">
        <q-input :lazy-rules="true" filled label="Name" v-model="rule.name" placeholder="Create Cards"
                 :rules="[val => !!val || 'Field is required']" ref="input"></q-input>
        <q-input type="textarea" filled label="Note" v-model="rule.note"
                 placeholder="This rule allows the user to create Cards."></q-input>
        <q-select
          label="Action"
          filled
          v-model="rule.action"
          use-input
          :options="['find', 'get', 'create', 'update', 'patch', 'remove', 'manage']"
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add-unique"
          class="q-my-md"
        />
        <q-select
          label="Subject"
          filled
          v-model="rule.subject"
          use-input
          :options="theServices.map((service) => {return service.service}).concat(['all'])"
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add-unique"
          class="q-my-md"
        />
        <q-select
          label="Fields"
          filled
          v-model="rule.fields"
          use-input
          use-chips
          multiple
          :options="serviceFields"
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add-unique"
          class="q-my-md"
        />
      </q-card-section>
      <q-card-section>
        <div>
          <div v-if="!addingCondition">
            <q-btn color="primary" icon="fas fa-hand-paper" label="Add Condition"
                   @click="addingCondition = !addingCondition">
            </q-btn>
          </div>
          <div v-else>
            <div>
              <div class="q-card--bordered q-pa-md">
                <JsonEditor v-model="rule.conditions"
                            :objData="rule.conditions"
                            :key-path-name="this.keyPath"
                            :options="{
                      confirmText: 'confirm',
                      cancelText: 'cancel',
                    }"></JsonEditor>
              </div>
              <div class="q-card--bordered q-pa-md">
                <vue-json-pretty
                  :data="rule.conditions">
                </vue-json-pretty>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-toggle label="A 'cannot' rule" v-model="rule.inverted" left-label></q-toggle>
        <q-toggle label="Active" v-model="rule.active" left-label></q-toggle>
      </q-card-section>
      <q-card-section v-if="rule.inverted">
        <q-input label="Reason" v-model="rule.reason"
                 hint="This will be what is shown to the user if they don't have permissions."></q-input>
      </q-card-section>
      <q-card-actions class="flex flex-center">
        <div>
          <q-btn rounded outline color="primary" icon="add" type="submit">Save Rule</q-btn>
        </div>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';
  import {mapActions} from 'vuex';
  import JsonEditor from 'components/common/molecules/JsonEditor/JsonEditor';

  export default {
    name: 'addRuleForm',
    props: {
      ruleToEdit: {type: Object}
    },
    components: {
      VueJsonPretty,
      JsonEditor
    },
    mounted() {
      this.loadServices().then((res) => {
        this.theServices = res[0].serviceArray;
        this.keyPath = res[0].keyPathConfig;
      });
    },
    data() {
      return {
        theServices: [],
        keyPath: 'keyPath',
        rule: this.ruleToEdit ? new models.api.IrRolesRules(this.ruleToEdit).clone() : new models.api.IrRolesRules().clone(),
        addingCondition: false,
      };
    },
    computed: {
      serviceFields() {
        let arrayOfFields = [];
        this.theServices.map((service) => {
          if (this.rule.subject === service.service) {
            arrayOfFields.push(...service.fields.filter((field) => {
              return !arrayOfFields.includes(field);
            }));
          }
        });
        return arrayOfFields;
      }
    },
    methods: {
      ...mapActions('services-expose', {loadServices: 'find'}),
      createRule() {
        this.rule.save().then(() => {
          this.$q.notify('Rule successfully created');
          this.rule = new models.api.IrRolesRules().clone();
          this.$emit('close');
        }).catch((err) => {
          console.error(err);
          this.$q.notify('Something went wrong, please refresh and try again');
        });
      },

    }
  };
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;900&display=swap');

  .sourceSansProBold {
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 600;
    font-size: 1.7em;
  }

</style>
