<template>
    <v-card
      elevation="2"
      class="service-card"
    >
      <div
        class="icon-wrapper"
        :style="{ backgroundColor: bgColor }"
      >
        <v-icon
          color="#4A5D32"
          size="32"
        >
          {{ icon }}
        </v-icon>
      </div>
      <h3 class="service-title">
        {{ title }}
      </h3>
    </v-card>
  </template>
  
  <script>
  export default {
    name: "ServiceCard",
    props: {
      icon: {
        type: String,
        default: "mdi-help-circle",
      },
      title: {
        type: String,
        default: "Service Title",
      },
      bgColor: {
        type: String,
        default: "#f0f0f0",
      },
    },
  };
  </script>
  
  <style scoped>
  .service-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 24px;
    transition: box-shadow 0.3s;
    cursor: pointer;
  }
  
  .service-card:hover {
    box-shadow: 0 6px 14px rgba(0,0,0,0.1);
  }
  
  .icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    transition: transform 0.3s;
  }
  
  .service-card:hover .icon-wrapper {
    transform: scale(1.1);
  }
  
  .service-title {
    font-weight: 600;
    color: #4a5d32;
    font-size: 1.1rem;
    margin: 0;
  }
  </style>
  