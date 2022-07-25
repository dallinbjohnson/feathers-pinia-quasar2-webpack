import {models} from '@feathersjs/vuex';
import { vCheck } from 'src/mixins/ir-validate';

export default function(
  {
    name = 'form',
    service,
    servicePath,
    formFn,
    valuePath = 'value',
    formPath = 'form',
    saveEvent = 'input',
    successMessage = 'Saved!',
    errMessage = 'Error saving - ',
    vCheckForm = 'form',
    displayError = true,
    errNotify = true,
    addValueFn,
    validate,
    resetFormOnSave,
    paramsPath,
    savePath = 'save',
    validWatch,
    afterFn,
    log
  } = {}){

  let mixin = {
    mixins: [vCheck],
    data() {
      return {
        [`${formPath}`]: {},
        updateValidOnInput: validWatch
      };
    },
    watch: {
      [`${valuePath}`]: {
        immediate: true,
        handler(newVal){
          this.setForm(newVal);
          if(addValueFn){
            this[`${addValueFn}`]();
          }
        }
      }
    },
    computed: {
      vCheckForm(){
        return this.form;
      },
      formMixinModelName(){
        return models.api.byServicePath[this.formMixinService].modelName;
      },
      formMixinService(){
        if(servicePath){
          return this[`${servicePath}`] || service;
        } else return service;
      }
    },
    methods: {
      [`${name}SuccessNotify`](message) {
        this.$q.notify({ message: message, color: 'positive', timeout: 4000 });
      },
      [`${name}ErrNotify`](message) {
        this.$q.notify({
          message: message,
          color: 'negative',
          position: 'top',
          icon: 'mdi-alert-circle',
          timeout: 30000,
          actions: [{ icon: 'mdi-close', color: 'white' }],
        });
      },
      setForm(val = {}){
        const modelFn = val => {
          return new models.api[this.formMixinModelName](val).clone();
        };
        let fn = formFn ? formFn : modelFn;
        this[`${formPath}`] = fn(val);
      },
      [`${savePath}`](){
        const save = () => {
          let params = this[`${paramsPath}`] || {};
          if(log) console.log('saving form', this.formMixinService, this[`${formPath}`], params);
          if(this.formMixinService) {
            this.$isLoading(true);
            return this[`${formPath}`].save(params)
              .then(res => {
                this.$isLoading(false);
                this.$emit(saveEvent, res);
                this[`${name}SuccessNotify`](successMessage);
                if(log) console.log('saved form', res);
                if(afterFn) this[`${afterFn}`](res);
                if (resetFormOnSave) this.setForm();
                return res.clone();
              })
              .catch(err => {
                this.$isLoading(false);
                if(errNotify) this[`${name}ErrNotify`](errMessage + displayError ? err.message : '');
                console.error(errMessage + displayError ? err.message : '');
                return undefined;
              });
          } else this.$emit(saveEvent, this.form);
        };
        if(validate){
          const errors = this.$vCheck(this[`${vCheckForm}`]);
          if (errors && errors.length) {
            errors.forEach(err => {
              this.$vErrNotify(err);
            });
          } else {
            return save();
          }
        } else return save();
      }
    }
  };
  return mixin;
};
