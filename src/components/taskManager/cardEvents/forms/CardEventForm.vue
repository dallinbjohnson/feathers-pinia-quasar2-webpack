<template>
  <q-card style="min-width: 50vw;">
    <q-card-section>
      <q-input v-model="form.title" label="Title"></q-input>
      <q-input v-model="form.subtitle" label="Subtitle"></q-input>
      <q-input v-model="form.body" label="Body"></q-input>
    </q-card-section>
    <q-card-section>
      <q-card-actions>
        <q-btn label="save" @click="saveEvent" color="primary"></q-btn>
        <q-btn v-if="form._id" label="delete" @click="deleteEvent" color="negative"></q-btn>
      </q-card-actions>
    </q-card-section>
  </q-card>
</template>

<script>
  import { models } from '@feathersjs/vuex';
  export default {
    name: 'CardEventForm',
    mounted(){
      if(this.$lget(this.cardEventIn,'_id')){
        this.form = new models.api.CardEvents(this.cardEventIn).clone();
      } else {
        this.form = new models.api.CardEvents({card: this.card._id}).clone();
      }
    },
    data(){
      return{
        form: {}
      };
    },
    props:{
      cardEventIn: {type: Object},
      card: {type: Object}
    },
    methods:{
      saveEvent(){
        this.$isLoading = true;
        this.form.save()
          .then(() =>{
            this.$q.notify({
              type: 'positive',
              message: 'Your event was saved successfully',
              timeout: 10000,
            });
            this.$emit('close-dialog');
            this.$isLoading = false;
          })
          .catch(() =>{
            this.$q.notify({
              type: 'negative',
              message: 'There was an error saving your event',
              timeout: 30000,
            });
          });
      },
      deleteEvent(){
        this.$isLoading = true;
        this.form.remove()
          .then(()=>{
            this.$q.notify({
              type: 'positive',
              message: 'Your event was deleted successfully',
              timeout: 10000,
            });
            this.$emit('close-dialog');
            this.$isLoading = false;
          })
          .catch(()=>{
            this.$q.notify({
              type: 'negative',
              message: 'There was a problem saving your record',
              timeout: 30000,
            });
          });
      }
    }
  };
</script>

<style scoped>

</style>
