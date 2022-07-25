<template>
  <div class="filter-wrapper row">
    <q-select class="col-3" multiple map-options use-chips emit-value option-value="_id" option-label="name" v-model="rolesArr" :options="roles" label="Filter By Roles"></q-select>
    <q-checkbox toggle-indeterminate class="col-3" v-model="isVerified" label="User is verified" />
  </div>
</template>

<script>

  export default {
    name: 'UserManagementFilter',
    data(){
      return {
        rolesArr: [],
        isVerified: null
      };
    },
    props: {
      roles: {
        type: Array,
        default: () => []
      }
    },
    watch: {
      finalQuery: {
        deep: true,
        handler(newVal, oldVal) {
          if(JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.emitValue();
          }
        }
      }
    },
    computed: {
      finalQuery(){
        return {
          roles: this.rolesArr.length ? this.rolesArr : [],
          isVerified: this.isVerified === null ? null : (this.isVerified ? true : false)
        };
      }
    },
    methods: {
      emitValue(){
        this.$emit('queryChange', this.finalQuery);
      }
    }
  };
</script>

<style scoped lang="scss">

</style>
