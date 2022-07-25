<template>
  <div id="IconPicker" v-bind="$attrs['div-attrs']">
    <q-field :value="value"
             v-bind="$attrs['q-field-attrs']"
             @focus="$refs['search'].focus()"
             @clear="$emit('input', undefined)">
      <template v-slot:control>
        <div class="q-mt-md full-width">
          <q-select v-model="icon_set" v-bind="$attrs['icon-set-attrs']"/>
          <q-input v-model="filter" ref="search" v-bind="$attrs['search-attrs']"/>
          <!--        <p class="q-ma-none" style="font-size: 1.1rem;">-->
          <!--          <b class="q-mr-sm">Selected:</b>-->
          <!--          <q-chip v-if="value" removable :icon="value" @remove="$emit('input', undefined)">-->
          <!--            {{ value }}-->
          <!--          </q-chip>-->
          <!--        </p>-->
          <!--        <q-separator class="q-my-lg"></q-separator>-->
          <q-icon-picker :value="value"
                         @input="$emit('input', $event)"
                         :icon-set="icon_set"
                         v-model:pagination="pagination"
                         :filter="filter"
                         :name="path"
                         v-bind="$attrs['attrs']">
            <template v-for="slot in slots" v-slot:[slot]="slotProps">
              <slot :name="slot" :key_name="path" v-bind="slotProps"></slot>
            </template>
          </q-icon-picker>
        </div>
      </template>
    </q-field>
  </div>
</template>

<script>
  export default {
    name: 'IconPicker',
    inheritAttrs: false,
    props: {
      value: {
        type: String,
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
    },
    data() {
      return {
        icon_set: 'material-icons',

        filter: '',
        pagination: {
          itemsPerPage: 60,
          page: 0,
        },
      };
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          this.$lset(newVal, 'attrs.animated', this.$lget(newVal, 'attrs.animated', true));
          this.$lset(newVal, 'attrs.style', this.$lget(newVal, 'attrs.style', 'height: 180px;'));
          this.$lset(newVal, 'attrs.tooltips', this.$lget(newVal, 'attrs.tooltips', true));
          this.$lset(newVal, 'attrs.selected-background-color', this.$lget(newVal, 'attrs.selected-background-color', 'secondary'));

          // q-field-attrs defaults
          this.$lset(newVal, 'q-field-attrs.label', this.$lget(newVal, 'q-field-attrs.label', 'Select Icon:'));
          this.$lset(newVal, 'q-field-attrs.filled', this.$lget(newVal, 'q-field-attrs.filled', true));
          this.$lset(newVal, 'q-field-attrs.clearable', this.$lget(newVal, 'q-field-attrs.clearable', true));
          this.$lset(newVal, 'q-field-attrs.color', this.$lget(newVal, 'q-field-attrs.color', 'secondary'));
          if (this.$lget(newVal, 'q-field-attrs.rules')) {
            this.$lset(newVal, 'q-field-attrs.rules', this.$lget(newVal, 'q-field-attrs.rules', []));
          }

          // q-field-attrs validation
          let rules = this.$lget(newVal, 'q-field-attrs.rules', []);
          let new_rule = val => {
            return val && val.length > 0 || `${this.$lget(newVal, 'q-field-attrs.label')} is required`;
          };
          if (this.$lget(newVal, 'q-field-attrs.required') && !rules.map(item => item.toString()).includes(new_rule.toString())) {
            rules.push(new_rule);
            this.$lset(newVal, 'q-field-attrs.rules', rules);
          }

          // icon-set-attrs defaults
          this.$lset(newVal, 'icon-set-attrs.label', this.$lget(newVal, 'icon-set-attrs.label', 'Icon Set'));
          this.$lset(newVal, 'icon-set-attrs.color', this.$lget(newVal, 'icon-set-attrs.color', 'secondary'));
          // this.$lset(newVal, 'icon-set-attrs.dense', this.$lget(newVal, 'icon-set-attrs.dense', true));
          this.$lset(newVal, 'icon-set-attrs.options', this.$lget(newVal, 'icon-set-attrs.options', [
            'ionicons-v4',
            'fontawesome-v5',
            'eva-icons',
            'themify',
            'line-awesome',
            'mdi-v5',
            'material-icons',
            'material-icons-outlined',
            'material-icons-round',
            'material-icons-sharp',
          ]));

          // search-attrs defaults
          this.$lset(newVal, 'search-attrs.label', this.$lget(newVal, 'search-attrs.label', 'Search icons...'));
          this.$lset(newVal, 'search-attrs.class', this.$lget(newVal, 'search-attrs.class', 'q-my-sm'));
          this.$lset(newVal, 'search-attrs.color', this.$lget(newVal, 'search-attrs.color', 'secondary'));
          this.$lset(newVal, 'search-attrs.clearable', this.$lget(newVal, 'search-attrs.clearable', true));
          // this.$lset(newVal, 'search-attrs.dense', this.$lget(newVal, 'search-attrs.dense', true));

          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12'));
        },
      },
    },
  };
</script>

<style scoped>

</style>
