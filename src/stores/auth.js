import { defineStore } from "pinia";
import axiosApiInstance from "../api";
import { ref } from "vue";
import { AxiosError } from "axios";
import { useRouter } from "vue-router";

const apiKey = import.meta.env.VITE_API_KEY_FIREBASE;

export const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const userInfo = ref({
    logIn: false,
    token: "",
    email: "",
    userId: "",
    refreshToken: "",
  });

  const error = ref();

  const auth = async (payload, type) => {
    const stringUrl = type === "signup" ? "signUp" : "signInWithPassword";
    error.value = "";
    try {
      let responce = await axiosApiInstance.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:${stringUrl}?key=${apiKey}`,
        {
          ...payload,
          returnSecureToken: true,
        }
      );

      userInfo.value.token = responce.data.idToken;
      userInfo.value.email = responce.data.email;
      userInfo.value.userId = responce.data.localId;
      userInfo.value.refreshToken = responce.data.refreshToken;
      userInfo.value.logIn = true;

      localStorage.setItem(
        "userTokens",
        JSON.stringify({
          token: userInfo.value.token,
          refreshToken: userInfo.value.refreshToken,
          userId: userInfo.value.userId,
          email: userInfo.value.email,
        })
      );
      router.push("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.error.message);
      }
      switch (err.response?.data.error.message) {
        case "ERR_BAD_REQUEST":
          error.value = "BAD REQUEST";
          break;
        case "OPERATION_NOT_ALLOWED":
          error.value = "operation not allowed";
          break;
        case "WEAK_PASSWORD":
          error.value = "WEAK_PASSWORD";
          break;
        default:
          error.value = "Error";
          break;
      }
    }
  };

  return { auth, userInfo, error };
});
