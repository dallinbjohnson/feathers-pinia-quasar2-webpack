<template>
  <q-page id="MyAccountsAdmin" class="q-pa-md">
    <f-data-accounts/>
  </q-page>
</template>

<script>
  import FDataAccounts from 'pages/admin/AdminTables/FDataAccounts';
  export default {
    name: 'AdminAccounts',
    components: {FDataAccounts},
  };
</script>

<style scoped lang="scss">
</style>

<style lang="scss">
  #MyAccountsAdmin {
    #FormGenerator {
      #FormsetGenerator {
        .q-card {
          //box-shadow: unset;
          max-height: 300px;
          overflow-y: scroll;
        }
      }
    }
  }
</style>
