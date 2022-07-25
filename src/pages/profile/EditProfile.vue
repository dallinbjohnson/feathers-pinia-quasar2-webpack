<template>
  <q-page :style="{backgroundColor: $q.dark.mode ? '' : '#F9F9FA', padding: '20px'}" class="test">
    <div class="tabs">
      <div class="tab" @click="activeTab = tab" :style="{color: activeTab === tab ? 'var(--q-color-primary)' : '#000000', borderBottom: '1px solid transparent', borderColor: activeTab === tab ? 'var(--q-color-primary)' : 'transparent'}" v-for="(tab, idx) of tabs" :key="idx">
        {{ tab }}
      </div>
    </div>
    <div class="edit-profile-wrapper" :style="{backgroundColor : $q.dark.mode ? $lightenHex('--q-color-dark', 50) : 'white'}">
      <div v-if="activeTab === 'My profile'">
        <div class="fields">
          <div>
            <div style="font-size: 1.3em; margin-bottom: 15px;">Profile Picture</div>
            <ImageForm @input="test" v-model="form.avatar"/>
          </div>
          <div class="field-wrapper">
            <q-select style="flex: .7" multiple use-chips v-model="form.roles" :options="roles" label="Select role"
                      map-options emit-value option-value="_id" option-label="name">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">No Roles created</q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-input label="Edit Email" v-model="form.email" />
          </div>
        </div>
        <ProfilePhone @removePhone="removePhone" path="phones" @phoneNum="getPhoneDetails" :value="form.phones" class="q-mt-xl"/>

        <div class="buttons">
          <q-btn @click="$router.go(-1)" label="Cancel" color="red" />
          <q-btn @click="saveUser" class="q-ml-md" label="Save user" color="primary" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

  import {models} from '@feathersjs/vuex';
  import {mapGetters, mapActions} from 'vuex';
  import ImageForm from 'components/common/atoms/images/ImageForm';
  import ProfilePhone from 'components/profile/ProfilePhone';

  export default {
    name: 'EditProfile',
    data(){
      return {
        activeTab: 'My profile',
        tabs: ['My profile'],
        form: new models.api.Users(this.user).clone()
      };
    },
    components: { ProfilePhone, ImageForm },
    mounted() {
      this.loadRoles();
    },
    watch: {
      user: {
        immediate: true,
        handler() {
          this.form = new models.api.Users(this.user).clone();
          // this.form.roles = this.$lget(this.form, '_fastjoin.roles', []).map(role => role._id);
        }
      },
    },
    computed: {
      ...mapGetters('auth', {
        user: 'user'
      }),
      ...mapGetters('ir-roles-roles', {
        getRoles: 'find'
      }),
      formImg() {
        return this.getAvatar(this.form, 'avatar', 'large', null, 'https://cdn.quasar.dev/img/material.png');
      },
      roles() {
        return this.getRoles().data;
      }
    },
    methods: {
      ...mapActions('ir-roles-roles', {
        loadRoles: 'find'
      }),
      ...mapActions('users', {
        patchUser: 'patch'
      }),
      removePhone(phone) {
        this.patchUser([this.user._id, {
          $pull: {
            phones: phone
          }
        }]).then(() => {
          this.$q.notify({
            message: 'Number removed',
            color: 'positive'
          });
        });
      },
      getPhoneDetails(phone) {
        this.form.phones.push(phone);
      },
      test(val) {
        console.log('from edit profile: ', val, this.form);
      },
      saveUser() {
        // eslint-disable-next-line no-unused-vars
        this.form.save().then(res => {
          this.$q.notify({
            message: 'User saved',
            color: 'positive'
          });
        }).catch(() => {
          this.$q.notify({
            color: 'negative',
            message: 'Something went wrong on our end, try refreshing'
          });
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  .fields {
    display: grid;
    grid-template-columns: 1fr 2fr;

    .field-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-around;
    }
  }
  .edit-profile-wrapper {
    //border-radius: 3px;
    background-color: white;
    width: 100%;
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.2);
    //position: absolute;
    //top: 40px;
    //bottom: 40px;
    padding: 20px;
  }

  .tabs {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 15px;
    font-size: 1.15em;

    .tab {
      padding: 15px 8px;
      margin: 0 5px;
      cursor: pointer;
      transition: 0.1s all;
      font-weight: 350;
    }
  }
  .buttons {
    display: flex;
    align-items: center;
    margin-top: 30px;
    justify-content: flex-end;
  }
</style>
