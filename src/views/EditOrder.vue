<script setup>

import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import OrderServices from "../services/OrderServices.js";
import moment from "moment";

const route = useRoute();
const router = useRouter();

const order = ref({});
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

onMounted(async () => {
  await getOrder();
});

async function getOrder() {
  await OrderServices.getOrder(route.params.id)
    .then((response) => {
      order.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateOrder() {
  await OrderServices.updateOrder(order.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${order.value.name} updated successfully!`;
      router.push({ name: "clerk", params: {} });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getOrder();
}

function closeSnackBar() {
  snackbar.value.value = false;
}

const pickupTime = computed(() => {
  if (order.value.pickupTime) {
    return moment(order.value.pickupTime).format("YYYY-MM-DDTkk:mm");
  }
  return null;
});

const dropoffTime = computed(() => {
  if (order.value.dropoffTime) {
    return moment(order.value.dropoffTime).format("YYYY-MM-DDTkk:mm");
  }
  return null;
});
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Order #{{order.id}} 
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2"
              >Edit Order
            </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="order.pickupLocation"
              label="Pickup Location"
              :rules="[rules.required, rules.matches]"
              :maxLength="2"
              required
            ></v-text-field>
            <v-text-field
              v-model="order.dropoffLocation"
              label="Dropoff Location"
              :rules="[rules.required, rules.matches]"
              :maxLength="2"
              required
            ></v-text-field>
            <v-text-field
              v-bind:value="pickupTime"
              v-model="order.pickupTime"
              label="Pickup Time"
              type="datetime-local"
              required
            ></v-text-field>
            <v-text-field
              v-bind:value="dropoffTime"
              v-model="order.dropoffTime"
              label="Dropoff Time"
              type="datetime-local"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="updateOrder()"
              >Update Order</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
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

<script>
export default {
  data: () => ({
    rules: {
      required: value => !!value || 'Field is required',
      matches: value => /^[a-zA-Z][1-9]$/.test(value) || 'Must be a letter and a number',
    },
  }),
}
</script>
