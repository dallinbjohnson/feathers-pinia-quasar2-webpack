<template>
  <div>
    <q-timeline>
      <q-timeline-entry v-for="(event, i) in cardEvents"
                        :key=i
                        :body="$lget(event,'body')"
                        :subtitle="$lget(event, 'subtitle')"
                        :title="$lget(event, 'title')"
                        @click="editEvent(event)"
                        class="cursor-pointer"
      >
      </q-timeline-entry>

    </q-timeline>
    <q-btn label="New Event" @click="createEvent" color="primary"></q-btn>
    <q-dialog v-model="cardEventFormDialog">
      <card-event-form :cardEventIn="selectedCardEvent"
                       :card="card"
                       @close-dialog="cardEventFormDialog=false">
      </card-event-form>
    </q-dialog>
  </div>
</template>

<script>
  import CardEventForm from './forms/CardEventForm';

  export default {
    name: 'CardEventList',
    components: {
      CardEventForm
    },
    data() {
      return {
        cardEventFormDialog: false,
        selectedCardEvent: {}
      };
    },
    props: {
      cardEvents: {type: Array},
      card: {type: Object}
    },
    methods: {
      // ...mapActions('card-events', {loadEvents: 'find'}),
      editEvent(cardEvent) {
        this.selectedCardEvent = cardEvent;
        this.cardEventFormDialog = true;
      },
      createEvent() {
        this.selectedCardEvent = {};
        this.cardEventFormDialog = true;
      }
    }
  };
</script>

<style scoped>

</style>
