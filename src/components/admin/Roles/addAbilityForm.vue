<template>
  <q-card class="row flex justify-around q-my-md cardContainer">
    <q-form @submit="createAbility" class="cardContainer">
      <q-card-section class="col-sm-12 bg-primary text-white flex justify-between">
        {{ editing ? `Editing '${ability.name}'` : 'Create New Ability' }}
      </q-card-section>
      <q-card-section class="col-sm-12 col-md-5">
        <q-input lazy-rules filled label="Name" v-model="ability.name" placeholder="Basic User Rules"
                 :rules="[val => !!val || 'Field is required']" ref="input"></q-input>
      </q-card-section>
      <q-card-section class="col-sm-12">
        <div class="flex justify-between">
          <div class="text-weight-regular" style="font-size: 1.3em;">Rules</div>
        </div>
        <q-list
          style="max-height: 500px;overflow-y: scroll;border-radius: 10px;border: 1px solid rgba(225, 225, 225, 1)">
          <q-expansion-item
            expand-separator
            :label="subject"
            v-for="(subject,index) in allSubjects" :key="index"
            class="text-capitalize bg-primary text-white"
            expand-icon-class="text-white"
            style="font-size: 1.2em;"
          >
            <q-card v-for="(rule,ruleIndex) in irRolesRules.filter((rule) => {
                    return rule.subject.includes(subject);
                  })" :key="ruleIndex" class="text-black">
              <q-card-section class="text-h5 flex justify-between cursor-pointer"
                              style="border-bottom: 1px solid rgba(225, 225, 225, 1);" @click.stop="handleRule(rule)">
                <div>
                  <div class="text-h6">{{ rule.name }}</div>
                  <div class="text-subtitle1 text-lowercase">{{ rule.note }}</div>
                </div>
                <div>
                  <q-checkbox :value="ability.rules.includes(rule._id)" @input="handleRule(rule)"
                              color="positive"></q-checkbox>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
      <q-card-section class="col-sm-12 text-weight-regular">
        <q-toggle v-model="ability.active" label="Active" left-label></q-toggle>
      </q-card-section>
      <q-card-actions>
        <q-btn rounded outline color="primary" icon="add" type="submit">Save</q-btn>
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';

  export default {
    name: 'addAbilityForm',
    props: {
      editingAbility: {type: Object}
    },
    watch: {
      editingAbility: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            if(!this.$lget(newVal, '__isClone')){
              this.ability = newVal.clone();
              this.editing = true;
            }
          }
        }
      }
    },
    mixins: [
      makeFindPaginateMixin({
        service: 'ir-roles-rules',
        name: 'ir-roles-rules',
        qid: 'ir-roles-rules',
        query() {
          return {
            $sort: {
              subject: 1,
            }
          };
        },
      })
    ],
    data() {
      return {
        models: models,
        editing: false,
        ability: new models.api.IrRolesAbilities().clone(),
        createRuleDialog: false,
      };
    },
    computed: {
      allSubjects() {
        let subjectArr = [];
        // eslint-disable-next-line no-unused-vars
        let subjectMap = this.irRolesRules.map((rule) => {
          if (!subjectArr.includes(rule.subject)) {
            subjectArr.push(rule.subject);
          }
        });
        return subjectArr;
      },
    },
    methods: {
      handleRule(rule) {
        if (this.ability.rules.includes(rule._id)) {
          let index = this.ability.rules.indexOf(rule._id);
          this.ability.rules.splice(index, 1);
        } else {
          this.ability.rules.push(rule._id);
        }
      },
      createAbility() {
        this.ability.save().then(() => {
          this.ability = new this.models.api.IrRolesAbilities().clone();
          this.$q.notify({
            message: 'Ability Saved',
            color: 'positive'
          });
          this.$refs.input.resetValidation();
          this.$emit('refreshTable');
        }).catch(err => {
          this.$q.notify({
            message: err.message,
            color: 'negative'
          });
        });
      },
    }
  };
</script>

<style scoped>
.cardContainer {
  min-width: 300px;
  max-width: 800px;
  width: 100%;
}
</style>
