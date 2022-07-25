<template>
  <div :id="elementData._id" :style="{order: elementData.styles.order}" @click.stop="currentElement = elementData"
       :class="[...$lget(elementData, '_fastjoin.classes', []).map(cl => cl.name.replace('.', '')), !isEditing ? showBorder ? 'inactive': '' : 'editing']">
    <q-input :input-style="elementData.styles"
             @input="elementUpdate({path: 'content', value: $event})"
             :placeholder="attrs.placeholder"
             type="textarea"
             autogrow
             hide-bottom-space
             borderless
             input-class="text-xs q-pa-none q-ma-none" />
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import {mapFields} from 'vuex-map-fields';
  export default {
    name: 'TheText',
    components: {
    },
    props: {
      element: Object,
      index: Number,
      attrs: Object,
      editing: Boolean,
      focus: {
        type: Boolean,
        default: false
      },
      showBorder: {
        type: Boolean
      }
    },
    data() {
      return {
        elementData: new models.api.wpbElements(),
        isChanged: false
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        async handler(newVal) {
          if (newVal && JSON.stringify(newVal) !== JSON.stringify(this.elementData)) {
            this.elementData = new models.api.wpbElements(newVal).clone();
          }
        }
      },
      editing: {
        immediate: true,
        deep: true,
        async handler(newVal, oldVal) {
          if (!newVal && oldVal !== undefined && this.isChanged) {
            await this.elementData.save({query: {_type: this.elementData._type}});
            this.isChanged = false;
          }
        }
      },
    },
    computed: {
      isEditing() {
        return this.$lget(this.currentElement, '_id', false) === this.$lget(this.elementData, '_id', true);
      },
      ...mapFields(['currentElement']),

    },
    methods: {
      elementUpdate(elementInfo) {
        if (this.editing) {
          console.log('-------YaY------');
          this.$lset(this.elementData, elementInfo.path, elementInfo.value);
          console.log('Element Update', {path: elementInfo.path, value: elementInfo.value, element: this.elementData});
          this.isChanged = true;
        } else {
          console.log('sorry you can\'t save right now because youre not editing');
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  #TheText::v-deep {
    .q-textarea {
      .q-field__control-container {
        padding: 0;
      }
    }
  }
</style>
