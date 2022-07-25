<template>
  <div id="publishing" style="font-size: 1.3rem">
    <div>
      Create New Version <span><q-btn outline size="md" :icon="publishDio ? 'mdi-minus' : 'mdi-plus'"
                                      @click.stop="startPublish"/></span>
    </div>
    <div v-if="publishDio">
      <div>
        <h5>Version Info</h5>
        <q-form @submit.prevent="publish">
          <q-input readonly label="Next Version" v-model="payload.version"/>
          <q-input label="Publish Date" type="date" v-model="payload.publish_date"/>
          <q-input label="Publish End Date" type="date" v-model="payload.end_date"/>
          <q-checkbox left-label label="Active? " type="checkbox" v-model="payload.active"/>
          <q-card-actions>
            <q-btn color="primary" type="submit">Submit</q-btn>
            <q-space/>
            <q-btn @click.stop="publishDio = false">Cancel</q-btn>
          </q-card-actions>
        </q-form>
      </div>
    </div>

    Published Versions
    <div v-for="pub in publications"
         :key="pub._id" style="font-size: 1.1rem"
         :style="{border: pub.active ? '1px solid black' : 'none', }">
      <div class="flex column q-mb-sm">
        <div class="q-pl-sm">
          Version: {{ pub.version }}
          <span v-if="pub.active" class="text-red q-pr-sm q-ml-sm" style="width: 65px">Active</span>
        </div>
        <div class="q-pl-sm">Created: {{ new Date(pub.createdAt).toLocaleDateString() }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {makeFindMixin} from '@feathersjs/vuex';

  export default {
    name: 'publishing',
    mixins: [
      makeFindMixin({
        service: 'wpb-page-publications',
        name: 'publications',
        qid: 'publications',
      }),
    ],
    props: {
      page: Object,
    },
    data() {
      return {
        publishDio: false,
        payload: {
          version: 0,
          publish_date: new Date(),
          end_date: new Date(),
          active: true,
          page_id: this.$lget(this.page, '_id'),
        },
      };
    },
    created() {
    },
    mounted() {
    },
    computed: {
      publicationsParams() {
        return {
          query: {
            page_id: this.$lget(this.page, '_id'),
            $sort: {
              version: -1,
            },
          },
        };
      },
      lastVersion() {
        return this.publications.reduce((acc, curr) => {
          let currV = Number(curr.version);
          return currV > acc ? currV : acc;
        }, 0);
      },
      feathersAxios() {
        return this.$axios.create({
          baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.$store.state.auth.accessToken,
          },
        });
      },
    },
    watch: {},
    methods: {
      startPublish() {
        this.payload = {
          version: this.lastVersion + 1,
          publish_date: new Date(),
          end_date: new Date(),
          active: true,
          page_id: this.$lget(this.page, '_id'),
        };
        this.publishDio = !this.publishDio;
      },
      async publish() {
        let publishPayload = {
          action: 'publication',
          value: this.payload,
        };
        await this.feathersAxios.post('/wpb-management', publishPayload)
          .then(async () => {
            this.publishDio = !this.publishDio;
            this.$emit('saved');

            this.$q.notify({
              type: 'positive',
              timeout: 2000,
              message: 'Published',
            });
          })
          .catch(err => {
            console.error('autosave error', err);
          });
      },
    },
  };
</script>

<style scoped lang="scss">
  #publishing {

  }
</style>
