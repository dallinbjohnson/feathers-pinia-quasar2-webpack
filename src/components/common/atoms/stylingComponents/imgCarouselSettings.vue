<template>
  <div class="q-pa-md column" >
    <div class="column q-my-sm">
      <div class="row">

      <p style="margin: 0">Autoplay Timer (ms): </p>
      <input
        :disabled="autoPlaySwitch"
        class="inputBackground"
        type="number"
        :value="$lget(elementData, 'attrs.autoplay', '')"
        @input="debounce({path: 'attrs.autoplay', value: $event.target.value})"
      />
      <div class="col-12 col-md-6">
        <q-toggle
          color="green"
          label="Autoplay?"
          left-label
          :value="$lget(elementData, 'attrs.autoplaySwitch', false)"
          @input="$emit('stylesUpdate', {path: 'attrs.autoplaySwitch', value: $event})"
        />
      </div>
      </div>
    </div>
    <div class="column q-my-sm">
      <p style="margin: 0">Transition Previous: </p>
      <select
        class="inputBackground"
        style="font-size: 14px; border: 0; outline: 0; height: 25px"
        :value="$lget(elementData, 'attrs.transitionPrev', 'slide-left')"
        @change="debounce({path: 'attrs.transitionPrev', value: $event.target.value})"
      >
        <q-tooltip>
          Select Unit
        </q-tooltip>
        <option v-for="unit in transitions" :key="unit" :value="unit">{{ unit }}</option>
      </select>
    </div>
    <div class="column q-my-sm">
      <p style="margin: 0">Transition Next: </p>
      <select
        class="inputBackground"
        style="font-size: 14px; border: 0; outline: 0; height: 25px"
        :value="$lget(elementData, 'attrs.transitionNext', 'slide-left')"
        @change="debounce({path: 'attrs.transitionNext', value: $event.target.value})"
      >
        <q-tooltip>
          Select Unit
        </q-tooltip>
        <option v-for="unit in transitions" :key="unit" :value="unit">{{ unit }}</option>
      </select>
    </div>
    <div>
      <p style="margin: 0">Configure Carousel</p>
      <div class="row">
        <div class="col-12 col-md-6">
          <q-toggle
            color="green"
            label="Swipeable"
            left-label
            :value="$lget(elementData, 'attrs.swipeable')"
            @input="$emit('stylesUpdate', {path: 'attrs.swipeable', value: $event})"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-toggle
            color="green"
            label="Animated"
            left-label
            :value="$lget(elementData, 'attrs.animated', false)"
            @input="$emit('stylesUpdate', {path: 'attrs.animated', value: $event})"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-toggle
            color="green"
            label="Fullscreen"
            left-label
            :value="$lget(elementData, 'attrs.fullscreen', false)"
            @input="$emit('stylesUpdate', {path: 'attrs.fullscreen', value: $event})"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-toggle
            color="green"
            label="Thumbnails"
            left-label
            :value="$lget(elementData, 'attrs.thumbnails', false)"
            @input="$emit('stylesUpdate', {path: 'attrs.thumbnails', value: $event})"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-toggle
            color="green"
            label="Navigation"
            left-label
            :value="$lget(elementData, 'attrs.navigation', false)"
            @input="$emit('stylesUpdate', {path: 'attrs.navigation', value: $event})"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-toggle
            color="green"
            label="Infinite"
            left-label
            :value="$lget(elementData, 'attrs.infinite', false)"
            @input="$emit('stylesUpdate', {path: 'attrs.infinite', value: $event})"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-toggle
            color="green"
            label="Arrows"
            left-label
            :value="$lget(elementData, 'attrs.arrows', false)"
            @input="$emit('stylesUpdate', {path: 'attrs.arrows', value: $event})"
          />
        </div>
      </div>
    </div>
    <div>
      <div class="row flex items-center justify-between">
        <p style="margin: 0; font-size: 17px">Add Images</p>
        <q-btn icon="add" @click="addDialog = !addDialog" round flat />
      </div>
      <div>
        <div
          class="q-my-sm q-pa-sm row items-center justify-between"
          style="border: 1px solid #F2F2F2 "
          v-for="(slide, i) in slides"
          :key="i">
          <div>
            <div>
              <p style="margin: 0">Image Link: </p>
              <input
                disabled
                class="inputBackground"
                :value="slide.src"
              />
            </div>
            <div>
              <p style="margin: 0">Image Name: </p>
              <input
                disabled
                class="inputBackground"
                :value="slide.name"
              />
            </div>
          </div>
          <div>
            <q-btn flat icon="edit" @click="setEditSlide(slide)" round />
            <q-btn flat color="red" icon="delete" @click="setDelete(slide)" round />
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="deleteDialog" >
      <q-card>
        <q-card-section>
          <p>Are you sure you want to remove this image?</p>
        </q-card-section>
        <q-card-section>
          <q-btn label="Cancel" @click="deleteDialog != deleteDialog" />
          <q-btn label="Delete" color="red" @click="deleteSlide" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addDialog">
      <q-card>
        <q-card-section>
          <p>Upload Image </p>
          <single-image-upload style="height: 250px; width: 250px"
                               :value="{raw}"
                               add-label="Upload Image"
                               @input="setImage('uploader', $event)"
          />
        </q-card-section>
        <q-card-section>
          <p>------- Or -------</p>
        </q-card-section>
        <q-card-section>
          <div>
            <p style="margin: 0">Link to image: </p>
            <input
              style="width: 100%"
              class="inputBackground"
              v-model="form.src"
            />
          </div>
          <div>
            <p style="margin: 0">Name: </p>
            <input
              style="width: 100%"
              class="inputBackground"
              v-model="form.name"
            />
          </div>
        </q-card-section>
        <q-card-section style="width: 100%; display: flex; justify-content: flex-end">
          <q-btn class="q-mx-md" label="Cancel" flat @click="addDialog = !addDialog" />
          <q-btn label="Add" color="green" @click="addSlide" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="editingDialog" >
      <q-card>
        <q-card-section>
          <p>Upload Image </p>
          <single-image-upload style="height: 250px; width: 250px"
                               :value="{raw}"
                               add-label="Upload Image"
                               @input="editImage('uploader', $event)"
          />
        </q-card-section>
        <q-card-section>
          <p>------- Or -------</p>
        </q-card-section>
        <q-card-section>
          <div>
            <p style="margin: 0">Link to image: </p>
            <input
              style="width: 100%"
              class="inputBackground"
              v-model="editingSlide.src"
            />
          </div>
          <div>
            <p style="margin: 0">Name: </p>
            <input
              style="width: 100%"
              class="inputBackground"
              v-model="editingSlide.name"
            />
          </div>
        </q-card-section>
        <q-card-section style="width: 100%; display: flex; justify-content: flex-end">
          <q-btn class="q-mx-md" label="Cancel" flat @click="addDialog = !addDialog" />
          <q-btn label="Add" color="green" @click="editSlide" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import SingleImageUpload from 'components/images/SingleImageUpload';
  import { mapActions } from 'vuex';
  export default {
    name: 'buttonEditor',
    inheritAttrs: false,
    components: {
      SingleImageUpload
    },
    props: {
      element: Object
    },
    computed: {
      slides() {
        return this.elementData.slides;
      },
      autoPlaySwitch() {
        return this.$lget(this.elementData, 'attrs.autoplaySwitch', false) !== true;
      }
    },
    data() {
      return {
        timer: new this.$timer(),
        flat: this.$lget(this.elementData, 'flat', false),
        transitions: ['slide-right', 'slide-left', 'slide-up', 'slide-down', 'fade', 'scale', 'rotate', 'flip-right', 'flip-left', 'flip-up', 'flip-down', 'jump-right', 'jump-left', 'jump-up', 'jump-down'],
        elementData: {},
        elementDelete: {},
        deleteDialog: false,
        addDialog: false,
        editingDialog: false,
        editingSlide: {},
        form: {
          src: '',
          name: ''
        },
        raw: {
          _id: null,
          file: null
        }
      };
    },
    watch: {
      element: {
        immediate: true,
        deep: true,
        handler(newVal) {
          this.elementData = this.$lcloneDeep(newVal);
        }
      }
    },
    methods: {
      ...mapActions('wpb-elements', {
        patchElement: 'patch'
      }),
      debounce(val) {
        let emit = () => {
          this.$emit('stylesUpdate', {path: val.path, value: val.value});
        };
        this.timer.start({cb: emit, iv: 2000});
        console.log('emitting......');
      },
      setEditSlide(val) {
        this.editingSlide = val;
        this.raw.file = val.src;
        this.editingDialog = true;
      },
      editSlide() {
        let index = this.slides.indexOf(this.editingSlide._id);
        console.log('index of item', index);
        let arr = [];
        this.elementData.slides.map( res => {
          if (res._id !== this.editingSlide._id) {
            arr.push(res);
            console.log('this is the arr', arr);
            return arr;
          }
        });
        arr.splice(index, 0, this.editingSlide);
        this.patchElement([this.elementData._id, { slides: arr}, {query: {_type: this.elementData._type}} ])
          .then( res => {
            this.editingSlide = {};
            this.editingDialog = false;
            this.raw = {
              file: null,
              _id: null
            };
            console.log('edited', res);
            this.$q.notify({
              type: 'positive',
              message: 'Edited Slide'
            });
          })
          .catch( err => {
            this.$q.notify({
              type: 'negative',
              message: 'Error Editing Slide'
            });
            console.log('erroring', err);
          });
      },
      addSlide() {
        this.elementData.slides.push(this.form);
        this.patchElement([this.elementData._id, this.elementData,   {query: {_type: this.elementData._type}}])
          .then( () => {
            this.form.src = '';
            this.form.name = '';
            this.addDialog = false;
            this.$q.notify({
              type: 'positive',
              message: 'Added Slide'
            });
          })
          .catch( err => {
            this.$q.notify({
              type: 'negative',
              message: 'Error Adding Slide'
            });
            console.log('erroring', err);
          });
      },
      setImage(name, res) {
        this.form.src = res.raw.file;
      },
      editImage(name, res) {
        this.editingSlide.src = res.raw.file;
      },
      setDelete(val) {
        this.elementDelete = val;
        this.deleteDialog = true;
      },
      deleteSlide() {
        let arr = [];
        this.elementData.slides.map( res => {
          if (res._id !== this.elementDelete._id) {
            arr.push(res);
            console.log('this is the arr', arr);
            return arr;
          }
        });
        this.patchElement([this.elementData._id, { slides: arr}, {query: {_type: this.elementData._type}} ])
          .then( res => {
            this.elementDelete = {};
            this.deleteDialog = false;
            console.log('remvoed', res);
            this.$q.notify({
              type: 'positive',
              message: 'Removed Slide'
            });
          })
          .catch( err => {
            this.$q.notify({
              type: 'negative',
              message: 'Error Removing Slide'
            });
            console.log('erroring', err);
          });
      }
    }
  };
</script>

<style scoped>
.inputBackground {
  background-color: #f2f2f2;
  border: none;
}
</style>
