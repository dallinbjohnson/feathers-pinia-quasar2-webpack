import { route } from 'quasar/wrappers';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';

import {Notify} from 'quasar';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function ( { store/*, ssrContext*/ } ) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  });

  Router.beforeEach(async (to, from, next) => {
    if (!store.getters['auth/isAuthenticated']) {
      await store.dispatch('auth/authenticate', {
        strategy: 'local',
        email: 'dev@ionrev.com',
        password: 'W3lc0m3^',
      })
        .then(() => {
          // console.log('authenticated');
          // console.log('getters user', store.getters['auth/user']);
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
            next();
          }
        });
    } else {
      next();
    }
  });

  return Router;
});
