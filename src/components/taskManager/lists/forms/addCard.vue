<template>
  <div id="addCard" :class="[ $q.dark.mode ? 'bg-dark' : 'bg-white']">
    <q-btn v-if="!show_add_card"
           flat
           icon="add"
           class="full-width"
           @click.stop="show_add_card = true"
           @touchstart.stop="show_add_card = true">
      {{label}}
    </q-btn>
    <q-card flat v-else style="width: 100%; margin: 5px 2px 5px 2px;">
      <q-card-section class="flex" style="align-items: center;">
        <q-input v-model="name" @touchstart.stop="focusCardInput" ref="new-card-input" type="textarea" filled autogrow autofocus style="width: 100%;"></q-input>

        <q-btn color="primary" @click.stop="createCard" @touchstart.stop="createCard" :disable="!name || !name.length">Save</q-btn>
        <q-btn flat round icon="close" @click.stop="show_add_card = false" @touchstart.stop="show_add_card = false"></q-btn>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
  import {models} from '@feathersjs/vuex';

  export default {
    name: 'addCard',
    props: {
      list: {
        type: Object,
        required: true,
        default: () => {return {};}
      },
      parentCard: {
        type: Object,
        required: false,
      },
      label: {
        type: String,
        required: false,
        default: () => {return 'New Card';}
      }
    },
    data() {
      return {
        show_add_card: false,
        name: undefined,
      };
    },
    methods: {
      focusCardInput() {
        let el = this.$refs['new-card-input'];
        el.focus();
      },
      createCard() {

        let new_card = new models.api.Cards({name: this.name, list: this.list._id, order: this.list._fastjoin.cards.length}).clone();
        if(this.parentCard){
          new_card.parent = this.parentCard._id;
        }
        new_card.create()
          .then(result => {
            if(this.parentCard){
              let childrenArr = this.parentCard.children;
              childrenArr.push(result._id);
              this.$store.dispatch('cards/patch', [this.parentCard._id, {children: childrenArr}]);
            }
            this.show_add_card = false;
            this.name = undefined;
            this.$emit('cardCreated');
            this.$isLoading(false);
            this.$q.notify({
              type: 'positive',
              message: `Successfully Created "${result.name}"`,
              timeout: 10000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  }
                }
              ]
            });
          })
          .catch(error => {
            this.$isLoading(false);
            this.$q.notify({
              type: 'negative',
              message: error.message,
              timeout: 30000,
              actions: [
                {
                  icon: 'close', color: 'white', handler: () => {
                    /* ... */
                  }
                }
              ]
            });
          });
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
