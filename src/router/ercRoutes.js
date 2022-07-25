// eslint-disable-next-line no-unused-vars
export default function ({store, ssrContext}) {
  const routes = [
    {
      path: '/',
      component: () => import('layouts/ErcLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import ('pages/ErcHome.vue'),
        },
        // {
        //   path: 'about',
        //   name: 'about',
        //   component: () => import ('pages/ErcTest.vue'),
        // },
      ],
    },
    {
      path: '/bank',
     component: () => import('components/banks/BankDashboard'),
    }
  ];

  // Always leave this as last one
  if (process.env.MODE !== 'ssr') {
    routes.push({
      path: '*',
      component: () => import('pages/Error404.vue'),
    });
  }

  return routes;
}

