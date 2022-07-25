<template>
  <div>
    <div class="social-links">
      <div v-if="$lget(accountData, 'account.socialLinks', []).length">
        <div class="my-links-wrapper">
          <q-item class="my-link" v-for="(link, idx) of $lget(accountData, 'account.socialLinks')" :key="idx"
                  :style="{display: 'flex', justifyContent: 'space-between', backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark', 35) : ''}">
            <q-icon :name="link.icon" size="lg" :style="{color: link.color ? link.color : ''}"
                    :color="link.color ? '' : 'primary'" class="my-icon"/>
            <div class="lg-link-type">{{ link.type }}</div>
            <div class="sm-link-type">
              <a target="_blank" :href="link.url"
                 :style="{color: $q.dark.mode ? '#cbcbcb' : ''}">{{ link.type }}</a>
              <q-item-label v-if="link.name" style="font-size: small" caption>{{ link.name }}</q-item-label>
            </div>
            <a class="lg-link-label" target="_blank" :href="link.url"
               :style="{color: $q.dark.mode ? '#cbcbcb' : ''}">{{ link.name ? link.name : link.url }}</a>
            <q-icon name="more_vert" size="sm">
                <q-menu fit>
                  <q-list style="min-width: 100px">
                    <q-item @click="toggleEditLink(link, idx)" clickable>
                      <q-item-section>Edit</q-item-section>
                      <q-item-section side>
                        <q-icon name="edit" size="xs"/>
                      </q-item-section>
                    </q-item>
                    <q-item @click="removeSocialLink(link)" clickable>
                      <q-item-section>Delete</q-item-section>
                      <q-item-section side>
                        <q-icon name="far fa-trash-alt" color="negative" size="xs"/>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
            </q-icon>
          </q-item>
        </div>
      </div>
      <div v-else>
        <div class="no-links">No links added</div>
      </div>
      <div class="add-link">
        <div class="icon" @click="toggleAddLink">
          <q-icon name="sp:add_socialLinks" color="primary"/>
        </div>
        <transition name="drop-down">
          <div v-if="addingNewLink || editExistingLink" class="new-link-form-wrapper">
            <div class="new-link-form">
              <div class="icon-picker-wrapper">
                <q-select v-model="currentSocialLink.icon" style="width: 20%;" class="icon-picker"
                          :options="socialLinkIcons" label="Select Icon">
                  <template v-slot:option="scope">
                    <div v-bind="scope.itemProps" v-on="scope.itemEvents" class="select-option-icon">
                      <q-icon size="sm" color="secondary" :name="scope.opt"/>
                    </div>
                  </template>

                  <template v-slot:selected>
                    <q-icon style="margin-top: 3px;" :name="currentSocialLink.icon" color="secondary" size="md"/>
                  </template>
                </q-select>
                <q-icon @click="colorDio = true" :color="currentSocialLink.color.length ? '' : 'accent'"
                        :style="{color: currentSocialLink.color.length ? currentSocialLink.color : ''}" class="cursor-pointer"
                        name="fas fa-palette" size="sm"/>
              </div>
              <q-input v-model="currentSocialLink.type" style="width: 20%;" label="Name (github, instagram, etc...)"/>
              <q-input v-model="currentSocialLink.name" style="width: 20%;" label="Label (optional)"/>
              <q-input hint="Prepend with http or https if linking to external site" v-model="currentSocialLink.url"
                       style="width: 20%;" label="Url"/>
            </div>
            <div class="buttons">
              <q-btn @click="stopEdit" label="Cancel" color="negative"/>
<!--              <q-btn @click="addingNewLink ? addSocialLink : editSocialLink" class="q-mx-lg" label="Save" color="primary"/>-->
              <q-btn v-if="addingNewLink" @click="addSocialLink" class="q-mx-lg" label="Save" color="primary"/>
              <q-btn v-if="editExistingLink" @click="editSocialLink" class="q-mx-lg" label="Save" color="primary"/>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <q-dialog v-model="colorDio">
      <q-color v-model="currentSocialLink.color"/>
    </q-dialog>
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import {mapActions} from 'vuex';

  export default {
    name: 'SocialLinksOld',

    props: {
      value: {
        type: Object,
        required: true,
      },
    },

    data() {
      return {
        accountData: {
          account: new models.api.Accounts().clone(),
        },
        currentSocialLink: {
          icon: '',
          type: '',
          name: '',
          url: '',
          color: '',
        },
        addingNewLink: false,
        editExistingLink: false,
        colorDio: false,
        urlClone: null,
      };
    },

    watch: {
      value: {
        deep: true,
        immediate: true,
        handler(newVal) {
          if (newVal && Object.keys(newVal).length) {
            this.accountData = this.$lcloneDeep(newVal);
          }
        },
      },
    },

    computed: {
      socialLinkIcons() {
        return [
          'fab fa-instagram', 'fab fa-instagram-square', 'fab fa-twitter',
          'fab fa-twitter-square', 'fab fa-facebook-f', 'fab fa-facebook',
          'fab fa-facebook-square', 'fab fa-github', 'fab fa-github-square',
          'fab fa-github-alt', 'fab fa-reddit', 'fab fa-reddit-square',
          'fab fa-snapchat', 'fab fa-snapchat-square',
        ];
      },
      editSocialLinkParams() {
        let keys = Object.keys(this.currentSocialLink);
        let params = {};
        keys.forEach(item => {
          return params[`socialLinks.$.${item}`] = this.currentSocialLink[`${item}`];
        });
        return params;
      }
    },
    methods: {
      ...mapActions('accounts', {
        patchAccount: 'patch',
      }),
      stopEdit() {
        this.addingNewLink ? this.addingNewLink = false : this.editExistingLink = false;
        this.currentSocialLink = {icon: '', type: '', name: '', url: '', color: ''};
      },
      toggleAddLink() {
        this.editExistingLink = false;
        this.addingNewLink = true;
        this.currentSocialLink = {icon: '', type: '', name: '', url: '', color: ''};
      },
      addSocialLink() {
        let {icon, url} = this.currentSocialLink;
        if (!icon || !url) {
          this.$q.notify({
            message: 'Must Have Selected Icon And Url',
          });
          return;
        }
        if (this.accountData.account.socialLinks.map(item => item.url).includes(this.currentSocialLink.url)) {
          this.$q.notify({
            type: 'negative',
            message: 'Error: Social Link already exists',
          });
        } else {
          this.patchAccount([this.accountData.account._id, {
            $push: {
              socialLinks: this.currentSocialLink,
            },
          }]).then(() => {
            this.$q.notify({
              message: 'Added Social Link',
              color: 'positive',
            });
            this.stopEdit();
          }).catch(err => {
            this.$q.notify({
              message: 'Something went wrong, try refreshing the page',
              color: 'negative',
            });
            console.log('this is log on err in addSocialLink catch: ', err);
          });
        }
      },
      editSocialLink() {
        let {icon, url} = this.currentSocialLink;
        if (!icon || !url) {
          this.$q.notify({
            message: 'Must Have Selected Icon And Url',
          });
          return;
        }
        this.patchAccount([null, this.editSocialLinkParams, {
          query: {
            _id: this.accountData.account._id,
            'socialLinks.url': this.urlClone,
          }
        }]).then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Saved',
          });
          this.stopEdit();
        }).catch(err => {
          this.$q.notify({
            type: 'negative',
            message: `Error: ${err}`,
          });
        });
      },
      toggleEditLink(link) {
        this.addingNewLink = false;
        this.editExistingLink = true;
        this.currentSocialLink = link;
        this.urlClone = link.url;
      },
      removeSocialLink(link) {
        this.patchAccount([this.accountData.account._id, {
          $pull: {
            socialLinks: link,
          },
        }]);
      },
    },
  };
</script>

<style scoped lang="scss">
  .social-links {
    .no-links {
      text-align: center;
      margin-top: 35px;
      font-size: 1.4em;
      font-weight: 300;
    }

    .icon {
      text-align: center;
      margin: 25px auto 0 auto;
      font-size: 2.2em;
      cursor: pointer;
      transition: 0.2s all;
      width: 95%;
      border-radius: 10px;
      padding: 5px;
    }

    .icon:hover {
      background-color: #f5f5f535;
    }
  }

  .new-link-form-wrapper {
    .new-link-form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 70px;
      padding: 0 30px;
    }

    .buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 60px;
    }
  }

  .select-option-icon {
    padding: 10px;
    cursor: pointer;
    transition: 0.2s all;
  }

  .icon-picker-wrapper {
    display: flex;
    align-items: center;
    width: 20%;

    .icon-picker {
      flex: .9;
      margin-right: 12px;
    }
  }

  .my-links-wrapper {
    //text-align: center;
    width: 88%;
    margin: 10px auto; //consider changing margin to to 20 as to match addresses

    .my-link {
      display: grid;
      align-items: center;
      margin: 25px 0;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      transition: 0.2s all;
      padding: 10px;
      border-radius: 5px;

      .sm-link-type {
        display: none;
      }

      div {
        //margin: 0 50px;
        font-size: 1.2em;
      }
    }

    .my-link:hover {
      box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  }

  .select-option-icon:hover {
    background-color: #e8eaef;
  }

  .drop-down-enter-active {
    transition: all .3s ease;
  }

  .drop-down-leave-active {
    transition: all .2s ease-in-out;
  }

  .drop-down-enter, .drop-down-leave-to {
    transform: translateY(100px);
    margin-top: -20vh;
    opacity: 0;
  }

  @media screen and (max-width: 550px) {
    .my-links-wrapper {
      .lg-link-type {
        display: none;
      }

      .lg-link-label {
        display: none;
      }

      .sm-link-type {
        display: unset !important;
      }
    }
  }

</style>
