<template>
  <q-list bordered class="rounded-borders">
    <base-sections v-model="templateExpansion"
                   :currentElement="currentElement"
                   @addElementDialog="$emit('addElementDialog', $event)"></base-sections>

    <q-separator/>

    <q-expansion-item switch-toggle-side
                      default-opened
                      :value="templateExpansion === 'baseElement'"
                      @input="templateExpansion === 'baseElement' ? templateExpansion = null : templateExpansion = 'baseElement'"
                      expand-separator
                      label="Base Elements">
      <div class="q-ma-sm row"
           style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); grid-column-gap: 7px; grid-row-gap: 10px; justify-items: center; align-items: center;">
        <q-card class="col-12 col-md-6 bg-secondaryGradient"
                @click="imagePickerDialog = !imagePickerDialog"
                style="height: 90px; display: flex; justify-content: center; align-items: center; width: 100%;">
          <q-card-section class="column"
                          style="margin: 0; padding: 0; width: 100%; display: flex; justify-content: center; align-items: center">
            <q-icon name="far fa-images" size="2.2rem"/>
            <p style="font-size: 10pt; margin: 0">Image</p>
          </q-card-section>
        </q-card>
        <q-card v-for="(baseElement, index) in baseElements"
                :key="index"
                class="col-12 col-md-6 bg-secondaryGradient"
                style="height: 90px; display: flex; justify-content: center; align-items: center; width: 100%;"
                @click="$emit('addElementDialog', baseElement)">
          <q-card-section class="column"
                          style="margin: 0; padding: 0; width: 100%; display: flex; justify-content: center; align-items: center">
            <q-icon :name="$lget(baseElement, 'icon', 'format_shapes')" size="2.2rem"/>
            <p class="q-px-sm" style="font-size: 10pt; margin: 0; text-align: center">{{ baseElement.name }}</p>
          </q-card-section>
        </q-card>
      </div>
    </q-expansion-item>
    <q-separator/>
    <q-expansion-item switch-toggle-side
                      expand-separator
                      :value="templateExpansion === 'sectionPrivate'"
                      @input="templateExpansion === 'sectionPrivate' ? templateExpansion = null : templateExpansion = 'sectionPrivate'"
                      label="Your Base Section">
      <div class="q-ma-sm row"
           style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); grid-column-gap: 7px; grid-row-gap: 10px; justify-items: center; align-items: center;">
        <q-card v-for="(section, index) in sectionTemplatesPrivate"
                :key="index"
                class="col-12 col-md-6 bg-secondaryGradient"
                style="width: 100%;"
                @click="$emit('addElementDialog', section)">
          <q-card-section style="margin: 0; padding: 0; width: 100%; display: flex; justify-content: flex-end">
            <q-btn icon="close" @click.stop="$emit('deleteElement', section)" flat round/>
          </q-card-section>
          <q-card-section class="column"
                          style="margin: 0; padding: 0; width: 100%; display: flex; justify-content: center; align-items: center">
            <q-icon :name="$lget(section, 'icon', 'format_shapes')" size="2.2rem"/>
            <p class="q-px-sm" style="font-size: 10pt; text-align: center">{{ section.name }}</p>
          </q-card-section>
        </q-card>
      </div>
      <div style="display: flex; justify-content: center">
        <q-pagination v-if="sectionTemplatesPrivatePages > 1"
                      :value="sectionTemplatesPrivateCurrentPage"
                      @input="sectionTemplatesPrivateHandlePageChange"
                      :max="sectionTemplatesPrivatePages"
                      :max-pages="6"
                      :direction-links="true"
                      :boundary-links="true">
        </q-pagination>
      </div>
    </q-expansion-item>

    <q-separator/>

    <q-expansion-item switch-toggle-side
                      expand-separator
                      :value="templateExpansion === 'elementPrivate'"
                      @input="templateExpansion === 'elementPrivate' ? templateExpansion = null : templateExpansion = 'elementPrivate'"
                      label="Your Base Elements">
      <div class="q-ma-sm"
           style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); grid-column-gap: 7px; grid-row-gap: 10px;">
        <q-card v-for="(element, index) in elementTemplatesPrivate"
                :key="index"
                class="col-12 col-md-6 bg-secondaryGradient"
                style="width: 100%;"
                @click="$emit('addElementDialog', element)">
          <q-card-section style="margin: 0; padding: 0; width: 100%; display: flex; justify-content: flex-end">
            <q-btn icon="close" @click.stop="$emit('deleteElement', element)" flat round/>
          </q-card-section>
          <q-card-section class="column"
                          style="margin: 0; padding: 0; width: 100%; display: flex; justify-content: center; align-items: center">
            <q-icon :name="$lget(element, 'icon', 'format_shapes')" size="2.2rem"/>
            <p class="q-px-sm" style="font-size: 10pt; text-align: center">{{ element.name }}</p>
          </q-card-section>
        </q-card>
      </div>
      <div style="display: flex; justify-content: center">
        <q-pagination v-if="elementTemplatesPrivatePages > 1"
                      :value="elementTemplatesPrivateCurrentPage"
                      @input="elementTemplatesPrivateHandlePageChange"
                      :max="elementTemplatesPrivatePages"
                      :max-pages="6"
                      :direction-links="true"
                      :boundary-links="true">
        </q-pagination>
      </div>
    </q-expansion-item>
    <q-dialog v-model="imagePickerDialog">
      <image-picker :element="currentElement" @addImage="addImage"/>
    </q-dialog>
  </q-list>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import {mapGetters} from 'vuex';

  import BaseSections from './BaseSections';
  import ImagePicker from 'components/common/atoms/stylingComponents/imagePicker';

  export default {
    name: 'elementTemplates',
    components: {
      BaseSections,
      ImagePicker,
    },
    props: {
      currentElement: Object,
    },
    mixins: [
      makeFindPaginateMixin({
        service: 'wpb-elements',
        name: 'baseElements',
        qid: 'baseElements',
        query() {
          return {
            baseElement: true,
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
      makeFindPaginateMixin({
        service: 'wpb-sections',
        name: 'sectionTemplatesPrivate',
        qid: 'sectionTemplatesPrivate',
        query() {
          return {
            template: true,
            baseSection: false,
            devTemplate: false,
            isPublic: false,
            ownerId: this.userId
          };
        },
      }),
      makeFindPaginateMixin({
        service: 'wpb-elements',
        name: 'elementTemplatesPrivate',
        qid: 'elementTemplatesPrivate',
        query() {
          return {
            template: true,
            baseElement: false,
            devTemplate: false,
            isPublic: false,
            ownerId: this.userId
          };
        },
      }),
    ],
    data() {
      return {
        imagePickerDialog: false,
        templateExpansion: '',
      };
    },
    computed: {
      ...mapGetters('auth', {
        user: 'user',
      }),
      userId() {
        return this.user._id;
      },
    },
    methods: {
      addImage(val) {
        console.log('elementTemplates >> methods >> addImage >> val', val);
        this.imagePickerDialog = !this.imagePickerDialog;
        this.$emit('addImage', val);
      },
    },
  };
</script>

<style scoped>

</style>
