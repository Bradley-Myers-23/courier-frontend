<script setup>
import { onMounted, ref, computed, reactive } from "vue";

import OrderServices from "../services/OrderServices.js";

const user = ref(null);
const orders = ref([]);
const routeDirections = reactive({});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  await getOrders();
});

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
function startDriving(delivery) {
  delivery.status = "Driving";

  OrderServices.updateOrder(delivery)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${delivery.value.status} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function pickUp(delivery) {
  delivery.status = "Picked Up";
  OrderServices.updateOrder(delivery)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${delivery.value.status} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function completeDelivery(delivery) {
  delivery.status = "Delivered";
  OrderServices.updateOrder(delivery)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${delivery.value.status} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}
function formatDate(dateTimeStr) {
      const date = new Date(dateTimeStr);
      return date.toISOString().slice(0, 10); // Returns only the date part (YYYY-MM-DD)
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
          v-show="
            delivery.status !== 'Delivered' && delivery.status !== 'Cancelled'
          "
        >
          <v-card-text>
            <p><strong>Name :</strong> {{ delivery.customer.name }}</p>
            <p>
              <strong>Pickup Location:</strong> {{ delivery.pickupLocation }}
            </p>
            <p>
              <strong>Delivery Location:</strong> {{ delivery.dropoffLocation }}
            </p>
            <p><strong>Pick up Time:</strong> {{ formatDate(delivery.pickupTime) }}</p>
            <p><strong>Drop off Time:</strong> {{ formatDate(delivery.dropoffTime)}}</p>
            <p
              v-show="
                delivery.status !== 'Driving' && delivery.status !== 'Pending'
              "
            >
              <strong>Route:</strong>{{ delivery.route }}
            </p>
            <p><strong>Status:</strong> {{ delivery.status }}</p>
            <v-card-actions>
              <v-btn
                v-if="delivery.status === 'Pending'"
                @click="startDriving(delivery)"
                color="accent"
                >Start Driving</v-btn
              >
              <v-btn
                v-if="delivery.status === 'Driving'"
                @click="pickUp(delivery)"
                color="accent"
                >Pick Up</v-btn
              >
              <v-btn
                v-if="delivery.status === 'Picked Up'"
                @click="completeDelivery(delivery)"
                color="accent"
                >Delivered</v-btn
              >
            </v-card-actions>
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
            <p><strong>Pick up Time:</strong> {{ formatDate(delivery.pickupTime) }}</p>
            <p><strong>Drop off Time:</strong> {{ formatDate(delivery.dropoffTime)}}</p>
            <p><strong>Route:</strong>{{ delivery.route }}</p>

            <p><strong>Status:</strong> {{ delivery.status }}</p>
          </v-card-text>
        </v-card>

        <h2>Cancelled item</h2>
        <v-card
          v-for="delivery in orders"
          :key="delivery.id"
          class="my-4"
          v-show="delivery.status == 'Cancelled'"
        >
          <v-card-text>
            <p><strong>Name :</strong> {{ delivery.customer.name }}</p>
            <p>
              <strong>Pickup Location:</strong> {{ delivery.pickupLocation }}
            </p>
            <p>
              <strong>Delivery Location:</strong> {{ delivery.dropoffLocation }}
            </p>
            <p><strong>Pick up Time:</strong> {{ formatDate(delivery.pickupTime) }}</p>
            <p><strong>Drop off Time:</strong> {{ formatDate(delivery.dropoffTime)}}</p>
            <p><strong>Route:</strong>{{ delivery.route }}</p>

            <p><strong>Status:</strong> {{ delivery.status }}</p>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>
