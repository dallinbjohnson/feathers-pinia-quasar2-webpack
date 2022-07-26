<template>
  <q-page>
    <q-btn @click="$emit('goBack')" color="primary" icon="fas fa-arrow-left"/>

    <div class="form">
      <div class="fields justify-between q-mt-lg">
        <div style="margin: 22px 0;" v-for="(field, idx) of fields" :key="idx" :style="{display: Object.keys(userToPass).length > 0 && field.name === 'password' ? 'none' : 'block'}">
          <q-input v-if="field.type === 'string' && field.name !== 'password'" :label="field.name"
                   v-model="form[field.name]"/>
          <q-input v-else-if="field.type === 'string' && field.name === 'password' && Object.keys(userToPass).length === 0" v-model="form[field.name]" filled
                   :type="isPwd ? 'password' : 'text'" :label="field.name">
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-select use-chips multiple v-else-if="field.type === 'select' && !field.isFastJoin" :options="field.data"
                    v-model="form[field.name]" :label="field.name">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">Nothing to display</q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select use-chips multiple v-else-if="field.type === 'select' && field.isFastJoin" :options="field.data" v-model="form.roles" label="Select roles" map-options emit-value option-value="_id" option-label="name">
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">Nothing to display</q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-checkbox v-else-if="field.type === 'checkbox'" v-model="form[field.name]" :label="field.name"/>
        </div>
      </div>

      <div class="buttons">
        <q-btn flat rounded color="primary" label="Cancel" @click="goBack"/>
        <q-btn unelevated rounded color="primary" :label="Object.keys(userToPass).length ? 'Save changes' : 'Create user'" @click="createUser"/>
      </div>
    </div>

  </q-page>
</template>

<script>

  import {models} from '@feathersjs/vuex';

  export default {
    name: 'AddUser',
    props: {
      permissions: {
        type: Array,
        default: () => [],
      },
      fields: {
        type: Array,
        default: () => [],
      },
      userToPass: {
        type: Object,
        required: false
      }
    },
    beforeUnmount(){
      this.$emit('clearUser');
    },
    data() {
      return {
        isPwd: true,
        form: Object.keys(this.userToPass).length > 0 ? new models.api.Users(this.userToPass).clone() : new models.api.Users().clone(),
      };
    },
    methods: {
      goBack(){
        this.$emit('goBack');
      },
      createUser() {
        let user = this.form;
        console.log(this.form);
        user.save().then((res) => {
          if(Object.keys(this.userToPass).length === 0) {
            this.form = new models.api.Users().clone();
          }
          this.$q.notify({
            message: Object.keys(this.userToPass).length ? 'User ' + res.email + ' Updated' : 'User ' + res.email + ' Created',
            color: 'positive',
          });
        }).catch(err => {
          this.$q.notify({
            message: err.message,
            color: 'negative'
          });
        });
      },
    },
  };
</script>

<style scoped lang="scss">
  .fields {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin-top: 50px;

    > div {
      width: 93%;
      justify-items: center;
    }
  }

  .buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 100px;
  }
</style>
