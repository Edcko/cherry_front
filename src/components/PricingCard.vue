<template>
    <v-card :class="cardClasses" class="pricing-card">
      <div class="pricing-header">
        <div :class="iconContainerClasses">
          <v-icon :color="isPopular ? 'white' : '#4469E3'" size="24">
            {{ iconName }}
          </v-icon>
        </div>
        <div>
          <h3 class="plan-title">{{ title }}</h3>
          <span
            v-if="isPopular"
            class="popular-badge"
          >
            Popular
          </span>
        </div>
      </div>
  
      <div class="pricing-info">
        <span class="price">{{ price }}</span>
        <span :class="subPriceClasses">/monthly</span>
      </div>
  
      <div class="features-list">
        <h4 class="features-title">What's included</h4>
        <div
          class="feature-item"
          v-for="(feature, i) in features"
          :key="i"
        >
          <v-icon :color="isPopular ? 'white' : '#4469E3'">
            mdi-check
          </v-icon>
          <span>{{ feature }}</span>
        </div>
      </div>
  
      <v-btn
        block
        :class="buttonClasses"
        class="choose-plan"
      >
        Choose Plan
      </v-btn>
    </v-card>
  </template>
  
  <script>
  export default {
    name: "PricingCard",
    props: {
      title: {
        type: String,
        default: "",
      },
      price: {
        type: String,
        default: "",
      },
      features: {
        type: Array,
        default: () => [],
      },
      isPopular: {
        type: Boolean,
        default: false,
      },
      iconName: {
        type: String,
        default: "mdi-help-circle",
      },
    },
    computed: {
      cardClasses() {
        return this.isPopular ? "popular-card" : "normal-card";
      },
      iconContainerClasses() {
        return this.isPopular ? "icon-container popular-bg" : "icon-container normal-bg";
      },
      subPriceClasses() {
        return this.isPopular ? "subprice popular-subprice" : "subprice normal-subprice";
      },
      buttonClasses() {
        return this.isPopular ? "popular-button" : "normal-button";
      },
    },
  };
  </script>
  
  <style scoped>
  .pricing-card {
    border-radius: 16px;
    padding: 24px;
    min-height: 100%;
  }
  
  /* Distinción de estilos si es popular o no */
  .popular-card {
    background-color: #4469e3;
    color: white;
  }
  
  .normal-card {
    background-color: white;
    color: #333;
  }
  
  .pricing-header {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    align-items: center;
  }
  
  .icon-container {
    padding: 8px;
    border-radius: 8px;
  }
  
  .popular-bg {
    background-color: rgba(255,255,255,0.1);
  }
  
  .normal-bg {
    background-color: #f0f0f0;
  }
  
  .plan-title {
    font-size: 1.4rem;
    margin: 0;
  }
  
  .popular-badge {
    display: inline-block;
    background-color: rgba(255,255,255,0.2);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    margin-top: 4px;
  }
  
  .pricing-info {
    margin-bottom: 16px;
  }
  
  .price {
    font-size: 2rem;
    font-weight: bold;
  }
  
  .subprice {
    margin-left: 8px;
    font-size: 0.9rem;
  }
  
  .popular-subprice {
    color: rgba(255,255,255,0.7);
  }
  
  .normal-subprice {
    color: #666;
  }
  
  .features-list {
    margin-bottom: 24px;
  }
  
  .features-title {
    font-weight: 600;
    margin-bottom: 12px;
    font-size: 1rem;
  }
  
  .feature-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }
  
  .choose-plan {
    font-weight: 600;
    font-size: 1rem;
  }
  
  /* Botones */
  .popular-button {
    background-color: white;
    color: #4469e3;
  }
  
  .popular-button:hover {
    background-color: rgba(255,255,255,0.8);
  }
  
  .normal-button {
    background-color: #4469e3;
    color: white;
  }
  
  .normal-button:hover {
    background-color: #4469e3cc;
  }
  </style>
  