<template>
  <q-layout view="Lhh lpR fff" container :class="$q.dark.mode ? 'bg-dark' : 'bg-white'" style="width: 550px; max-width: 100vw">
    <q-header class="bg-primary">
      <q-toolbar>
        <q-toolbar-title>Board Template</q-toolbar-title>
        <q-btn flat v-close-popup round dense icon="close"/>
      </q-toolbar>
    </q-header>
    <q-page-container v-if="createTemplateForm === false && showTemplateSelect === false">
      <q-page class="flex flex-center">
        <div>
          <div>
            <q-btn label="Select One" class="bg-primary text-white" @click="showTemplateSelect = true">

            </q-btn>
          </div>
          <div class="flex flex-center q-my-lg text-lg text-mb-lg text-weight-medium">
            <span>or</span>
          </div>
          <div>
            <q-btn label="Make your own" class="bg-primary text-white" @click="createTemplateForm = true">

            </q-btn>
          </div>
        </div>
        <q-icon flat class="cursor-pointer t-r q-ma-sm" color="secondary" name="fas fa-question-circle" size="md"
                @click="templateHelp = true">
          <q-tooltip>
            <span class="text-sm text-mb-sm">What are templates?</span>
          </q-tooltip>
        </q-icon>
      </q-page>
    </q-page-container>

    <q-page-container v-if="createTemplateForm === true">
      <q-page class="q-ma-sm">
        <div class="q-my-md">
          <q-btn flat class="text-secondary" icon="fas fa-arrow-left" @click="createTemplateForm = false">

          </q-btn>
        </div>
        <q-card class="q-pa-md">
          <form-generator v-model="template_data" :fields="template_fields"
                          class="flex justify-center"></form-generator>

          <div style="display: flex; justify-content: center;" class="q-my-md">
            <q-input label="List Name" v-model="listName" style="width: 90%;" filled outlined round
                     @keydown.enter="addListName">
              <template v-slot:append>
                <q-icon name="add" @click.stop="addListName" @click="templateHelp = true"/>
              </template>
            </q-input>
          </div>
          <q-card flat>
            <q-card-section v-for="(lists,index) in listNames"
                            :key="index"
                            class="q-my-sm flex justify-center items-center"
                            style="-webkit-box-shadow: 0px 5px 13px 0px rgba(0,0,0,0.24); box-shadow: 0px 5px 13px 0px rgba(0,0,0,0.24);border-radius: 20px;"
            >
              <div class="text-sm text-mb-sm text-weight-medium">
                {{ lists.name }}
              </div>
              <q-space/>
              <div>
                <q-btn icon="close" flat color="primary" @click="listNames.splice(index, 1)"
                       class="cursor-pointer"></q-btn>
              </div>
            </q-card-section>
          </q-card>
        </q-card>
      </q-page>
    </q-page-container>
    <q-page-container>
      <q-page v-if="showTemplateSelect === true" class="q-ma-sm">
        <div class="q-my-md">
          <div class="row">
            <q-btn flat class="text-secondary" icon="fas fa-arrow-left" @click="showTemplateSelect = false">

            </q-btn>
            <q-space/>
            <q-toggle v-model="isPublic" :label="isPublic ? 'Public Templates' : host.name + ' templates' " left-label>

            </q-toggle>
          </div>
          <div>
            <q-expansion-item v-for="template in templates" :key="template._id" class="q-my-sm" style="z-index: 0;">
              <template v-slot:header>
                <q-item-section avatar>
                  <q-icon color="accent" name="fas fa-box" />
                </q-item-section>

                <q-item-section style="display: flex; flex-direction: column;">
                  <div clas="text-sm text-mb-sm">
                  {{template.name}}
                  </div>
                  <div class="text-xxs text-mb-xxs">
                  {{template.description}}
                  </div>
                </q-item-section>
                <div class="cursor-pointer flex flex-center" style="border-radius: 15px;z-index: 2;">
                <q-icon name="add" color="white" size="sm" class="bg-primary" style="border-radius: 15px;" @click.stop="createBoardFromTemplate(template)"/>
                </div>
              </template>
              <q-card flat>
                <q-card-section v-for="(card,index) in template.cards" :key="index">
                  {{ index + 1 }}. {{ card.name }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-footer class="bg-white text-black" bordered v-if="this.createTemplateForm === true">
      <q-toolbar>
        <q-btn @click="createTemplate" class="bg-secondary text-white">Create</q-btn>
        <q-space></q-space>
      </q-toolbar>
    </q-footer>
    <q-dialog v-model="templateHelp">
      <q-card class="flex flex-center text-sm text-mb-sm"
              style="width: 300px; height: 300px;text-indent: 20px;">
        <q-card-section>
          Board Templates are a way to define processes you want to use for managing tasks. <br>We recommend using our
          default preset templates but feel free to create your own. They are not specific to leads and can be for any
          task you can think of.
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
  import {models} from '@feathersjs/vuex';
  import {mapState, mapGetters} from 'vuex';

  export default {
    name: 'templateForm',
    props: {
      boards: Array,
    },
    data() {
      return {
        isPublic: true,
        showTemplateSelect: false,
        templateHelp: false,
        template_data: {},
        cardName: '',
        cardNames: [],
        createTemplateForm: false,
        template_fields: [
          {
            fieldType: 'TextInput',
            path: 'name',
            attrs: {
              label: 'Name',
              filled: true,
              clearable: true,
              'clear-icon': 'close',
              required: true,
              placeholder: 'Proposal Workflow'
            },
            'div-attrs': {
              class: 'col-10'
            }
          },
          {
            fieldType: 'TextInput',
            path: 'description',
            attrs: {
              filled: true,
              label: 'Description',
              required: true,
              type: 'textarea',
              placeholder: 'A workflow for new proposals....'
            },
            'div-attrs': {
              class: 'col-10'
            }
          },
          {
            fieldType: 'Toggle',
            path: 'private',
          },
        ],
      };
    },
    computed: {
      ...mapState({host: 'host'}),
      ...mapGetters('board-templates', {
        findTemplates: 'find'
      }),
      templates() {
        return this.findTemplates(this.templateQuery).data;
      },
      templateQuery(){
        if(this.isPublic){
          return {
            query: {
              private: false
            }
          };
        }else {
          return {
            query: {
              host: this.$lget(this.host, '_id'),
            }
          };
        }
      }
    },
    methods: {
      createBoardFromTemplate(template){
        this.$store.dispatch('boards/create', [{...template, order: this.boards.length + 1},{$boardFromTemplate: true} ]).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.log(err);
        });
      },
      addListName() {
        let card = {
          name: this.cardName,
          order: this.cardNames.length
        };
        this.cardNames.push(card);
        this.cardName = '';
      },
      createTemplate() {
        let template = new models.api.BoardTemplates(this.template_data).clone();
        template.host = this.host._id;
        template.cards = this.cardNames;
        template.create().then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Your workflow efficiency just improved by 2x!',
            timeout: 10000,
          });
          this.$emit('close');
        }).catch((err) => {
          this.$q.notify({
            type: 'negative',
            message: 'Something went wrong, please refresh and try again',
            timeout: 30000,
          });
          console.error(err);
        });
      }
    }
  };
</script>

<style scoped>

</style>
