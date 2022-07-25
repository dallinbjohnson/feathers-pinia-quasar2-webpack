<template>
  <div :class="`col-${cols} col-sm-${sm} col-md-${md} col-lg-${lg}`">
    <q-input :label="label"
                  :dense="dense"
                  :placeholder="placeholder"
                  :name="name"
                  :hint="hint"
                  :hide-hint="hideHint"
                  :hide-bottom-space="$attrs.hideBottomSpace"
                  :stack-label="$attrs.stackLabel"
                  :disabled="disabled"
                  :append-icon="append_icon"
                  :persistent-hint="persistent_hint"
                  :value="value"
                  :required="required"
                  :rules="required ? [v => !!v || 'This field is required'].concat(rules) : rules"
                  @input.native="handleInput($event.target.value)"
                  @click:clear="$emit('input', '')"
                  :type="$attrs.type ? $attrs.type : 'text'"
                  :clearable="clearable"
                  :clear-icon="clear_icon"
                  :class="required ? 'required ' + styleClass : styleClass"
                  :counter="counter"
                  :dark="dark"
                  :solo="solo"
                  :outlined="outlined"
                  :height="height"
                  :min="min"
                  :max="max"
                  :step="step"
                  :color="color"
                  :mask="mask"
                  :fill-mask="fillmask"
                  :filled="filled"
                  :autofocus="autofocus"
    >
      <template v-slot:prepend v-if="prepend_icon">
        <q-icon :name="prepend_icon"/>
      </template>
    </q-input>
  </div>
</template>

<script>
  export default {
    name: 'TextInput',
    props: {
      filled: Boolean,
      disabled: Boolean,
      append_icon: String,
      prepend_icon: String,
      step: Number,
      min: Number,
      max: Number,
      hint: {
        type: String
      },
      hideHint: {
        type: Boolean,
        default: true
      },
      styleClass: String,
      solo: Boolean,
      outlined: Boolean,
      height: Number,
      dark: Boolean,
      counter: Boolean,
      clearable: Boolean,
      clear_icon: String,
      classIn: String,
      color: String,
      persistent_hint: {
        type: Boolean,
        default: true
      },
      dense: Boolean,
      label: {
        type: String
      },
      placeholder: {
        type: String
      },
      name: {
        type: String
      },
      value: {
        type: [String, Number]
      },
      required: {
        type: Boolean,
        required: false,
        default: false
      },
      rules: {
        type: Array,
        required: false,
        default: function () {
          return [];
        }
      },
      cols: {
        type: [Number, Boolean, String],
        default: 12
      },
      sm: {
        type: [Number, Boolean, String],
      },
      md: {
        type: [Number, Boolean, String],
      },
      lg: {
        type: [Number, Boolean, String],
      },
      xl: {
        type: [Number, Boolean, String],
      },
      return_number: Boolean,
      mask: {
        type: String,
        default: ''
      },
      fillmask: {
        type: String,
      },
      autofocus: {
        type:Boolean,
        required: false
      }
    },
    methods: {
      handleInput(value){
        let val = this.return_number ? parseFloat(value) : value;
        this.$emit('input', val);
      }
    }
  };
</script>
