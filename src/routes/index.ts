import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/fee',
      name: 'fee',
      component: () => import('@/pages/FeeView.vue'),
    },
  ],
})

export default router
