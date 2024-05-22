<script setup>
import "primeicons/primeicons.css";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";

import Message from "primevue/message";

const router = useRouter();
const authStore = useAuthStore();

const email = ref();
const password = ref();
const error = ref("");

const isInvalidPassword = computed(
  () => password.value && password.value.length < 6
);

const redirectToSignUp = () => {
  router.push({ name: "signup" });
};
const signup = async () => {
  try {
    await authStore.auth(
      { email: email.value, password: password.value },
      "signin"
    );
  } catch (err) {
    console.log(err);
    error.value = "Invalid login or password";
  }
};
</script>

<template>
  <div class="wrapper-card">
    <div class="card">
      <div class="title">Login</div>
      <div class="input-group">
        <div class="input-card">
          <i class="pi pi-envelope" />
          <input
            class="input-email"
            type="email"
            v-model="email"
            placeholder="Your Email"
          />
        </div>
        <div class="input-card">
          <i class="pi pi-lock" />
          <input
            class="input-password"
            type="password"
            v-model="password"
            placeholder="Your Password"
          />
        </div>
        <div class="warn-short-password" v-if="isInvalidPassword">
          Too short password
        </div>
        <div class="error-auth" style="color: red" v-if="error">
          {{ error }}
          <i class="pi pi-exclamation-triangle" style="color: red" />
        </div>
      </div>
      <button
        class="btn-login"
        tabindex="0"
        @keyup.enter="signup"
        @click="signup"
      >
        Sign In
      </button>
      <Message class="warn" severity="warn" v-if="authStore.error"
        >Invalid login or password</Message
      >
      <div class="navigation-rout">
        <button class="btn-signup-rout" @click="redirectToSignUp">
          SignUp
        </button>
        <div class="change-password-rout">Forgot Password</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper-card {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100vh;
  background-color: rgb(37, 39, 46);
}

.card {
  margin-top: 90px;
  margin-bottom: 90px;
  width: 400px;
  height: auto;
  border: 2px solid rgb(171, 205, 239);
  border-radius: 30px;
  margin-bottom: 40px;
}

.title {
  margin-top: 60px;
  margin-left: 40%;
  margin-bottom: 70px;
  font-size: 30px;
  color: rgb(171, 205, 239);
  font-weight: bold;
}

.input-group {
  margin-left: 20px;
  margin-top: 130px;
}

.input-card {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

i {
  color: rgb(171, 205, 239);
}

.input-email,
.input-password {
  width: calc(100% - 40px);
  padding: 10px;
  border: none;
  outline: none;
  border-bottom: 1px solid white;
  background: transparent;
  margin-bottom: 10px;
  color: white;
}

.btn-login {
  margin-left: 30px;
  width: calc(100% - 50px);
  height: 29px;
  border-radius: 7px;
  background-color: rgb(37, 39, 46);
  color: rgb(171, 205, 239);
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  font-size: 15px;
}

.navigation-rout {
  display: flex;
  justify-content: space-between;
  margin-top: 27px;
}

.btn-signup-rout {
  cursor: pointer;
  margin-left: 20px;
  border: none;
  background-color: rgb(37, 39, 46);
  font-size: 17px;
  margin-bottom: 20px;
  color: rgb(171, 205, 239);
}

.change-password-rout {
  cursor: pointer;
  margin-right: 20px;
  font-size: 17px;
  margin-bottom: 20px;
  color: rgb(171, 205, 239);
}

.warn-short-password {
  font-size: 14px;
  font-family: Comic Sans MS, Comic Sans, cursive;
  color: red;
}

.warn {
  width: 70%;
  margin-left: 15%;
}
</style>
