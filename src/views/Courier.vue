<template>
    <v-app>
      <v-main>
        <v-container>
          <h1 class="text-center">Courier Dashboard</h1>
  
          <h2>Assigned Deliveries</h2>
          <v-card v-for="delivery in assignedDeliveries" :key="delivery.id" class="my-4" v-show="delivery.status !== 'Delivered'">
            
            <v-card-text>
            <p><strong>Name :</strong> {{ delivery.CustomerName }}</p>
              <p><strong>Pickup Location:</strong> {{ delivery.pickupLocation }}</p>
              <p><strong>Delivery Location:</strong> {{ delivery.deliveryLocation }}</p>
              <p><strong>Delivery Time:</strong> {{ delivery.deliveryTime }}</p>
              <p><strong>Route:</strong> {{ delivery.route }}</p>
              <p><strong>Status:</strong> {{ delivery.status }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="delivery.status === 'Assigned'" @click="startDriving(delivery)" color="accent">Start Driving</v-btn>
              <v-btn v-if="delivery.status === 'Driving'" @click="pickUp(delivery)" color="accent">Pick Up</v-btn>
              <v-btn v-if="delivery.status === 'Picked Up'" @click="completeDelivery(delivery)" color="accent">Delivered</v-btn>
            </v-card-actions>
          </v-card>
  
          <h2>Delivered Items</h2>
          <v-card v-for="deliveredItem in deliveredItems" :key="deliveredItem.id" class="my-4">
            <v-card-text>
              
              <p><strong>Name :</strong> {{ deliveredItem.CustomerName }}</p>
              <p><strong>Pickup Location:</strong> {{ deliveredItem.pickupLocation }}</p>
              <p><strong>Delivery Location:</strong> {{ deliveredItem.deliveryLocation }}</p>
              <p><strong>Delivery Time:</strong> {{ deliveredItem.deliveryTime }}</p>
              <p><strong>Route:</strong> {{ deliveredItem.route }}</p>
              <p><strong>Status:</strong> {{ deliveredItem.status }}</p>
            </v-card-text>
          </v-card>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const assignedDeliveries = ref([
        {
      
          CustomerName: 'Bickers & Bickers',
          pickupLocation: 'ABC Company',
          deliveryLocation: 'XYZ Store',
          deliveryTime: '12:00 PM',
          route: 'ABC Street -> XYZ Street -> ABC Street',
          status: 'Assigned',
        },
      ]);
  
      const deliveredItems = ref([]);
  
      function startDriving(delivery) {
        // Simulate getting route from current location to pickup location
        const route = `Current Location -> ${delivery.pickupLocation}`;
        delivery.route = route;
        delivery.status = 'Driving';
  
        // Display or notify the courier about the route
        console.log('Route:', route);
      }
  
      function pickUp(delivery) {
        // Simulate getting route from pickup location to delivery location
        const route = `${delivery.pickupLocation} -> ${delivery.deliveryLocation}`;
        delivery.route = route;
        delivery.status = 'Picked Up';
  
        // Display or notify the courier about the route
        console.log('Route:', route);
      }
  
      function completeDelivery(delivery) {
        delivery.status = 'Delivered';
        // Notify the courier or perform any necessary actions when delivering the package
        deliveredItems.value.push(delivery);
      }
  
      return {
        assignedDeliveries,
        deliveredItems,
        startDriving,
        pickUp,
        completeDelivery,
      };
    },
  };
  </script>
  
