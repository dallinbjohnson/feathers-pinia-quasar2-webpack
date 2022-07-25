<template>
  <q-layout id="Projects" view="hHh lpR fff" container style="height: calc(100vh - 80px);">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <q-btn flat
               dense
               round
               @click="leftDrawerOpen = !leftDrawerOpen">
          <q-icon name="menu" style="font-size: 2.2em;
            background: -webkit-linear-gradient(#0B63F6 , #003CC5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;font-weight: 900;"></q-icon>
        </q-btn>
        <q-space></q-space>
        <q-btn flat
               @click.stop="$router.push({name: 'projects', params: {project_id: $route.params.project_id}})"
               class="text-black">
          <span
            style="font-size: 18px;font-weight: 900;" class="text-primary">
            Projects
          </span>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen"
              bordered
              content-class="bg-grey-1">
      <q-list style="width: 100%">
        <q-item-section style="width: 100%">
          <div class="q-pa-sm flex justify-between full-width">
            <div style="font-size: 1.2rem; align-self: center">Your Projects</div>
            <div>
              <q-btn size="lg" icon='add' flat round @click='projectFormDio = true'>
                <q-tooltip>New Project</q-tooltip>
              </q-btn>
            </div>
          </div>
          <q-item v-for="project in projectsClones" :key="$lget(project, '_id')"
                  :class="`project-item ${$lget(selectedProject, '_id') === project._id ? 'selected' : 'unselected'}` ">
            <div class="full-width"
                 style="font-size: 1.1rem"
                 @click.stop="setProject(project)">
              {{ $lget(project, 'name', 'No Name') }}
            </div>
            <q-btn v-if="$lget(selectedProject, '_id') === project._id" size="sm" icon='settings' flat round
                   @click='projectSettingsDio = true'>
              <q-tooltip>Settings</q-tooltip>
            </q-btn>
          </q-item>
        </q-item-section>
      </q-list>
    </q-drawer>
    <q-page-container>
      <q-page>
        <pages-list :project="selectedProject"/>
      </q-page>
    </q-page-container>

    <q-dialog v-model='projectFormDio'>
      <q-card style="min-width: 200px; min-height: 100px;" class="q-pa-md">
        <q-card-section>
          <div class="text-sm text-mb-sm text-weight-bold">Start a new project</div>
          <q-form @submit.prevent="newProjectCreate">
            <q-input label="Name"
                     v-model="newProject.name"
                     @keypress.enter="newProjectCreate"
                     :rules="[val => !!val.length || 'Name cannot be empty']"
                     class="q-mb-sm"></q-input>
            <div class="flex" style="width: 100%; display: flex; justify-content: flex-end">
              <q-btn flat class="q-mx-md" label="cancel" type="button" @click.stop="projectFormDio = false"></q-btn>
              <q-btn label="Submit" color="green" type="ok"></q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model='projectSettingsDio'>
      <project-settings :project="selectedProject"
                        @close="projectSettingsDio = false"
                        @deleteProject="confirmDeleteProject"/>
    </q-dialog>
  </q-layout>
</template>

<script>
  import {makeFindMixin} from '@feathersjs/vuex';
  import {mapActions, mapGetters} from 'vuex';
  import PagesList from 'components/pagesList/PagesList';
  import ProjectSettings from 'components/projectSettings/projectSettings';

  const newProjectDefault = () => {
    return {
      name: '',
      ownerId: undefined,
      modelName: 'users',
    };
  };

  export default {
    name: 'Projects',
    props: {},
    components: {
      ProjectSettings,
      PagesList,
    },
    mixins: [
      makeFindMixin({
        service: 'wpb-projects',
        name: 'projects',
        qid: 'projects',
        queryWhen() {
          const when1 = !!this.$lget(this.user, 'projects', []).length;
          const when2 = this.findUserProjects(this.projectsParams).data.length !== this.$lget(this.user, 'projects', []).length;
          // console.log('should i query for projects whens', when1, when2);
          // console.log('should i query for projects ', when1 && when2);
          return when1 && when2;
        },
      }),
    ],
    data() {
      return {
        leftDrawerOpen: true,
        selectedProject: {},
        projectFormDio: false,
        newProject: newProjectDefault(),
        projectSettingsDio: false,
      };
    },
    watch: {
      projectsClones: {
        immediate: true,
        deep: true,
        handler(newVal) {
          if (newVal && newVal.length) {
            if (this.$lget(this.$route, 'params.project_id')) {
              this.selectedProject = newVal.find(item => item._id === this.$route.params.project_id);
            }
          }
        },
      },
    },
    computed: {
      ...mapGetters('auth', {
        isAuthenticated: 'isAuthenticated',
        user: 'user',
      }),
      ...mapGetters('wpb-projects', {
        findUserProjects: 'find',
      }),
      projectsClones() {
        return this.projects.map(item => item.clone());
      },
      projectsParams() {
        return {
          query: {
            $or: [
              {
                _id: {
                  $in: this.$lget(this.user, 'projects', []),
                },
              },
              {
                sharedAccessIds: this.$lget(this.user, '_id'),
                accessibleBy: 'shared',
              },
            ],
          },
        };
      },
    },
    methods: {
      ...mapActions('wpb-projects', {
        createProject: 'create',
        removeProject: 'remove',
        loadProjects: 'find',
      }),
      async newProjectCreate() {
        this.newProject.ownerId = this.user._id;
        this.createProject(this.newProject)
          .then(async () => {
            this.newProject = newProjectDefault();
            this.projectFormDio = false;
          })
          .catch(err => {
            console.error('error creating new project', err);
          });
      },
      setProject(project) {
        this.selectedProject = project;
        this.$route.params.project_id = project._id;
      },
      confirmDeleteProject() {
        this.$isLoading(true);
        if (this.selectedProject) {
          this.removeProject(this.selectedProject._id)
            .then(() => {
              this.$isLoading(false);
              this.selectedProject = null;
              this.$router.push({name: 'projects'});
              this.projectSettingsDio = false;
              this.$q.notify({type: 'positive', message: 'Project Deleted', timeout: 4000, actions: [{icon: 'close'}]});
            })
            .catch(err => {
              this.$isLoading(false);
              console.error('problem deleting project', err);
            });
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  #Projects {
    .project-item {
      display: flex;
      justify-content: space-between;
      width: 100%;
      cursor: pointer;
    }

    .selected {
      background-color: lightgrey;
    }

    .unselected {
      &:hover {
        background-color: rgba(200, 200, 200, .2);
      }
    }

    //* {
    //  border: 1px solid red;
    //}
  }
</style>
