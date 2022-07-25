<template>
  <q-card>
    <q-card-section>
      <div class="row text-xxs text-mb-xs text-weight-light">Phones
        <q-space/>
        <q-btn v-if="adding !== 'address'" size="sm" icon="mdi-plus" label="add phone" flat
               @click="adding = 'address'"/>
      </div>
    </q-card-section>
    <q-slide-transition>
      <template v-if="adding === 'address'">
        <q-card-section>
          <vue-tel-input :style="{border: isValid ? '1px solid green' : (!isValid && inputVal ? '1px solid red' : '')}" :preferredCountries="preferredCountries" @input="handlePhone"></vue-tel-input>
        </q-card-section>
      </template>
    </q-slide-transition>
    <q-card-section>
      <default-list
        :items="form[path]"
        title="phone"
        default-path="number.e164"
        :default-id="$lget(form, 'settings.defaults.phone.number.e164', null)"
        item-label="number.national"
        @rmv="handleRemove"
      ></default-list>
    </q-card-section>
  </q-card>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import DefaultList from './DefaultList';
  import {mapGetters} from 'vuex';

  export default {
    name: 'ProfilePhone',
    components: { DefaultList },
    props: {
      subject: {
        type: String,
        default: 'Users'
      },
      path: {
        type: String,
        default: 'phone'
      },
      subjectIn: Object,
      value: Array,
      userId: {
        type: String,
        default: ''
      }
    },
    mounted() {
      this.form = new models.api.Users(this.user).clone();
    },
    data() {
      return {
        adding: null,
        email: '',
        form: {},
        preferredCountries: ['NG','US'],
        isValid: false,
        inputVal: ''
      };
    },
    watch: {
      subjectIn: {
        immediate: true,
        handler(newVal) {
          console.log('got one', newVal);
          if (newVal && newVal._id) {
            this.form = newVal;
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', {
        user: 'user'
      })
    },
    methods: {
      handleRemove(phone) {
        this.$emit('removePhone', phone);
      },
      async handlePhone(number, isValid) {
        this.inputVal = number;
        this.isValid = isValid.isValid;
        if(isValid.isValid){
          this.form.phone = isValid;
          this.$emit('phoneNum', this.form.phone);
        }
      }
    }
  };
</script>
