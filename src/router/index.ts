import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      component: () => import('../views/MainView.vue'),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('../views/HomeView.vue')
        }, { path: 'users', component: () => import('@/userViews/usersList.vue'), name: 'users' },
        { path: 'roles', component: () => import('@/rightsViews/rolesView.vue'), name: 'roles' },
        { path: 'rights', component: () => import('@/rightsViews/rightsView.vue'), name: 'rights' },
        { path: 'goods', component: () => import('@/shopViews/shopList.vue'), name: 'goods' },
        { path: 'params', component: () => import('@/shopViews/paramsView.vue'), name: 'params' },
        { path: 'categories', component: () => import('@/shopViews/categoriesView.vue'), name: 'categories' },
        { path: 'orders', component: () => import('@/orderViews/orderList.vue'), name: 'orders' },
        { path: 'reports', component: () => import('@/dataCount/reportsView.vue'), name: 'reports' },
      ]
    },

    { path: '/404', component: () => import('../views/NotFound.vue') },
    // 任意其他页面
    { path: '/:any(\.+)', redirect: '/404' },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    if (token) {
      next('/welcome')
    } else {
      next()
    }
  } else {
    if (token) {
      next()
    } else {
      next('/login')
    }
  }
})

export default router
