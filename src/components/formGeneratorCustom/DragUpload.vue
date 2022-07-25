<template>
  <div @drop.prevent="addFile" @dragover.prevent @click="$refs.filePick.pickFiles()"
       :style="'max-width: 100%; ' + $lget($attrs, 'div-attrs.style', '')">
    <div :class="`drop_zone bg-${$lget($attrs, 'color', 'primary')}`">
      <div class="drag_cover text-primary bg-background">
        <div class="row justify-center" style="width: 100%">
          <q-icon size="40px" name="mdi-cloud-upload"/>
        </div>
        <div class="row justify-center text-center" style="width: 100%">
          <div class="text-xs text-mb-xs text-weight-light">{{ $lget($attrs, 'attrs.label', 'Drop it like its hot') }}
          </div>
        </div>
        <q-file
          ref="filePick"
          dense prepend-icon="mdi-video-plus" :multiple="multiple" :value="files" bgcolor="transparent"
          placeholder="Choose File" @input="setPending"
        ></q-file>
        <!--        <q-uploader-->
        <!--          @start="handleStart"-->
        <!--          @uploading="handleUploading"-->
        <!--          @finish="handleFinish"-->
        <!--          @uploaded="handleUploaded"-->
        <!--          @added="handleAdded"-->
        <!--          @rejected="handleRejected"-->
        <!--          @failed="handleFailed"-->
        <!--          :form-fields="formFields"-->
        <!--          :url="uploadUrl"-->
        <!--          prepend-icon="mdi-video-plus"-->
        <!--          :multiple="multiple"-->
        <!--          class="bg-transparent"-->
        <!--          label="Choose File"></q-uploader>-->
        <!--      <button :disabled="uploadDisabled" @click="upload">Upload</button>-->
      </div>
    </div>

    <q-dialog v-model="filePending" persistent>
      <q-card class="q-pa-md" style="max-width: 100vw">
        <div class="text-sm text-mb-lg text-weight-medium">Confirm and name
          {{ files && files.length ? files.length : '' }} file {{ files && files.length === 1 ? '' : 's' }}
        </div>
        <div :class="`row ${ files && files.length === 1 ? 'justify-center' : ''} q-px-md no-wrap`" style="width: 100%; overflow-x: scroll">
          <div class="q-mx-xs" v-for="(file, i) in files" :key="`file-${i}`">
            <q-input clearable @clear="nameInputs[i] = ''" outlined class="q-mb-sm" dense label="Name File" hide-bottom-space v-model="nameInputs[i].name"></q-input>
            <div class="row justify-center">
              <div style="border-radius: 2px; box-shadow: 0 0 4px rgba(0,0,0,.3); height: 130px; width: 100px">
                <iframe :src="getPreviewURL(file)" height="130px" width="100px" frameborder="0"></iframe>
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-end">
          <q-btn class="q-mx-xs" size="sm" label="cancel" flat color="negative" @click="clearAll"/>
          <q-btn flat icon="mdi-upload" class="q-mx-xs" size="sm" label="upload" push color="positive" @click="handleInput"/>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    name: 'DragUpload',
    props: {
      value: [String, Array, Object],
      multiple: {
        type: Boolean,
        default: true
      },
      // 'image', 'video', 'doc'
      fileType: {
        type: String,
        default: 'video'
      },
      returnFile: Boolean,
      uploadFile: {
        type: Boolean,
        default: true
      },
      storage: {
        type: String,
        default: 's3'
      }

    },
    data() {
      return {
        newImage: {},
        files: null,
        nameInput: '',
        filePending: false,
        nameInputs: []
      };
    },
    watch: {
      value: {
        handler(newVal) {
          if (newVal && typeof newVal !== 'undefined') {
            if(Array.isArray(newVal)) {
              this.files = newVal;
            } else this.files = [newVal];
          }
        }
      }
    },
    computed: {
      uploadUrl() {
        return process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030';
      },
      deepColor() {
        return this.$store.getters.deepColor;
      },
      uploadDisabled() {
        return this.files.length === 0;
      }
    },
    methods: {
      ...mapActions('file-uploader', {
        uploadFiles: 'create'
      }),
      getPreviewURL(file) {
        return window.URL.createObjectURL(file);
      },
      clearAll() {
        this.filePending = false;
        this.files = [];
      },
      handleStart() {
        console.log('started uploading');
      },
      handleUploading(info) {
        console.log('files uploading', info.files, info.xhr);
      },
      handleFinish() {
        console.log('finished uploading');
      },
      handleUploaded(info) {
        console.log('files uploaded', info.files, info.xhr);
      },
      handleAdded(files) {
        console.log('files added', files);
      },
      handleRejected(rejected) {
        console.log('files rejected', rejected);
      },
      handleFailed(info) {
        console.log('upload failed', info.files, info.xhr);
      },
      formFields(files) {
        console.log('files', files);
        if (files) {
          files.forEach(a => {
            a.storage = this.storage;
          });
        }
        return files;
      },
      addFile(e) {
        let droppedFiles = e.dataTransfer.files;
        if (!droppedFiles) return;
        // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
        ([...droppedFiles]).forEach(f => {
          this.files.push(f);
        });
        setTimeout(() => {
          console.log('emitting files', this.files);
        // this.$emit('input', this.files)
        }, 200);
      },
      setPending(files) {
        files.forEach(file => {
          this.nameInputs ? this.nameInputs.push({name: file.name}) : this.nameInputs = [{name: file.name}];
        });
        this.files = files;
        this.filePending = true;
      },
      handleInput() {
        this.filePending = false;
        console.log('drag upload >> handling input', this.files);
        if (!this.uploadFile) {
          let pass = this.files && typeof this.files !== 'undefined';
          if (pass) this.$emit('input', this.files);
        } else {
          this.upload();
        }
      },
      removeFile(file) {
        if (this.multiple) {
          this.files = this.files.filter(f => {
            return f != file;
          });
        } else this.files = null;
      },
      setImage(avatar_key, data) {
        this.newImage[avatar_key] = data;
        this.$nextTick(() => {
          this.$emit('input', this.newImage);
        });
      },
      upload() {
        let formData = new FormData();
        this.files.forEach((f, i) => {
          let name = this.$lget(this.nameInputs, [i, 'name'], f.name);
          console.log('file', f);
          formData.append('name', name);
          formData.append('storage', this.storage);
          formData.append('file', f);
          let info = {
            name: name,
            size: f.size,
            type: f.type,
            lastModifiedDate: f.lastModifiedDate
          };
          formData.append('info', JSON.stringify(info));
          let headers = {
            'content-type': 'application/x-www-form-urlencoded',
          };
          let token = this.$lget(this.$store, 'state.auth.accessToken');
          if(token) headers.Authorization = 'Bearer ' + token;
          else headers['x-api-key'] = this.$lget(this.$attrs, 'api-key');
          this.$axios({
            method: 'post',
            url: `${this.uploadUrl}/file-uploader`,
            data: formData,
            headers: headers
          })
            .then(res => {
              console.log('got res', res);
              let val = res.data;
              if(this.multiple && !Array.isArray(val)) val = [res.data];
              console.log('emit input', val);
              this.$emit('input', val);
            })
            .catch(err => {
              console.log('error uploading file', err);
              this.$errNotify('Error uploading file ' + err.message);
            });
        // fetch('https://httpbin.org/post', {
        //   method: 'POST',
        //   body: formData
        // })
        //   .then(res => res.json())
        //   .then(res => {
        //     console.log('done uploading', res);
        //   })
        //   .catch(e => {
        //     console.error(JSON.stringify(e.message));
        //   });
        });
      }
    }
  };
</script>

<style scoped>
  .drag_cover {
    /*position: absolute;*/
    border-radius: 5px;
    height: 100%;
    width: 100%;
    padding: 5px;
    /*opacity: .3;*/
  }

  .drop_zone {
    /*height: 60px;*/
    padding: 5px;
    width: 420px;
    max-width: 100%;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: 10px;
    /*box-shadow: 0px 0px 0px 4px #757575;*/
  }
</style>
