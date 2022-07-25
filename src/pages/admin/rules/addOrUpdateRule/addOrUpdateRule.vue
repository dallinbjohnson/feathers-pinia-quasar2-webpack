<template>
  <div id="addOrUpdateRule">
    <slot name="dialogBtn">
      <q-btn rounded color="accent" text-color="black" icon="add" @click="addDialog">
        Add Rule
      </q-btn>
    </slot>

    <q-dialog v-model="dialogForm" position="right" full-height>
      <q-layout view="Lhh LpR Lff" container :class="$q.dark.mode ? 'bg-dark' : 'bg-white'"
                :style="`width: ${$data.$windowWidth < 420 ? $data.$windowWidth - 10 : 400}px;`">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title class="text-accent text-uppercase" style="font-weight: 700;">
              {{ $lget(formData, 'rule._id') ? $lget(formData, 'rule.name') : 'Create Rule' }}
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
            <q-btn color="accent" text-color="black" :disable="!valid" @click="saveRule">Save</q-btn>
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
    name: 'addOrUpdateRule',
    props: {
      value: {
        type: Object,
        // required: true,
      },
    },
    mixins: [
      makeFindPaginateMixin({
        limit: 12,
        service: 'ir-roles-abilities',
        name: 'abilities',
        qid: 'rolesAbilitiesAddOrUpdateAdmin',
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
          rule: new models.api.IrRolesRules().clone(),
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
            path: 'rule.name',
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
            fieldType: 'TextInput',
            path: 'rule.note',
            attrs: {
              label: 'Notes',
              type: 'textarea',
              filled: true,
              'bg-color': 'secondary',
              'label-color': 'white',
              color: 'accent',
              clearable: true,
              'clear-icon': 'close',
              'bottom-slots': true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'rule.subject',
            attrs: {
              label: 'Subject',
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
            fieldType: 'TextInput',
            path: 'rule.reason',
            attrs: {
              label: 'Reason',
              type: 'text',
              filled: true,
              'bg-color': 'secondary',
              'label-color': 'white',
              color: 'accent',
              clearable: true,
              'clear-icon': 'close',
              'bottom-slots': true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'ToggleMe',
            path: 'rule.inverted',
            attrs: {
              mode: 'acs-toggle',
              label: 'inverted?',
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
          },
          {
            fieldType: 'ToggleMe',
            path: 'rule.active',
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
          },
          {
            fieldType: 'SelectInput',
            path: 'rule.inAbilities',
            attrs: {
              label: 'Abilities',
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
              options: this.abilities,
            },
            'div-attrs': {
              class: 'col-12',
            },
            // slots: [/*'selected-item', 'option'*/],
          },
        ];
      },
    },
    methods: {
      addDialog() {
        this.dialogForm = true;
        this.formData = {
          rule: new models.api.IrRolesRules().clone(),
        };
      },
      async saveRule() {
        let self = this;
        if (self.formData.rule && Object.keys(self.formData.rule).length) {
          try {
            let rule = await self.formData.rule.save({
              data: {
                name: self.$lget(self.formData, 'rule.name'),
                note: self.$lget(self.formData, 'rule.note'),
                subject: self.$lget(self.formData, 'rule.subject'),
                active: self.$lget(self.formData, 'rule.active'),
                inAbilities: self.$lget(self.formData, 'rule.inAbilities'),
              },
              userJoin: true,
            });
            self.formData = {
              rule: new models.api.IrRolesRules().clone(),
            };
            self.dialogForm = false;
            self.$emit('saved', rule);

            self.$q.notify({
              type: 'positive',
              message: `Successfully Saved "${rule.name}"`,
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

<style scoped lang="scss" src="./_addOrUpdateRule.scss">

</style>
