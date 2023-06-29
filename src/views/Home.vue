<script setup>

import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";


const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  
});

</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col align="center"
        ><v-card-title class="text-h2 font-weight-bold"
          >Welcome to the Courier Service!
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
                ><v-card-title class="headline">Price per block: </v-card-title>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col class="d-flex justify-start">
                [PRICE GOES HERE]
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
          {{ new Date().getFullYear() }} — <strong>Courier Services Inc.</strong>
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
