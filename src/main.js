import { createApp } from "vue";
import { createPinia } from "pinia";
import { initializeApp } from "firebase/app";
import PrimeVue from "primevue/config";

import App from "./App.vue";

import router from "./router";

import "primevue/resources/themes/aura-light-green/theme.css";

const firebaseConfig = {
  apiKey: "AIzaSyADAo0QV7AzdVmCQKj-KCtjUZaaD6meVnQ",
  authDomain: "rafgat-kurs.firebaseapp.com",
  projectId: "rafgat-kurs",
  storageBucket: "rafgat-kurs.appspot.com",
  messagingSenderId: "124458500726",
  appId: "1:124458500726:web:25d4dfc278ed357de09557",
};

initializeApp(firebaseConfig);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);

app.mount("#app");
