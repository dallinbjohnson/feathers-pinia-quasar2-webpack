<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="text-white" style="background: -webkit-linear-gradient(#0B63F6 , #003CC5)">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click.stop="left = !left"/>

        <q-toolbar-title>
          <div>Select Template</div>
        </q-toolbar-title>
        <q-btn flat icon="close" @click.stop="close"/>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="left" side="left" bordered>
      <q-card flat>
        <q-form @submit.prevent="savePage">
          <q-card-section>
            Choose what to make a new page from:
          </q-card-section>
          <q-card-section v-if="pageTemplatesClones.length">
            <div class="q-mb-sm text-h6">Templates</div>
            <div class="flex flex-center column full-width">
              <q-list dense separator>
                <q-item clickable v-for="template in pageTemplatesClones"
                        :key="template._id"
                        :style="{backgroundColor: $lget(selectedPage,'_id',false) === $lget(template,'_id', true) ? 'lightgray':'white' }"
                        @click.stop="setSelectedPage(template)">
                  <q-item-section style="width: 100%;">
                    <p style="text-align: left;">
                      {{ template.name }}
                    </p>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-pagination v-if="pageTemplatesPages > 1"
                            :value="pageTemplatesCurrentPage"
                            @input="pageTemplatesHandlePageChange"
                            :max="pageTemplatesPages"
                            :max-pages="6"
                            :direction-links="true"
                            :boundary-links="true">
              </q-pagination>
            </div>
          </q-card-section>
          <q-card-section v-if="userPagesClones.length">
            <div class="q-mb-sm text-h6">Your pages</div>
            <div class="flex flex-center column full-width">
              <q-list dense separator>
                <q-item clickable v-for="userPage in userPagesClones"
                        :key="userPage._id"
                        active-class="item_selected"
                        class="flex flex-center column"
                        :style="{backgroundColor: $lget(selectedPage,'_id',false) === $lget(userPage,'_id',true) ? 'lightgray':'white', fontSize: '1.2rem', border: '10px' }"
                        @click.stop="setSelectedPage(userPage)">
                  <q-item-section style="width: 100%;">
                    <p style="text-align: left;">
                      {{ userPage.name }}
                    </p>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-pagination v-if="userPagesPages > 1"
                            :value="userPagesCurrentPage"
                            @input="userPagesHandlePageChange"
                            :max="userPagesPages"
                            :max-pages="6"
                            :direction-links="true"
                            :boundary-links="true"
                            class="q-my-sm">
              </q-pagination>
            </div>
          </q-card-section>
          <q-card-section>
            <div>Start from scratch <span><q-checkbox v-model="blankPage" @input="$event ? selectedPage = {} : false"/></span>
            </div>
          </q-card-section>
          <q-card-section>
            <q-input label="New Page Name"
                     v-model="newPageName"
                     :rules="[(val) => !!val.length || 'Name cannot be empty!']"/>
          </q-card-section>
          <q-card-section>
            <q-card-actions style="width: 100%; display: flex;  justify-content: flex-end">
              <q-btn class="q-mx-md" flat label="Cancel" @click.stop="close" type="button"></q-btn>
              <q-btn color="green" label="Submit" type="submit"></q-btn>
              <slot>
              </slot>
            </q-card-actions>
            <div v-for="error in errors" class="q-my-md text-red" :key="error">{{ error }}</div>
          </q-card-section>
        </q-form>
      </q-card>
    </q-drawer>

    <q-page-container style="width: 100%; height: 100vh">
      <q-card v-if="selectedPage.name">
        <q-page style="width: 100%; height: 100vh">

          <q-scroll-area ref="scrollArea"
                         id="scrollArea"
                         :style="`height: 100%;  max-width: 100%;`">
            <div style="padding: 5px">

              <div :id="selectedPage._id" :style="selectedPage.styles">
                <section-view v-for="(section, i) in $lget(selectedPage, '_fastjoin.sections', [])"
                              :tree-path="[selectedPage]"
                              :key="section._id"
                              :section="section"
                              :previewing="true"
                              :arrIndex="i"
                              :parent="selectedPage"
                              :currentPage="selectedPage"/>
              </div>
            </div>
          </q-scroll-area>
        </q-page>
      </q-card>
      <q-card v-else style="width: 100vw; height: 100vh; display: flex; justify-content: center; align-items: center">
        <p style="font-size: 48px; font-weight: bold; color: gray">
          {{ blankPage ? 'Create a blank page' : 'No Page Selected' }}</p>
      </q-card>
    </q-page-container>

    <q-dialog v-model="progressDialog" maximized>
      <q-card class="flex flex-center column justify-center" style="background: rgba(255, 255, 255, 0.7)">
        <vLottiePlayer name="WebsiteBuildingAnim"
                       loop
                       width="350px"
                       height="350px"
                       :animationData="require('../../assets/lottieAnims/WebsiteLoading.json')"/>
        <q-card-section style="font-size: 1.5em;
            background: -webkit-linear-gradient(#0B63F6 , #003CC5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;font-weight: 900;">
          <q-linear-progress :value="$lget(progress, 'amount', 0) / 100" class="q-my-sm" rounded color="blue"/>
          {{ `Give us a moment to generate your new page: ${$lget(progress, 'amount', 0)}%` }}
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script>
  import {makeFindPaginateMixin} from '@iy4u/common-client-lib';
  import sectionView from '../common/substance/Section';
  import {models} from '@feathersjs/vuex';
  import {mapGetters} from 'vuex';
  import VueLottiePlayer from 'vue-lottie-player';

  export default {
    name: 'PageTemplateList',
    props: {
      project: Object,
    },
    components: {
      sectionView,
      vLottiePlayer: VueLottiePlayer,
    },
    mixins: [
      makeFindPaginateMixin({
        service: 'wpb-pages',
        name: 'userPages',
        qid: 'userPages',
        limit: 6,
        query() {
          return {
            $or: [
              {
                _id: {
                  $in: this.project.pages,
                },
              },
            ],
          };
        },
      }),
      makeFindPaginateMixin({
        service: 'wpb-pages',
        name: 'pageTemplates',
        qid: 'pageTemplates',
        limit: 6,
        query() {
          return {
            ownerId: {
              $ne: this.$store.state.auth.user._id,
            },
            template: true,
          };
        },
      }),
    ],
    data() {
      return {
        form: new models.api.wpbPages().clone(),
        parentHeight: 0,
        parentWidth: 0,
        selectedPage: {},
        createdPage: null,
        newPageName: '',
        left: true,
        previewing: true,
        errors: [],
        selectedTemplateError: 'Please select a template.',
        progressDialog: false,
        saving: false,
        blankPage: false,
      };
    },
    watch: {},
    computed: {
      ...mapGetters('progress', {
        findProgress: 'find',
      }),
      progress() {
        let a = this.findProgress({query: {_id: '0'}});
        return a.data[0];
      },
      userPagesClones() {
        return this.userPages.map(item => item.clone());
      },
      pageTemplatesClones() {
        return this.pageTemplates.map(item => item.clone());
      },
      feathersAxios() {
        return this.$axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.$store.state.auth.accessToken,
          },
          timeout: (1000 * 60) * 10,
        });
      },
    },
    methods: {
      setSelectedPage(page) {
        if (this.errors.includes(this.selectedTemplateError)) {
          this.errors = this.errors.filter(item => item !== this.selectedTemplateError);
        }
        this.blankPage = false;
        this.selectedPage = page;
      },
      savePage() {
        let data = {
          action: 'duplicateTemplate',
          templateAction: 'pageTemplate',
          projectId: this.project._id,
          pageName: this.newPageName,
        };
        if ((this.selectedPage._id || this.blankPage) && !this.saving) {
          this.saving = true;
          this.progressDialog = true;
          if (this.blankPage) {
            data.value = 'blank';
          } else {
            data.value = this.selectedPage._id;
          }
          console.log('creating page data', data);
          console.log('process.env.VUE_APP_FEATHERS_URL', process.env.VUE_APP_FEATHERS_URL);
          this.feathersAxios.post('/wpb-management', data)
            .then(res => {
              console.log(res);
              this.createdPage = res.data;
              // if (this.$lget(this.createdPage, '_id')) {
              //   // this.$router.push({
              //   //   name: 'WpbEditor',
              //   //   params: {page_id: this.createdPage._id},
              //   // });
              this.close(res.data);
              // }

            })
            .catch(err => {
              console.error(err);
            });
        } else {
          if (!this.errors.includes(this.selectedTemplateError)) {
            this.errors.push(this.selectedTemplateError);
          }
        }
      },
      close(page) {
        this.newPageName = '';
        this.errors = [];
        this.progressDialog = false;
        this.saving = false;
        this.$emit('close', page);

      },
    },
  };
</script>

<style scoped lang="scss">

</style>
