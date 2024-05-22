<script setup>
import "primeicons/primeicons.css";

import sedan from "./icon/sedan.jpg";

import InputText from "primevue/inputtext";
import SelectButton from "primevue/selectbutton";
import Card from "primevue/card";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";

import Button from "primevue/button";

import { useAuthStore } from "./stores/auth";
import { getUserIdFromLocalStorage } from "./stores/getLocalStorage";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const authStore = useAuthStore();
const userId = getUserIdFromLocalStorage();

const usedAnnouncements = ref([]);
const newAnnouncements = ref([]);

const filteredUsedAnnouncements = ref();
const filteredNewAnnouncements = ref();

const userData = ref("");

const datetime24h = ref();
const inputSearch = ref("");
const selectTypeCatalog = ref(null);

const selectedTypeService = ref();
const typeService = ref([
  { name: "Лакокрасочные работы", code: "PW" },
  { name: "Шиномонтаж", code: "TS" },
  { name: "ТехОсмотр", code: "TI" },
  { name: "Мойка", code: "W" },
  { name: "Сход развал", code: "WA" },
]);

const optionsTypeCatalog = ref([
  { label: "Авто с пробегом", value: "usedCar" },
  { label: "Новые авто", value: "newCar" },
  { label: "Запись на сервис", value: "recordService" },
]);

const selectedAdressService = ref();
const optionsAdressService = ref([
  { name: "ул.Проффесора Камая 8а", code: "ProfKamya" },
  { name: "ул.Кремлевская 18", code: "Kremlevskya" },
]);

const getUserData = async () => {
  if (!userId) {
    console.log("userId is not defined");
    return;
  }
  try {
    const response = await fetch(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/userData/${userId}.json`
    );
    const data = await response.json();
    userData.value = data;
    console.log(userData.value);
  } catch (error) {
    console.log("Error during get access information about user: ", error);
  }
};

const getUsedCars = async () => {
  try {
    const response = await axios.get(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/usedCard/.json`
    );
    console.log(response.data);

    const firebaseStorageUrl =
      "https://firebasestorage.googleapis.com/v0/b/rafgat-kurs.appspot.com/o/";

    const announcementsWithImages = Object.values(response.data).map(
      (announcement) => {
        return {
          ...announcement,
          imageUrl: `${firebaseStorageUrl}${encodeURIComponent(
            announcement.link
          )}?alt=media`,
        };
      }
    );
    usedAnnouncements.value = announcementsWithImages;

    filteredUsedAnnouncements.value = announcementsWithImages.filter(
      (announcement) => announcement.announcementsId
    );
  } catch (err) {
    console.log(err.response);
  }
};
const getNewCars = async () => {
  try {
    const response = await axios.get(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/newCars/.json`
    );
    console.log(response.data);

    const firebaseStorageUrl =
      "https://firebasestorage.googleapis.com/v0/b/rafgat-kurs.appspot.com/o/";

    const announcementsWithImages = Object.values(response.data).map(
      (announcement) => {
        return {
          ...announcement,
          imageUrl: `${firebaseStorageUrl}${encodeURIComponent(
            announcement.link
          )}?alt=media`,
        };
      }
    );
    newAnnouncements.value = announcementsWithImages;

    filteredNewAnnouncements.value = announcementsWithImages.filter(
      (announcement) => announcement.announcementsId
    );
  } catch (err) {
    console.log(err.response);
  }
};

const likedAnnouncement = async (announcement) => {
  try {
    await axios.post(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/user/${userId}/favorites.json`,
      announcement
    );
  } catch (err) {
    console.log(err.response);
  }
};

const setRecordService = async () => {
  if (!datetime24h.value) {
    console.log("Дата и время не выбраны");
    return;
  }

  if (!selectedTypeService.value) {
    console.log("Тип услуги не выбран");
    return;
  }

  if (!userData.value) {
    await getUserData();
  }
  const { markCar, modelCar, mileage } = userData.value;

  const recordDate = datetime24h.value.toISOString().split("T")[0];
  const recordId = Math.floor(Math.random() * 100000);
  const recordData = {
    id: recordId,
    date: datetime24h.value,
    userId: userId,
    markCar: markCar,
    modelCar: modelCar,
    mileage: mileage,
    serviceType: selectedTypeService.value.name,
    adressService: selectedAdressService.value.name,
  };
  try {
    await axios.post(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/records/${recordDate}.json`,
      recordData
    );
    console.log("Запись успешно добавлена");
    clearFieldsRecord();
  } catch (err) {
    console.log("Ошибка при добавлении записи", err.response);
  }
};

const redirectToSignIn = () => {
  router.push({ name: "signin" });
};

const redirectToPersonalArea = () => {
  if (authStore.userInfo.logIn) {
    router.push({ name: "personalarea" });
  }
};

const redirectToFavorites = () => {
  if (authStore.userInfo.logIn) {
    router.push({ name: "favorites" });
  }
};

const clearFieldsRecord = () => {
  datetime24h.value = "";
  selectedTypeService.value = null;
};

const logout = () => {
  localStorage.removeItem("userTokens");
  authStore.userInfo.token = null;
  authStore.userInfo.email = null;
  authStore.userInfo.userId = null;
  authStore.userInfo.refreshToken = null;
  authStore.userInfo.logIn = false;

  console.log("logout");
};

onMounted(async () => {
  await getUsedCars();
  await getNewCars();
  await getUserData();
});
</script>

<template>
  <div class="container">
    <div class="header-line">
      <div class="input-container">
        <InputText
          class="input-search"
          type="text"
          v-model="inputSearch"
          placeholder="Поиск автомобиля"
        />
      </div>
      <div class="nav-menu">
        <div class="btn-favorite" @click="redirectToFavorites">
          <i class="pi pi-heart" />
        </div>
        <div class="btn-personal-area">
          <i
            v-if="!authStore.userInfo.logIn"
            class="pi pi-sign-in"
            @click="redirectToSignIn"
          />
          <i v-else class="pi pi-user" @click="redirectToPersonalArea" />
        </div>
        <div v-if="authStore.userInfo.logIn" class="btn-logout">
          <i class="pi pi-times" @click="logout" />
        </div>
      </div>
    </div>
    <div class="content">
      <div class="nav-catalog">
        <SelectButton
          v-model="selectTypeCatalog"
          :options="optionsTypeCatalog"
          optionLabel="label"
          optionValue="value"
          aria-labelledby="basic"
        />
      </div>
      <div v-if="selectTypeCatalog === 'usedCar'" class="list-used-car">
        <Card
          class="card"
          v-for="(announcement, i) in filteredUsedAnnouncements"
          :key="i"
        >
          <template #header>
            <img
              alt="announcements-avatar"
              class="announcements-avatar"
              :src="announcement.imageUrl"
            />
          </template>
          <template #title>
            <div class="description-announcement"></div>
            {{ announcement.markCar }} {{ announcement.modelCar }},
            {{ announcement.mileage }}км,{{ announcement.engineCapacity }}
            {{ announcement.horsePower }}л.с
          </template>
          <template #subtitle>
            <div class="subtitle-container">
              {{ announcement.price }}₽
              <div class="option-menu">
                <i
                  class="pi pi-heart"
                  @click="likedAnnouncement(announcement)"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div v-if="selectTypeCatalog === 'newCar'" class="list-new-car">
        <Card
          class="card"
          v-for="(announcement, i) in filteredNewAnnouncements"
          :key="i"
        >
          <template #header>
            <img
              alt="announcements-avatar"
              class="announcements-avatar"
              :src="announcement.imageUrl"
            />
          </template>
          <template #title>
            <div class="description-announcement"></div>
            {{ announcement.markCar }} {{ announcement.modelCar }},
            {{ announcement.mileage }}км,{{ announcement.horsePower }}л.с
          </template>
          <template #subtitle>
            <div class="subtitle-container">
              {{ announcement.price }}₽
              <div class="option-menu">
                <i
                  class="pi pi-heart"
                  @click="likedAnnouncement(announcement)"
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
      <div v-if="selectTypeCatalog === 'recordService'" class="record-service">
        <div v-if="!authStore.userInfo.logIn" class="warning-title">
          <span class="warning-auth-title">Вы не авторизованы</span>
        </div>
        <div v-if="authStore.userInfo.logIn" class="wrapper-record">
          <div class="wrapper-calendar">
            <span class="select-date-title">Выберите дату записи</span>
            <Calendar
              id="calendar-24h"
              v-model="datetime24h"
              showTime
              hourFormat="24"
              class="calendar-record"
            />
          </div>
          <div class="select-type-service">
            <span class="select-type-service-title">Выберите тип услуги</span>
            <Dropdown
              v-model="selectedTypeService"
              :options="typeService"
              optionLabel="name"
              placeholder="Выберите тип услуг"
              class="dropdown-type-service"
            />
          </div>
          <div class="select-adress">
            <span class="select-adress-title">Выберите адресс</span>
            <Dropdown
              v-model="selectedAdressService"
              :options="optionsAdressService"
              optionLabel="name"
              placeholder="Выберите адресс"
              class="dropdown-select-adress"
            />
          </div>
          <div class="add-car-record">
            <span class="add-car-record-title">Ваше ТС</span>
            <div class="user-add-car">
              <Card class="card-record">
                <template #header>
                  <img alt="user-avatar" class="title-image" :src="sedan" />
                </template>
                <template #title>
                  <div class="description-announcement"></div>
                  {{ userData.markCar }} {{ userData.modelCar }},
                  {{ userData.mileage }}км
                </template>
              </Card>
            </div>
          </div>
          <button @click="setRecordService" class="btn-save-record">
            Добавить запись
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.input-container {
  flex: 1;
}

.input-search {
  height: 40px;
  width: 60vh;
  font-size: 25px;
  padding-left: 10px;
}

.nav-menu {
  display: flex;
  align-items: center;
  margin-left: 50vh;
}

.btn-personal-area {
  margin-left: 20px;
}

.btn-logout {
  margin-left: 16px;
}

.content {
  margin-top: 20px;
  width: 100%;
  height: fit-content;
}

.nav-catalog {
  margin-left: 40vh;
}

.list-used-car {
  margin-top: 20px;
  margin-left: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.card {
  width: 37vh;
  height: fit-content;
  max-height: 340px;
  border: 2px solid rgb(170, 170, 170);
}

.title-image {
  width: 100%;
  height: 200px;
  border: 2px solid white;
  border-radius: 6px;
  object-fit: cover;
}

.announcements-avatar {
  width: 100%;
  height: 200px;
  border: 2px solid white;
  border-radius: 6px;
  object-fit: cover;
}

.description-announcement {
  font-size: 16px;
}

.description-announcement:hover {
  color: rgb(189, 189, 189);
}

.subtitle-container {
  display: flex;
  justify-content: space-between;
}

.option-menu {
  color: black;
}

.list-new-car {
  margin-top: 20px;
  margin-left: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.warning-auth-title {
  font-size: 30px;
  margin-left: 50vh;
}

.wrapper-record {
  margin-top: 20px;
  width: fit-content;
  padding: 15px;
  border: 2px solid rgb(170, 170, 170);
  border-radius: 8px;
  margin-left: 50vh;
}

.wrapper-calendar {
  margin-top: 8px;
}

.calendar-record {
  margin-left: 20px;
  height: 30px;
}

.select-type-service {
  margin-top: 10px;
}

.dropdown-type-service {
  margin-left: 20px;
  height: 30px;
}

.select-adress {
  margin-top: 10px;
}

.dropdown-select-adress {
  margin-left: 20px;
  height: 30px;
}

.add-car-record {
  margin-top: 10px;
}

.card-record {
  width: fit-content;
  height: fit-content;
  max-height: 340px;
  border: 2px solid black;
  border-radius: 7px;
  margin-top: 10px;
}

.card-record:hover {
  border: 2px solid rgb(124, 122, 122);
}

.btn-save-record {
  background: none;
  border-radius: 3px;
  margin-left: 20%;
  margin-top: 10px;
  padding: 5px;
}

.btn-save-record:hover {
  border: 2px solid rgb(124, 122, 122);
}
</style>
