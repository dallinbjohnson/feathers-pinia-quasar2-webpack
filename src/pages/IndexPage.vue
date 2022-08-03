<template>
  <q-page>
    <p>pinia:</p>
    <ol>
      <li v-for="(user, index) in users" :key="index">{{ user.name }}</li>
    </ol>
    <q-pagination :model-value="currentPage"
                  @update:model-value="toPage"
                  :max="pageCount"
                  :max-pages="6"
                  direction-links
                  boundary-links></q-pagination>

    <!--    {{ logins.map(item => item.name) }}-->
    <!--    {{ accounts.map(item => item.name) }}-->

<!--&lt;!&ndash;    <hr>&ndash;&gt;-->

<!--    <p>vuex:</p>-->
<!--    <ol>-->
<!--      <li v-for="(user, index) in vuexUsers" :key="index">{{ user.name }}</li>-->
<!--    </ol>-->

<!--    <FeathersVuexPagination v-model="pagination" :latest-query="vuexLatestQuery">-->
<!--      <template #default="{ currentPage, pageCount, toPage }">-->
<!--        <q-pagination :model-value="currentPage"-->
<!--                      @update:model-value="toPage"-->
<!--                      :max="pageCount"-->
<!--                      :max-pages="6"-->
<!--                      direction-links-->
<!--                      boundary-links></q-pagination>-->
<!--      </template>-->
<!--    </FeathersVuexPagination>-->
  </q-page>
</template>

<script>
  import { defineComponent, computed, reactive/*, watch, ref*/ } from 'vue';
  import { useFind, usePagination } from 'feathers-pinia';
  // import { useFind as useFindVuex, models, FeathersVuexPagination } from '@feathersjs/vuex';

  import useUsers from 'stores/services/users';
  import useLogins from 'stores/services/logins';
  import useAccounts from 'stores/services/accounts';

  export default defineComponent({
    name: 'IndexPage',
    components: {
      // FeathersVuexPagination,
    },
    setup() {
      // eslint-disable-next-line no-unused-vars
      const loginsStore = useLogins();
      // let logins = computed(() => {
      //   return loginsStore.findInStore().data;
      // });

      // eslint-disable-next-line no-unused-vars
      const accountsStore = useAccounts();
      // let accounts = computed(() => {
      //   return accountsStore.findInStore().data;
      // });

      const usersStore = useUsers();

      const pagination = reactive({ $limit: 5, $skip: 0 });

      const usersParams = computed(() => {
        return {
          query: {
            ...pagination,
          },
          qid: 'users',
          paginate: true,

          rulesJoin: true,
          usersResolversQuery: {
            logins: [undefined, {
              loginsResolversQuery: {
                accounts: true,
              },
            }],
          },
        };
      });

      const { items: users, latestQuery, ...meta } = useFind({
        model: usersStore.Model,
        params: usersParams,
      });
      const {
        // next,
        // prev,
        // canNext,
        // canPrev,
        currentPage,
        // itemsCount,
        pageCount,
        toPage,
        // toStart,
        // toEnd
      } = usePagination(pagination, latestQuery);


      // const { Users } = models.api;
      //
      // const usersVuexParams = computed(() => {
      //   return {
      //     query: {
      //       ...pagination,
      //     },
      //     rulesJoin: true,
      //     usersResolversQuery: {
      //       logins: [undefined, {
      //         loginsResolversQuery: {
      //           accounts: true,
      //         },
      //       }],
      //     },
      //   };
      // });
      //
      // const { latestQuery: vuexLatestQuery, ...vuexMeta } = useFindVuex({
      //   model: Users,
      //   params: usersVuexParams,
      // });
      //
      // let vuexUsers = ref([]);
      //
      // watch(vuexLatestQuery, () => {
      //   vuexUsers.value = vuexLatestQuery?.value?.response?.data || [];
      // }, { immediate: true, deep: true });

      return {
        // vuexMeta,
        // vuexLatestQuery,
        // vuexUsers,

        pagination,

        // logins,
        // accounts,
        meta,
        usersParams,
        latestQuery,
        users,
        currentPage,
        pageCount,
        toPage,
      };
    },
  });
</script>
