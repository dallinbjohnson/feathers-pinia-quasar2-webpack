<template>
  <q-page id="editor" class="flex flex-center" :tabindex="0" @keydown.esc="currentElement = null">
    <div v-if="html" style="position: relative">
      <q-icon name="fas fa-compress-arrows-alt"
              color="white"
              class="q-pa-xs"
              size="md"
              style="position: absolute; top: 5px; left: 10px;z-index: 99;background-color: rgba(0,0,0,.5); border-radius: 50%"
              @click.stop="stopPreview">
        <q-tooltip content-style="font-size: 10pt">End Preview</q-tooltip>
      </q-icon>
      <div v-html="html"></div>
    </div>
    <q-layout id="WpbEditor"
              v-else
              ref="WpbEditor"
              view="hHr Lpr fff"
              container
              style="position: relative"
              :style="`height: ${parentHeight}px; width: ${parentWidth}px;`">
      <q-header v-if="!previewing" bordered class="bg-white text-secondary">
        <q-toolbar style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
          <div style="display: flex; justify-content: flex-start; align-items: center;">
            <div style="font-size: 1.5rem; margin-right: 12px;">
              <p style="margin: 0"
                 contenteditable="true"
                 @blur="updatePageName($event.target.innerText)">
                {{ form.name ? form.name : 'Loading...' }}
              </p>

            </div>

            <auto-save ref="autoSave"
                       :page="form"/>
            <q-btn flat
                   dense
                   round
                   :color="!undoRedoStatus.undo ? 'grey' : 'secondary'"
                   icon="undo"
                   :disable="!undoRedoStatus.undo"
                   @click.stop="undoRedo('undo')">
              <q-tooltip v-if="undoRedoStatus.undo" content-style="font-size: 10pt">
                undo
              </q-tooltip>
            </q-btn>
            <q-btn flat
                   dense
                   round
                   :color="!undoRedoStatus.redo ? 'grey' : 'secondary'"
                   icon="redo"
                   :disable="!undoRedoStatus.redo"
                   @click.stop="undoRedo('redo')">
              <q-tooltip v-if="undoRedoStatus.redo" content-style="font-size: 10pt">
                redo
              </q-tooltip>
            </q-btn>
<!--            <div style="position: relative;">-->
<!--              <q-btn flat-->
<!--                     class="text-primary"-->
<!--                     @click="pickTheme = !pickTheme"-->
<!--                     label="Your Theme"-->
<!--                     icon="fas fa-palette"></q-btn>-->
<!--              <div v-if="pickTheme"-->
<!--                   style="display: flex; flex-direction: row; width: 100%;position: absolute; top: 0; left: 0;">-->
<!--                <div style="display: flex; flex-direction: column;">-->
<!--                  <q-btn round color="positive" icon="check" class="q-mb-sm q-mr-sm"-->
<!--                         @click="setTheme(pickedColor)"></q-btn>-->
<!--                  <q-btn round color="negative" icon="close" class="q-mb-sm q-mr-sm" @click="pickTheme = false"></q-btn>-->
<!--                </div>-->
<!--                <div>-->
<!--                  <color-picker :value="$getCssVar('&#45;&#45;q-color-primary')"-->
<!--                                @colorPicker="pickedColor = $event"/>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
          </div>
          <div style="display: flex; justify-content: center; align-items: center;">
            <q-btn-toggle v-model="screenSize"
                          rounded unelevated
                          toggle-color="primary"
                          style="border: 1px solid var(--q-color-primary)"
                          :options="[
                            {slot: 'Mobile', value: 'mobile'},
                            {slot: 'Tablet', value: 'tablet'},
                            {slot: 'Desktop', value: 'desktop'}
                          ]">
              <template v-slot:Mobile>
                <div class="row items-center no-wrap">
                  <q-icon name="fas fa-mobile-alt"/>
                </div>
              </template>
              <template v-slot:Tablet>
                <div class="row items-center no-wrap">
                  <q-icon name="fas fa-tablet-alt"/>
                </div>
              </template>
              <template v-slot:Desktop>
                <div class="row items-center no-wrap">
                  <q-icon name="fas fa-desktop"/>
                </div>
              </template>
            </q-btn-toggle>
          </div>
          <div style="display: flex; justify-content: flex-end; align-items: center;">
            <q-btn flat
                   dense
                   round
                   size="13pt"
                   :color="styleSheetsDio ? 'accent': 'secondary'"
                   icon="code"
                   @click="handleCodeEditor">
              <q-tooltip content-style="font-size: 10pt">
                Edit stylesheets
              </q-tooltip>
            </q-btn>
            <q-btn flat
                   dense
                   round
                   :color="showBorder ? 'accent': 'secondary'"
                   icon="fas fa-border-none"
                   @click.stop="showBorder = !showBorder">
              <q-tooltip content-style="font-size: 10pt">
                Borders
              </q-tooltip>
            </q-btn>
            <q-btn flat
                   @click.stop="startPreview"
                   dense
                   round
                   size="13pt"
                   icon="preview">
              <q-tooltip content-style="font-size: 10pt">
                Preview Page
              </q-tooltip>
            </q-btn>
            <q-btn flat
                   dense
                   round
                   :color="$q.fullscreen.isActive ? 'accent': 'secondary'"
                   :icon="!$q.fullscreen.isActive ? 'fas fa-expand-arrows-alt' : 'fas fa-compress-arrows-alt'"
                   @click.stop="toggleFullScreen">
              <q-tooltip content-style="font-size: 10pt">
                {{ !$q.fullscreen.isActive ? 'Full Screen' : 'Exit Full Screen' }}
              </q-tooltip>
            </q-btn>
            <q-btn flat
                   dense
                   round
                   size="13pt"
                   icon="menu"
                   aria-label="Menu"
                   @click="drawerOpen = !drawerOpen">
              <q-tooltip content-style="font-size: 10pt">Toggle Menu</q-tooltip>
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>


      <q-drawer :value="drawerOpen && !previewing"
                @input="drawerOpen = !drawerOpen"
                side="right"
                bordered
                show-if-above
                content-class="bg-grey-1">
        <q-toolbar class="bg-white text-primary">
          <div class="q-ma-xs" style="max-width: 265px;">
            <q-btn-toggle v-model="panel"
                          no-caps
                          toggle-color="white"
                          color="white"
                          spread
                          text-color="secondary"
                          :options="[
                            { value: 'styles', slot: 'styles' },
                            { value: 'layers', slot: 'layers' },
                            { value: 'elements', slot: 'elements' },
                            { value: 'templates', slot: 'templates' },
                            { value: 'publishing', slot: 'publishing' },
                          ]">
              <template v-slot:styles>
                <q-icon name="fas fa-paint-brush"
                        size="12pt"
                        :class="`${panel === 'styles' ? 'bg-primary' : ''} q-pa-sm`"
                        style="border-radius: 20px;"></q-icon>
                <q-tooltip content-style="font-size: 10pt">Styles</q-tooltip>
              </template>
              <template v-slot:layers>
                <q-icon name="fas fa-layer-group"
                        size="12pt"
                        :class="`${panel === 'layers' ? 'bg-primary' : ''} q-pa-sm`"
                        style="border-radius: 20px;"></q-icon>
                <q-tooltip content-style="font-size: 12pt;font-weight: 900;">Layers</q-tooltip>
              </template>
              <template v-slot:elements>
                <q-icon name="fas fa-th-large"
                        size="12pt"
                        :class="`${panel === 'elements' ? 'bg-primary' : ''} q-pa-sm`"
                        style="border-radius: 20px;"></q-icon>
                <q-tooltip content-style="font-size: 12pt;font-weight: 900;">Elements</q-tooltip>
              </template>
              <template v-slot:templates>
                <q-icon name="web"
                        size="16pt"
                        :class="`${panel === 'templates' ? 'bg-primary' : ''} q-pa-sm`"
                        style="border-radius: 20px;"></q-icon>
                <q-tooltip content-style="font-size: 12pt;font-weight: 900;">Templates</q-tooltip>
              </template>
              <template v-slot:publishing>
                <q-icon name="far fa-clone"
                        size="14pt"
                        :class="`${panel === 'publishing' ? 'bg-primary' : ''} q-pa-sm`"
                        style="border-radius: 20px;"></q-icon>
                <q-tooltip content-style="font-size: 12pt;font-weight: 900;">Publishing</q-tooltip>
              </template>
            </q-btn-toggle>
          </div>
        </q-toolbar>

        <q-tab-panels v-model="panel"
                      animated
                      class="shadow-2 rounded-borders">
          <q-tab-panel name="styles" style="padding: 0;">
            <div class="text-h6 q-ma-md">Styles</div>
            <q-card flat style="width: 100%">
              <styles :page="form" :cssRules="availableClassRules"/>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="layers" :style="`height: calc(${parentHeight}px - 50px)`">
            <div class="text-h6">Layers</div>
            <layers :parentHeight="parentHeight"
                    :form="form"
                    @scrollToElement="scrollToElement"
                    @mountedScroll="scrollToElement(currentElement._id ? currentElement : form)"/>
          </q-tab-panel>

          <q-tab-panel name="elements" class="q-pa-none q-pt-md">
            <div class="text-h6 q-ml-sm">Elements</div>

            <element-templates
              v-if="$lget(currentElement,'_id') && (!$lget(currentElement,'_type') || $lget(currentElement,'_type') === 'page')"
              :currentElement="currentElement"
              @addElementDialog="addElementDialogSet"
              @deleteElement="setDelete"
              @addImage="addElement"/>
            <div v-else style="width: 100%;">
              <p style="font-size: 17px; font-weight: bold; text-align: center;">Select a Section to add to</p>
            </div>
          </q-tab-panel>

          <q-tab-panel name="templates" class="q-pa-none q-pt-md">
            <div class="text-h6 q-ml-sm">Templates</div>
            <user-templates
              v-if="$lget(currentElement,'_id') && (!$lget(currentElement,'_type') || $lget(currentElement,'_type') === 'page')"
              :currentElement="currentElement"
              @elementDialogOpen="elementDialog = $event"
              @addElementDialog="addElementDialogSet"
              @deleteElement="setDelete"/>
            <div v-else style="width: 100%; display: flex; justify-content: center">
              <p style="font-size: 17px; font-weight: bold">Select a Section to add to</p>
            </div>
          </q-tab-panel>
          <q-tab-panel name="publishing" :style="`height: calc(${parentHeight}px - 50px)`">
            <div class="text-h6">Publishing</div>
            <publishing :page="form"/>
          </q-tab-panel>
        </q-tab-panels>
      </q-drawer>

      <q-page-container :id="'editor-' + form.project">
        <q-page :class="[...classes]"
                style="display: flex; justify-content: center;"
                @click.stop="currentElement = {...form, treePath: [{...form, index: 0, path: '', pathToMe: ''}], pathToMe: '', index: 0}">
          <q-icon v-if="previewing || html"
                  name="mdi-eye-off"
                  color="white"
                  class="q-pa-xs"
                  size="md"
                  style="position: absolute; top: 5px; left: 10px;z-index: 99;background-color: rgba(0,0,0,.5); border-radius: 50%"
                  @click.stop="stopPreview">
            <q-tooltip content-style="font-size: 10pt">End Preview</q-tooltip>
          </q-icon>
          <q-scroll-area ref="scrollArea"
                         id="scrollArea"
                         :style="`height: ${previewing ? `${parentHeight}px` : `calc(${parentHeight}px - 50px)`};  max-width: ${parentWidth}px;${screenSizeStyles}`">
            <div :style="{padding: `${previewing ? '0 13px 0 0' : '25px 13px 0 5px'}`}">
              <div :id="form.project"
                   :style="form.styles"
                   :class="!previewing ? !isSelected(form) ? showBorder ? 'inactive': '' : 'editing' : ''"
                   style="position: relative">
                <editing-options v-if="isSelected(form)" :parent="null" :options="{delete: false}" :type="form.name"/>
                <section-view v-for="(section, i) in $lget(form, '_fastjoin.sections', [])"
                              :editing="editing === i"
                              :tree-path="[{...form, index: 0, path: '', pathToMe: ''}]"
                              :pathToMe="`_fastjoin.sections[${i}]`"
                              :key="section._id"
                              :section="section"
                              :arrIndex="i"
                              :previewing="previewing"
                              @editSection="editing = $event"
                              :parent="form"
                              :currentPage="form"
                              :show-border="showBorder"/>
              </div>
            </div>
            <div>
              <q-inner-loading :showing="loading">
                <vLottiePlayer name="PageLoading"
                               loop
                               :width="`${parentWidth / 5}px`"
                               :height="`${parentHeight}px`"
                               :animationData="require('../../assets/lottieAnims/PageLoading.json')"
                               style="position: absolute;top: 50px;"/>
              </q-inner-loading>
            </div>
          </q-scroll-area>
        </q-page>
      </q-page-container>

      <q-dialog v-model="addElementDialog">
        <q-card class="q-pa-sm">
          <q-card-section>
            <p style="font-size: 24px">Do you want to add this {{ addingElement._type ? 'element' : 'section' }}?</p>
          </q-card-section>
          <q-card-section style="width: 100%; display: flex; justify-content: flex-end;  ">
            <q-btn flat class="q-mx-md" label="Cancel" @click="addElementDialog = !addElementDialog"/>
            <q-btn label="Add" color="green" @click="addElement(addingElement)"/>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="deleteElementDialog">
        <q-card class="q-pa-sm">
          <q-card-section>
            <p style="font-size: 24px">Do you want to remove this {{ addingElement._type ? 'element' : 'section' }}?</p>
          </q-card-section>
          <q-card-section style="width: 100%; display: flex; justify-content: flex-end;  ">
            <q-btn flat class="q-mx-md" label="Cancel" @click="deleteElementDialog = false"/>
            <q-btn label="Delete" color="red" @click="deleteElement"/>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="elementDialog">
        <q-card style="width: 100%; max-width: 450px">
          <q-card-section>
            <q-input class="col-6" v-model="form.elementTemplateName"/>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-layout>

    <q-dialog v-model="styleSheetsDio" seamless persistent position="bottom" full-width>
      <q-card :style="{width: '100%', height: styleSheetHeight, overflow: 'hidden'}">
        <CssEditor ref="CssEditor"
                   :projectId="$lget(form, 'project')"
                   :height="styleSheetHeight"
                   @changeHeight="changeHeight($event)"
                   @closeEditor="styleSheetsDio = false"
                   :pageId="$lget(form, '_id')"/>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  import {scroll} from 'quasar';
  import {makeGetMixin, models} from '@feathersjs/vuex';
  import {mapActions, mapGetters, mapState} from 'vuex';
  import '@quasar/quasar-ui-qiconpicker/dist/index.css';
  import VueLottiePlayer from 'vue-lottie-player';
  import classesMixin from 'src/mixins/classesMixin';

  import styles from 'components/common/molecules/styles';
  import sectionView from 'components/common/substance/Section';
  import editingOptions from 'components/editingOptions/editingOptions';
  import AutoSave from 'components/AutoSave/AutoSave';
  import ElementTemplates from 'components/elementTemplates/elementTemplates';
  import UserTemplates from 'components/userTemplates/userTemplates';
  import layers from 'components/layers/layers';
  import publishing from '../../components/publishing/publishing';
  import CssEditor from 'components/common/molecules/CSSEditor';
  // import colorPicker from 'components/common/atoms/stylingComponents/colorPicker';


  let {getScrollTarget, setScrollPosition} = scroll;

  export default {
    name: 'WpbEditor',
    components: {
      // colorPicker,
      CssEditor,
      layers,
      UserTemplates,
      ElementTemplates,
      AutoSave,
      sectionView,
      styles,
      editingOptions,
      publishing,
      vLottiePlayer: VueLottiePlayer,
    },
    props: {
      page: Object,
    },
    mixins: [
      classesMixin({
        nameSpace: 'form',
        service: 'wpb-pages',
      }),
      makeGetMixin({
        service: 'wpb-pages',
        name: 'makeGetPage',
        id() {
          return this.$lget(this.$route, 'params.page._id', this.$route.params.page_id);
        },
        queryWhen() {
          console.log('should i query for page?', !this.$lget(this.$route, 'params.page._id'));
          let statePage = this.getPage(this.$route.params.page_id);
          return !this.$lget(this.$route, 'params.page._id') && !statePage;
        },
      }),
    ],
    data() {
      return {
        styleSheetsDio: false,
        styleSheetHeight: '45vh',
        pickedColor: '',
        pickTheme: false,
        screenSize: 'desktop',
        loading: false,
        value: '',
        addElementDialog: false,
        deleteElementDialog: false,
        addingElement: {},
        form: new models.api.wpbPages().clone(),
        editing: false,
        showBorder: true,
        parentHeight: 0,
        parentWidth: 0,
        drawerOpen: true,
        panel: 'styles',
        elementDialog: false,
        open: false,
        previewing: false,
        html: '',
      };
    },
    created() {
      window.addEventListener('beforeunload', this.preventNav);
      let body = document.getElementsByTagName('body');
      body[0].addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
          this.stopPreview();
        }
      }, true);
    },
    mounted() {
      // this.$watch('$data.$windowWidth', () => {
      //   if (this.$refs['WpbEditor']) {
      //     let el = this.$refs['WpbEditor'].$el;
      //     this.parentWidth = el.parentNode.clientWidth || 0;
      //   }
      // }, {
      //   immediate: true,
      // });
      // this.$watch('$data.$windowHeight', () => {
      //   if (this.$refs['WpbEditor']) {
      //     let el = this.$refs['WpbEditor'].$el;
      //     this.parentHeight = el.parentNode.clientHeight || 0;
      //     this.$setCssVar('--parent-height', `${this.parentHeight}px`);
      //   }
      // }, {
      //   immediate: true,
      // });

      if (this.$refs['WpbEditor']) {
        let el = this.$refs['WpbEditor'].$el;
        new ResizeObserver(() => {
          this.parentWidth = el.parentNode.clientWidth || 0;
          this.parentHeight = el.parentNode.clientHeight || 0;
          this.$setCssVar('--parent-height', `${this.parentHeight}px`);
        }).observe(el.parentNode);
      }

      this.$store.commit('SET_AUTOSAVE_PREFERENCES');
    },
    watch: {
      isGetMakeGetPagePending: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.loading = true;
          } else {
            setTimeout(() => {
              this.loading = false;
            }, 800);
          }
        },
      },
      makeGetPage: {
        immediate: true,
        deep: true,
        async handler(newVal, oldVal) {
          // console.log('makeGetPage change', newVal);
          if (newVal && newVal._id === this.$lget(this.page, '_id', this.$route.params.page_id)) {
            if (this.$lget(newVal, '_fastjoin.fonts', []).length !== this.$lget(oldVal, '_fastjoin.fonts', []).length) {
              this.loadFonts(this.$lget(newVal, '_fastjoin.fonts', []));
            }
            this.form = newVal.clone();
            let payload = {project: newVal.project, user: this.user, page: newVal};
            // console.log('makeGetPage change payload', payload);
            await this.$store.dispatch('setCurrentDbCollection', payload);
            // await this.$store.dispatch('setUndoRedoStatus', newVal);
            this.applyCssRules(this.$lget(newVal, '_fastjoin.css', ''));
          }
        },
      },
      page: {
        immediate: true,
        deep: true,
        async handler(newVal) {
          // console.log('Page change', newVal);
          if (newVal && newVal._id) {
            this.form = newVal;
            let payload = {project: newVal.project, user: this.user, page: newVal};
            // console.log('Page change payload', payload);
            await this.$store.dispatch('setCurrentDbCollection', payload);
            // await this.$store.dispatch('setUndoRedoStatus', newVal);
            this.applyCssRules(this.$lget(newVal, '_fastjoin.css', ''));
          }
        },
      },
      currentElement: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            if (this.$lget(newVal, 'index') > -1 && this.panel === 'layers') {
              // console.log('element has an index', newVal.index, newVal._id);
              this.scrollToElement(newVal);
            }
            if (this.$lget(newVal, 'parentJump')) {
              let copy = this.$lcloneDeep(newVal);
              copy.index = null;
              // console.log('jumping to parent', copy);
              this.scrollToElement(copy);
            }
            if (this.$lget(newVal, 'dbChange')) {
              let copy = this.$lcloneDeep(newVal);
              copy.index = null;
              // console.log('jumping to parent', copy);
              this.scrollToElement(copy);
            }
          }
        },
      },
      form: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (this.$lget(newVal, 'availableClasses', []).length) {
            this.$store.dispatch('setAvailableClasses', this.$lget(newVal, 'availableClasses', []));
          }
        },
      },
      user: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal) {
          if (this.$lget(newVal, 'theme.--q-color-primary') !== this.$lget(oldVal, 'theme.--q-color-primary')) {
            this.$setCssVar('--q-color-primary', this.$lget(newVal, 'theme.--q-color-primary'));
          }
          if (this.$lget(newVal, 'preferences.autoSave')) {
            const autosavePreference = newVal.preferences.autoSave;
            this.autoSave = autosavePreference.value;
            this.autoSaveDebounce = autosavePreference.debounce;
          }
        },
      },
    },
    computed: {
      ...mapGetters('auth', {
        user: 'user',
      }),
      ...mapGetters('wpb-pages', {
        getPage: 'get',
      }),
      ...mapState({undoRedoStatus: 'undoRedoStatus'}),
      screenSizeStyles() {
        if (this.screenSize === 'desktop') {
          return 'width: 100%;';
        } else if (this.screenSize === 'mobile') {
          return 'width: 350px;';
        } else {
          return 'width: 900px;';
        }
      },
      userId() {
        return this.user._id;
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
      currentElement: {
        get() {
          return this.$store.getters.getCurrentElement;
        },
        set(element) {
          this.$store.dispatch('setCurrentElement', element);
        },
      },
      isEditing() {
        return this.$lget(this.currentElement, '_id', false) === this.$lget(this.form, '_id', true);
      },
      axiosFeathers() {
        return this.$axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.$store.state.auth.accessToken,
          },
        });
      },
      availableClassRules() {
        let media = /@media/;
        let keyframes = /@keyframes/;
        let classes = /\.\w+/;
        return this.$lget(this.form, '_fastjoin.cssRules', []).filter(rule =>
          !media.test(rule.name) &&
          !keyframes.test(rule.name) &&
          classes.test(rule.name),
        );
      },
    },
    methods: {
      ...mapActions('wpb-pages', {
        patchPage: 'patch',
      }),
      // setTheme(event) {
      //   this.$setCssVar('--q-color-primary', event);
      //   let newUser = this.user.clone();
      //   newUser.theme['--q-color-primary'] = event;
      //   newUser.save().then(() => {
      //     this.$successNotify('Looks good!');
      //   }).catch((err) => {
      //     this.$errNotify('Something went wrong with setting theme, please refresh and try again');
      //     console.err(err);
      //   });
      // },
      changeHeight(hei) {
        console.log(hei);
        if (this.styleSheetHeight === hei) {
          this.styleSheetHeight = '45vh';
        } else {
          this.styleSheetHeight = hei;
        }
      },
      loadFonts(newFonts) {
        function createAndLoad(fonts) {
          let link = 'https://fonts.googleapis.com/css?family=';
          fonts.map(font => {
            let cleanSpace = font.replace(/\s/g, '+') + '|';
            link += cleanSpace;
          });
          // add links to head to load fonts
          let stylesheet = document.createElement('link');
          stylesheet.rel = 'stylesheet';
          stylesheet.href = link;
          stylesheet.id = 'PageFonts';
          document.head.appendChild(stylesheet);
        }

        if (document.getElementById('PageFonts')) {
          let element = document.getElementById('PageFonts');
          element.parentNode.removeChild(element);
          createAndLoad(newFonts);
        } else {
          createAndLoad(newFonts);
        }
      },
      updatePageName(val) {
        if (this.$lget(this.form, 'name') !== val) {
          this.patchPage([this.form._id, {name: val}])
            .then(() => {
              this.$q.notify({
                type: 'positive',
                message: 'Changed Page Name',
              });
            })
            .catch(err => {
              this.$q.notify({
                type: 'negative',
                message: 'Error Changing Name',
              });
              console.log('erroring', err);
            });
        }
      },
      addElementDialogSet(val) {
        this.addingElement = val;
        console.log('elemenet', this.addingElement);
        this.addElementDialog = !this.addElementDialog;
      },
      setDelete(val) {
        this.addingElement = val;
        this.deleteElementDialog = true;
      },
      deleteElement() {
        if (this.addingElement.devTemplate === false) {
          if (this.addingElement.ownerId === this.user._id) {
            if (this.addingElement._type) {
              this.$store.dispatch('wpb-elements/remove', this.addingElement._id)
                .then(res => {
                  console.log('Saved', res);
                  this.deleteElementDialog = false;
                  this.addingElement = {};
                  this.$q.notify({
                    type: 'positive',
                    message: 'Removed Element',
                  });
                })
                .catch(err => {
                  this.deleteElementDialog = false;
                  this.$q.notify({
                    type: 'negative',
                    message: 'Error removing',
                  });
                  console.log('erroring', err);
                });
            } else {
              this.$store.dispatch('wpb-sections/remove', this.addingElement._id)
                .then(res => {
                  console.log('Saved', res);
                  this.deleteElementDialog = false;
                  this.addingElement = {};
                  this.$q.notify({
                    type: 'positive',
                    message: 'Removed Section',
                  });
                })
                .catch(err => {
                  this.$q.notify({
                    type: 'negative',
                    message: 'Error removing',
                  });
                  console.log('erroring', err);
                });
            }
          } else {
            this.$q.notify({
              type: 'negative',
              message: 'Can\'t delete templates you do not own',
            });
          }
        } else {
          this.$q.notify({
            type: 'negative',
            message: 'Can\'t remove default templates',
          });
        }
      },
      addElement(element) {
        let elementCopy = this.$lcloneDeep(element);
        this.imagePickerDialog = false;
        const a = this.$lget(this.currentElement, 'sections', []).length;
        const b = this.$lget(this.currentElement, 'children', []).length;
        const c = this.$lget(this.currentElement, 'elements', []).length;
        const newOrder = a + b + c;
        // console.log('wpbeditor >> methods >> addElement >> element', element);
        if (!this.currentElement._type || this.currentElement._type === 'page') {
          // console.log('this is a section', this.currentElement.elements.length);
          let type = elementCopy._type;
          // console.log('wpbeditor >> methods >> addElement >> if _type >> type', element);
          let payload;
          if (type) {
            if (this.currentElement.page) {
              elementCopy.styles.order = newOrder;
              payload = {
                action: 'duplicateTemplate',
                templateAction: 'elementTemplate',
                value: elementCopy,
                section_id: this.currentElement._id,
                order_position: newOrder,
              };
              console.log('this is the first', payload);
            } else {
              payload = {
                ownerId: this.user._id,
                action: 'duplicateTemplate',
                templateAction: 'rootElement',
                value: elementCopy,
                page_id: this.currentElement._id,
                order_position: newOrder,
              };
              console.log('this is the second', payload);
            }

          } else {
            let page_id = this.currentElement.page ? this.currentElement.page : this.currentElement._id;
            // console.log('check page_id', page_id);
            let parent_id = page_id === this.currentElement._id ? undefined : this.currentElement._id;
            // console.log('check parent_id', parent_id);
            elementCopy.styles.order = newOrder;
            // console.log('1 order setter', elementCopy.styles.order);

            payload = {
              action: 'duplicateTemplate',
              templateAction: 'sectionTemplate',
              value: elementCopy._id,
              order_position: newOrder,
              parent_id,
              page_id,
            };
            console.log('numba 3 payload', payload);
            // console.log('this is the third', payload);
          }
          this.feathersAxios.post('/wpb-management', payload)
            .then(res => {
              this.addingElement = {};
              this.addElementDialog = false;
              console.log('yus sur, big sur, numba 3', res);
            })
            .catch(err => console.error('REEEEEEEEEE SOMETHING IS WRONG', err));
        } else {
          this.$q.notify({
            message: 'You must select a section to add to',
            color: 'red',
          });
        }
      },
      isSelected(item) {
        return this.$lget(this.currentElement, '_id', true) === this.$lget(item, '_id', false);
      },
      scrollToElement(item) {
        // console.log('scrollToElement item', item);
        if (this.$lget(this.currentElement, '_id', true) !== this.$lget(item, '_id', false)) {
          // console.log('they dont match', item);
          this.currentElement = item;
        }
        let index;
        if (item.index || item.index === 0) {
          index = String(item.index) + '-';
        }
        // console.log('index/item.styles.order', index, item.styles.order);
        let refName;
        if (index) {
          refName = index + item._id;
        } else {
          refName = item._id;
        }
        // console.log('refName', refName);
        if (refName) {
          let element = document.getElementById(refName);
          // console.log('the element', element);
          let form;
          if (index) {
            let nestableItems = document.getElementsByClassName('nestable-item-' + this.form._id);
            if (nestableItems.length) {
              form = nestableItems[0];
            }
            // console.log('the tree form',form);
          } else {
            form = document.getElementById(this.form.project);
            // console.log('the reg form',form);
          }
          if (element && form) {
            let elementOffset = this.findOffset(element, form);
            // console.log('elementOffset', elementOffset);
            const scrollTarget = getScrollTarget(element);
            // console.log('scroll', `element.offsetTop: ${element.offsetTop}`, `form.offsetTop: ${form.offsetTop}`);
            const offset = elementOffset - (this.parentHeight / 6);
            const duration = 300;
            setScrollPosition(scrollTarget, offset, duration);
          }
        }
      },
      findOffset(element, top) {
        // console.log('finding the offset', element, 'the top', top);
        let offset = element.offsetTop;
        if (element !== top) {
          let parent = element.offsetParent;
          if (parent !== top) {
            offset += this.findOffset(parent, top);
          }
        }
        return offset;
      },
      startPreview() {
        this.previewing = true;
        this.showBorder = false;
        let el = this.$lget(this.$refs['WpbEditor'], '$el');
        if (el) {
          this.parentHeight = el.parentNode.clientHeight || 0;
          this.parentWidth = el.parentNode.clientWidth || 0;
        }
      },
      stopPreview() {
        this.previewing = false;
        this.showBorder = true;
        this.html = '';
      },
      toggleFullScreen() {
        // this.currentElement = {};
        // this.previewing = true;
        // this.showBorder = false;
        let el = document.getElementById('editor');
        // setTimeout(() => {
        //   if (el) {
        //     this.html = el.outerHTML;
        //   }
        // },300);
        if (this.$q.fullscreen.isCapable) {
          if (!this.$q.fullscreen.isActive) {
            this.$q.fullscreen.toggle(el);
          } else {
            this.$q.fullscreen.exit();
          }

        }

      },
      manualSave() {
        this.$refs['autoSave'].manualSave();
      },
      preventNav(event) {
        if (!this.unsavedChanges) return;
        event.preventDefault();
        event.returnValue = '';
      },
      undoRedo(val) {
        this.$store.dispatch('undoRedo', {type: val, page: this.form});
      },
      markSaved() {
        this.unsavedChanges = false;
        this.undoRedoChanges = false;
      },
      handleCodeEditor() {
        if (!this.styleSheetsDio) {
          this.styleSheetsDio = true;
        } else {
          this.$refs['CssEditor'].closeEditor();
        }
      },
      applyCssRules(str) {
        let head = document.getElementsByTagName('head')[0];
        let style = document.getElementById('stylingTag');
        if (style) {
          style.innerHTML = '';
          style.appendChild(document.createTextNode(str));
          head.appendChild(style);
        } else {
          let styleTag = document.createElement('style');
          styleTag.type = 'text/css';
          styleTag.id = 'stylingTag';
          styleTag.appendChild(document.createTextNode(str));
          head.appendChild(styleTag);
        }
      },
    },
    beforeRouteLeave(to, from, next) {
      if (this.unsavedChanges) {
        this.manualSave();
      }
      this.currentElement = {};
      next();
    },
    beforeUnmount() {

      // removes the font link tag so we don't load unnecessary styles.
      if (document.getElementById('PageFonts')) {
        document.getElementById('PageFonts').parentNode.removeChild(document.getElementById('PageFonts'));
      }

      window.removeEventListener('beforeunload', this.preventNav);
      window.removeEventListener('keydown', this.stopPreview);
      if (this.unsavedChanges) {
        this.manualSave();
      }
      this.currentElement = {};
    },
  };
</script>

<style scoped lang="scss" src="./_WpbEditor.scss">

</style>
