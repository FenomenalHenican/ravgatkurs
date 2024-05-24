<script setup>
import "primeicons/primeicons.css";
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const router = useRouter();

const email = ref();
const password = ref("");

const isPasswordValid = computed(() => password.value.length >= 6);

const signup = async () => {
  await authStore.auth(
    { email: email.value, password: password.value },
    "signup"
  );

  router.push("/signin");
};
</script>

<template>
  <div class="wrapper-card">
    <div class="card">
      <div class="title">Registration form</div>
      <div class="input-group">
        <div class="input-card">
          <i class="pi pi-envelope" />
          <input class="input-email" type="email" v-model="email" />
        </div>
        <div class="input-card">
          <i class="pi pi-lock" />
          <input class="input-password" type="password" v-model="password" />
        </div>
        <div class="validation-password" v-if="isPasswordValid">
          The password is correct <i class="pi pi-check-circle" />
        </div>
      </div>
      <button class="btn-login" @click="signup">Register</button>
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
}

.card {
  margin-top: 90px;
  margin-bottom: 90px;
  width: 430px;
  height: 450px;
  border: 2px solid rgb(171, 205, 239);
  border-radius: 30px;
  background-color: rgb(135, 206, 235);
}

.title {
  margin-top: 60px;
  margin-left: 80px;
  margin-bottom: 70px;
  font-size: 30px;
  color: white;
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
  color: white;
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

.input-email + i,
.input-password + i {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  color: white;
}

.btn-login {
  margin-left: 30px;
  width: calc(100% - 50px);
  height: 29px;
  border-radius: 7px;
  background-color: rgb(105, 176, 205);
  color: white;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
  border: 2px solid white;
}

.validation-password {
  font-size: 14px;
  font-family: Comic Sans MS, Comic Sans, cursive;
  color: green;
}
</style>
