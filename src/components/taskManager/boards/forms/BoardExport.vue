<template>
  <q-card>
    <q-card-section>
      Board Export List

    </q-card-section>
    <q-card-section>
      <q-select emit-value map-options :options="boards" option-label="name" v-model="selectedBoard" label="Name"></q-select>
<!--      <q-list>-->
<!--        <q-item clickable v-for="(board, i) in boards" :key="i" @click="selectedBoard = board">-->
<!--          <q-item-section>-->
<!--            {{board.name}}-->
<!--          </q-item-section>-->
<!--        </q-item>-->
<!--      </q-list>-->
    </q-card-section>
    <q-card-section>
      <p>Selected Board: {{$lget(selectedBoard,'name','')}}</p>
    </q-card-section>
    <q-card-actions align="right">
      <q-btn dense label="Save" @click="exportBoard"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
  // import makeFindMixin from '@feathersjs/vuex';
  import {mapActions, mapGetters} from 'vuex';
  import { models } from '@feathersjs/vuex';


  export default {
    name: 'BoardExport',
    // mixins:[
    //   makeFindMixin({
    //     service: 'boards'
    //   })],
    props:{
      card: {type: Object}
    },
    data(){
      return {
        selectedBoard: null,
      };
    },
    mounted(){
      this.loadBoards(this.boardsParams);
    },
    computed:{
      ...mapGetters('boards', {getBoards:'find'}),
      boardsParams(){
        return {query: {host: this.$lget(this.card,'host','')}};
      },
      boards(){
        return this.getBoards(this.boardsParams).data.map(board => board.clone());
      },
      options(){
        return this.boards.map(board => {
          return {
            label: board.name,
            value: board
          };
        });
      },
      form(){
        return new models.api.Cards(this.card).clone();
      }
    },
    methods:{
      ...mapActions('boards', {loadBoards: 'find'}),
      exportBoard(){
        if(this.$lget(this.selectedBoard,'lists',[]).length){
          this.form.list = this.selectedBoard.lists[0];
          this.form.save()
            .then(()=> {
              this.$q.notify({
                type: 'positive',
                message: 'Board was successfully exported',
                timeout: 10000,
              });
            })
            .catch((err)=>{
              console.error(err);
              this.$q.notify({
                type: 'negative',
                message: 'Error exporting this board',
                timeout: 30000,
              });
            });
        } else {
          this.$q.notify({
            type: 'negative',
            message: 'That board does not have any lists yet',
            timeout: 30000,
          });
        }
      }
    }
  };

</script>

<style scoped>

</style>
