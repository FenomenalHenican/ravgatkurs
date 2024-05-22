<script setup>
import { computed, watch } from "vue";
import { format } from "date-fns";

const props = defineProps({
  records: Array,
  selectedDate: Date,
});

const date = computed(() => {
  return format(props.selectedDate, "dd-MM-yyyy");
});

const formatDate = (date) => {
  return new Date(date).toLocaleString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};
</script>

<template>
  <div class="data-page">
    <h1>Записи на {{ date }}</h1>
    <div v-if="records.length">
      <div v-for="(record, index) in records" :key="index" class="record">
        <p>Машина: {{ record.markCar }} {{ record.modelCar }}</p>
        <p>Пробег: {{ record.mileage }} km</p>
        <p>Тип услуги: {{ record.serviceType }}</p>
        <p>Время записи: {{ formatDate(record.date) }}</p>
        <p>Адрес сервиса: {{ record.adressService }}</p>
      </div>
    </div>
    <div v-else>
      <p>No records for this date.</p>
    </div>
  </div>
</template>

<style scoped>
.date-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: Arial, sans-serif;
}

h1 {
  color: #333;
}

.record {
  border: 2px solid black;
  width: fit-content;
  padding: 5px;
  border-radius: 8px;
}
</style>
