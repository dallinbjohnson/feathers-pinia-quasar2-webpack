<template>
  <div :class="divClass" :style="divStyle">
    <q-select
      style="width: 100%"
      :label="label"
      :placeholder="placeholder ? placeholder : 'Search Or Add Tags...'"
      :options="useOptions"
      v-model="selected"
      :multiple="multiple"
      :rounded="rounded"
      :outlined="outlined"
      use-input
      @focus="!useOptions || !useOptions.length ? loadTags : ''"
      @input-value="val => searchInput = val"
      new-value-mode="add-unique"
      @keyup.enter="addTag"
      @input="emitInput"
      :behavior="behavior"
      :input-class="inputClass"
      clearable
      @clear="reloadTags(0)"
    >
      <template v-slot:prepend>
        <q-icon :name="prependIcon"></q-icon>
      </template>
      <template v-slot:append v-if="searchInput && adding">
        <q-btn size="sm" round push :color="color" @click="addTag" icon="mdi-plus"></q-btn>
      </template>
      <template v-slot:before-options v-if="searchInput && adding">
        <q-item clickable @click="addTag">
          <q-item-section>
            <div>+ Add <span class="text-italic text-weight-medium">{{searchInput}}</span></div>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:after-options v-if="total > limit">
        <q-item dense clickable @click="reloadTags(skip + 1)">
          <q-item-section>
            <q-item-label>
              <div class="row items-center">
                <div>Load More</div>
                <q-icon name="mdi-menu-down"></q-icon>
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section avatar v-if="loading">
            <q-spinner></q-spinner>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{loading ? 'Loading...' : 'No Tags - Add One'}}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:option="scope">
        <q-item clickable @click="scope.toggleOption(scope.opt)">
          <q-item-section avatar>
            <q-icon :color="isSelected(scope.opt) ? color : 'grey-5'" :name="tagIcon"></q-icon>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-xs text-mb-sm text-weight-light">{{scope.opt}}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:selected-item="scope">
        <q-chip :dark="dark" square :color="color" :icon="tagIcon" :label="scope.opt" removable @remove="scope.toggleOption(scope.opt)"></q-chip>
      </template>
    </q-select>
  </div>
</template>
<script>
  import axios from 'axios';
  const flattenArray = (arr) => {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flattenArray(toFlatten) : toFlatten);
    }, []);
  };
  export default {
    name: 'TagPicker',
    props: {
      divStyle: String,
      behavior: {
        type: String,
        default: 'menu'
      },
      label: String,
      placeholder: String,
      divClass: String,
      inputClass: String,
      multiple: {
        type: Boolean,
        default: true
      },
      dense: Boolean,
      outlined: Boolean,
      rounded: Boolean,
      adding: {
        type: Boolean
      },
      prependIcon: {
        type: String,
        default: 'mdi-tag'
      },
      dark: {
        type: Boolean,
        default: true
      },
      skipText: {
        type: Number,
        default: 4
      },
      minTagLength: {
        type: Number,
        default: 2
      },
      color: {
        type: String,
        default: 'primary'
      },
      tagIcon: {
        type: String,
        default: 'mdi-tag'
      },
      serviceIn: {
        type: String,
        required: true
        //service you are adding tags to
      },
      tagPath: {
        type: String,
        default: 'tags'
      },
      value: [String, Array]
    },
    mounted(){
      this.loadTags();
    },
    data(){
      return {
        loading: false,
        options: [],
        selected: null,
        searchInput: '',
        limit: 15,
        skip: 0,
        total: 0
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          this.selected = newVal;
        }
      },
      searchInput: {
        immediate: true,
        handler(newVal, oldVal){
          let newLength = newVal && newVal.length ? newVal.length : 0;
          let oldLength = oldVal && oldVal.length ? oldVal.length : 0;
          if(newLength && newLength > oldLength && newLength % this.skipText === 0){
            this.loadTags(newVal);
          }
        }
      }
    },
    computed: {
      useOptions(){
        if(this.options) {
          if (this.searchInput && this.searchInput.length) {
            return this.options.filter(a => {
              return a.toLowerCase().indexOf(this.searchInput.toLowerCase()) > -1;
            });
          } else return this.options;
        } else return [];
      },
      computeSkip() {
        let skip = typeof this.skip === 'number' ? this.skip : 0;
        let limit = typeof this.limit === 'number' ? this.limit : 0;
        return skip * limit;
      },
      axiosFeathers() {
        return axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
          headers: {
            ContentType: 'application/x-www-form-urlencoded',
            Accept: 'application/json',
            // Authorization: 'Bearer ' + this.$store.state.auth.accessToken
          }
        });
      }
    },
    methods: {
      isSelected(tag){
        if(Array.isArray(this.selected)) {
          if (this.multiple) return this.selected.indexOf(tag) > -1;
          else return this.selected === tag;
        } else return false;
      },
      emitInput(){
        this.searchInput = '';
        this.$emit('input', this.selected);
      },
      addTag(){
        if(this.adding) {
          let val = JSON.parse(JSON.stringify(this.searchInput));
          this.searchInput = '';
          if (val && val.length >= this.minTagLength) {
            if (this.multiple) {
              this.selected ? this.selected.push(val) : this.selected = [val];
            } else this.selected = val;
            this.emitInput();
          } else this.$q.notify({
            message: `Tags must be ${this.minTagLength} characters`,
            color: 'info',
            timeout: 4000
          });
        }
      },
      reloadTags(i){
        if(typeof i === 'number'){
          this.skip = i;
          this.loadTags(this.searchInput ? this.searchInput : false);
        }
      },
      async loadTags(text){
        this.loading = true;
        let query = {
          $limit: this.limit,
          $skip: this.computeSkip,
          $select: ['_id', 'tags']
        };
        if(text && typeof text === 'string' && text.length){
          query[this.tagPath] = { $in: text };
        } else {
          query[this.tagPath] = { $nin: [[], null] };
        }
        // query.$select = [this.tagPath];
        await this.$store.dispatch(`${this.serviceIn}/find`, {
          query: query
        })
          .then(res => {
            this.loading = false;
            this.options = Array.from(new Set(flattenArray(res.data.map(a => a.tags))));
          }).catch(err => {
            this.loading = false;
            console.log('error loading tags', err.message);
          });
      }
    }
  };
</script>
