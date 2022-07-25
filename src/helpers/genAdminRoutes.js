function genAdminRoutes(routes){
  let admin = [
    {
      path: '/admin',
      children: [],
      component: () => import('layouts/AdminLayout'),
      meta: {requiresAuth: true}
    },
    {
      path: '*',
      component: () => import('pages/Error404.vue'),
      beforeEnter (to, from, next) {
        if (to.path.startsWith('/admin')) {
          if(Object.keys(to.query).length) {
            next({path: '/admin', query: to.query});
          } else {
            next();
          }
        } else {
          next();
        }
      }
    }
  ];

  return [...routes, ...admin];
}

export default genAdminRoutes;
