<template>
  <div>
    <q-list v-if="$lget(currentElement,'_id')" bordered class="rounded-borders">
      <template v-if="isHyperLink">
        <q-expansion-item class="expansion-item"
                          switch-toggle-side
                          dense
                          dense-toggle
                          default-opened
                          header-style="font-size: 17px;"
                          label="Hyperlink Settings">
          <hyper-link-settings :element="elementInfo"
                               @stylesUpdate="saveElement"/>
        </q-expansion-item>

        <q-separator/>
      </template>
      <template v-if="isContactForm">
        <q-expansion-item class="expansion-item"
                          switch-toggle-side
                          dense
                          dense-toggle
                          default-opened
                          header-style="font-size: 17px;"
                          label="Contact Form Settings">
          <contact-form-settings :element="elementInfo"
                                 @stylesUpdate="saveElement"/>
        </q-expansion-item>

        <q-separator/>
      </template>
      <template v-if="isImage">
        <q-expansion-item class="expansion-item"
                          switch-toggle-side
                          dense
                          dense-toggle
                          default-opened
                          header-style="font-size: 17px;"
                          label="Image Settings">
          <imgSettings :element="elementInfo"
                       @stylesUpdate="saveElement"/>
        </q-expansion-item>

        <q-separator/>
      </template>
      <template v-if="isImageCarousel">
        <q-expansion-item class="expansion-item"
                          switch-toggle-side
                          dense
                          dense-toggle
                          default-opened
                          header-style="font-size: 17px;"
                          label="Image Carousel Settings">
          <imgCarouselSettings :element="elementInfo"
                               @stylesUpdate="saveElement"/>
        </q-expansion-item>

        <q-separator/>
      </template>
      <template v-if="isYoutubeVideo">
        <q-expansion-item class="expansion-item"
                          switch-toggle-side
                          dense
                          dense-toggle
                          default-opened
                          header-style="font-size: 17px;"
                          label="Youtube Video Settings">
          <youtube-video-settings :element="elementInfo"
                                  @stylesUpdate="saveElement"/>
        </q-expansion-item>

        <q-separator/>
      </template>
      <template v-if="isMap">
        <q-expansion-item class="expansion-item"
                          switch-toggle-side
                          dense
                          dense-toggle
                          default-opened
                          header-style="font-size: 17px;"
                          label="Map Settings">
          <map-settings :element="elementInfo"
                        @stylesUpdate="saveElement"/>
        </q-expansion-item>

        <q-separator/>
      </template>
      <template v-if="isIcon">
        <q-expansion-item class="expansion-item"
                          switch-toggle-side
                          dense
                          dense-toggle
                          default-opened
                          header-style="font-size: 17px;"
                          label="Icon Settings">
          <icon-editor :element="elementInfo"
                       @stylesUpdate="saveElement"/>
        </q-expansion-item>

        <q-separator/>
      </template>
      <template v-if="isButton">
        <q-expansion-item class="expansion-item"
                          switch-toggle-side
                          dense
                          dense-toggle
                          default-opened
                          header-style="font-size: 17px;"
                          label="Button Settings">
          <ButtonEditor :element="elementInfo"
                        v-bind="elementInfo"
                        @stylesUpdate="saveElement"/>
        </q-expansion-item>

        <q-separator/>
      </template>

      <q-expansion-item class="expansion-item"
                        switch-toggle-side
                        dense
                        dense-toggle>
        <template v-slot:header>
          <span style="font-size: 18px;font-weight: 400;display: flex; align-items: center;">Classes</span>
          <div class="flex flex-center q-ml-sm">
            <q-icon name="fas fa-file-alt" size="xs" style="font-size: 18px;
  background: -webkit-linear-gradient(#FF0076 , #590FB7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;font-weight: 900;display: flex; align-items: center;"/>
          </div>

        </template>
        <classes :cssRules="cssRules"
                 :element="elementInfo"
                 @stylesUpdate="saveElement"
                 :value="elementClasses"/>
      </q-expansion-item>

      <q-separator/>

      <q-expansion-item class="expansion-item"
                        switch-toggle-side
                        dense
                        dense-toggle>
        <template v-slot:header>
          <span style="font-size: 18px;
  font-weight: 400;display: flex; justify-content: center;align-items: center;">General</span>
          <div class="flex flex-center q-ml-sm">
            <q-icon name="fas fa-cog" size="xs" style="font-size: 18px;
  background: -webkit-linear-gradient(#9055FF , #13E2DA);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;font-weight: 900;display: flex; justify-content: center;align-items: center;"/>
          </div>
        </template>
        <General :element="elementInfo"
                 @stylesUpdate="saveElement"/>
      </q-expansion-item>

      <q-separator/>

      <q-expansion-item class="expansion-item"
                        switch-toggle-side
                        dense
                        dense-toggle>
        <template v-slot:header>
          <span style="font-size: 18px;
  font-weight: 400;display: flex; align-items: center;">Dimensions</span>
          <div class="flex flex-center q-ml-sm">
            <q-icon name="fas fa-vector-square" size="xs" style="font-size: 18px;
  background: -webkit-linear-gradient(#DF98FA , #9055FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;font-weight: 900;"/>
          </div>
        </template>
        <Dimension :element="elementInfo"
                   @stylesUpdate="saveElement"/>
      </q-expansion-item>

      <q-separator/>

      <q-expansion-item v-if="isText || isButton || isIcon"
                        class="expansion-item"
                        switch-toggle-side
                        dense
                        dense-toggle>
        <template v-slot:header>
          <span style="font-size: 18px;
  font-weight: 400;display: flex; align-items: center;">Typography</span>
          <div class="flex flex-center q-ml-sm">
            <q-icon name="fas fa-font" size="xs" style="font-size: 18px;
  background: -webkit-linear-gradient(#402565 , #30BE96);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;font-weight: 900;display: flex; align-items: center;"/>
          </div>
        </template>
        <font-settings :element="elementInfo"
              @stylesUpdate="saveElement"/>
      </q-expansion-item>

      <q-separator/>

      <q-expansion-item class="expansion-item"
                        switch-toggle-side
                        dense
                        dense-toggle>
        <template v-slot:header>
          <span style="font-size: 18px;;font-weight: 400;display: flex; align-items: center;">Background</span>
          <div class="flex flex-center q-ml-sm">
            <q-icon name="fas fa-image" size="xs" style="font-size: 18px;
  background: -webkit-linear-gradient(#E233FF , #FF6B00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;font-weight: 900;display: flex; align-items: center;"/>
          </div>
        </template>

        <background :element="elementInfo" @stylesUpdate="saveElement"></background>
      </q-expansion-item>

      <q-separator/>

      <q-expansion-item class="expansion-item"
                        switch-toggle-side
                        dense
                        dense-toggle
                        label="Border Settings">
        <template v-slot:header>
          <span style="font-size: 18px;font-weight: 400;">Border Settings</span>
          <div class="flex flex-center q-ml-sm">
            <q-icon name="fas fa-border-style" size="xs" style="font-size: 18px;
  background: -webkit-linear-gradient(#402662 , #F06966);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;font-weight: 900;"/>
          </div>
        </template>
        <borderSettings :element="elementInfo"
                        @stylesUpdate="saveElement"/>
      </q-expansion-item>

      <q-btn class="q-mb-md bg-white text-negative"
             style="width: 100%;"
             label="Clear All Styles"
             @click="clearDialog = true"></q-btn>
    </q-list>
    <div v-else style="width: 100%; display: flex; justify-content: center">
      <p style="font-size: 17px; font-weight: bold">Select something to style</p>
    </div>

    <q-dialog v-model="clearDialog">
      <q-card>
        <q-card-section>
          <p style="font-size: 24px">Are you sure you want to clear all of your settings?</p>
        </q-card-section>
        <q-card-section style="width: 100%; display: flex; justify-content: flex-end">
          <q-btn style="margin-right: 16px" flat label="Cancel" @click="clearDialog = false"/>
          <q-btn label="Confirm" color="green" @click="clearStyles"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import General from '../atoms/stylingComponents/general';
  import Dimension from '../atoms/stylingComponents/dimension';
  import FontSettings from '../atoms/stylingComponents/font';
  import borderSettings from '../atoms/stylingComponents/borderSettings';
  import ButtonEditor from '../atoms/stylingComponents/buttonEditor';
  import {mapActions, mapGetters} from 'vuex';
  import classes from 'components/common/atoms/stylingComponents/classes';
  import IconEditor from 'components/common/atoms/stylingComponents/iconEditor';
  import Background from 'components/stylingComponents/background';
  import hyperLinkSettings from 'components/common/atoms/stylingComponents/hyperLinkSettings';
  import mapSettings from 'components/common/atoms/stylingComponents/mapSettings';
  import youtubeVideoSettings from 'components/common/atoms/stylingComponents/youtubeVideoSettings';
  import imgSettings from 'components/common/atoms/stylingComponents/imgSettings';
  import imgCarouselSettings from 'components/common/atoms/stylingComponents/imgCarouselSettings';
  import ContactFormSettings from 'components/common/atoms/stylingComponents/contactFormSettings';


  export default {
    name: 'styles',
    props: {
      page: Object,
    },
    data() {
      return {
        elementInfo: {},
        clearDialog: false,
        elementClasses: [],
      };
    },
    components: {
      ContactFormSettings,
      Background,
      mapSettings,
      IconEditor,
      classes,
      Dimension,
      General,
      FontSettings,
      ButtonEditor,
      borderSettings,
      hyperLinkSettings,
      youtubeVideoSettings,
      imgCarouselSettings,
      imgSettings,
    },
    watch: {
      currentElement: {
        immediate: true,
        deep: true,
        handler(newVal) {
          this.elementInfo = this.$lcloneDeep(newVal);
        },
      },
      elementInfo: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.elementClasses = this.compileExistingClasses(this.$lget(this.page, '_fastjoin.cssRules', [])
              .filter(rule => this.$lget(newVal, 'classes', []).map(cls => cls.id).includes(rule._id)), true);
          }
        },
      },
    },
    computed: {
      isText() {
        return this.elementInfo._type === 'text';
      },
      isButton() {
        return this.elementInfo._type === 'button';
      },
      isIcon() {
        return this.elementInfo._type === 'icon';
      },
      isHyperLink() {
        return this.elementInfo._type === 'hyperlink';
      },
      isMap() {
        return this.elementInfo._type === 'map';
      },
      isYoutubeVideo() {
        return this.elementInfo._type === 'youtubevideo';
      },
      isImage() {
        return this.elementInfo._type === 'image';
      },
      isImageCarousel() {
        return this.elementInfo._type === 'imgcarousel';
      },
      isContactForm() {
        return this.elementInfo._type === 'contactform';
      },
      feathersAxios() {
        return this.$axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.$store.state.auth.accessToken,
          },
        });
      },
      ...mapGetters({
        currentElement: 'getCurrentElement',
      }),
      cssRules() {
        return this.compileClasses(this.$lget(this.page, '_fastjoin.cssRules', []));
      },
    },
    methods: {
      ...mapActions('wpb-elements', {
        patchElement: 'patch',
      }),
      ...mapActions('wpb-sections', {
        patchSection: 'patch',
      }),
      ...mapActions('wpb-pages', {
        patchPage: 'patch',
      }),
      clearStyles() {
        let order = this.currentElement.styles.order;
        console.log('saved order', order);
        if (this.currentElement._type) {
          let clearedElement = Object.assign({}, this.currentElement.styles);
          clearedElement = {
            order: order,
          };
          this.patchElement([this.currentElement._id, {styles: clearedElement}, {query: {_type: this.currentElement._type}}])
            .then(res => {
              this.$q.notify({
                type: 'positive',
                message: 'Cleared Styles For Element',
              });
              console.log('success', res);
            })
            .catch(err => {
              this.$q.notify({
                type: 'Negative',
                message: 'Error Clearing Element Styles',
              });
              console.log('err', err);
            });
          this.clearDialog = false;
        } else {
          let clearedElement = Object.assign({}, this.currentElement.styles);
          clearedElement = {
            order: order,
            display: 'flex',
          };
          this.patchSection([this.currentElement._id, {styles: clearedElement}])
            .then(res => {
              this.$q.notify({
                type: 'positive',
                message: 'Cleared Styles For Section',
              });
              console.log('success', res);
            })
            .catch(err => {
              this.$q.notify({
                type: 'Negative',
                message: 'Error Clearing Section Styles',
              });
              console.log('err', err);
            });
          this.clearDialog = false;
        }
      },
      saveElement(val) {
        console.log('getting val', val);
        if (!Array.isArray(val)) {
          val = [val];
        }
        const currentElementCopy = this.$lcloneDeep(this.currentElement);
        let changes = val.map(item => {
          return {
            id: currentElementCopy._id,
            path: item.path,
            // before: this.$lget(currentElementCopy, item.path, '$unset'),
            after: item.value,
            meta: {
              index: currentElementCopy.index,
              pathToMe: currentElementCopy.pathToMe,
              treePath: currentElementCopy.treePath,
              type: currentElementCopy._type ? currentElementCopy._type : currentElementCopy.sections ? 'page' : 'section',
            },
          };
        }, this);
        if (changes.length) {
          this.$store.dispatch('addToSaveQueue', {
            changes,
            pageId: this.$route.params.page_id,
            meta: {
              editorTab: 'styles',
            },
          });
        }
      },
      compileClasses(arr) {
        let reg = /\.\w+/;
        let reg2 = /(\.\w+){2,}/;
        return arr.map((rule) => {
          return rule.name.split(' ').reduce((acc, curr) => {
            acc.label = acc.label + ' ' + curr;
            if (reg.test(curr) && !reg2.test(curr)) {
              acc.values = [...acc.values, {
                ...rule,
                classValue: curr.match(reg)[0].replace('.', ''),
                label: acc.label,
              }];
            }
            return acc;
          }, {label: '', values: []}).values;
        }).flat();
      },
      compileExistingClasses(arr) {
        let usedRuleLabels = this.$lget(this.elementInfo, 'classes', []).map(rule => rule.label + rule.id);
        let reg = /\.\w+/;
        let reg2 = /(\.\w+){2,}/;
        return arr.map((rule) => {
          return rule.name.split(' ').reduce((acc, curr) => {
            acc.label = acc.label + ' ' + curr;
            if (reg.test(curr) && !reg2.test(curr)) {
              acc.values = [...acc.values, {
                ...rule,
                classValue: curr.match(reg)[0].replace('.', ''),
                label: acc.label,
              }];
            }
            return acc;
          }, {label: '', values: []}).values;
        }).flat().filter(item => usedRuleLabels.includes(item.label + item._id));
      },
    },
  };
</script>

<style scoped lang="scss">
  .expansion-item {
    width: 100%;
    padding-bottom: 3px;
  }

  button {
    height: 35px;
    margin: 0 0;
    padding: 0 0;
  }
</style>
