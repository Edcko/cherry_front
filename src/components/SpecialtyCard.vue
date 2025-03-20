<template>
    <v-card
      elevation="2"
      class="specialty-card"
    >
      <div class="icon-bg">
        <v-icon color="#4A5D32" size="32">
          {{ icon }}
        </v-icon>
      </div>
      <h3 class="specialty-title">{{ title }}</h3>
    </v-card>
  </template>
  
  <script>
  export default {
    name: "SpecialtyCard",
    props: {
      icon: {
        type: String,
        default: "mdi-help-circle",
      },
      title: {
        type: String,
        default: "Specialty",
      },
    },
  };
  </script>
  
  <style scoped>
  .specialty-card {
    text-align: center;
    padding: 24px;
    background-color: rgba(255,255,255,0.8);
    backdrop-filter: blur(4px);
    transition: box-shadow 0.3s;
    cursor: pointer;
  }
  
  .specialty-card:hover {
    box-shadow: 0 6px 14px rgba(0,0,0,0.1);
  }
  
  .icon-bg {
    width: 64px;
    height: 64px;
    border-radius: 9999px;
    background-color: rgba(138,154,91,0.1);
    margin: 0 auto 16px auto;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.3s;
  }
  
  .specialty-card:hover .icon-bg {
    transform: scale(1.1);
  }
  
  .specialty-title {
    font-weight: 600;
    color: #4A5D32;
    font-size: 1rem;
    margin: 0;
  }
  </style>
  