<template>
  <q-card :style="{height: height, width: width}">
    <q-img style="height: 100%; width: 100%" :src="getAvatar(value, null, 'raw')">
      <div style="height: 100%; width: 100%" class="flex flex-center">
        <q-slide-transition>
          <template v-if="adding">
            <image-uploader path="raw" storage="s3" :value="{raw: value.raw}" :attrs="imageUploadAttrs" @input="handleImage"/>
          </template>
        </q-slide-transition>
        <template v-if="adding">
          <q-btn label="cancel" flat size="xs" color="white" @click.stop="adding = false"/>
        </template>
        <q-slide-transition>
          <template v-if="!adding">
            <q-btn :label="addLabel" flat icon="mdi-image" color="white" @click.stop="adding = true"/>
          </template>
        </q-slide-transition>
      </div>
    </q-img>
  </q-card>
</template>
<script>

  import ImageUploader from '../utils/formGenerator/ImageUploader';
  export default {
    components: { ImageUploader },
    props: {
      addLabel: {
        type: String,
        default: 'Add Logo'
      },
      height: {
        type: String,
        default: '100%'
      },
      width: {
        type: String,
        default: '100%'
      },
      value: Object
    },
    mounted(){
      if(this.getAvatar(this.value, null, 'raw')){
        this.adding = false;
      }
    },
    data(){
      return {
        imgResult: null,
        adding: false,
        fields: [
          {
            fieldType: 'ImageSelect',
            path: 'avatar',
            storage: 's3',
            'label-attrs': {
              'v-text': 'Host Avatar',
              'style': { 'font-size': '20px' }
            }
          },
        ],
        imageUploadAttrs: {
          imageTransformVariantsOriginalName: 'raw',
          'accepted-file-types': 'image/png, image/jpeg, image/gif, image/svg'
        }
      };
    },
    methods: {
      removeImage(){
        this.imgResult = null;
        this.$emit('input', null);
      },
      handleImage(val){
        this.imgResult = val;
        console.log('handling image', val);
        let payload = val;
        if(Array.isArray(val)) payload = val[0];
        console.log('emitting input', payload);
        this.$emit('input', payload);
        this.adding = false;
      }
    }
  };
</script>
