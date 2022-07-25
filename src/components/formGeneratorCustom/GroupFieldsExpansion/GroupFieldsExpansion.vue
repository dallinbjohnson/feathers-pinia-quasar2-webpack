<template>
  <div id="GroupFieldsExpansion" v-bind="$attrs['div-attrs']">
    <q-expansion-item
      v-bind="$attrs['expansion-attrs']"
    >
      <q-card v-bind="$attrs['q-card-attrs']">
        <q-card-section>
          <form-generator :value="value"
                          @input="updateForm($event)"
                          :fields="templateFormFields"
                          v-bind="$attrs['attrs']">
            <template v-for="slot in slots"
                      v-slot:[slot]="slotProps">
              <slot :name="slot" v-bind="slotProps"></slot>
            </template>
          </form-generator>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<script>
  export default {
    name: 'GroupFieldsExpansion',
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
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          // this.$lset(newVal, 'attrs.label', this.$lget(newVal, 'attrs.label', 'label'));

          // q-card-attrs defaults
          this.$lset(newVal, 'q-card-attrs.class', this.$lget(newVal, 'q-card-attrs.class', 'bg-grey-2'));

          // expansion-attrs defaults
          this.$lset(newVal, 'expansion-attrs.label', this.$lget(newVal, 'expansion-attrs.label', 'label'));
          this.$lset(newVal, 'expansion-attrs.dense-toggle', this.$lget(newVal, 'expansion-attrs.dense-toggle', true));
          this.$lset(newVal, 'expansion-attrs.style.border-radius', this.$lget(newVal, 'expansion-attrs.style.border-radius', '3.5px 3.5px 0px 0px'));
          this.$lset(newVal, 'expansion-attrs.class', this.$lget(newVal, 'expansion-attrs.class', 'bg-grey-3'));

          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));
        },
      },
    },
    methods: {
      updateForm(val) {
        this.$emit('input', val);
      }
    },
  };
</script>

<style scoped lang="scss" src="./_GroupFieldsExpansion.scss">

</style>
