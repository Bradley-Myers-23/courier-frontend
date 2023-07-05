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
      path: "/sites",
      name: "sites",
      component: () => import("./views/SiteList.vue"),
    },
    {
      path: "/hotels",
      name: "hotels",
      component: () => import("./views/HotelList.vue"),
    },
    {
      path: "/trips",
      name: "trips",
      component: () => import("./views/TripList.vue"),
    },
    {
      path: "/trip/:id",
      name: "editTrip",
      props: true,
      component: () => import("./views/EditTrip.vue"),
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

    
  ],
});

export default router;
