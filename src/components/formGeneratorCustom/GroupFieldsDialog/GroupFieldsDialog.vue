<template>
  <div id="GroupFieldsDialog" v-bind="$attrs['div-attrs']">
    <slot :data="value" :btnAttrs="$attrs['btn-attrs']" :toggleDialog="toggleDialog">
      <q-btn @click="dialogToggle = !dialogToggle" v-bind="$attrs['btn-attrs']"/>
    </slot>
    <q-dialog v-model="dialogToggle" v-bind="$attrs['dialog-attrs']">
      <q-card v-bind="$attrs['card-attrs']">
        <q-card-section class="flex justify-between">
          <h4 class="no-margin">{{ label }}</h4>
          <q-btn v-close-popup icon="close" flat round dense/>
        </q-card-section>
        <q-card-section>
          <form-generator v-model="formData"
                          :fields="templateFormFields"
                          v-bind="$attrs['attrs']">
            <template v-for="slot in slots"
                      v-slot:[slot]="slotProps">
              <slot :name="slot" v-bind="slotProps"></slot>
            </template>
          </form-generator>
        </q-card-section>
        <q-card-actions>
          <q-space/>
          <q-btn v-close-popup label="Save" @click="updateForm"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  export default {
    name: 'GroupFieldsDialog',
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

<style scoped lang="scss" src="./_GroupFieldsDialog.scss">

</style>
