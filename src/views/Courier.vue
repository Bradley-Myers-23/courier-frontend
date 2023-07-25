<script setup>
import { onMounted, ref, computed, reactive } from "vue";

import OrderServices from "../services/OrderServices.js";

const user = ref(null);
const orders = ref([]);
const routeDirections = reactive({});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  await getOrders();
  for (const delivery of orders.value) {
    routeDirections[delivery.id] = await getRouteTextDirections(
      delivery.pickupLocation,
      delivery.dropoffLocation
    );
  }
});

function getRouteTextDirections(pickupLocation, dropoffLocation) {
  const route = {
    startAddress: pickupLocation,
    endAddress: dropoffLocation,
  };

  return OrderServices.getRoutes(route)
    .then((response) => {      
      return response.data.textDirections;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getOrders() {
  await OrderServices.getOrdersByUserId(user.value.id)

    .then((response) => {
      orders.value = response.data;
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
  <v-app>
    <v-main>
      <v-container>
        <h1 class="text-center">Courier Dashboard</h1>

        <h2>Assigned Deliveries</h2>
        <v-card
          v-for="delivery in orders"
          :key="delivery.id"
          class="my-4"
          v-show="delivery.status !== 'Delivered'"
        >
          <v-card-text>
            <p><strong>Name :</strong> {{ delivery.customer.name }}</p>
            <p>
              <strong>Pickup Location:</strong> {{ delivery.pickupLocation }}
            </p>
            <p>
              <strong>Delivery Location:</strong> {{ delivery.dropoffLocation }}
            </p>
            <p><strong>Delivery Time:</strong> {{ delivery.deliveryTime }}</p>
            <p><strong>Route:</strong></p>
            <ul v-if="routeDirections[delivery.id]">
              <li v-for="direction in routeDirections[delivery.id]" :key="direction">
                {{ direction }}
              </li>
            </ul>
            <p v-else>Loading route directions...</p>
            <p><strong>Status:</strong> {{ delivery.status }}</p>
          </v-card-text>
        </v-card>

        <h2>Delivered item</h2>
        <v-card
          v-for="delivery in orders"
          :key="delivery.id"
          class="my-4"
          v-show="delivery.status == 'Delivered'"
        >
          <v-card-text>
            <p><strong>Name :</strong> {{ delivery.customer.name }}</p>
            <p>
              <strong>Pickup Location:</strong> {{ delivery.pickupLocation }}
            </p>
            <p>
              <strong>Delivery Location:</strong> {{ delivery.dropoffLocation }}
            </p>
            <p><strong>Delivery Time:</strong> {{ delivery.deliveryTime }}</p>
            <p><strong>Route:</strong></p>
            <ul v-if="routeDirections[delivery.id]">
              <li v-for="direction in routeDirections[delivery.id]" :key="direction">
                {{ direction }}
              </li>
            </ul>
            <p v-else>Loading route directions...</p>
            <p><strong>Status:</strong> {{ delivery.status }}</p>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>
