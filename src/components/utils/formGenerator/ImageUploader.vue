<template>
  <div id="ImageSelect"
       v-bind="$attrs['div-attrs']"
       style="width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center">
    <file-pond :name="path"
               :files="myFiles"
               :server="{  process, load, remove/*, revert,  restore, fetch*/ }"
               @init="handleFilePondInit, $emit('init', $refs.pond)"
               @processfile="handleFilePondProcessfile"
               @removefile="handleFilePondRemovefile"
               @preparefile="handleFilePondPrepareFile"
               v-bind="$attrs['attrs']"/>

    <p v-bind="$attrs['label-attrs']" v-text="$lget($attrs, 'label-attrs.v-text')"></p>

  </div>
</template>

<script>
  // Import Doka
  import {create} from 'src/css/doka.esm.min.js';
  import 'src/css/doka.min.css';

  import vueFilePond from 'vue-filepond';
  // Import FilePond styles
  import 'filepond/dist/filepond.min.css';
  // Import FilePond plugins
  // Please note that you need to install these plugins separately
  // Import image preview plugin styles
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
  // Import the plugin styles
  import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';

  // Import image preview and file type validation plugins
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageResize from 'filepond-plugin-image-resize';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
  import FilePondPluginImageEdit from 'filepond-plugin-image-edit';

  // Create component
  const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
    FilePondPluginImageEdit
  );

  export default {
    name: 'ImageSelect',
    inheritAttrs: false,
    components: {
      FilePond
    },
    props: {
      value: {
        type: [Array, Object, String],
        required: false,
        default() {
          return [];
        }
      },
      path: {
        required: true
      },
      storage: {
        type: String,
        required: false,
        default: 'local-public'
      },
    },
    data() {
      return {
        uploadedFiles: [],
        newImages: [],
        apiCallOff: false,
      };
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal, oldVal) {
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            // remove attrs for local use.
            let apiCallOff = this.$lget(newVal, 'attrs.apiCallOff');
            if (apiCallOff) this.apiCallOff = apiCallOff || false;
            this.$omitDeep(newVal, ['attrs.apiCallOff']);


            // attrs defaults
            this.$lset(newVal, 'attrs.name', this.$lget(newVal, 'attrs.name', 'name'));
            this.$lset(newVal, 'attrs.ref', this.$lget(newVal, 'attrs.ref', 'pond'));
            this.$lset(newVal, 'attrs.label-idle', this.$lget(newVal, 'attrs.label-idle', '<b>Drag & Drop</b> your image or <b><span class="filepond--label-action"> Browse </span></b> to select'));
            this.$lset(newVal, 'attrs.accepted-file-types', this.$lget(newVal, 'attrs.accepted-file-types', 'image/png, image/jpeg, image/gif'));
            this.$lset(newVal, 'attrs.imagePreviewHeight', this.$lget(newVal, 'attrs.imagePreviewHeight', '170'));
            // this.$lset(newVal, 'attrs.imageCropAspectRatio', this.$lget(newVal, 'attrs.imageCropAspectRatio', '1:1'));
            // this.$lset(newVal, 'attrs.imageResizeTargetWidth', this.$lget(newVal, 'attrs.imageResizeTargetWidth', '600'));
            // this.$lset(newVal, 'attrs.imageResizeTargetHeight', this.$lget(newVal, 'attrs.imageResizeTargetHeight', '600'));
            this.$lset(newVal, 'attrs.stylePanelLayout', this.$lget(newVal, 'attrs.stylePanelLayout', 'compact circle'));
            this.$lset(newVal, 'attrs.styleLoadIndicatorPosition', this.$lget(newVal, 'attrs.styleLoadIndicatorPosition', 'center bottom'));
            this.$lset(newVal, 'attrs.styleButtonRemoveItemPosition', this.$lget(newVal, 'attrs.styleButtonRemoveItemPosition', 'left bottom'));
            this.$lset(newVal, 'attrs.styleProgressIndicatorPosition', this.$lget(newVal, 'attrs.styleProgressIndicatorPosition', 'right bottom'));
            this.$lset(newVal, 'attrs.styleButtonProcessItemPosition', this.$lget(newVal, 'attrs.styleButtonProcessItemPosition', 'right bottom'));
            this.$lset(newVal, 'attrs.allow-multiple', this.$lget(newVal, 'attrs.allow-multiple', false));
            this.$lset(newVal, 'attrs.allow-reorder', this.$lget(newVal, 'attrs.allow-reorder', true));
            this.$lset(newVal, 'attrs.allowImagePreview', this.$lget(newVal, 'attrs.allowImagePreview', true));
            this.$lset(newVal, 'attrs.style', this.$lget(newVal, 'attrs.style', 'width: 200px;'));
            // this.$lset(newVal, 'attrs.imageTransformVariantsIncludeDefault', this.$lget(newVal, 'attrs.imageTransformVariantsIncludeDefault', false));
            // this.$lset(newVal, 'attrs.imageTransformVariantsIncludeOriginal', this.$lget(newVal, 'attrs.imageTransformVariantsIncludeOriginal', true));
            // this.$lset(newVal, 'attrs.imageTransformVariantsOriginalName', this.$lget(newVal, 'attrs.imageTransformVariantsOriginalName', 'raw'));
            this.$lset(newVal, 'attrs.instantUpload', this.$lget(newVal, 'attrs.instantUpload', true));
            this.$lset(newVal, 'attrs.dropValidation', this.$lget(newVal, 'attrs.dropValidation', true));
            // this.$lset(newVal, 'attrs.max-files', this.$lget(newVal, 'attrs.max-files', 5));
            this.$lset(newVal, 'attrs.imageEditEditor', this.$lget(newVal, 'attrs.imageEditEditor', create({
              cropMask: (root, setInnerHTML) => {
                // https://pqina.nl/doka/docs/patterns/api/doka-instance/#setting-the-crop-mask
                setInnerHTML(root, `
                  <mask id="my-mask">
                      <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                      <circle cx="50%" cy="50%" r="50%" fill="black"/>
                  </mask>
                  <rect fill="rgba(255,255,255,.3125)" x="0" y="0" width="100%" height="100%" mask="url(#my-mask)"/>
                  <circle cx="50%" cy="50%" r="50%" fill="transparent" stroke-width="1" stroke="#fff"/>
              `);
              },
              // doka options here
              cropAspectRatioOptions: [
                {
                  label: 'Free',
                  value: null
                },
                {
                  label: 'Portrait',
                  value: 1.25
                },
                {
                  label: 'Square',
                  value: 1
                },
                {
                  label: 'Landscape',
                  value: .75
                }
              ]
            })));
            // this.$lset(newVal, 'attrs.imageTransformVariants', this.$lget(newVal, 'attrs.imageTransformVariants', {
            //   'medium': transforms => {
            //     transforms.resize.size.width = 384;
            //     transforms.resize.size.height = 384;
            //     return transforms;
            //   },
            //   'small': transforms => {
            //     transforms.resize.size.width = 128;
            //     transforms.resize.size.height = 128;
            //     return transforms;
            //   },
            //   'favicon': transforms => {
            //     transforms.resize.size.width = 50;
            //     transforms.resize.size.height = 50;
            //     return transforms;
            //   }
            // }));

            // div-attrs defaults
            this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12'));

            // label-attrs defaults
            this.$lset(newVal, 'label-attrs.style', this.$lget(newVal, 'label-attrs.style', 'font-size: 11px; margin-top: -5px'));
            this.$lset(newVal, 'label-attrs.v-text', this.$lget(newVal, 'label-attrs.v-text', 'Upload Image'));
          }
        }
      },
    },
    computed: {
      axiosFeathers() {
        return this.$axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
          headers: {
            ContentType: 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            Authorization: 'Bearer ' + this.$store.state.auth.accessToken
          }
        });
      },
      myFiles() {
        let images = [];
        const originalName = this.$lget(this.$attrs, 'attrs.imageTransformVariantsOriginalName', 'raw');
        if (typeof this.value === 'string') {
          images.push({
            source: this.value,
            options: {
              type: 'local'
            }
          });
        } else if (Array.isArray(this.value)) {
          this.value.forEach(value => {
            let source = this.$lget(value, `${originalName}.file`, this.$lget(value, 'file', this.$lget(value, originalName, null)));
            if (source) {
              images.push({
                source: source,
                options: {
                  type: 'local'
                }
              });
            }
          });
        } else if (typeof this.value === 'object') {
          let source = this.$lget(this.value, `${originalName}.file`, this.$lget(this.value, 'file', this.$lget(this.value, originalName, null)));
          if (source) {
            images.push({
              source: source,
              options: {
                type: 'local'
              }
            });
          }
        }
        return images;
      }
    },
    methods: {
      // eslint-disable-next-line no-unused-vars
      process(fieldName, file, metadata, load, error, progress, abort, transfer, options) {
        console.log('file', file);
        if (!Array.isArray(file)) {
          file = [{file: file, name: this.$lget(this.$attrs, 'attrs.imageTransformVariantsOriginalName', 'raw')}];
        }
        if (this.apiCallOff) {
          file.map(f => {
            let avatar_key = f.name;
            this.newImages.push({[avatar_key]: f.file});
          });
          this.$emit('input', this.newImages);
          load();
        } else {
          Promise.all(file.map(f => {
            let avatar_key = f.name;
            let payload = new FormData();
            payload.append('name', f.file.name);
            payload.append('storage', this.storage);
            // payload.append('file', f.file);
            payload.append('file', new File([f.file], f.file.name));
            let info = {
              name: f.file.name,
              size: f.file.size,
              type: f.file.type,
              lastModifiedDate: f.file.lastModifiedDate
            };
            payload.append('info', JSON.stringify(info));
            // console.log('payload', payload);
            return this.axiosFeathers.post('/file-uploader', payload)
              .then(res => {
                console.log('image upload success:', res);
                //TODO: we need to be able to group variants with the raw
                this.newImages.push({[avatar_key]: res.data});
                return {[avatar_key]: res.data};
              })
              .catch(err => {
                console.error('image upload error', err);
              });
          }))
            .then((res) => {
              console.log('promise.all res', res);
              console.log('newImages', this.newImages);
              this.$emit('input', this.newImages);
              load();
            })
            .catch(err => {
              console.log('promise.all error', err);
            });
        }
      },
      // eslint-disable-next-line no-unused-vars
      load(source, load, error, progress, abort, headers) {
        const myRequest = new Request(source);
        fetch(myRequest)
          .then(function (response) {
            console.log('load response', response);
            response.blob()
              .then(function (myBlob) {
                load(myBlob);
              })
              .catch(function (error) {
                // eslint-disable-next-line no-console
                console.error('Load Error: ', error);
                load();
              });
          })
          .catch(function (error) {
            // eslint-disable-next-line no-console
            console.error('Load Error: ', error);
            load();
          });
      },
      // eslint-disable-next-line no-unused-vars
      async remove(source, load, error) {
        console.log('remove source:', source);
        const originalName = this.$lget(this.$attrs, 'attrs.imageTransformVariantsOriginalName', 'raw');
        let image = this.$lfind(this.newImages, {[originalName]: {file: source}});
        console.log('remove newImages:', this.newImages);
        console.log('remove image:', image);
        if (source && image === undefined) {
          try {
            let res = await this.axiosFeathers.get(`/file-uploader?file=${source}`);
            let images = this.$lget(res, 'data.data', this.$lget(res, 'data', res));
            let f_image = this.$lfind(images, {file: source});

            image = {[originalName]: {file: f_image.file, _id: f_image._id}};
          } catch (e) {
            console.error('image remove get error:', e);
          }
        }
        if (image && !this.apiCallOff) {
          this.axiosFeathers.delete(`/file-uploader/${image[originalName]._id}`)
            .then(res => {
              console.log('image remove success:', res);
              this.$emit('remove', res.data || res);
            })
            .catch(err => {
              console.error('image remove error:', err);
            });
        } else {
          this.$emit('remove', source);
        }
        load();
      },
      // // eslint-disable-next-line no-unused-vars
      // async revert(uniqueFileId, load, error) {
      //   console.log('revert uniqueFileId:', uniqueFileId);
      //   load();
      // },
      // FilePond
      handleFilePondInit: function () {
        // eslint-disable-next-line no-console
        // console.log('FilePond has initialized');
        // FilePond instance methods are available on `this.$refs.pond`
        this.$refs.pond.getFiles();
      },
      // eslint-disable-next-line no-unused-vars
      handleFilePondProcessfile: function (error, file) {
        // eslint-disable-next-line no-console
        console.log('FilePond succesfully processed file:', file.filename);
      },
      handleFilePondRemovefile: function (error, file) {
        // eslint-disable-next-line no-console
        // console.log("FilePond deleted file " + file.filename);
        // let index = this.uploadedFiles.indexOf(file.file);
        let index = this.uploadedFiles.indexOf(this.$lfind(this.uploadedFiles, {file: file.file}));
        if (index > -1) {
          this.uploadedFiles.splice(index, 1);
        }
      },
      handleFilePondPrepareFile: function (file, output) {
        // eslint-disable-next-line no-console
        // console.log("FilePond Prepare file " + file.filename);
        // eslint-disable-next-line no-console
        console.log('FilePond Prepare file:', output);
        if (!Array.isArray(output)) {
          output = [{file: output, name: this.$lget(this.$attrs, 'attrs.imageTransformVariantsOriginalName', 'raw')}];
        }
        output.forEach(file => {
          this.uploadedFiles.push(file);
        });
      }
    }
  };
</script>

<style scoped lang="scss">
</style>
