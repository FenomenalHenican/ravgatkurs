import { createRouter, createWebHistory } from "vue-router";
import MainPage from "../MainPage.vue";
import SignUp from "../components/SignUp.vue";
import SignIn from "../components/SignIn.vue";
import PersonalArea from "../components/PersonalArea.vue";
import ListLikes from "../components/ListLikes.vue";
import DataPage from "../components/DataPage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainPage,
    },
    {
      path: "/signup",
      name: "signup",
      component: SignUp,
    },
    {
      path: "/signin",
      name: "signin",
      component: SignIn,
    },
    {
      path: "/personalarea",
      name: "personalarea",
      component: PersonalArea,
    },
    {
      path: "/favorites",
      name: "favorites",
      component: ListLikes,
    },
    {
      path: "/dataPage",
      name: "dataPage",
      component: DataPage,
      props: true,
    },
  ],
});

export default router;
