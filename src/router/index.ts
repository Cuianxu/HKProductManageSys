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
        }
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
