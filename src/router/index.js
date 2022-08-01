import { route } from 'quasar/wrappers';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import {Notify} from 'quasar';

import Routes from './routes';
import ErcRoutes from './ercRoutes';
import adminRoutes from './adminRoutes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const host = window.location.host;

export default route(function({ store, ssrContext }) {
  let routes = [];
  let siteDomains = (process.env.SITE_DOMAIN || '127.0.0.1,localhost').split(',');
  if (!siteDomains.some(item => host.includes(item))) {
    routes = ErcRoutes({ store, ssrContext });
  } else {
    routes = Routes({ store, ssrContext });
  }

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {

    // hooks.fingerprintRouterBeforeEach(FeathersClient, store).then(
    //   () => {
    //     console.log('FP Recorded: ');
    //   }
    // ).catch(
    //   err =>{
    //     console.log('FP ERR: ', err);
    //   }
    // );
    // console.log('authenticated beforeEach');
    if (!store.getters['auth/isAuthenticated']) {
      await store.dispatch('auth/authenticate')
        .then(() => {
          // console.log('authenticated');
          // console.log('getters user', store.getters['auth/user']);
          // let rules = Router.app.$lget(store.state, 'auth.rules', []);
          // Router.app.$ability.update(rules);

          if (to.meta.requiresAuth) {
            if (store.getters['auth/isAuthenticated']) {
              // console.log('pass');
              next();
            } else {
              // console.log('not pass', store.state.auth.user);
              Notify.create({
                type: 'negative',
                message: 'Page is restricted',
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
              next('/login');
            }
          } else {
            next();
          }
        })
        .catch((e) => {
          console.log('not authenticated', e);
          if (to.meta.requiresAuth) {
            if (store.getters['auth/isAuthenticated']) {
              // let rules = Router.app.$lget(store.state, 'auth.rules', []);
              // Router.app.$ability.update(rules);

              next();
            } else {
              Notify.create({
                type: 'negative',
                message: 'Page is restricted. Please login or register.',
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    },
                  },
                ],
              });
              next('/login');
            }
          } else {
            if (store.getters['auth/isAuthenticated']) {
              // let rules = Router.app.$lget(store.state, 'auth.rules', []);
              // Router.app.$ability.update(rules);
            }

            next();
          }
        });
    } else {
      // let rules = Router.app.$lget(store.state, 'auth.rules', []);
      // Router.app.$ability.update(rules);
      next();
    }
  });

  adminRoutes({
    Router,
    store,
    ssrContext,
    // defaultRoute: {
    //   icon: 'fas fa-user-friends',
    //   title: 'Users',
    //   // $can: () => router.app.$can('manage', 'users'),
    //   $can: () => true,
    //   path: 'user-management',
    //   name: 'admin-user-management',
    //   component: () => import('../pages/admin/users/users'),
    // },
    beforeRouteConfigs: [
      {
        icon: 'fas fa-money-bill-wave',
        title: 'Payments',
        // $can: () => router.app.$can('manage', 'payments'),
        $can: () => true,
        path: 'payments',
        name: 'admin-payments',
        component: () => import('../pages/admin/payments/payments'),
      },
      // {
      //   icon: 'fas fa-store',
      //   $can: () => true,
      //   title: 'Stores',
      //   path: 'admin-stores',
      //   name: 'admin-my-stores',
      //   component: () => import('components/profile/profile-admin/Stores'),
      // },
      {
        icon: 'fas fa-users-cog',
        title: 'Participant Management',
        $can: () => true,
        children: [
          {
            icon: 'fas fa-user-secret',
            title: 'Participants',
            $can: () => true,
            path: 'participants',
            name: 'admin-participants',
            component: () => import('../pages/admin/participants/participants'),
          },
          {
            icon: 'fas fa-comments',
            title: 'Chats',
            $can: () => true,
            children: [
              {
                icon: 'fas fa-door-open',
                title: 'Rooms',
                $can: () => true,
                path: 'rooms',
                name: 'admin-rooms',
                component: () => import('../pages/admin/rooms/rooms'),
              },
              {
                icon: 'far fa-comments',
                title: 'Chats',
                $can: () => true,
                path: 'chats',
                name: 'admin-chats',
                component: () => import('../pages/admin/chats/chats'),
              },
            ],
          },
          {
            icon: 'fas fa-check',
            title: 'Task Manager',
            $can: () => true,
            children: [
              {
                icon: 'fas fa-chalkboard',
                title: 'Boards',
                $can: () => true,
                path: 'boards',
                name: 'admin-boards',
                component: () => import('../pages/admin/TaskManager/boards'),
              },
              {
                icon: 'fas fa-bars',
                title: 'Lists',
                $can: () => true,
                path: 'lists',
                name: 'admin-lists',
                component: () => import('../pages/admin/TaskManager/lists'),
              },
              {
                icon: 'fas fa-check-square',
                title: 'Cards',
                $can: () => true,
                path: 'cards',
                name: 'admin-cards',
                component: () => import('../pages/admin/TaskManager/cards'),
              },
              {
                icon: 'fas fa-pencil-ruler',
                title: 'Board Templates',
                $can: () => true,
                path: 'board-templates',
                name: 'admin-board-templates',
                component: () => import('../pages/admin/TaskManager/boardTemplates'),
              },
              {
                icon: 'fas fa-calendar-check',
                title: 'Card Events',
                $can: () => true,
                path: 'card-events',
                name: 'admin-card-events',
                component: () => import('../pages/admin/TaskManager/cardEvents'),
              },
            ],
          },
          {
            icon: 'fas fa-calendar',
            title: 'Events',
            $can: () => true,
            children: [
              {
                icon: 'far fa-calendar',
                title: 'Events',
                $can: () => true,
                path: 'events',
                name: 'admin-events',
                component: () => import('../pages/admin/events/events'),
              },
              {
                icon: 'fas fa-calendar-alt',
                title: 'Event Templates',
                $can: () => true,
                path: 'event-templates',
                name: 'admin-event-templates',
                component: () => import('../pages/admin/events/eventTemplates'),
              },
              {
                icon: 'fas fa-user-clock',
                title: 'Participant Events',
                $can: () => true,
                path: 'participant-events',
                name: 'admin-participant-events',
                component: () => import('../pages/admin/events/participantEvents'),
              },
            ],
          },
          {
            icon: 'fas fa-video',
            title: 'Streams',
            $can: () => true,
            children: [
              {
                icon: 'fas fa-broadcast-tower',
                title: 'Streams',
                $can: () => true,
                path: 'streams',
                name: 'admin-streams',
                component: () => import('../pages/admin/streams/streams'),
              },
              {
                icon: 'fas fa-layer-group',
                title: 'Stream Groups',
                $can: () => true,
                path: 'stream-groups',
                name: 'admin-stream-groups',
                component: () => import('../pages/admin/streams/streamGroups'),
              },
            ],
          },
        ],
      },
    ],
    afterRouteConfigs: [
      {
        // eslint-disable-next-line no-undef
        icon: `img:${require('@iy4u/common-client-lib/src/assets/icons/svg/quickBooksIcon_black.svg')}`,
        title: 'Connect Quickbooks',
        // $can: () => router.app.$can('manage', 'quickbooks'),
        $can: () => true,
        path: 'quickbooks',
        name: 'admin-quickbooks',
        component: () => import('../pages/admin/ConnectQuickbooks'),
      },
    ],
  });

  return Router;
});
