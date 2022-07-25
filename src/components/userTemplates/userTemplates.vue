<template>
  <q-list bordered class="rounded-borders">
    <q-expansion-item switch-toggle-side
                      default-opened
                      :value="templateExpansion === 'devTemplateSection'"
                      @input="templateExpansion === 'devTemplateSection' ? templateExpansion = null : templateExpansion = 'devTemplateSection'"
                      expand-separator
                      label="Default Section Templates">
      <div class="q-ma-sm row"
           style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); grid-column-gap: 7px; grid-row-gap: 10px; justify-items: center; align-items: center;">
        <q-card v-for="(devTemplateSection, index) in devSectionTemplates"
                :key="index"
                class="col-12 col-md-6 bg-secondaryGradient"
                style="height: 100px; display: flex; justify-content: center; align-items: center; width: 100%; color: white"
                @click="$emit('addElementDialog', devTemplateSection)">
          <q-card-section class="column"
                          style="margin: 0; padding: 0; width: 100%; display: flex; justify-content: center; align-items: center">
            <q-icon :name="$lget(devTemplateSection, 'icon', 'format_shapes')" size="2.2rem"/>
            <p class="q-px-sm" style="font-size: 10pt; margin: 0; text-align: center">{{ devTemplateSection.name }}</p>
          </q-card-section>
        </q-card>
      </div>
    </q-expansion-item>
    <q-separator/>
    <q-expansion-item switch-toggle-side
                      default-opened
                      :value="templateExpansion === 'devTemplateElement'"
                      @input="templateExpansion === 'devTemplateElement' ? templateExpansion = null : templateExpansion = 'devTemplateElement'"
                      expand-separator
                      label="Default Element Templates">
      <div class="q-ma-sm row"
           style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); grid-column-gap: 7px; grid-row-gap: 10px; justify-items: center; align-items: center;">
        <q-card v-for="(devTemplateElement, index) in devElementTemplates"
                :key="index"
                class="col-12 col-md-6 bg-secondaryGradient"
                style="height: 90px; display: flex; justify-content: center; align-items: center; width: 100%; color: white"
                @click="$emit('addElementDialog', devTemplateElement)">
          <q-card-section class="column"
                          style="margin: 0; padding: 0; width: 100%; display: flex; justify-content: center; align-items: center">
            <q-icon :name="$lget(devTemplateElement, 'icon', 'format_shapes')" size="2.2rem"/>
            <p class="q-px-sm" style="font-size: 10pt; margin: 0; text-align: center">{{ devTemplateElement.name }}</p>
          </q-card-section>
        </q-card>
      </div>
    </q-expansion-item>
    <q-separator/>
    <q-expansion-item switch-toggle-side
                      expand-separator
                      :value="templateExpansion === 'section'"
                      @input="templateExpansion === 'section' ? templateExpansion = null : templateExpansion = 'section'"
                      label="Section Templates">
      <div class="q-ma-sm row"
           style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); grid-column-gap: 7px; grid-row-gap: 10px; justify-items: center; align-items: center;">
        <q-card v-for="(section, index) in sectionTemplatesPublic"
                :key="index"
                class="col-12 col-md-6 bg-secondaryGradient"
                style="width: 100%; color: white"
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
        <q-pagination v-if="sectionTemplatesPublicPages > 1"
                      :value="sectionTemplatesPublicCurrentPage"
                      @input="sectionTemplatesPublicHandlePageChange"
                      :max="sectionTemplatesPublicPages"
                      :max-pages="6"
                      :direction-links="true"
                      :boundary-links="true">
        </q-pagination>
      </div>
    </q-expansion-item>

    <q-separator/>

    <q-expansion-item switch-toggle-side
                      expand-separator
                      :value="templateExpansion === 'element'"
                      @input="templateExpansion === 'element' ? templateExpansion = null : templateExpansion = 'element'"
                      label="Element Templates">
      <div class="q-ma-sm row"
           style="display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); grid-column-gap: 7px; grid-row-gap: 10px;">
        <q-card v-for="(element, index) in elementTemplatesPublic"
                :key="index"
                class="col-12 col-md-6 bg-secondaryGradient"
                style="width: 100%; color: white"
                @click="$emit('addElementDialog', element)">
          <q-card-section style="margin: 0; padding: 0; width: 100%; display: flex; justify-content: flex-end">
            <q-btn icon="close" @click.stop="$emit('deleteElement', element)" flat round/>
          </q-card-section>
          <q-card-section class="column"
                          style="margin: 0; padding: 0; width: 100%; display: flex; justify-content: center; align-items: center">
            <q-icon :name="$lget(element, 'icon', 'format_shapes')" size="2.2rem"/>
            <p class="q-px-sm" style="font-size: 10pt; margin: 0; text-align: center">{{ element.name }}</p>
          </q-card-section>
        </q-card>
      </div>
      <div style="display: flex; justify-content: center">
        <q-pagination v-if="elementTemplatesPublicPages > 1"
                      :value="elementTemplatesPublicCurrentPage"
                      @input="elementTemplatesPublicHandlePageChange"
                      :max="elementTemplatesPublicPages"
                      :max-pages="6"
                      :direction-links="true"
                      :boundary-links="true">
        </q-pagination>
      </div>
    </q-expansion-item>

  </q-list>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';

  export default {
    name: 'userTemplates',
    props: {
      currentElement: Object,
    },
    mixins: [
      makeFindPaginateMixin({
        service: 'wpb-sections',
        name: 'devSectionTemplates',
        qid: 'devSectionTemplates',
        query() {
          return {
            template: true,
            baseSection: false,
            devTemplate: true,
            isPublic: true,
          };
        },
      }),
      makeFindPaginateMixin({
        service: 'wpb-elements',
        name: 'devElementTemplates',
        qid: 'devElementTemplates',
        query() {
          return {
            template: true,
            baseElement: false,
            devTemplate: true,
            isPublic: true,
          };
        },
      }),
      makeFindPaginateMixin({
        service: 'wpb-sections',
        name: 'sectionTemplatesPublic',
        qid: 'sectionTemplatesPublic',
        query() {
          return {
            template: true,
            baseSection: false,
            devTemplate: false,
            isPublic: true,
          };
        },
      }),
      makeFindPaginateMixin({
        service: 'wpb-elements',
        name: 'elementTemplatesPublic',
        qid: 'elementTemplatesPublic',
        query() {
          return {
            template: true,
            baseElement: false,
            devTemplate: false,
            isPublic: true,
          };
        },
      }),
    ],
    data() {
      return {
        templateExpansion: '',
      };
    },
  };
</script>

<style scoped>

</style>
