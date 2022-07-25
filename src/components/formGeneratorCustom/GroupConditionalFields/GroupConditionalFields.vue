<template>
  <div id="GroupConditionalFields" v-bind="$attrs['div-attrs']">
    <form-generator v-model="formData"
                    :fields="filteredFormFields"
                    v-bind="$attrs['attrs']">
      <template v-for="slot in slots"
                v-slot:[slot]="slotProps">
        <slot :name="slot" v-bind="slotProps"></slot>
      </template>
    </form-generator>
  </div>
</template>

<script>
  export default {
    name: 'GroupConditionalFields',
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
      conditions: {
        type: Function,
      },
    },
    data() {
      return {
        formData: {},
        filteredFormFields: [],
      };
    },
    watch: {
      value: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            let arr = this.$lcloneDeep(this.templateFormFields),
                spliceIdx,
                conditionsArr = Array.from(this.conditions(newVal)),
                objsInConditions = Array.from(conditionsArr);
            //consider refining if for changing template form fields.
            if (conditionsArr.some(item => typeof item === 'object')) {
              this.conditions(newVal).forEach(item => {
                if (typeof item !== 'object') {
                  spliceIdx = objsInConditions.findIndex(i => i === item);
                  if (spliceIdx >= 0) objsInConditions.splice(spliceIdx, 1);
                }
                if (typeof item === 'object') {
                  spliceIdx = conditionsArr.findIndex(i => i === item);
                  if (spliceIdx >= 0) conditionsArr.splice(spliceIdx, 1);
                }
                spliceIdx = undefined;
              });
              objsInConditions.forEach(item => {
                conditionsArr.push(item.path);
              });

              objsInConditions.forEach(obj => {
                let keysInObj = Object.keys(obj);
                spliceIdx = keysInObj.findIndex(i => i === 'path');
                keysInObj.splice(spliceIdx, 1);
                if ((keysInObj).length > 0) {
                  let objIdx = arr.findIndex(i => i.path === obj.path);
                  keysInObj.forEach(key => {
                    this.changeFun(arr, key, obj[key], arr[objIdx][key]);
                  });
                }
              });
            }

            this.templateFormFields.forEach(item => {
              if (!conditionsArr.includes(item.path)) {
                spliceIdx = arr.findIndex(i => i.path === item.path);
                if (spliceIdx >= 0) arr.splice(spliceIdx, 1);
              }
            });
            this.filteredFormFields = arr;
            this.formData = newVal;
          }
        },
      },
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            // div-attrs defaults
            this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12'));
            /*This $lset is hiding a bigger problem. Our changing the filteredFormFields in the previous watcher
            causes an error to occur with the styles of the component, and throws the following errors:
            Firefox: Uncaught (in promise) TypeError: c is null
              (note: Above error mentions QForm.js, a function called getValidationComponents, and validate)
            Google: Uncaught (in promise) TypeError: Cannot read properties of null (reading 'validate')
              (note: Above error mentions QTree.js and validate)*/
            console.log('this is $attrs: ', newVal);
          }
        }
      }
    },
    methods: {
      changeFun(changeData, key, newVal, oldVal) {
        let val = newVal;
        if (typeof val === 'object') {
          let keysInVal = Object.keys(val);
          keysInVal.forEach(item => {
            if (typeof val[item] === 'object') {
              oldVal[item] = this.changeFun(newVal, item, newVal[item], oldVal[item]);
            } else {
              oldVal[item] = newVal[item];
            }
          });
          val = oldVal;
        }
        return changeData[key] = val;
      },
    },
  };
  /*how to use:
  {
    fieldType: 'GroupConditionalFields',
    path: '',
    return_object_no_key: true,
    conditions: val => val.name === 'filter' ? [{
      path: 'name',
      attrs: {label: 'Changed Label'},
      'div-attrs': {class: 'col-6'}
    }, 'active'] : ['name', 'active', 'abilities'],
    templateFormFields: [],
  }*/
</script>
