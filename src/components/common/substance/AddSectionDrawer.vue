<template>
  <q-drawer :value="editing" bordered content-class="bg-grey-1">
    <q-list padding>
      <q-item>
        Section Adder
      </q-item>
      <q-item clickable v-for="template in templates" :key="template._id" @click="selectedSectionToAdd = template">
        <add-section-item :template="template" ></add-section-item>
      </q-item>

      <q-btn label="add" @click="addSection"></q-btn>
    </q-list>
  </q-drawer>
</template>

<script>
  import AddSectionItem from '../molecules/AddSectionItem';
  import {mapActions} from 'vuex';

  export default {
    components: {
      AddSectionItem
    },
    props: {
      templates: Array,
      editing: Boolean,
      currentPage: Object,
      user: Object
    },
    data() {
      return {
        selectedSectionToAdd: {},
      };
    },
    computed: {},
    methods: {
      ...mapActions('wpb-sections', {
        createSection: 'create'
      }),
      async addSection() {
        let {styles, children, elements} =this.selectedSectionToAdd;
        let order = this.$lget(this.currentPage, 'sections', []).length;
        this.$lset(this.selectedSectionToAdd, 'styles.order', order);
        let payload = {
          styles,
          children,
          elements,
          page: this.currentPage._id,
          user: this.user
        };
        console.log('payload is:', payload);
        await this.createSection(payload)
          .then(res => {
            console.log('section successfully created', res);
            this.selectedSectionToAdd = {};
          })
          .catch(err => {
            console.error('error creating section', err);
          });
      }
    },

  };
</script>

<style lang="scss" scoped>

</style>
