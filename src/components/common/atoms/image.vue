<template>
  <div :style="{display: 'flex', ...imageData.styles, position: 'relative'}"
       :id="imageData._id"
       :class="!isEditing ? showBorder ? 'inactive': '' : 'editing'"
       @click.stop="!previewing ? currentElement = {...imageData, treePath, index, pathToMe}:''"
       @mouseenter.stop="hovering = true"
       @mouseleave.stop="hovering = false">
    <editing-options v-if="$lget(currentElement, '_id', false) === $lget(imageData, '_id', true) && !previewing"
                     :type="imageData._type"
                     :parent="$lget(treePath, [0])" @jumpToParent="currentElement = $event"/>
    <single-image-upload v-show="isEditing && hovering"
                         :value="imageData"
                         add-label="Change Image"
                         @input="imageUpdate"
                         height="100%"
                         width="100%"/>

    <q-img v-show="!isEditing || isEditing && !hovering"
           :src="$lget(imageData, 'raw.file')"
           :class="!isEditing ? showBorder ? 'inactive': '' : 'editing'">
      <template v-slot:loading>
        <q-spinner-box/>
      </template>
    </q-img>
  </div>
</template>

<script>
  import SingleImageUpload from '../../images/SingleImageUpload';
  import {mapActions} from 'vuex';
  import editingOptions from 'components/editingOptions/editingOptions';


  export default {
    name: 'theimage',
    components: {
      SingleImageUpload,
      editingOptions,
    },
    props: {
      previewing: Boolean,
      element: Object,
      attrs: Object,
      showBorder: Boolean,
      treePath: Array,
      pathToMe: String,
      index: [String, Number],
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
        return this.$lget(this.currentElement, '_id', false) === this.$lget(this.element, '_id', true) && !this.previewing;
      },
    },
    data() {
      return {
        hovering: false,
        imageData: null,
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal) {
            this.imageData = newVal;
          }
        },
      },

    },
    methods: {
      ...mapActions('wpb-elements', {
        patchElement: 'patch',
      }),
      imageUpdate(val) {
        let elementCopy = Object.assign({}, this.element);
        console.log('Element Update', {val, elementCopy});
        this.patchElement([this.currentElement._id, {'raw': val.raw}, {query: {_type: this.currentElement._type}}])
          .then(res => {
            console.log('YaY it saved', res);
            this.$isLoading(false);
          })
          .catch(err => {
            console.log('REEEE SOMETHING IS WRONG', err);
          });
      },
    },
  };
</script>

<style scoped>

</style>
