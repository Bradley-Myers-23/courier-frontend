<script setup>

import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import RateServices from "../services/RateServices";


const rate = ref({});
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

</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col align="center"
        ><v-card-title class="text-h2 font-weight-bold"
          >Welcome to the ACME Courier Service!
        </v-card-title>
      </v-col>
    </v-row>
    <v-row align="center">
      <v-col align="center"
        ><v-card-title class="text-h4">
          We deliver locally!<br>Please see below for our list of rates:
        </v-card-title>
      </v-col>
    </v-row>
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

    <v-footer-border>
      <v-row justify="center" no-gutters>
        <v-col class="text-center mt-4" cols="12">
          <strong>1-555-COURIER</strong>
        </v-col>
      </v-row>
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          {{ new Date().getFullYear() }} — <strong>ACME Courier Service</strong>
        </v-col>
      </v-row>
    </v-footer-border>
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
