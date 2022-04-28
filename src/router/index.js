import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/home";
import Tickets from "@/pages/tickets";
import Win from "@/pages/win";
import Games from "@/pages/games";

const routes = [
  {
    path: "/",
    component: Home,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: "/tickets",
    component: Tickets,
    meta: {
      keepAlive: true,
    },
  },
  {
    path: "/win",
    component: Win,
    meta: {
      keepAlive: false,
    },
  },
  {
    path: "/games",
    component: Games,
    meta: {
      keepAlive: false,
    },
  },
];

const router = createRouter({
  mode: "history",
  history: createWebHistory(),
  base: process.env.BASE_URL,
  // base: "/",
  routes,
});

export default router;
