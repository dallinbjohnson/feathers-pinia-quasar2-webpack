<template>
  <div style="min-width: 350px;max-width: 600px;width: 100%;min-height: 400px;">
    <q-form @submit="createRole">
    <div class="flex flex-center">
      <q-card style="min-width: 350px;max-width: 600px;width: 100%;min-height: 400px;display: grid;grid-template-columns: 1fr;justify-items: center;">
        <q-card-section style="font-size: 1.5em;min-width: 300px;max-width: 500px;width: 100%;border-radius: 15px;" class="text-weight-bold bg-primary text-white flex justify-center items-center q-mt-sm">
          Create Role
        </q-card-section>
        <q-card-section style="min-width: 300px;max-width: 500px;width: 100%;display: flex; flex-direction: column; justify-content: space-between;align-content: flex-start;">
          <q-input v-model="role.name" label="Role Name" placeholder="Admin" lazy-rules :rules="[val => !!val || 'Field is required']" ref="input">

          </q-input>
          <q-select label="Abilities with Role"
                    v-model="role.abilityIds"
                    :options="irRolesAbilities"
                    multiple
                    use-chips
                    option-value="_id"
                    option-label="name"
                    emit-value
                    map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey">
                  No Abilities Created
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-toggle v-model="role.active" label="Active" left-label style="font-size: 1em;">

          </q-toggle>
        </q-card-section>
        <q-card-actions>
          <q-btn rounded outline color="primary" icon="add" type="submit">{{ editingRole ? 'Save Role' : 'Create Role'}}</q-btn>
        </q-card-actions>
      </q-card>
    </div>
    </q-form>
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';

  export default {
    name: 'addRoleForm',
    props: {
      editingRole: {type: Object}
    },
    mixins: [
      makeFindPaginateMixin({
        service: 'ir-roles-abilities',
        name: 'ir-roles-abilities',
        qid: 'ir-roles-abilities',
        limit: 50,
        query() {
          return { };
        },
      })
    ],
    watch: {
      editingRole: {
        immediate: true,
        deep: true,
        handler(newVal){
          if(newVal){
            this.role = newVal.clone();
          }
        }
      }
    },
    data(){
      return {
        role: new models.api.IrRolesRoles().clone()
      };
    },
    methods: {
      createRole(){
        this.role.save().then(() => {
          this.role = new models.api.IrRolesRoles().clone();
          this.$q.notify({
            type: 'positive',
            message: 'Role Saved'
          });
          this.$refs.input.resetValidation();
          this.$emit('refreshTable');
        }).catch(() => {
          this.$q.notify({
            type: 'negative',
            message: 'Something went wrong, please refresh and try again.'
          });
        });
      }
    }
  };
</script>

<style scoped>

</style>
