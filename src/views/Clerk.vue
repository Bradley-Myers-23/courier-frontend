<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import OrderCard from "../components/OrderComponent.vue";
import OrderServices from "../services/OrderServices.js";
import moment from "moment";

// import { useVuerify } from "vuetify";

// import { vDate } from '../../plugins/vuerify/lib/validators';

// useVuerify({
//   rules: {
//     vDate,
//   },
// });
const date = ref(new Date().toISOString().substr(0, 10));
const menu1 = ref(false);
const orders = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


// const computedDateFormattedMomentjs = computed(() => {
//   return date.value ? moment(date.value).format("dddd, MMMM Do YYYY") : "";
// });
// const computedDateFormattedDatefns = computed(() => {
//   return date.value ? format(date.value, "dddd, MMMM Do YYYY") : "";
// });
const newOrder = ref({
  pickupTime: null,
  dropoffTime: null,
  price: null,
  pickupLocation: null,
  dropoffLocation: null,
  status: "Pending",
  route: "",
});

onMounted(async () => {
  await getOrders();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getOrders() {
  await OrderServices.getOrders()

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
async function addOrder() {
  isAdd.value = false;
  newOrder.value.userId = user.value.id;

  await OrderServices.addOrder(newOrder.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newOrder.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getOrders();
}

async function updateOrder() {
  isEdit.value = false;
  await OrderServices.updateOrder(newOrder.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newOrder.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getOrders();
}

function openAdd() {
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newOrder.value.id = item.id;
  newOrder.value.pickupTime = item.pickupTime;
  newOrder.value.dropoffTime=  item.dropoffTime;
  newOrder.value.price = item.price;
  newOrder.value.pickupLocation = item.pickupLocation;
  newOrder.value.dropoffLocation = item.dropoffLocation;
  newOrder.value.status = item.status;
  newOrder.value.route = item.route;
  isEdit.value = true;
}

function closeEdit() {
  isEdit.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Orders
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            >Add</v-btn
          >
        </v-col>
      </v-row>

      <OrderCard
        v-for="order in orders"
        :key="order.id"
        :order="order"
        @deletedList="getLists()"
      />

      <v-dialog persistent :model-value="isAdd" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2"
              >Add Order
            </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newOrder.pickupLocation"
              label="Pickup Location"
              required
            ></v-text-field>
            <v-text-field
              v-model="newOrder.dropoffLocation"
              label="Dropoff Location"
              required
            ></v-text-field>
            <v-text-field
              v-model="newOrder.pickupTime"
              label="Pickup Time"
              type="datetime-local"
              required
            ></v-text-field>
            <v-text-field
              v-model="newOrder.dropoffTime"
              label="Dropoff Time"
              type="datetime-local"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAdd()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addOrder()"
              >Add Order</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
