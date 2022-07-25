<template>
  <div v-if="!$lget(project, '_id')"
       style="display: flex; justify-content: center; align-items: center; margin-top: 30vh; font-size: 1.5rem;">
    Nothing to show. Please select a project.
  </div>

  <div v-else>
    <div class="q-pa-md" style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <p style="padding: 0; margin: 0; width: 100%; font-size: 36px; text-align: left;background: -webkit-linear-gradient(#0B63F6 , #003CC5);-webkit-background-clip: text;-webkit-text-fill-color: transparent;font-weight: 300;">
        Your pages: </p>
      <q-btn size="lg" icon='add' flat round @click='pageFormDio = true'/>
    </div>
    <div class="q-pa-md" style="width: 100%; display: flex; justify-content: flex-end">
      <q-btn-toggle v-model="model"
                    class="my-custom-toggle"
                    no-caps
                    rounded
                    unelevated
                    toggle-color="primary"
                    color="white"
                    text-color="primary"
                    :options="[
                      {slot: 'card', value: 'card'},
                      {slot: 'list', value: 'list'}
                    ]">
        <template v-slot:card>
          <div class="row items-center no-wrap">
            <q-icon right name="view_agenda"/>
          </div>
        </template>

        <template v-slot:list>
          <div class="row items-center no-wrap">
            <q-icon right name="format_list_bulleted"/>
          </div>
        </template>
      </q-btn-toggle>
    </div>

    <div v-if="isFindProjectPagesPending" style="height: 60vh" class="flex flex-center content-center">
      <vLottiePlayer name="WebsiteBuildingAnim"
                     loop
                     width="350px"
                     height="350px"
                     :animationData="require('../../assets/lottieAnims/WebsiteLoading.json')"/>
    </div>

    <div v-else-if="!isFindProjectPagesPending && !projectPagesClones.length" style="height: 60vh; font-size: 1.3rem"
         class="flex flex-center column content-center">
      <div>Oh Snap! Looks like you haven't made any pages yet.</div>
      <div class="hover text-bold text-primary" @click.stop="pageFormDio = true"> Let's get started!</div>
    </div>

    <template v-else>
      <q-list v-if="model === 'list'" separator bordered>
        <q-item v-for='page in projectPagesClones' :key='page._id' clickable>
          <q-item-section @click="openWpbEditor(page)"
                          class="noPadding">
            <p style="font-size: 1.15rem; padding: 0;">{{ page.name }}</p>
          </q-item-section>
          <q-item-section class="noPadding">
            <p style="display: flex; align-items: center; font-size: 1rem; margin: 0;">
              <span class="q-mr-sm" style="font-size: 1.15rem;">Created: </span>
              {{ formatDateFunc(page.createdAt, 'MMM Do, YYYY h:mma') }}
            </p>
          </q-item-section>
          <q-item-section class="noPadding">
            <p style="display: flex; align-items: center; font-size: 1rem; margin: 0;">
              <span class="q-mr-sm" style="font-size: 1.15rem;">Last Updated:</span>
              {{ formatDateFunc(page.updatedAt, 'MMM Do, YYYY h:mma') }}
            </p>
          </q-item-section>
          <q-item-section class="noPadding" avatar>
            <q-icon color="red" name="delete" @click="openDeletePageDio(page)"></q-icon>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="q-mt-xl"
           style="width: 100%; display: grid; grid-template-columns: repeat(auto-fit, minmax(175px, 300px)); justify-content: space-around; align-items: center;"
           v-if="model === 'card'">
        <q-card class="page_card hover q-my-md"
                v-for='page in projectPagesClones'
                :key='page._id'
                clickable
                @click.stop="openWpbEditor(page)">
          <div style="padding: 8px; display: flex; align-content: center; justify-content: center">
            <q-icon name="web" size="10rem" class="text-black"/>
          </div>
          <div class="page_card_title">
            <p>{{ page.name }}</p>
          </div>
          <div class="page_card_info">
              <span class="q-mr-sm">
                Created Date:
                {{ formatDateFunc(page.createdAt, 'MMM Do, YYYY h:mma') }}
              </span>
          </div>
          <div class="page_card_info">
              <span class="q-mr-sm">
                Last Updated:
                {{ formatDateFunc(page.updatedAt, 'MMM Do, YYYY h:mma') }}
              </span>

          </div>
          <div class="garbageButtonContainer">
            <div>
              <q-btn color="red" flat style="width: 100%" icon="delete" @click.stop="openDeletePageDio(page)"/>
            </div>
          </div>
        </q-card>
      </div>
    </template>

    <q-dialog v-model='pageFormDio' maximized>
      <page-template-list :project="project" @close="pageFormDioClose"></page-template-list>
    </q-dialog>

    <q-dialog v-model="deletePageDio" @hide="cancelDelete">
      <q-card class="q-pa-lg">
        <q-card-section>
          <p style="font-size: 21px">Are you sure you want to delete {{ $lget(selectedPageToDelete, 'name') }}?</p>
        </q-card-section>
        <q-card-actions style="width: 100%; display: flex; justify-content: flex-end">
          <q-btn flat label="Cancel" @click.stop="cancelDelete"></q-btn>
          <q-btn label="Delete" color="red" @click.stop="confirmDelete"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

  import {mapActions, mapGetters} from 'vuex';
  import PageTemplateList from 'components/pageTemplateList/PageTemplateList';
  import VueLottiePlayer from 'vue-lottie-player';
  import {makeFindMixin} from '@feathersjs/vuex';
  import {date} from 'quasar';

  const {formatDate} = date;


  export default {
    name: 'PagesList',
    props: {
      project: Object,
    },
    components: {
      PageTemplateList,
      vLottiePlayer: VueLottiePlayer,
    },
    mixins: [
      makeFindMixin({
        service: 'wpb-pages',
        name: 'projectPages',
        qid: 'projectPages',
        queryWhen() {
          const when1 = !!this.$lget(this.project, 'pages', []).length;
          const when2 = this.progress ? this.progress.amount === 0 : true;
          const when3 = this.findPages(this.projectPagesParams).data.length !== this.$lget(this.project, 'pages', []).length;
          // console.log('should i query for pages whens', when1, when2, when3);
          // console.log('should i query for pages ', when1 && when2 && when3);
          // console.log('should i query for pages progress', this.progress, when2);
          // console.log('pages queryWhen params', this.$route.params);
          return when1 && when2 && when3;
          // return false;
        },
        watch: ['project._id'],
      }),
    ],
    data() {
      return {
        model: 'card',
        pageFormDio: false,
        deletePageDio: false,
        selectedPageToDelete: null,
        newPage: {},
        formatDateFunc: formatDate,
      };
    },
    watch: {},
    computed: {
      ...mapGetters('auth', {
        user: 'user',
      }),
      ...mapGetters('progress', {
        getProgress: 'get',
      }),
      ...mapGetters('wpb-pages', {
        findPages: 'find',
      }),
      progress() {
        return this.getProgress('0');
      },
      projectPagesClones() {
        return this.projectPages.map(item => item.clone());
      },
      projectPagesParams() {
        return {
          query: {
            _id: {
              $in: this.$lget(this.project, 'pages', []),
            },
          },
        };
      },
    },
    methods: {
      ...mapActions('wpb-pages', {
        createPage: 'create',
        deletePage: 'remove',
      }),
      openDeletePageDio(id) {
        this.deletePageDio = true;
        this.selectedPageToDelete = id;
      },
      confirmDelete() {
        this.$q.loading.show({message: `Removing ${this.selectedPageToDelete.name}`, ignoreDefaults: true});
        this.deletePage(this.selectedPageToDelete._id)
          .then(res => {
            console.log(res._id, 'was deleted successfully\n', res);
            this.$isLoading(false);
          })
          .catch(err => console.error('there was a problem deleting this page', err));
        this.deletePageDio = false;
      },
      cancelDelete() {
        this.deletePageDio = false;
        this.selectedPageToDelete = null;
      },
      openWpbEditor(page) {
        this.$router.push({
          name: 'WpbEditor',
          params: {page_id: page._id, page, project_id: this.project._id},
        });
      },
      async pageFormDioClose() {
        this.pageFormDio = false;
      },
    },
  };
</script>

<style lang='scss' scoped>
  .page_card {
    padding: 0 10px 10px 10px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    width: 100%;
    max-height: 600px;
    min-height: 200px;

    &_title {
      font-size: 1.3rem;
      display: flex;
      justify-content: center;
    }

    &_info {
      font-size: .75rem;
      display: flex;
      justify-content: center;
    }
  }

  .hover {
    &:hover {
      cursor: pointer;
    }
  }

  .noPadding {
    padding: 0;
  }

  .garbageButtonContainer {
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    width: 100%;
  }
</style>
