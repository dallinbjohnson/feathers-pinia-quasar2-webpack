<template>
  <div class="row justify-center justify-md-start font-2" style="max-width: 100%">
    <div style="width: 700px; max-width: 100%; padding: 0 2vw;">
      <div class="row justify-end">
        <div class="col-10">
          <div class="__strip"></div>
        </div>
      </div>
      <div class="row">
        <div :class="smCol">
          <div :class="colInner">
            <q-icon v-bind="getIconAttrs('mdi-face')"></q-icon>
          </div>
        </div>
        <div :class="lgCol">
          <q-input v-model="form.name" class="bg-white" dense placeholder="Your Name"
                   input-class="q-px-sm"></q-input>
        </div>
        <div :class="smCol">
          <div :class="colInner">
            <q-icon v-bind="getIconAttrs('mdi-email-outline')"></q-icon>
          </div>
        </div>
        <div :class="lgCol">
          <q-input v-model="form.email" class="bg-white" dense placeholder="Your Email"
                   input-class="q-px-sm"></q-input>
        </div>
        <div :class="smCol">
          <div :class="colInner">
            <q-icon v-bind="getIconAttrs('mdi-phone')"></q-icon>
          </div>
        </div>
        <div :class="lgCol">

          <vue-tel-input placeholder="Phone Number" style="height: 40px;"
                         :value="$lget(form, 'phone.number.national')"
                         @input="setPhone"></vue-tel-input>

        </div>
        <div :class="smCol">
          <div :class="colInner">
            <q-icon v-bind="getIconAttrs('mdi-text')"></q-icon>
          </div>
        </div>
        <div :class="lgCol">
          <q-input
            v-model="form.body"
            class="bg-white"
            type="textarea"
            placeholder="Pour your heart out"
            input-class="q-px-sm"
          ></q-input>
        </div>
      </div>
      <div class="row">
        <div class="col-2"></div>
        <q-btn outline push color="secondary" label="Send" icon="mdi-send" @click="save()"></q-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import formMixin from 'src/mixins/formMixin';

  export default {
    name: 'ContactForm',
    mixins: [
      formMixin({
        service: 'ir-requests',
        validate: true,
        validWatch: true,
        resetFormOnSave: true,

        afterFn: () => {
          this.$successNotify('Thanks! We\'ll reach out to you.');
        },
      }),
    ],
    data() {
      return {
        colInner: 'row justify-center',
        smCol: 'col-2 q-py-sm',
        lgCol: 'col-10 q-py-sm',
      };
    },
    computed: {
      validCheck() {
        let obj = {
          email: {name: 'Email', v: ['email']},
          name: {name: 'Name', v: ['notEmpty']},
        };

        let phone = {
          name: 'Phone',
          v: ['phone'],
        };

        if (this.form.phone) {
          obj.phone = phone;
          delete obj.email;
        }
        return obj;
      },
    },
    methods: {
      getIconAttrs(name) {
        return {
          size: '30px',
          color: this.textColor,
          name,
        };
      },
      setPhone(val, obj) {
        this.form.phone = obj;
      },
    },
  };
</script>

<style scoped>

</style>
