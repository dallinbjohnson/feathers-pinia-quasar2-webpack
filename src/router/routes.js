// eslint-disable-next-line no-unused-vars
export default function({ store, ssrContext }) {
  const routes = [
    {
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('pages/IndexPage.vue') },
        // {
        //   path: '',
        //   name: 'home',
        //   beforeEnter(to, from, next) {
        //     if (store.getters['auth/user']) {
        //       next({ name: 'dashboard' });
        //     } else {
        //       next();
        //     }
        //   },
        //   component: () => import('pages/Index.vue')
        // },

        {
          path: 'dashboard',
          name: 'dashboard',
          beforeEnter(to, from, next) {
            if (!store.getters['auth/user']) {
              next({ name: 'home' });
            } else {
              next();
            }
          },
          component: () => import('pages/Dashboard')
        },

        {
          path: 'msg',
          name: 'msg',
          meta: { requiresAuth: true },
          component: () => import ('components/messages.vue')
        },
        {
          path: '/balance-sheets',
          name: 'balance-sheets',
          meta: { requiresAuth: true },
          component: () => import('pages/qb_reports/BalancedSheets')
        },
        {
          path: '/profit-and-loss',
          name: 'profit-and-loss',
          meta: { requiresAuth: true },
          component: () => import('pages/qb_reports/ProfitAndLoss')
        },
        {
          path: 'notifications',
          name: 'notifications',
          meta: { requiresAuth: true },
          component: () => import ('pages/notifications/Notifications.vue')
        },
        {
          path: 'my-account/:id?',
          name: 'my-account',
          meta: { requiresAuth: true },
          // beforeEnter(to, from, next) {
          //   if (!store.getters['auth/user']) {
          //     next({name: 'home'});
          //   } else {
          //     next();
          //   }
          // },
          component: () => import('pages/profile/AccountProfile/AccountProfile')
        },
        {
          path: 'quickbooks-connect',
          name: 'quickbooks-connect',
          meta: { requiresAuth: true },
          component: () => import ('pages/ConnectQuickbooks.vue')
        },


        {
          path: 'messages',
          name: 'messages',
          meta: { requiresAuth: true },
          component: () => import ('pages/messages/messages.vue')
        },
        {
          path: 'chats',
          name: 'chats',
          meta: { requiresAuth: true },
          component: () => import ('pages/chats/chats.vue')
        },

        {
          path: 'boards',
          name: 'boards',
          meta: { requiresAuth: true },
          component: () => import ('pages/taskManager/boards')
        },
        {
          path: 'boards/:id',
          name: 'boardsProcess',
          meta: { requiresAuth: true },
          component: () => import ('pages/taskManager/boards')
        },
        {
          path: 'boards/:board_id/lists',
          name: 'lists',
          meta: { requiresAuth: true },
          component: () => import('pages/taskManager/lists.vue')
        },

        {
          path: 'projects',
          name: 'projects',
          meta: { requiresAuth: true },
          component: () => import('pages/Projects')
        },
        {
          path: 'WpbEditor/:page_id?',
          name: 'WpbEditor',
          component: () => import('pages/WpbEditor/WpbEditor'),
          props: (route) => {
            return {
              ...route.params
            };
          },
          meta: { requiresAuth: true }
        },

        {
          path: 'login',
          name: 'login',
          // eslint-disable-next-line no-unused-vars
          props(route) {
            return {
              attrs: {
                fieldsColor: 'secondary',
                redirectUrl: {
                  name: 'home'
                },
                'login-btn-attrs': {
                  class: ['shadow-5'],
                  color: 'primary',
                  'no-caps': false
                },
                'forgot-password-attrs': {
                  'btn-attrs': {
                    color: 'accent',
                    'no-caps': false
                  }
                },
                'title-attrs': {
                  class: 'text-uppercase',
                  style: 'font-size: 25px; font-weight: 700;'
                }
              },
              'page-attrs': {
                style: {
                  background: 'radial-gradient(rgba(0, 0, 0, .1), rgba(0, 0, 0, .5))',
                  'background-size': 'cover',
                  '-o-background-size': 'cover',
                  '-moz-background-size': 'cover',
                  '-webkit-background-size': 'cover'
                }
              }
            };
          },
          component: () => import('@iy4u/auth-management-client-lib/src/pages/login/baseLogin/loginPage')
        },
        {
          path: 'register',
          name: 'register',
          // eslint-disable-next-line no-unused-vars
          props(route) {
            return {
              attrs: {
                fieldsColor: 'secondary',
                default_verify_value: ['sms'],
                'title-attrs': {
                  class: 'text-uppercase',
                  style: 'font-size: 25px; font-weight: 700;'
                },
                'register-btn-attrs': {
                  class: ['shadow-5'],
                  color: 'primary',
                  'no-caps': false
                },
                'verify-dialog-title-attrs': {
                  class: 'bg-primary text-accent text-uppercase q-mb-sm'
                },
                'sentToMessage-attrs': {
                  class: 'text-weight-bold text-accent',
                  style: 'display: inline-block;'
                },
                'sentToMessage-div-attrs': {
                  class: 'text-uppercase',
                  style: 'font-size: 25px;'
                }
              },
              'page-attrs': {
                style: {
                  background: 'radial-gradient(rgba(0, 0, 0, .1), rgba(0, 0, 0, .5))',
                  'background-size': 'cover',
                  '-o-background-size': 'cover',
                  '-moz-background-size': 'cover',
                  '-webkit-background-size': 'cover'
                }
              }
            };
          },
          component: () => import('@iy4u/auth-management-client-lib/src/pages/register/baseRegister/registerPage')
        },
        {
          path: 'verify',
          name: 'verify',
          component: () => import('@iy4u/auth-management-client-lib/src/pages/authManagement/verifyEmail/verifyEmailPage')
        },
        {
          path: 'resetPassword',
          name: 'resetPassword',
          component: () => import('@iy4u/auth-management-client-lib/src/pages/authManagement/resetPassword/resetPasswordPage')
        },
        {
          path: 'verifyAndSetPassword',
          name: 'verifyAndSetPassword',
          component: () => import('@iy4u/auth-management-client-lib/src/pages/authManagement/verifyAndSetPassword/verifyAndSetPasswordPage')
        },
        {
          path: 'changePassword',
          name: 'changePassword',
          component: () => import('@iy4u/auth-management-client-lib/src/pages/authManagement/changePassword/changePasswordPage')
        },

        {
          path: 'logout',
          name: 'logout',
          beforeEnter(to, from, next) {
            store.dispatch('auth/logout')
              // eslint-disable-next-line no-unused-vars
              .then(result => {
                // console.log('logout:', result);
                if (from.path === '/') {
                  next({ name: 'login' });
                } else {
                  next('/');
                }
              })
              .catch(error => {
                console.error('error logout:', error);
                next(from);
              });
          }
        }
      ]
    },
    {
      path: '/bank',
      component: () => import('components/banks/BankDashboard')
    },

    // Always leave this as last one,
    // but you can also remove it
    {
      path: '/:catchAll(.*)*',
      component: () => import('pages/ErrorNotFound.vue')
    }
  ];
  return routes;
}
