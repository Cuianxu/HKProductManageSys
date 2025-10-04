import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

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
          path: '',
          name: 'Home',
          component: () => import('../views/Home/HomeView.vue')
        },
        {
          path: 'home',
          redirect: '/'
        },
        {
          path: 'users',
          name: 'Users',
          component: () => import('../views/userManage/UserList.vue')
        },
        {
          path: 'roles',
          name: 'Roles',
          component: () => import('../views/permissionManage/RoleList.vue')
        },
        {
          path: 'rights',
          name: 'Rights',
          component: () => import('../views/permissionManage/PermissionList.vue')
        },
        {
          path: 'goods',
          name: 'Goods',
          component: () => import('../views/goodsManage/GoodsList.vue')
        },
        {
          path: 'goods/add',
          name: 'AddGoods',
          component: () => import('../views/goodsManage/AddGoods.vue')
        },
        {
          path: 'params',
          name: 'Params',
          component: () => import('../views/goodsManage/CategoryParam.vue')
        },
        {
          path: 'categories',
          name: 'Categories',
          component: () => import('../views/goodsManage/GoodsCategory.vue')
        },
        {
          path: 'orders',
          name: 'Orders',
          component: () => import('../views/orderManage/OrderList.vue')
        },
        {
          path: 'reports',
          name: 'Reports',
          component: () => import('../views/dataStatistics/DataReport.vue')
        },
      ]
    },
    { path: '/404', component: () => import('../views/NotFound.vue') },
    // 任意其他页面
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    },
  ],
})

router.beforeEach((to, from, next) => {
  console.log(to.path, '守卫')
  const token = localStorage.getItem('token')
  if (to.path === '/login') {
    if (token) {
      next('/home')
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
