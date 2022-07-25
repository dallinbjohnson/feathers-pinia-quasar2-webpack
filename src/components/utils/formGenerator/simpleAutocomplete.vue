<template>
    <div :class="`col-${cols}`">
        <q-autocomplete
                        @change="$emit('input', $event)"
                        :label="label"
                        :items="options"
                        :item-text="item_text"
                        :item-value="item_value"
                        :hint="hint"
                        :persistent-hint="persistent_hint"
                        :chips="chips"
                        :multiple="multiple"
                        :solo="solo"
                        :actioned="actioned"
                        :outlined="outlined"
                        :prepend-icon="prepend_icon"
                        :return-object="return_object"
                        :height="height"
                        :name="name"
                        :value="value"
                        :style="{padding: padding}"
        >
<!--          ref https://codepen.io/anon/pen/PEpaMM?editors=1011-->
<!--            <template v-slot:selection="data">-->
<!--                <v-chip light-->
<!--                        :input-value="data.selected"-->
<!--                        close-->
<!--                        class="chip&#45;&#45;select-multi"-->
<!--                        @input="remove(data.item)"-->
<!--                >-->
<!--                    {{ data.item }}-->
<!--                </v-chip>-->
<!--            </template>-->
<!--            <template v-slot:item="data">-->
<!--                <v-list-item-content>-->
<!--                    <v-list-item-title-->
<!--                            v-html="data.item"></v-list-item-title>-->
<!--                </v-list-item-content>-->
<!--            </template>-->
        </q-autocomplete>
    </div>
</template>

<script>
  export default {
    name: 'SimpleAutocomplete',
    props: {
      cols: {
        type: Number,
        default: 6
      },
      return_object: {
        default: true,
        type: Boolean
      },
      multiple: {
        type: Boolean,
        default: true,
        required: false
      },
      options: {
        type: Array,
        required: true,
      },
      height: Number,
      padding: String,
      name: {
        type: String,
        default: '',
      },
      label: {
        type: String,
        default: '',
      },
      prepend_icon: {
        type: String,
        default: '',
        required: false
      },
      hint: {
        type: String,
        default: '',
        required: false,
      },
      persistent_hint: {
        type: Boolean,
        default: true,
        required: false,
      },
      solo: {
        type: Boolean,
        default: true,
        required: false,
      },
      outlined: {
        type: Boolean,
        default: true,
        required: false,
      },
      chips: {
        type: Boolean,
        default: true,
        required: false,
      },
      // DISPLAYS TEXT ACTION ON LIST
      actioned: {
        type: String,
        default: 'Selected',
        required: false
      },
      value: [String, Array, Object, Number],
      item_text: {
        type: String,
        default: name,
        required: false,
      },
      item_value: {
        type: [String, Object],
        required: false,
      },
    },
    data() {
      return {
      // select: '',
      };
    },
    watch: {
    // value: {
    //   deep: true,
    //   immediate: true,
    //   handler(newVal){
    //     if(this.multiple){
    //       this.select = newVal
    //     } else this.select = Object.assign(newVal)
    //   }
    // }
    },
    computed: {
      colorClicked(item) {
        if (this.options.filter(e => e.name === item.name).length > 0) {
          return 'green accent-4';
        } else {
          return 'grey';
        }
      },
    },
    methods: {
      handleChange(){
        this.$emit('input', this.value);
      }
    }
  };
</script>
