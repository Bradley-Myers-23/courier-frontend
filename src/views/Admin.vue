<script setup>

import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import RateServices from "../services/RateServices";


const rate = ref({});
const isEdit = ref(false);
const newRate = ref({
  id: null,
  IntialPrice: null,
  pricePerBlock: null,
  CancelFee: null,
  Bonus: null,
});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getRates();
});

async function getRates() {
  await RateServices.getRates()
    .then((response) => {
      rate.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function updateRates() {
  await RateServices.updateRate(newRate.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Rates updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getRates();
  isEdit.value = false;
}

function openEdit(){
  newRate.value.id = rate.value.id;
  newRate.value.IntialPrice = rate.value.IntialPrice;
  newRate.value.pricePerBlock = rate.value.pricePerBlock;
  newRate.value.CancelFee = rate.value.CancelFee;
  newRate.value.Bonus = rate.value.Bonus;
  isEdit.value = true;
}

</script>

<template>
  <v-container>
    <v-btn v-if="user !== null" color="accent" @click="openEdit()">Edit Rates</v-btn>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title>
            <v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Initial Fee: ${{ rate.IntialPrice }}</v-card-title>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title>
            <v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Price per block: ${{ rate.pricePerBlock }}</v-card-title>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title>
            <v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Cancellation Fee: ${{ rate.CancelFee }}</v-card-title>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title>
            <v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Courier Bonus: ${{ rate.Bonus }}</v-card-title>
              </v-col>
            </v-row>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>


    <v-dialog persistent :model-value="isEdit" width="800">
      <v-row>
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2"
              >Edit Rates
            </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newRate.IntialPrice"
              label="Initial Price"
              required
            ></v-text-field>
            <v-text-field
              v-model="newRate.pricePerBlock"
              label="Price Per Block"
              required
            ></v-text-field>
            <v-text-field
              v-model="newRate.CancelFee"
              label="Cancellation Fee"
              required
            ></v-text-field>
            <v-text-field
              v-model="newRate.Bonus"
              label="Courier Bonus"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="updateRates()"
              >Update Rates</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-row>
    </v-dialog>

    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
