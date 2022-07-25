<template>
  <q-page class="flex flex-center pageContainer">
    <div class="userManagementContainer">
      <div class="headerUser">{{ addUser ? 'User management' : 'Create a user' }}</div>

      <div v-if="!addUser">
        <UserManagementTable @startEdit="setUser" @addUser="addUser = true" :table-fields="['email', {name: 'roles', path: '_fastjoin.roles', val: 'name'}, 'isVerified', 'createdAt']" :roles="roles"/>
      </div>

      <div v-else>
        <AddUser @clearUser="userToPass = {}" :userToPass="userToPass" :fields="[{name: 'email', type: 'string'}, {name: 'password', type: 'string'}, {name: 'roles', type: 'select', data: roles, isFastJoin: true}, {name: 'isVerified', type: 'checkbox'}]" @goBack="addUser = false"/>
      </div>

    </div>
  </q-page>
</template>

<script>
  import UserManagementTable from 'components/admin/UserManagement/UserManagementTable';
  // import {routerMixin} from '@iy4u/common-client-lib';
  import {mapActions, mapGetters} from 'vuex';
  import AddUser from 'pages/admin/AddUser';

  export default {
    name: 'UserManagement',
    components: {AddUser, UserManagementTable},
    data(){
      return {
        addUser: false,
        userToPass: {}
      };
    },
    mixins: [
      // routerMixin({
      //   name: 'Users',
      //   query() {
      //     return {
      //       addUser: this.addUser
      //     };
      //   }
      // }),
    ],
    mounted(){
      this.loadRoles();
    },
    computed: {
      ...mapGetters('ir-roles-roles', {
        getRoles: 'find'
      }),
      roles(){
        return this.getRoles().data;
      },
    },
    methods: {
      ...mapActions('ir-roles-roles', {
        loadRoles: 'find'
      }),
      setUser(e){
        this.userToPass = e;
        this.addUser = true;
      }
    },
  };
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;900&display=swap');

  .sourceSansPro {
    font-family: 'Source Sans Pro', sans-serif;
  }

  .userManagementContainer {
    height: 95%;
    width: 95%;
  }
  .pageContainer {
    height: 100vh;
    width: 100vw;
  }
  .headerUser {
    margin: 20px 0 40px 0;
    font-size: 1.75em;
  }
</style>
