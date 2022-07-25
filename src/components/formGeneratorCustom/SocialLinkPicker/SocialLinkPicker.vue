<template>
  <div id="SocialLinkPicker" v-bind="$attrs['div-attrs']">
    <q-card>
      <q-card-section>
        <label class="text-weight-bold">Social Links:</label>

        <template v-for="(formData, index) in listFormData">
          <transition :key="index"
                      appear
                      enter-active-class="animated backInLeft"
                      leave-active-class="animated backOutRight">
            <q-card :class="{'q-mt-sm': index !== 0}">
              <q-card-section>
                <div style="width: 100%; display: flex; align-items: center;">
                  <p class="q-ma-none">Social Link {{ index + 1 }}:</p>
                  <q-space></q-space>

                  <q-btn flat rounded dense @click="listFormData.splice(index, 1)">
                    <q-icon name="close"></q-icon>
                  </q-btn>
                </div>

                <form-generator v-model="listFormData[index]"
                                :fields="getFields(listFormData[index])"
                                useQform
                                v-model:valid="valid"
                                @input="handleInput">
                  <template v-slot:default="{data, btnAttrs, toggleDialog}">
                    <q-btn :icon="$lget(data, 'icon', $lget(btnAttrs, 'icon'))"
                           @click="toggleDialog"
                           :style="{color: $lget(data, 'color')}"
                           v-bind="btnAttrs"/>
                  </template>
                  <template v-slot:option="scope">
                    <q-item
                      v-if="!(value || []).map(item => item.name).includes(scope.opt.value) || scope.opt.value === ''"
                      v-bind="scope.itemProps"
                      v-on="scope.itemEvents">
                      <q-item-section>
                        <q-item-label v-html="scope.opt.label"/>
                      </q-item-section>
                    </q-item>
                  </template>
                </form-generator>
              </q-card-section>
            </q-card>
          </transition>
        </template>

        <div class="q-mt-sm" style="width: 100%; display: flex;">
          <!--          v-if="listFormData.length < 3"-->
          <q-space></q-space>

          <q-btn v-bind="$attrs['add-btn-attrs']" @click="listFormData.push({})">
            <q-icon name="add"></q-icon>
            Social Link
          </q-btn>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
  export default {
    name: 'SocialLinkPicker',
    props: {
      value: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        valid: false,
        listFormData: [{}],
        oldVal: undefined,
        commonLinks: ['facebook', 'gitlab', 'twitter'],
      };
    },
    watch: {
      value: {
        deep: true,
        immediate: true,
        handler(newValue) {
          if (newValue) {
            let newValArr = Array.from(newValue);
            // newValArr.forEach(item => {
            //   if (this.commonLinks.includes(item.name)) {
            //     item.icon = `fab fa-${item.name}`;
            //   } else if (item.name === '') {
            //     item.icon = 'fas fa-icons';
            //   }
            // });
            console.log('this is form data: ', newValue);
            this.listFormData = newValArr;
            if (!this.listFormData.length) this.listFormData = [{}];
          }
        },
      },
      listFormData: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal && JSON.stringify(newVal) !== JSON.stringify(this.oldVal)) {
            console.log(newVal);
            let emitVal = newVal.filter(item => Object.keys(item).length);
            this.$emit('input', emitVal);
            this.oldVal = this.$lcloneDeep(newVal);
          }
        },
      },
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          //add-btn-attrs logic
          // if (this.listFormData.map(item => {
          //
          // }))

          //div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12'));
        },
      },
      // valid: {
      //   immediate: true,
      //   handler(newValue) {
      //     if (newValue) {
      //       this.$emit('input', [this.formData]);
      //     }
      //   },
      // },
    },
    methods: {
      handleInput(data) {
        // console.log(data);
        if (this.commonLinks.includes(data.name)) {
          data.icon = `fab fa-${data.name}`;
          if (data.name === 'facebook') {
            data.color = '#1877f2';
          } else if (data.name === 'gitlab') {
            data.color = '#e24329';
          } else if (data.name === 'twitter') {
            data.color = '#1da1f2';
          }
        } else if (data.name === '' && this.commonLinks.some(link => this.$lget(data, 'icon', '').includes(link))) {
          delete data.icon;
          delete data.color;
        }
      },
      getFields(formData) {
        let fields = [
          {
            fieldType: 'SelectInput',
            path: 'name',
            attrs: {
              label: 'Select Social Link',
              dense: true,
              'emit-value': true,
              'map-options': true,
              behavior: 'menu',
              'hide-selected': false,
              'fill-input': false,
              'options-selected-class': 'text-accent q-ma-sm',
              required: true,
              options: [
                {
                  label: 'Facebook',
                  value: 'facebook',
                },
                {
                  label: 'Gitlab',
                  value: 'gitlab',
                },
                {
                  label: 'Twitter',
                  value: 'twitter',
                },
                {
                  label: 'Custom',
                  value: '',
                },
              ],
            },
            'div-attrs': {
              class: 'col-12',
            },
            slots: ['option'],
          },
        ];

        let formName = this.$lget(formData, 'name');
        if (!this.$lisNil(formName) && !this.commonLinks.includes(formName)) {
          fields = fields.concat([
            {
              fieldType: 'GroupFieldsDialog',
              label: 'Icon',
              path: 'icon',
              return_object_no_key: true,
              'btn-attrs': {
                icon: 'fas fa-icons',
                round: true,
                label: '',
                // dense: true,
              },
              'dialog-attrs': {
                persistent: true,
              },
              'div-attrs': {
                class: 'col-2 q-my-auto',
              },
              slots: ['default'],
              templateFormFields: [
                {
                  fieldType: 'IconPicker',
                  path: 'icon',
                  // return_object_no_key: true,
                  attrs: {
                    label: 'Social Link',
                    type: 'text',
                    filled: true,
                    clearable: true,
                    'clear-icon': 'close',
                    required: true,
                  },
                  // 'q-field-attrs': {
                  //   filled: false,
                  //   borderless: true,
                  // },
                  'div-attrs': {
                    class: 'col-12',
                    style: 'min-width: 25vw',
                  },
                },
                {
                  fieldType: 'GroupFieldsExpansion',
                  path: '',
                  return_object_no_key: true,
                  'expansion-attrs': {
                    label: 'Pick a Color',
                    // dense: true,
                  },
                  'div-attrs': {
                    class: 'col-12',
                  },
                  templateFormFields: [
                    {
                      fieldType: 'ColorPicker',
                      path: 'color',
                      'div-attrs': {
                        class: 'col-12',
                      },
                      colorObjOff: true,
                    },
                  ],
                },
              ],
            },
            {
              fieldType: 'TextInput',
              path: 'name',
              attrs: {
                label: 'Name',
                type: 'text',
                filled: true,
                clearable: true,
                'clear-icon': 'close',
                required: true,
                dense: true,
              },
              'div-attrs': {
                class: 'col-5',
                style: 'margin-top: 20px',
              },
            },
            {
              fieldType: 'TextInput',
              path: 'url',
              attrs: {
                label: 'Url',
                type: 'text',
                filled: true,
                clearable: true,
                'clear-icon': 'close',
                required: true,
                dense: true,
              },
              'div-attrs': {
                class: 'col-5',
                style: 'margin-top: 20px',
              },
            },
            {
              fieldType: 'TextInput',
              path: 'description',
              attrs: {
                label: 'Description',
                type: 'text',
                filled: true,
                clearable: true,
                'clear-icon': 'close',
                required: true,
                dense: true,
              },
              'div-attrs': {
                class: 'col-12',
                // style: 'margin-top: 20px',
              },
            },
          ]);
        } else if (!this.$lisNil(formName) && this.commonLinks.includes(formName)) {
          fields = fields.concat([
            {
              fieldType: 'GroupFieldsDialog',
              label: 'Icon',
              path: 'icon',
              return_object_no_key: true,
              'btn-attrs': {
                // icon: 'fas fa-icons',
                icon: 'sp:socialLinks',
                round: true,
                label: '',
                disabled: true,
              },
              'dialog-attrs': {
                persistent: true,
              },
              'div-attrs': {
                class: 'col-2 q-my-auto',
              },
              slots: ['default'],
              templateFormFields: [],
            },
            {
              fieldType: 'TextInput',
              path: 'name',
              attrs: {
                label: 'Name',
                type: 'text',
                required: true,
                disabled: true,
                readonly: true,
                dense: true,
              },
              'div-attrs': {
                class: 'col-5',
                style: 'margin-top: 20px',
              },
            },
            {
              fieldType: 'TextInput',
              path: 'url',
              attrs: {
                label: 'Url',
                type: 'text',
                filled: true,
                clearable: true,
                'clear-icon': 'close',
                required: true,
                dense: true,
              },
              'div-attrs': {
                class: 'col-5',
                style: 'margin-top: 20px',
              },
            },
            {
              fieldType: 'TextInput',
              path: 'description',
              attrs: {
                label: 'Description',
                type: 'text',
                filled: true,
                clearable: true,
                'clear-icon': 'close',
                required: true,
                dense: true,
              },
              'div-attrs': {
                class: 'col-12',
                // style: 'margin-top: 20px',
              },
            },
          ]);
        }

        console.log(formData._type, fields);
        return fields;
      },
    },
  };
</script>

<style scoped lang="scss" src="./_SocialLinkPicker.scss">

</style>
