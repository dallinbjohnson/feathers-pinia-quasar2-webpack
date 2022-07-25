<template>
  <div id="FGSearchInput" v-bind="$attrs['div-attrs']">
    <search-input v-bind="$attrs['attrs']"
                  :use-email="useEmail"
                  :service="service"
                  :qid="qid"
                  :value="value">
      <!--      @selected="updateForm"-->
      <template v-for="slot in slots"
                v-slot:[slot]="slotProps">
        <slot :name="slot" v-bind="slotProps"></slot>
      </template>
    </search-input>
  </div>
</template>

<script>
  import SearchInput from 'pages/messages/components/search-input';

  export default {
    name: 'FGSearchInput',
    inheritAttrs: false,
    components: {
      SearchInput,
    },
    props: {
      value: {
        type: [Array, String],
      },
      path: {
        required: true,
      },
      service: {
        type: String,
        required: true,
      },
      qid: {
        required: true,
      },
      useEmail: {
        type: Boolean,
        default: false,
      },
      slots: {
        type: Array,
        default() {
          return [];
        },
      },
    },
    data() {
      return {};
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          this.$lset(newVal, 'attrs.label', this.$lget(newVal, 'attrs.label', 'label'));

          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));
        },
      },
    },
    methods: {},
  };
</script>

<style scoped lang="scss" src="./_FGSearchInput.scss">

</style>
