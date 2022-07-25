<template>
  <div id="GroupLayoutDialog" v-bind="$attrs['div-attrs']">
    <slot :data="value" :btnAttrs="$attrs['btn-attrs']" :toggleDialog="toggleDialog">
      <q-btn @click="dialogToggle = !dialogToggle" v-bind="$attrs['btn-attrs']"/>
    </slot>
    <q-dialog id="group-layout-dialog" v-model="dialogToggle" v-bind="$attrs['dialog-attrs']">
      <q-layout view="Lhh LpR Lff" container :class="$q.dark.mode ? 'bg-dark' : 'bg-white'">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-toolbar-title class="text-uppercase" style="font-weight: 700;">
              {{ label }}
            </q-toolbar-title>
            <q-btn flat v-close-popup round dense icon="close"/>
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page class="q-pa-sm">
            <form-generator v-model="formData"
                            :fields="templateFormFields"
                            v-bind="$attrs['attrs']">
              <template v-for="slot in slots"
                        v-slot:[slot]="slotProps">
                <slot :name="slot" v-bind="slotProps"></slot>
              </template>
            </form-generator>
          </q-page>
        </q-page-container>

        <q-footer :class="$q.dark.mode ? 'bg-dark' : 'bg-white'" bordered>
          <q-toolbar>
            <q-space/>
            <q-btn v-close-popup label="Save" color="primary" @click="updateForm"/>
          </q-toolbar>
        </q-footer>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script>
  export default {
    name: 'GroupLayoutDialog',
    inheritAttrs: false,
    props: {
      value: {
        type: Object,
      },
      path: {
        required: true,
      },
      slots: {
        type: Array,
        default() {
          return [];
        },
      },
      templateFormFields: {
        type: Array,
        required: true,
        default() {
          return [];
        },
      },
      label: {
        type: String,
        default: 'Default Label',
      }
    },
    data() {
      return {
        dialogToggle: false,
        formData: {},
        oldVal: {},
      };
    },
    watch: {
      value: {
        deep: true,
        immediate: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal) {
          // console.log('Old: ', JSON.stringify(this.oldVal), 'New: ', JSON.stringify(newVal));
          if (newVal && JSON.stringify(newVal) !== JSON.stringify(this.oldVal)) {
            this.formData = this.$lcloneDeep(newVal);
            this.oldVal = this.$lcloneDeep(newVal);
          }
        },
      },
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          // this.$lset(newVal, 'attrs.label', this.$lget(newVal, 'attrs.label', 'label'));

          // btn-attrs defaults
          this.$lset(newVal, 'btn-attrs.label', this.$lget(newVal, 'btn-attrs.label', 'label'));

          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));
        },
      },
    },
    methods: {
      toggleDialog() {
        this.dialogToggle = !this.dialogToggle;
      },
      updateForm() {
        this.$emit('input', this.formData);
      },
    },
  };
</script>

<style lang="scss">
  #group-layout-dialog {
    .q-layout,
    .q-page {
      position: unset;
    }
  }
</style>

<style scoped lang="scss" src="./_GroupLayoutDialog.scss">

</style>
