<script setup>
import "primeicons/primeicons.css";

import Card from "primevue/card";

import { getUserIdFromLocalStorage } from "../stores/getLocalStorage";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();
const userId = getUserIdFromLocalStorage();

const favoriteAnnouncements = ref([]);

const getListLikes = async () => {
  try {
    const response = await axios.get(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/user/${userId}/favorites.json`
    );
    favoriteAnnouncements.value = response.data;
  } catch (err) {
    console.log(err);
  }
};

const deleteFavoriteAnnouncements = async (announcementsId) => {
  try {
    const response = await axios.get(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/user/${userId}/favorites.json`
    );
    const favoriteKey = Object.keys(response.data).find(
      (key) => response.data[key].announcementsId === announcementsId
    );
    if (favoriteKey) {
      await axios.delete(
        `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/user/${userId}/favorites/${favoriteKey}.json`
      );
      console.log(
        `Announcement with ID ${announcementsId} successfully deleted from favorites`
      );
      await getListLikes();
    } else {
      console.log(`Announcement with ID ${announcementsId} not found`);
    }
  } catch (err) {
    console.log(err);
  }
};

const redirectToMainPage = () => {
  router.push({ name: "home" });
};
onMounted(async () => {
  await getListLikes();
});
</script>

<template>
  <div class="wrapper-favorites">
    <div class="wrapper-redirect" @click="redirectToMainPage">
      <i class="pi pi-arrow-left" /><span class="title-redirect"
        >Вернуться</span
      >
    </div>
    <div class="favorites">
      <span class="title-favorites">Список избранного</span>
      <div class="favorites-card-group">
        <Card
          class="card"
          v-for="(announcement, i) in favoriteAnnouncements"
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
                  @click="
                    deleteFavoriteAnnouncements(announcement.announcementsId)
                  "
                />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper-redirect {
  margin-left: 40px;
}

.title-redirect {
  margin-left: 10px;
  font-size: 20px;
}

.favorites {
  margin-top: 20px;
}

.title-favorites {
  font-size: 18px;
}

.favorites-card-group {
  margin-left: 20px;
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  width: 37vh;
  height: 340px;
  border: 2px solid black;
  border-radius: 8px;
  margin-top: 20px;
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
