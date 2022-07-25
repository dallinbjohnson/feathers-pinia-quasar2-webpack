<template>
  <q-card>
    <q-card-section style="width: 100%; display: flex; justify-content: center">
      <p style="margin: 0; font-size: 24px">Select a Image or Upload Your Own</p>
    </q-card-section>
    <q-card-section>
      <q-tabs v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator>
        <q-tab name="select" label="Select"/>
        <q-tab name="upload" label="Upload"/>
      </q-tabs>

      <q-separator/>

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="select">
          <div class="text-h6">Select</div>
          <div class="row">
            <div class="q-pa-sm col-12 col-md-6 imagePopUps" style="display: flex; justify-content: center"
                 v-for="(image, i) in images" :key="i">
              <img width="150px" height="100px" :src="image.url" @click="setImage('select', image.url)"/>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="upload">
          <div class="text-h6">Upload</div>
          <single-image-upload style="height: 250px; width: 100%"
                               :value="{raw}"
                               add-label="Upload Image"
                               @input="setImage('uploader', $event)"
                               height="100%"
                               width="100%"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-card-section>
    <q-dialog v-model="confirmPopUp">
      <q-card>
        <q-card-section>
          <p>Are You Sure You Want To Use This Image?</p>
        </q-card-section>
        <q-card-section class="flex justify-end">
          <q-btn label="Cancel" @click="confirmPopUp = !confirmPopUp"/>
          <q-btn class="q-mx-md" label="Yes" color="green" @click="addImage"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import SingleImageUpload from '../../../images/SingleImageUpload';

  export default {
    name: 'imagePicker',
    components: {
      SingleImageUpload,
    },
    props: {
      element: Object,
    },
    data() {
      return {
        tab: 'select',
        selectedImage: '',
        confirmPopUp: false,
        uploadedImage: {},
        raw: {
          _id: null,
          file: null,
        },
        images: [
          {
            url: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/gathur/pexels-christel-jensen-628776.jpg',
          },
          {
            url: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/gathur/pexels-ella-olsson-3026805.jpg',
          },
          {
            url: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/gathur/pexels-kaboompics-com-5938.jpg',
          },
          {
            url: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/gathur/pexels-kasumi-loffler-3535383.jpg',
          },
          {
            url: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/gathur/pexels-spencer-davis-4393021.jpg',
          },
          {
            url: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/gathur/pexels-lisa-fotios-1351238.jpg',
          },
        ],
      };
    },
    methods: {
      setImage(name, val) {
        if (name === 'select') {
          this.raw.file = val;
          console.log('setting image.... ', this.selectedImage);
          this.confirmPopUp = !this.confirmPopUp;
        } else if (name === 'uploader') {
          console.log('uploader response', val);
          this.raw.file = val.raw.file;
          this.raw._id = val.raw._id;
          this.confirmPopUp = !this.confirmPopUp;
        }
      },
      addImage() {
        let payload = {
          baseElement: false,
          template: false,
          devTemplate: false,
          isPublic: false,
          _type: 'image',
          raw: this.raw,
          styles: {
            order: 0,
            width: '400px',
            height: 'auto',
          },
        };
        console.log('imagePicker >> methods >> addImage >> payload', payload);
        this.$emit('addImage', payload);
        this.selectedImage = '';
        this.confirmPopUp = false;
      },
    },
  };
</script>

<style scoped>
  .imagePopUps:hover {
    cursor: pointer;
  }
</style>
