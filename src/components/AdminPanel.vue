<script setup>
import AddCard from "./AddCard.vue";
import SelectButton from "primevue/selectbutton";

import ViewAnnouncements from "./ViewAnnouncements.vue";
import ViewRecordServices from "./ViewRecordService.vue";

import { ref } from "vue";

const valueOfMenu = ref("");
const optionsMenu = ref([
  { label: "Посмотреть объявления", value: "viewAnnouncements" },
  { label: "Добавить объявление", value: "addCard" },
  { label: "Посмотреть записи сервсис-центра", value: "viewRecordServices" },
]);
</script>

<template>
  <div class="conteiner">
    <span class="title-admin">Панель администратора</span>
    <div class="nav-menu-admin">
      <SelectButton
        v-model="valueOfMenu"
        :options="optionsMenu"
        option-label="label"
        option-value="value"
      />
    </div>
    <div class="wrapper-panel">
      <ViewAnnouncements v-if="valueOfMenu === 'viewAnnouncements'" />
      <AddCard v-if="valueOfMenu === 'addCard'" />
      <ViewRecordServices v-if="valueOfMenu === 'viewRecordServices'" />
    </div>
  </div>
</template>

<style scoped>
.conteiner {
  margin-top: 20px;
}

.title-admin {
  margin-left: 50px;
  font-size: 30px;
}

.nav-menu-admin {
  margin-top: 20px;
  margin-left: 40px;
}

.wrapper-panel {
  margin-left: 40px;
}
</style>
