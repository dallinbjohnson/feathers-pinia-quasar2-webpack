/* eslint-disable no-unused-vars */
import {Notify} from 'quasar';
import lget from 'lodash/get';
import {environmentRoutes} from '@iy4u/common-client-lib';

export default function (
  {
    Router,
    store,
    ssrContext,
    defaultRoute = {
      name: 'admin-dashboard',
    },
    beforeRouteConfigs = [],
    afterRouteConfigs = [],
  }) {

  function getFormattedRoutes(routes) {
    let children = [], hiddenRoutes = [], baseRoutes = [];
    routes.forEach((route) => {
      if (lget(route, 'children', []).length) {
        route.children.forEach((child) => {
          if (lget(child, 'children', []).length) {
            let nestedRoutes = getFormattedRoutes(child.children);
            children.push(...nestedRoutes);
          }

          if (child.path) {
            let obj = {
              name: child.name,
              path: child.path,
              component: child.component,
              $can: child.$can,
            };
            children.push(obj);
          }
        });
      }
      if (lget(route, 'hiddenRoutes', []).length) {

        route.hiddenRoutes.forEach(hidden => {
          if (lget(hidden, 'hiddenRoutes', []).length) {
            let nestedHiddenRoutes = getFormattedRoutes(hidden.hiddenRoutes);
            hiddenRoutes.push(...nestedHiddenRoutes);
          }

          if (hidden.path) {
            let hiddObj = {
              name: hidden.name,
              path: route.path + '/' + hidden.path,
              component: hidden.component,
              $can: hidden.$can,
            };
            hiddenRoutes.push(hiddObj);
          }
        });
      }
      if (route.path) {
        let obj = {
          name: route.name,
          path: route.path,
          component: route.component,
          $can: route.$can,
        };
        baseRoutes.push(obj);
      }
    });
    return [...baseRoutes, ...children, ...hiddenRoutes];
  }

  // commonRoutes.children = commonRoutes.childrenRoutes.map(child => {
  //
  //   return  {
  //     icon: child.icon,
  //     $can: () => true,
  //     title: child.title,
  //     path: child.routeTo,
  //     name: child.title,
  //     component: child.component,
  //     iconColor: 'orangered',
  //     textColor: 'purple',
  //   };
  // });


// eslint-disable-next-line no-unused-vars
  const adminRouteConfigure = (
    {
      router,
      store,
      defaultRoute = {},
      beforeRouteConfigs = [],
      afterRouteConfigs = [],
    } = {}) => {
    let defaultRoutes = [
      // {
      //   icon: 'fas fa-chart-line',
      //   $can: () => true,
      //   title: 'Sample Dashboard',
      //   path: 'sample-dashboard',
      //   name: 'admin-sample-dashboard',
      //   component: () => import('pages/admin/SampleDashboard'),
      //   hiddenRoutes: [
      //     {
      //       $can: () => true,
      //       path: 'dashboard-sample-one',
      //       name: 'admin-dashboard-sample-one',
      //       component: () => import('components/admin/Dashboards/sample-one'),
      //     },
      //     {
      //       $can: () => true,
      //       path: 'dashboard-sample-two',
      //       name: 'admin-dashboard-sample-two',
      //       component: () => import('components/admin/Dashboards/sample-two'),
      //     },
      //     {
      //       $can: () => true,
      //       path: 'dashboard-sample-three',
      //       name: 'admin-dashboard-sample-three',
      //       component: () => import('components/admin/Dashboards/sample-three'),
      //     },
      //     {
      //       $can: () => true,
      //       path: 'dashboard-sample-four',
      //       name: 'admin-dashboard-sample-four',
      //       component: () => import('components/admin/Dashboards/sample-four'),
      //     },
      //   ]
      // },
      {
        icon: 'fas fa-home',
        $can: () => true,
        title: 'Dashboard',
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('pages/admin/Dashboard'),
      },
      {
        icon: 'fas fa-users',
        $can: () => true,
        title: 'Accounts',
        path: 'my-accounts',
        name: 'admin-my-accounts',
        component: () => import('pages/admin/Accounts/AdminAccounts'),
      },
      {
        icon: 'fas fa-user-friends',
        title: 'Users',
        $can: () => router.app.$can('manage', 'users'),
        // $can: () => true,
        path: 'user-management',
        name: 'admin-user-management',
        component: () => import('../pages/admin/users/users'),
      },
      {
        icon: 'admin_panel_settings',
        title: 'Roles and Permissions',
        $can: () => router.app.$can('manage', ['roles', 'abilities', 'rules']),
        // $can: () => true,
        children: [
          {
            icon: 'fas fa-user-shield',
            title: 'Roles',
            $can: () => router.app.$can('manage', 'roles'),
            // $can: () => true,
            path: 'roles',
            name: 'admin-roles',
            component: () => import('../pages/admin/roles/roles'),
          },
          {
            icon: 'fas fa-shield-alt',
            title: 'Abilities',
            $can: () => router.app.$can('manage', 'abilities'),
            // $can: () => true,
            path: 'abilities',
            name: 'admin-abilities',
            component: () => import('../pages/admin/abilities/abilities'),
          },
          {
            icon: 'rule',
            title: 'Rules',
            $can: () => router.app.$can('manage', 'rules'),
            // $can: () => true,
            path: 'rules',
            name: 'admin-rules',
            component: () => import('../pages/admin/rules/rules'),
          },
        ],
      },
      environmentRoutes,
      {
        icon: 'fas fa-book-open',
        title: 'GL Management',
        // $can: () => true,
        children: [
          {
            icon: 'fas fa-object-group',
            $can: () => true,
            title: 'GL Classes',
            path: 'admin-gl-classes',
            name: 'admin-gl-classes',
            component: () => import('components/profile/profile-admin/GLClasses'),
          },
          {
            icon: 'fas fa-object-ungroup',
            $can: () => true,
            title: 'GL Departments',
            path: 'admin-gl-departments',
            name: 'admin-gl-departments',
            component: () => import('components/profile/profile-admin/GLDepartments'),
          },
          {
            icon: 'fas fa-layer-group',
            $can: () => true,
            title: 'GL Accounts',
            path: 'admin-gl-accounts',
            name: 'admin-gl-accounts',
            component: () => import('components/profile/profile-admin/GLAccounts'),
          },
          {
            icon: 'fas fa-business-time',
            $can: () => true,
            title: 'GL Periods',
            path: 'gl-periods',
            name: 'admin-gl-periods',
            component: () => import('components/profile/profile-admin/GLPeriods'),
          },
        ],
      },
      {
        icon: 'fas fa-laptop-house',
        title: 'Store Management',
        // $can: () => true,
        children: [
          {
            icon: 'fas fa-store',
            $can: () => true,
            title: 'Stores',
            path: 'admin-stores',
            name: 'admin-my-stores',
            component: () => import('components/profile/profile-admin/Stores'),
          },
          {
            icon: 'fas fa-house-damage',
            $can: () => true,
            title: 'Store Templates',
            path: 'store-templates',
            name: 'admin-store-templates',
            component: () => import('components/profile/profile-admin/StoreTemplates'),
          },
        ],
      },
      {
        icon: 'fas fa-dungeon',
        title: 'Inventory Management',
        // $can: () => true,
        children: [
          {
            icon: 'fas fa-warehouse',
            $can: () => true,
            title: 'Warehouses',
            path: 'warehouses',
            name: 'admin-warehouses',
            component: () => import('components/profile/profile-admin/Warehouses'),
          },
          {
            icon: 'fab fa-product-hunt',
            $can: () => true,
            title: 'Products',
            path: 'admin-products',
            name: 'admin-products',
            component: () => import('components/profile/profile-admin/Products'),
          },
          {
            icon: 'fas fa-atlas',
            $can: () => true,
            title: 'Price Books',
            path: 'priceBooks',
            name: 'admin-price-books',
            component: () => import('components/profile/profile-admin/PriceBooks'),
          },
          {
            icon: 'fas fa-dolly-flatbed',
            $can: () => true,
            title: 'Inventories',
            path: 'inventories',
            name: 'admin-inventories',
            component: () => import('components/profile/profile-admin/Inventories'),
          },
          {
            icon: 'fas fa-boxes',
            $can: () => true,
            title: 'Inventory Items',
            path: 'inventory-items',
            name: 'admin-inventory-items',
            component: () => import('components/profile/profile-admin/InventoryItems'),
          },
          {
            icon: 'fas fa-blind',
            $can: () => true,
            title: 'Counts',
            path: 'counts',
            name: 'admin-counts',
            component: () => import('components/profile/profile-admin/Counts'),
          },
        ],
      },
      {
        icon: 'fas fa-receipt',
        title: 'Commission Management',
        // $can: () => true,
        children: [
          {
            icon: 'fas fa-money-check-alt',
            $can: () => true,
            title: 'Commission Templates',
            path: 'commission-templates',
            name: 'admin-commission-templates',
            component: () => import('components/profile/profile-admin/CommissionTemplates'),
          },
          {
            icon: 'fab fa-intercom',
            $can: () => true,
            title: 'Leads',
            path: 'leads',
            name: 'admin-leads',
            component: () => import('components/profile/profile-admin/Leads'),
          },

          {
            icon: 'fas fa-file-invoice-dollar',
            $can: () => true,
            title: 'Invoices',
            path: 'invoices',
            name: 'admin-invoices',
            component: () => import('components/profile/profile-admin/Invoices'),
          },
        ],
      },
      // {
      //   icon: 'fas fa-wallet',
      //   $can: () => true,
      //   title: 'Admin Wallets',
      //   path: 'admin-wallets',
      //   name: 'admin-my-wallet',
      //   component: () => import('pages/profile/ProfileWallet'),
      // },

    ];

    if (Object.keys(defaultRoute).length === 0) {
      defaultRoute = defaultRoutes[0].children[0];
    }

    Array.prototype.move = function (from, to) {
      this.splice(to, 0, this.splice(from, 1)[0]);
    };

    let menuItems = [...beforeRouteConfigs, ...defaultRoutes, ...afterRouteConfigs];
    let index = menuItems.findIndex(item => item.name === defaultRoute.name);
    if (index !== -1) menuItems.move(index, 0);

    router.addRoute({
      path: '/admin',
      name: 'admin',
      props() {
        return {
          menuItems,
          defaultRoute: defaultRoute,
        };
      },
      beforeEnter(to, from, next) {
        if (!router.app.$can('route', 'admin')) {
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
          next(from);
        } else {
          next();
        }
      },
      meta: {requiresAuth: true},
      component: () => import('layouts/AdminLayout'),
    });

    // if (Object.keys(defaultRoute).length) {
    //   let formattedDefault = getFormattedRoutes([defaultRoute])[0];
    //   router.addRoute('admin', {
    //     name: 'admin-home',
    //     ...formattedDefault,
    //     path: '',
    //     meta: {requiresAuth: true},
    //     // eslint-disable-next-line no-unused-vars
    //     beforeEnter(to, from, next) {
    //
    //     }
    //   });
    // } else {
    //   let formattedDefault = {
    //     path: 'my-profile',
    //     name: 'admin-my-profile',
    //     component: () => import('../pages/profile/EditProfile')
    //   };
    // }

    let routes = getFormattedRoutes([...beforeRouteConfigs, ...defaultRoutes, ...afterRouteConfigs]);

    routes.forEach((route) => {
      let {$can, ...link} = route;
      router.addRoute('admin', {
        ...link,
        meta: {requiresAuth: true},
        // eslint-disable-next-line no-unused-vars
        beforeEnter(to, from, next) {
          // $can() ? next() : next(from);
          if ($can && !$can()) {
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
            next(from);
          } else {
            next();
          }
        },
      });
    });

    // console.log('router.options.routes:', router.options.routes);
    // console.log('router.getRoutes():', router.getRoutes());
  };

  adminRouteConfigure({
    router: Router,
    store,
    beforeRouteConfigs,
    afterRouteConfigs,
    defaultRoute,
  });
}

