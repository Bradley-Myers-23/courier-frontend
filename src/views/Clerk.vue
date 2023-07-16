<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import OrderCard from "../components/OrderComponent.vue";
import OrderServices from "../services/OrderServices.js";
import CustomerServices from "../services/CustomerServices";
import dropdown from "vue-dropdowns";
import UserServices from "../services/UserServices";



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
const customers = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const users = ref([]);
const user = ref(null);
const isAddCustomer = ref(false);
const isCreateCustomer = ref(false);
const isViewCustomer = ref(false);
const selectedCustomer = ref({});
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
  customerId: null,
  userId: null,
});

const newCustomer = ref({
  PhoneNumber: null,
  name: null,
  address: null,
});

onMounted(async () => {
  await getOrders();
  await getCustomers();
  await getUsers();
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

async function getUsers() {
  await UserServices.getUser()
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addOrder() {
  isAdd.value = false;
  newOrder.value.customerId = selectedCustomer.value.id;
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

async function createCustomer() {
  isCreateCustomer.value = false;

  await CustomerServices.addCustomer(newCustomer.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newCustomer.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
    window.location.reload();
}

function openAdd() {
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openAddCustomer() {
  isAddCustomer.value = true;
}

function closeAddCustomer() {
  isAddCustomer.value = false;
}

function openCreateCustomer() {
  isCreateCustomer.value = true;
}

function closeCreateCustomer() {
  isCreateCustomer.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}

async function getCustomers() {
  await CustomerServices.getCustomers()
    .then((response) => {
      customers.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function assignCustomer(customer){
  selectedCustomer.value.name = customer.name;
  selectedCustomer.value.id = customer.id
  isAddCustomer.value = false;
}

function openCustomerDetails(customer) {
  selectedCustomer.value = customer;
  selectedCustomer.value.id = customer.id;
  isViewCustomer.value = true;
}

function closeCustomerDetails() {
  isViewCustomer.value = false;
}

async function deleteCustomer(id) {
  await CustomerServices.deleteCustomer(id)
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
    window.location.reload();
}

function formatPhoneNumber(phoneNumber) {
  // Assuming the phone number is in a standard format like "1234567890"
  const areaCode = phoneNumber.slice(0, 3);
  const firstPart = phoneNumber.slice(3, 6);
  const secondPart = phoneNumber.slice(6);
  
  // Format the phone number as "(123) 456-7890"
  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

</script>

<dropdown :options="arrayOfObjects" :selected="object" v-on:updateOption="methodToRunOnSelect"></dropdown>


<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Customers
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openCreateCustomer()"
            >Add</v-btn
          >
        </v-col>
      </v-row>
      <v-row>
        <v-chip
          size="large"
          v-for="customer in customers"
          :key="customer.id"
          pill
          @click="openCustomerDetails(customer)"
          >
            {{ customer.name }}
        </v-chip>
      </v-row>
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
        :customer="customers.filter(customer => customer.id === order.customerId)[0].name"
        :courierFName="users.filter(user => user.id === order.userId)[0].firstName"
        :courierLName="users.filter(user => user.id === order.userId)[0].lastName"
        @deletedList="getLists()"
      />

      <v-dialog persistent :model-value="isAdd" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2"
              >Add Order
            </v-card-title>
          <v-card-text>
            <v-icon
              size="small"
              icon="mdi-account"
              @click="openAddCustomer()"
            ></v-icon>
            {{ selectedCustomer.name }}
            <v-text-field
              v-model="newOrder.pickupLocation"
              label="Pickup Location"
              :rules="[rules.required, rules.matches]"
              :maxLength="2"
              required
            ></v-text-field>
            <v-text-field
              v-model="newOrder.dropoffLocation"
              label="Dropoff Location"
              :rules="[rules.required, rules.matches]"
              :maxLength="2"
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

      <v-dialog
        persistent
        :model-value="isAddCustomer"
        width="800"
      >
      <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">
            Assign Customer
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-list>
                  <v-list-item v-for="customer in customers" :key="customer.id" @click="assignCustomer(customer)">
                    <v-row align="center">
                      <v-col cols="6">
                        <v-list-item-content>
                          <v-list-item-title>{{ customer.name }} - {{ customer.address }} - {{ customer.PhoneNumber }}</v-list-item-title>
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
              @click="closeAddCustomer()"
              >Close</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog persistent :model-value="isCreateCustomer" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2"
              >Add Customer
            </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newCustomer.name"
              label="Name"
              required
            ></v-text-field>
            <v-text-field
              v-model="newCustomer.address"
              label="Address"
              required
            ></v-text-field>
            <v-text-field
              v-model="newCustomer.PhoneNumber"
              label="Phone Number"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeCreateCustomer()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="createCustomer()"
              >Add Customer</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
      persistent
      :model-value="isViewCustomer"
      width="800"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          Customer Details
        </v-card-title>
        <v-table>
          <tbody>
            <tr>
              <td>Name</td>
              <td>Address</td>
              <td>Phone Number</td>
            </tr>
            <tr>
              <td>
                {{ selectedCustomer.name }}
              </td>
              <td>
                {{ selectedCustomer.address }}
              </td>
              <td>
                {{ formatPhoneNumber(selectedCustomer.PhoneNumber) }}
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="closeCustomerDetails()"
            >Close</v-btn
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
