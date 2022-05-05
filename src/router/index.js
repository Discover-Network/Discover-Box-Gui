import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/home";
import Tickets from "@/pages/tickets";
import Win from "@/pages/win";
import Games from "@/pages/games";
import Admin from "@/pages/admin";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminTransfer from "@/pages/admin/transfer";
import AdminHistory from "@/pages/admin/history";
import AdminShare from "@/pages/admin/share_manager";
import AdminWhitelist from "@/pages/admin/whitelist";

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
  {
    path: "/admin",
    component: Admin,
    meta: {
      keepAlive: false,
    },
  },
  {
    path: "/admin/dashboard",
    component: AdminDashboard,
    meta: {
      keepAlive: false,
    },
  },
  {
    path: "/admin/transfer",
    component: AdminTransfer,
    meta: {
      keepAlive: false,
    },
  },
  {
    path: "/admin/history",
    component: AdminHistory,
    meta: {
      keepAlive: false,
    },
  },
  {
    path: "/admin/share",
    component: AdminShare,
    meta: {
      keepAlive: false,
    },
  },
  {
    path: "/admin/whitelist",
    component: AdminWhitelist,
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
