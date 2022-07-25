<template>
  <div>
    <q-btn-toggle
      v-model="qry"
      toggle-color="primary"
      :options="[
        {label: 'One', value: q1},
        {label: 'Two', value: q2}
      ]"
    />
    <div>
      <span class="text-bold">
      Query:
    </span>
      {{ messagesParams }}
    </div>
    <div>
      <span class="text-bold">
      Data:
    </span>
      {{ messages }}
    </div>


  </div>
</template>

<script>
  import {makeFindMixin} from '@feathersjs/vuex';

  export default {
    name: 'messages',
    mixins: [makeFindMixin({name: 'messages', service: 'accounts', watch: true})],
    data() {
      return {
        q1: ['624b759cfd1b35a3cb53b40f','6265cf9161cea9879d5cbf75'],
        q2: ['6247249ea64050f44f92f921'],
        qry:[],
        limit: 15,
        skip: 1,
      };
    },
    computed: {
      queryParams() {
        console.log('extQuery:', this.extQuery._id);
        return {
          $limit: this.limit,
          $skip: this.skip,
          _id: this.extQuery._id,
        };
      },
      messagesParams() {
        return {
          query: this.queryParams,
          paginate: false,
        };
      },
      extQuery() {
        return {
          _id: {'$in': this.qry},
        };
      },
    },
    methods: { // Step 4

      previousPage() {
        this.skip = this.skip - this.limit;
      },
      nextPage() {
        this.skip = this.skip + this.limit;
      },
    },
  };
</script>

<style scoped>

</style>
