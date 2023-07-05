<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices";
import OrderServices from "../services/OrderServices.js";

const router = useRouter();

const selectedCourier = ref({});
const isViewOrder = ref(false);
const showDetails = ref(false);
const isAddUser = ref(false);
const isEdit = ref(false);
const users = ref([]);
const user = ref(null);

const newOrder = ref({
  pickupTime: null,
  dropoffTime: null,
  price: null,
  pickupLocation: null,
  dropoffLocation: null,
  status: "Pending",
  route: "",
});

// const userOrders = ref([]);
// const userOrder = ref({
//   orderId: undefined,
//   userId: undefined,
//   headCount: undefined
// });

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const props = defineProps({
  order: {
    required: true,
  },
});

onMounted(async () => {
  await getUsers();
  user.value = JSON.parse(localStorage.getItem("user"));
  console.log(user.value);
});

// async function getUserOrders() {
//   await UserOrderServices.getUserForOrder(props.order.id)
//     .then((response) => {
//       userOrders.value = response.data;
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// }

async function getUsers() {
  await UserServices.getUser()
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}


function navigateToEdit() {
  router.push({ name: "editOrder", params: { id: props.order.id } });
}

// async function assignCourierToOrder(user) {
//   userOrder.value.userId = user.id;
//   userOrder.value.orderId = props.order.id;
//   userOrder.value.headCount = 1;
//   userOrder.userId = user.id;
//   userOrder.orderId = props.order.id;
//   userOrder.headCount = 1;
//   isAddUser.value = false;

//   await UserOrderServices.assignCourierOrder( userOrder)
//     .then(() => {
//       snackbar.value.value = true;
//       snackbar.value.color = "green";
//       snackbar.value.text = `User for Order added successfully!`;
//     })
//     .catch((error) => {
//       console.log(error);
//       snackbar.value.value = true;
//       snackbar.value.color = "error";
//       snackbar.value.text = error.response.data.message;
//     });
//   await getUserOrders();
//   await getUsers();
// }

// async function removeUserFromOrder(user) {
//   isViewUser.value = false;
  
//   await UserOrderServices.deleteUserOrder(user)
//     .then(() => {
//       snackbar.value.value = true;
//       snackbar.value.color = "green";
//       snackbar.value.text = `User for Order removed successfully!`;
//     })
//     .catch((error) => {
//       console.log(error);
//       snackbar.value.value = true;
//       snackbar.value.color = "error";
//       snackbar.value.text = error.response.data.message;
//     });

//   await getUserOrders();
//   await getUsers();
// }

function openAddUser() {
  isAddUser.value = true;
}

function closeAddUser() {
  isAddUser.value = false;
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
            v-if="user !== null"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-account"
            @click="openAddUser()"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Courier assigned to this order: </h3>
 
        <!-- <v-chip
          size="small"
          v-for="userOrder in userOrders"
          :key="userOrder.id"
          pill
          @click="openUserDetails(userOrder)"
          >
            {{ userOrder.user.firstName }} 
            {{ userOrder.user.lastName }}
        </v-chip> -->

        <br><br>
        <h3>Order Details</h3>
        <br>
        <v-table>
          <tbody>
            <tr>
              <td>Pickup Location</td>
              <td>Dropoff Location</td>
              <td>Pickup Time</td>
              <td>Dropoff Time</td>
            </tr>
            <tr>
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
                <v-list-item v-if="user !== null" v-for="user in users" :key="user.id" @click="assignCourierToOrder(user)">
                  <v-row align="center">
                    <v-col cols="6">
                      <v-list-item-content>
                        <v-list-item-title>{{ user.firstName }} {{ user.lastName }}</v-list-item-title>
                      </v-list-item-content>
                    </v-col>
                  </v-row>
                </v-list-item>
                <v-list-item v-if="user !== null" @click="assignCourierToOrder(user)">
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
