<template>
  <div :class="[...classes, !isEditing ? showBorder ? 'inactive': '' : 'editing']"
       :id="$lget(sectionData, '_id')"
       :style="{...$lget(sectionData, 'styles', {}), position: 'relative'}"
       @click.stop="!previewing ? currentElement = {...sectionData, treePath, index: arrIndex, pathToMe} : ''">
    <editing-options v-if="isEditing && !previewing"
                     :parent="$lget(treePath, [0])"
                     type="section"
                     @jumpToParent="jumpToParent"/>

    <template v-if="$lget(sectionData, 'children', []).length">
      <the-section v-for="(section, index) in sectionData._fastjoin.children" :key="section._id"
                   :section="section"
                   :editing="isEditing"
                   :tree-path="[{...sectionData, index: arrIndex, treePath, pathToMe}, ...treePath]"
                   :pathToMe="`${pathToMe}._fastjoin.children[${index}]`"
                   :arrIndex="index"
                   :previewing="previewing"
                   :parent="sectionData"
                   :show-border="showBorder"
                   :currentPage="currentPage"/>
    </template>
    <template v-if="$lget(sectionData, 'elements', []).length">
      <component v-for="(element, index) in $lget(sectionData, '_fastjoin.elements', [])"
                 :is="elementComponents[element._type].component"
                 :element="element"
                 :tree-path="[{...sectionData, index: arrIndex, treePath, pathToMe}, ...treePath]"
                 :pathToMe="`${pathToMe}._fastjoin.elements[${index}]`"
                 :index="index"
                 :previewing="previewing"
                 :show-border="showBorder"
                 v-bind="element"
                 :key="element._id"/>
    </template>
  </div>
</template>

<script>
  import TheImage from '../atoms/image';
  import pTag from '../atoms/pTag';
  import editingOptions from '../../editingOptions/editingOptions';
  import isButton from '../atoms/button';
  import Icon from '../atoms/icon';
  import hyperLink from '../atoms/hyperLink';
  import mapComponent from '../atoms/mapComponent';
  import youtubeVideo from '../atoms/youtubeVideo';
  import imgCarousel from '../atoms/imgCarousel';
  import Editor from '../atoms/editor';
  import contactForm from '../atoms/contactForm';
  import classesMixin from 'src/mixins/classesMixin';

  export default {
    name: 'TheSection',
    components: {
      TheImage,
      pTag,
      editingOptions,
      isButton,
      Icon,
      hyperLink,
      mapComponent,
      youtubeVideo,
      imgCarousel,
      Editor,
      contactForm,
    },
    props: {
      treePath: Array,
      section: Object,
      arrIndex: [Number, String],
      currentPage: Object,
      parent: Object,
      showBorder: Boolean,
      previewing: Boolean,
      pathToMe: String,
    },
    mixins: [
      classesMixin({
        nameSpace: 'sectionData',
        service: 'wpb-sections',
      }),
    ],
    data() {
      return {
        focus: false,
        isChanged: false,
        sectionData: {},
        editSection: null,
        editElement: null,
        editingChild: false,
      };
    },
    watch: {
      section: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.sectionData = Object.assign({}, newVal);
          }
        },
      },
    },
    computed: {
      currentElement: {
        get() {
          return this.$store.getters.getCurrentElement;
        },
        set(element) {
          this.$store.dispatch('setCurrentElement', element);
        },
      },
      isEditing() {
        return this.$lget(this.currentElement, '_id', false) === this.$lget(this.sectionData, '_id', true) && !this.previewing;
      },
      elementComponents() {
        return {
          text: {
            component: pTag,
            attrs: {
              placeholder: 'The placeholder text',
              label: 'The label text',

            },
          },
          button: {
            component: isButton,
            attrs: {
              label: 'Button',
            },
          },
          icon: {
            component: Icon,
            attrs: {
              label: 'Icon',
            },
          },
          hyperlink: {
            component: hyperLink,
            attrs: {
              label: 'Icon',
            },
          },
          image: {
            component: TheImage,
            attrs: {},
          },
          map: {
            component: mapComponent,
            attrs: {},
          },
          youtubevideo: {
            component: youtubeVideo,
            attrs: {},
          },
          imgcarousel: {
            component: imgCarousel,
            attrs: {},
          },
          editor: {
            component: Editor,
            attrs: {},
          },
          contactform: {
            component: contactForm,
            attrs: {},
          },
        };
      },
    },
    methods: {
      jumpToParent() {
        this.currentElement = {...this.treePath[0], treePath: this.treePath, parentJump: true};
      },
    },
  };
</script>

<style lang="scss" scoped>

</style>
