<template>
  <q-expansion-item switch-toggle-side
                    default-opened
                    :value="expand === 'baseSection'"
                    @input="expand === 'baseSection' ? setExpand(null) : setExpand('baseSection')"
                    expand-separator
                    label="Base Sections">
    <div class="q-ma-sm row"
         style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); grid-column-gap: 7px; grid-row-gap: 10px; justify-items: center; align-items: center;">
      <q-card class="col-12 col-md-6 bg-secondaryGradient"
              v-for="(baseSection, index) in baseSections"
              :key="index"
              style="height: 90px; display: flex; justify-content: center; align-items: center; width: 100%;"
              @click="$emit('addElementDialog', baseSection)">
        <q-card-section class="column"
                        style="margin: 0; padding: 0; width: 100%; display: flex; justify-content: center; align-items: center">
          <q-icon :name="$lget(baseSection, 'icon', 'format_shapes')" size="2.2rem"/>
          <p class="q-px-sm" style="font-size: 10pt; margin: 0; text-align: center">{{ baseSection.name }}</p>
        </q-card-section>
      </q-card>
    </div>
  </q-expansion-item>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';

  export default {
    name: 'BaseSections',
    props: {
      value: String,
      currentElement: Object,
    },
    mixins: [
      makeFindPaginateMixin({
        service: 'wpb-sections',
        name: 'baseSections',
        qid: 'baseSections',
        query() {
          return {
            baseSection: true,
            template: true,
            devTemplate: true,
            isPublic: true
          };
        },
        params() {
          return {
            paginate: false,
          };
        },
      }),
    ],
    data() {
      return {
        expand: null,
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            console.log(newVal);
            this.expand = newVal;
          }
        }
      }
    },
    methods: {
      setExpand(val) {
        this.expand = val;
        this.$emit('input', val);
      },
    },
  };
</script>

<style scoped>

</style>
