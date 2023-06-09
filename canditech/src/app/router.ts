import { createWebHistory, createRouter } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      components: {
        default: () => import("pages/home/index.vue"),
      },
    },
  ],
});

export default router;
