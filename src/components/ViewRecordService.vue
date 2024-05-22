<script setup>
import "primeicons/primeicons.css";

import DataPage from "./DataPage.vue";

import Calendar from "primevue/calendar";
import { ref } from "vue";
import axios from "axios";
import { format } from "date-fns";

const selectedDate = ref(null);
const records = ref([]);

const onDateSelect = async () => {
  if (selectedDate.value) {
    const formatedData = format(selectedDate.value, "yyyy-MM-dd");
    await fetchData(formatedData);
    console.log(formatedData);
  }
};

const fetchData = async (date) => {
  try {
    const response = await axios.get(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/records/${date}.json`
    );
    records.value = response.data ? Object.values(response.data) : [];
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
</script>
<template>
  <div class="calendar-container">
    <Calendar
      v-model="selectedDate"
      @date-select="onDateSelect"
      inline
      selection-mode="single"
      dateFormat="yyyy-MM-dd"
    />
  </div>
  <DataPage
    :records="records"
    :selected-date="selectedDate"
    v-if="selectedDate"
  />
</template>
<style scoped>
.calendar-container {
  margin-top: 20px;
}
</style>
