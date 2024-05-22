<script setup>
import "primeicons/primeicons.css";

import Card from "primevue/card";

import { onMounted, ref } from "vue";
import axios from "axios";

const usedAnnouncements = ref([]);
const newAnnouncements = ref([]);

const filteredUsedAnnouncements = ref();
const filteredNewAnnouncements = ref();

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

const updateNewCars = async (announcementsId) => {
  try {
    const response = await axios.get(
      "https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/newCars.json"
    );
    console.log(response.data);
    for (const [key, value] of Object.entries(response.data)) {
      if (value.announcementsId === announcementsId) {
        await axios.patch(
          `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/newCars/${key}.json`,
          { announcementsId: null }
        );
        console.log(
          `Поле announcementsId в объявлении с ID ${announcementsId} успешно очищено`
        );
        break;
      }
    }
    getNewCars();
  } catch (err) {
    console.log(err);
  }
};

const updateUsedCars = async (announcementsId) => {
  try {
    const response = await axios.get(
      "https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/usedCard.json"
    );

    for (const [key, value] of Object.entries(response.data)) {
      if (value.announcementsId === announcementsId) {
        await axios.patch(
          `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/usedCard/${key}.json`,
          { announcementsId: null }
        );
        console.log(
          `Поле announcementsId в объявлении с ID ${announcementsId} успешно очищено`
        );
        break;
      }
    }
    getUsedCars();
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  await getUsedCars();
  await getNewCars();
});
</script>
<template>
  <span class="used-car-title">Б/У машины</span>
  <div class="used-cars-group">
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
        {{ announcement.mileage }}км,{{ announcement.horsePower }}л.с
      </template>
      <template #subtitle>
        <div class="subtitle-container">
          {{ announcement.price }}₽
          <div class="option-menu">
            <i
              class="pi pi-trash"
              @click="updateUsedCars(announcement.announcementsId)"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
  <div class="wrapper-new-cars-group">
    <span class="new-card-title">Новые машины</span>
    <div class="new-cars-group">
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
            <div
              class="option-menu"
              @click="updateNewCars(announcement.announcementsId)"
            >
              <i class="pi pi-trash" />
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
<style scoped>
.used-car-title {
  font-size: 20px;
}

.new-card-title {
  font-size: 20px;
}

.used-cars-group {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.new-cars-group {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.wrapper-new-cars-group {
  margin-top: 20px;
}

.card {
  width: 37vh;
  height: 340px;
  border: 2px solid black;
}

.card:hover {
  border: 2px solid rgb(170, 170, 170);
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
</style>
