<template>
  <q-page>
    <p>pinia users:</p>
    <ol>
      <li v-for="(user, index) in users" :key="index">{{ user.name }}</li>
    </ol>
    <q-pagination :model-value="currentPage"
                  @update:model-value="toPage"
                  :max="pageCount"
                  :max-pages="6"
                  direction-links
                  boundary-links></q-pagination>
  </q-page>
</template>

<script>
  import { defineComponent, computed, reactive } from 'vue';
  import { useFind, usePagination } from 'feathers-pinia';

  import useUsers from 'stores/services/users';

  export default defineComponent({
    name: 'IndexPage',
    setup() {
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

      return {
        pagination,
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
