import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("./views/Home.vue"),
    },
    {
      path: "/courier",
      name: "courier",
      component: () => import("./views/Courier.vue"),
    },
    {
      path: "/clerk",
      name: "clerk",
      component: () => import("./views/Clerk.vue"),
    },
    {
      path: "/clerk/:id",
      name: "editOrder",
      props: true,
      component: () => import("./views/EditOrder.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("./views/Admin.vue"),
    },
  ],
});

export default router;
