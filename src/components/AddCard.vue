<script setup>
import "primeicons/primeicons.css";

import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import SelectButton from "primevue/selectbutton";

import { getUserIdFromLocalStorage } from "../stores/getLocalStorage";

import { ref } from "vue";
import axios from "axios";
import * as FB from "firebase/storage";

const userID = getUserIdFromLocalStorage();

const inputDescription = ref("");
const inputMark = ref("");
const inputModel = ref("");
const inputMileage = ref("");
const inputHorsePower = ref("");
const inputEngineCapacity = ref("");
const inputPrice = ref("");
const inputDataOfIssue = ref("");

const stateCar = ref();
const optionsSelectStateCar = ref([
  { label: "Б/У", value: "used" },
  { label: "Новая", value: "new" },
]);

const imageUrl = ref("");
let file = null;

const handleFileChange = (event) => {
  const fileUpload = event.target.files[0];
  if (!fileUpload) {
    console.log("file is not loaded");
    return;
  }
  file = fileUpload;
  imageUrl.value = URL.createObjectURL(fileUpload);
};

const handleFileUpload = async (event) => {
  if (!file) {
    return;
  }
  try {
    const storage = FB.getStorage();
    const storageRef = FB.ref(storage, `announcement/${userID}/${file.name}`);
    await FB.uploadBytes(storageRef, file);
    console.log("file uploaded");
    return `announcement/${userID}/${file.name}`;
  } catch (error) {
    console.log("error uploading:", error);
  }
};

const saveToFireBase = async () => {
  const link = await handleFileUpload();
  const announcementsId = Math.floor(Math.random() * 100000);
  const data = {
    description: inputDescription.value,
    price: inputPrice.value,
    modelCar: inputModel.value,
    markCar: inputMark.value,
    yearOfIssue: inputDataOfIssue.value,
    horsePower: inputHorsePower.value,
    engineCapacity: inputEngineCapacity.value,
    announcementsId: announcementsId,
    mileage: inputMileage.value,
    link: link,
    state: stateCar.value,
  };

  const path = stateCar.value === "used" ? "usedCard" : "newCars";

  axios
    .post(
      `https://rafgat-kurs-default-rtdb.europe-west1.firebasedatabase.app/${path}/.json`,
      data
    )
    .then((response) => {
      console.log("Announcement added successfully!");
      clearFields();
    })
    .catch((error) => {
      console.log("There has been a problem with your axios operation:", error);
    });
};

const clearFields = () => {
  inputDescription.value = "";
  inputPrice.value = "";
  inputMileage.value = "";
  inputEngineCapacity.value = "";
  inputHorsePower.value = "";
  inputDataOfIssue.value = "";
  inputModel.value = "";
  inputMark.value = "";
};
</script>
<template>
  <div class="wrapper-add-card">
    <span class="add-announcement-title">Добавить объявление</span>
    <div class="input-add-card-group">
      <div class="first-line">
        <InputText
          v-model="inputMark"
          class="input-mark-car"
          placeholder="Марка авто"
        />
        <InputText
          v-model="inputModel"
          class="input-model-car"
          placeholder="Модель авто"
        />
        <InputText
          v-model="inputDataOfIssue"
          class="input-data-of-issue-car"
          placeholder="Год выпуска"
          type="number"
        />
      </div>
      <div class="second-line">
        <InputText
          v-model="inputMileage"
          class="input-mileage-car"
          placeholder="Пробег авто"
          type="number"
        />
        <InputText
          v-model="inputHorsePower"
          class="input-horsepower-car"
          placeholder="Кол-во л.с"
          type="number"
        />
        <InputText
          v-model="inputEngineCapacity"
          class="input-engine-capacity"
          placeholder="Объем двигателя"
          type="number"
        />
      </div>
      <div class="third-line">
        <InputText
          v-model="inputPrice"
          class="input-price-car"
          placeholder="Цена "
          type="number"
        />
        <SelectButton
          v-model="stateCar"
          :options="optionsSelectStateCar"
          optionLabel="label"
          optionValue="value"
          aria-labelledby="basic"
          class="select-btn-state-car"
        />
      </div>
      <Textarea
        v-model="inputDescription"
        class="input-description-car"
        placeholder="Описание..."
      />
    </div>
    <div class="wrapper-input-image">
      <input class="input-image" type="file" @change="handleFileChange" />
    </div>
  </div>
  <button class="btn-add-announcement" @click="saveToFireBase">
    Добавить объявление
  </button>
</template>
<style scoped>
.wrapper-add-card {
  margin-top: 10px;
}

.add-announcement-title {
  font-size: 20px;
}

.input-add-card-group {
  margin-top: 10px;
}

.first-line {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
}

.input-model-car {
  margin-left: 10px;
}

.input-data-of-issue-car {
  margin-left: 10px;
}

.second-line {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
}

.input-horsepower-car {
  margin-left: 10px;
}

.input-engine-capacity {
  margin-left: 10px;
}

.third-line {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
}

.select-btn-state-car {
  margin-left: 10px;
}

.input-description-car {
  margin-top: 10px;
}

.input-image {
  margin-top: 10px;
}

.btn-add-announcement {
  margin-top: 10px;
  background: none;
  border-radius: 4px;
  padding: 5px;
}
</style>
