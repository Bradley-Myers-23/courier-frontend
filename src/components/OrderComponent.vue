<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";
import OrderServices from "../services/OrderServices";
import RateServices from "../services/RateServices";

const router = useRouter();

const selectedCourier = ref({});
const isViewOrder = ref(false);
const showDetails = ref(false);
const isAddUser = ref(false);
const isEdit = ref(false);
const users = ref([]);
const user = ref(null);
const selectedUser = ref({});
const selectedOrder = ref({});
const rate = ref({});

const newOrder = ref({
  pickupTime: null,
  dropoffTime: null,
  price: null,
  pickupLocation: null,
  dropoffLocation: null,
  status: "Pending",
  route: "",
  customer: null,
  user: null,
});

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const props = defineProps({
  order: {
    required: true,
  },
  customer:{
    required: true,
  },
  courierFName:{
    required: true,
  },
  courierLName:{
    required: true,
  },
});

onMounted(async () => {
  await getUsers();
  await getRates();
  user.value = JSON.parse(localStorage.getItem("user"));
  console.log(user.value);
});

async function getUsers() {
  await UserServices.getUser()
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getRates() {
  await RateServices.getRates()
    .then((response) => {
      rate.value = response.data[0];
      console.log(rate.value.CancelFee);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function deleteOrder(id) {
  await OrderServices.deleteOrder(id)
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
    window.location.reload();
}

function navigateToEdit() {
  router.push({ name: "editOrder", params: { id: props.order.id } });
}

function openAddUser() {
  isAddUser.value = true;
}

function closeAddUser() {
  isAddUser.value = false;
}

async function assignCourier(user, order){
  selectedUser.value.id = user.id;
  selectedUser.value.firstName = user.firstName;
  selectedUser.value.lastName = user.lastName;
  isAddUser.value = false;

  await OrderServices.getOrder(order.id)
    .then((response) => {
      selectedOrder.value = response.data;
      selectedOrder.value.userId = user.id;
      selectedOrder.value.status = "Pending"
    })
    .catch((error) => {
      console.log(error);
  });

  await OrderServices.updateOrder(selectedOrder.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Order updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
    window.location.reload();
}

async function cancelOrder(order){
  await getRates();

  await OrderServices.getOrder(order.id)
    .then((response) => {
      selectedOrder.value = response.data;
      selectedOrder.value.userId = user.id;
      selectedOrder.value.status = "Cancelled";
      selectedOrder.value.price = rate.value.CancelFee;
    })
    .catch((error) => {
      console.log(error);
  });

  await OrderServices.updateOrder(selectedOrder.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Order updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
    window.location.reload();
}

</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = (!isAddUser && !isEdit) ? !showDetails : showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          <v-chip class="ma-2" label>
            Order #{{order.id}} 
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-left">
          <v-icon
            v-if="user !== null && order.status !== 'Cancelled' && order.status !== 'Delivered'"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
          <v-icon
            v-if="user !== null && order.status !== 'Cancelled' && order.status !== 'Delivered'"
            size="small"
            icon="mdi-account"
            @click="openAddUser()"
          ></v-icon>
          <v-icon
            v-if="user !== null && order.status !== 'Cancelled' && order.status !== 'Delivered'"
            size="small"
            icon="mdi-cancel"
            @click="cancelOrder(order)"
          ></v-icon>
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-delete"
            @click="deleteOrder(order.id)"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Courier assigned to this order: </h3>
 
        <v-chip size="large">
            {{ courierFName }} 
            {{ courierLName }}
        </v-chip>

        <br><br>
        <h3>Order Details</h3>
        <br>
        <v-table>
          <tbody>
            <tr>
              <td>Customer</td>
              <td>Pickup Location</td>
              <td>Dropoff Location</td>
              <td>Pickup Time</td>
              <td>Dropoff Time</td>
              <td>Order Status</td>
              <td>Price</td>
            </tr>
            <tr>
              <td>
                {{ customer }}
              </td>
              <td>
                {{order.pickupLocation}}
              </td>
              <td>
                {{order.dropoffLocation}}
              </td>
              <td>
                {{new Date(order.pickupTime).toLocaleString('en-US')}}
              </td>
              <td>
                {{new Date(order.dropoffTime).toLocaleString('en-US')}}
              </td>
              <td>
                {{order.status}}
              </td>
              <td>
                ${{order.price}}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
      
    </v-expand-transition>
  </v-card>

    <v-dialog
      persistent
      :model-value="isAddUser"
      width="800"
    >
    <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          Assign Courier
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-list>
                <v-list-item v-if="user !== null" v-for="user in users" :key="user.id" @click="assignCourier(user, order)">
                  <v-row align="center">
                    <v-col cols="6">
                      <v-list-item-content>
                        <v-list-item-title>{{ user.firstName }} {{ user.lastName }}</v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="closeAddUser()"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    
</template>
