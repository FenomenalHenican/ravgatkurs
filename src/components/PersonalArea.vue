<script setup>
import "primeicons/primeicons.css";
import sedan from "../icon/sedan.jpg";

import Card from "primevue/card";
import InputText from "primevue/inputtext";

import AdminPanel from "./AdminPanel.vue";
import { ref, onMounted } from "vue";
import {
  getUserIdFromLocalStorage,
  getUserEmailFromLocalStorage,
} from "../stores/getLocalStorage";
import { format } from "date-fns";

import axios from "axios";

const userId = getUserIdFromLocalStorage();
const userEmail = getUserEmailFromLocalStorage();

const userData = ref("");

const userName = ref("");
const numberPhone = ref("");
const markCar = ref("");
const modelCar = ref("");
const mileage = ref("");

const isSettingsVisible = ref(false);
const isRecordsVisible = ref(false);

const records = ref([]);
const userRecords = ref([]);

const toogleSettings = () => {
  isSettingsVisible.value = !isSettingsVisible.value;
};

const toogleRecords = () => {
  isRecordsVisible.value = !isRecordsVisible.value;
};

const saveUserData = async () => {
  if (!userId) {
    console.log("userId is not defined");
    return;
  }

  try {
    const userSettingsData = {
      userName: userName.value,
      numberPhone: numberPhone.value,
      markCar: markCar.value,
      modelCar: modelCar.value,
      mileage: mileage.value,
      userId: userId,
      userEmail: userEmail,
    };
    await axios.patch(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/userData/${userId}.json`,
      userSettingsData
    );
    console.log(
      "user data succesfully set and save in data base",
      userSettingsData
    );
    clearFields();
  } catch (err) {
    console.log("error:", err);
  }
};

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

const getAllRecords = async () => {
  try {
    const response = await axios.get(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/records.json`
    );
    const allRecords = response.data
      ? Object.values(response.data).flatMap((dayRecords) =>
          Object.values(dayRecords)
        )
      : [];
    records.value = allRecords;
    filterUserRecords();
  } catch (error) {
    console.error("Error fetching records:", error);
  }
};

const filterUserRecords = () => {
  userRecords.value = records.value.filter(
    (record) => record.userId === userId
  );
};
const deleteUserRecord = async (id, date) => {
  const formatDate = format(date, "yyyy-MM-dd");
  console.log(id);
  try {
    await axios.delete(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/records/${formatDate}/${id}.json`
    );
    console.log(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/records/${id}.json`
    );
  } catch (error) {
    console.log("Error during get access information about user: ", error);
  }
};

const clearFields = () => {
  userName.value = "";
  numberPhone.value = "";
  markCar.value = "";
  modelCar.value = "";
  mileage.value = "";
};

onMounted(() => {
  getUserData();
  getAllRecords();
});
</script>

<template>
  <div v-if="userData">
    <AdminPanel v-if="userData.ADMIN" />
    <template v-else>
      <div class="user-data-container">
        <div class="user-data-title">Данные пользователя</div>
        <div class="user-data">
          <div class="user-name">ФИО: {{ userData.userName }}</div>
          <div class="user-id">UserId: {{ userData.userId }}</div>
          <div class="user-email">Email: {{ userData.userEmail }}</div>
          <div class="user-phone">
            Контактный телефон: {{ userData.numberPhone }}
          </div>
        </div>
        <div class="user-add-car">
          <Card class="card">
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
        <div class="user-settings">
          <i
            class="pi pi-arrow-down"
            @click="toogleSettings"
            v-if="!isSettingsVisible"
          />
          <i
            class="pi pi-arrow-up"
            @click="toogleSettings"
            v-if="isSettingsVisible"
          />
          <span class="title-settings">Настройки пользователя</span>
          <div class="wrapper-change-data" v-if="isSettingsVisible">
            <InputText
              v-model="userName"
              class="input-name"
              type="text"
              placeholder="Введите ФИО"
            />
            <InputText
              v-model="numberPhone"
              class="number-phone"
              placeholder="Контактный телефон"
            />
            <div class="group-add-car">
              <span class="add-car-title">Добавление машины:</span>
              <div class="input-group-add-car">
                <InputText
                  v-model="markCar"
                  class="input-mark-car"
                  type="text"
                  placeholder="Марка автомобиля"
                />
                <InputText
                  v-model="modelCar"
                  class="input-model-car"
                  type="text"
                  placeholder="Модель автомобиля"
                />
                <InputText
                  v-model="mileage"
                  class="input-mileage"
                  type="text"
                  placeholder="Пробег"
                />
              </div>
            </div>
            <button @click="saveUserData" class="save-data">Сохранить</button>
          </div>
        </div>
        <div class="record-service">
          <i
            class="pi pi-arrow-down"
            @click="toogleRecords"
            v-if="!isRecordsVisible"
          />
          <i
            class="pi pi-arrow-up"
            @click="toogleRecords"
            v-if="isRecordsVisible"
          />
          <span class="record-service-title" v-if="userRecords.length"
            >Ваши записи в центр</span
          >
          <div class="record-list" v-if="isRecordsVisible">
            <div v-if="userRecords.length">
              <div
                v-for="(record, index) in userRecords"
                :key="index"
                class="record"
              >
                <p>Машина: {{ record.markCar }} {{ record.modelCar }}</p>
                <p>Пробег: {{ record.mileage }} km</p>
                <p>Тип услуги: {{ record.serviceType }}</p>
                <p>
                  Время записи:
                  {{ new Date(record.date).toLocaleString("ru-RU") }}
                </p>
                <p>Адрес сервиса: {{ record.adressService }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.user-data-container {
  margin-left: 20px;
  margin-top: 20px;
}

.user-data-title {
  font-size: 30px;
}

.user-data {
  margin-top: 10px;
}

.user-id {
  margin-top: 5px;
}

.user-email {
  margin-top: 5px;
}

.user-phone {
  margin-top: 5px;
}

.card {
  width: fit-content;
  height: fit-content;
  border: 2px solid black;
  border-radius: 8px;
  margin-top: 20px;
}

.title-image {
  width: 90%;
  height: 100px;
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

.record {
  border: 2px solid black;
  margin-top: 10px;
  width: fit-content;
  padding: 10px;
  min-width: 350px;
  border-radius: 9px;
}

.user-settings {
  margin-top: 20px;
}

.title-settings {
  margin-left: 10px;
}

.wrapper-change-data {
  margin-top: 10px;
}

.number-phone {
  margin-left: 10px;
}

.group-add-car {
  margin-top: 10px;
}

.input-group-add-car {
  margin-top: 10px;
}

.input-model-car {
  margin-left: 10px;
}

.input-mileage {
  margin-left: 10px;
}

.save-data {
  margin-top: 10px;
  padding: 5px;
  background: none;
  width: fit-content;
  font-size: 16px;
  border-radius: 5px;
}

.record-service {
  margin-top: 20px;
}

.record-service-title {
  margin-left: 10px;
}

.record-list {
  margin-top: 10px;
}
</style>
