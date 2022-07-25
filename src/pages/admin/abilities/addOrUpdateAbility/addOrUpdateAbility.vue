<template>
  <div id="addOrUpdateAbility">
    <slot name="dialogBtn">
      <q-btn rounded color="accent" text-color="black" icon="add" @click="addDialog">
        Add Ability
      </q-btn>
    </slot>

    <q-dialog v-model="dialogForm" position="right" full-height>
      <q-layout view="Lhh LpR Lff" container :class="$q.dark.mode ? 'bg-dark' : 'bg-white'"
                :style="`width: ${$data.$windowWidth < 420 ? $data.$windowWidth - 10 : 400}px;`">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title class="text-accent text-uppercase" style="font-weight: 700;">
              {{ $lget(formData, 'ability._id') ? $lget(formData, 'ability.name') : 'Create Ability' }}
            </q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close"/>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page class="q-pa-sm">
            <formGenerator v-model="formData" :fields="fields" useQform v-model:valid="valid"></formGenerator>
          </q-page>
        </q-page-container>

        <q-footer :class="$q.dark.mode ? 'bg-dark' : 'bg-white'" bordered>
          <q-toolbar>
            <q-btn color="accent" text-color="black" :disable="!valid" @click="saveAbility">Save</q-btn>
          </q-toolbar>
        </q-footer>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';

  export default {
    name: 'addOrUpdateAbility',
    props: {
      value: {
        type: Object,
        // required: true,
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'ir-roles-rules',
        name: 'rules',
        qid: 'abilitiesRulesAdmin',
        query() {
          return {};
        },
        params() {
          return {
            debounce: 500,
          };
        },
      }),
    ],
    data() {
      return {
        valid: false,
        dialogForm: false,
        formData: {
          ability: new models.api.IrRolesAbilities().clone(),
        },
      };
    },
    watch: {
      value: {
        deep: true,
        immediate: true,
        handler(newVal) {
          if (newVal && Object.keys(newVal).length) {
            this.formData = this.$lcloneDeep(newVal);
          }
        },
      },
    },
    computed: {
      fields() {
        return [
          {
            fieldType: 'TextInput',
            path: 'ability.name',
            attrs: {
              label: 'Name',
              type: 'text',
              filled: true,
              'bg-color': 'secondary',
              'label-color': 'white',
              color: 'accent',
              clearable: true,
              'clear-icon': 'close',
              required: true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'SelectInput',
            path: 'ability.rules',
            attrs: {
              label: 'Rules',
              color: 'accent',
              'hide-selected': false,
              'fill-input': false,
              'bg-color': 'secondary',
              'label-color': 'white',
              'input-class': 'text-white',
              'options-selected-class': 'text-accent',
              'popup-content-style': 'background-color: var(--q-color-secondary)',
              multiple: true,
              'dropdown-icon': 'fas fa-chevron-down',
              'emit-value': true,
              'map-options': true,
              'option-value': '_id',
              'option-label': 'name',
              'use-chips': true,
              'bottom-slots': true,
              options: this.rules,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
          {
            fieldType: 'ToggleMe',
            path: 'ability.active',
            attrs: {
              mode: 'acs-toggle',
              label: 'active?',
              // 'toggle-indeterminate': true,
              'checked-text': 'YES',
              'unchecked-text': 'NO',
              dense: true,
              style: {
                'justify-content': 'space-between',
                display: 'flex',
              },
              'left-label': true,
              'attrs-label': {
                class: {
                  'text-uppercase': true,
                },
                style: {
                  'font-size': '20px',
                  'font-weight': 700,
                },
              },
            },
            'div-attrs': {
              class: 'col-12',
            },
          }
        ];
      },
    },
    methods: {
      addDialog() {
        this.dialogForm = true;
        this.formData = {
          ability: new models.api.IrRolesAbilities().clone(),
        };
      },
      async saveAbility() {
        let self = this;
        if (self.formData.ability && Object.keys(self.formData.ability).length) {
          try {
            let ability = await self.formData.ability.save({
              data: {
                name: self.$lget(self.formData, 'ability.name'),
                rules: self.$lget(self.formData, 'ability.rules'),
                active: self.$lget(self.formData, 'ability.active'),
              },
              userJoin: true,
            });
            self.formData = {
              ability: new models.api.IrRolesAbilities().clone(),
            };
            self.dialogForm = false;
            self.$emit('saved', ability);

            self.$q.notify({
              type: 'positive',
              message: `Successfully Saved "${ability.name}"`,
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          } catch (err) {
            self.$q.notify({
              type: 'negative',
              message: err.message,
              timeout: 30000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  },
                },
              ],
            });
          }
        }
      },
    },
  };
</script>

<style scoped lang="scss" src="./_addOrUpdateAbility.scss">

</style>
