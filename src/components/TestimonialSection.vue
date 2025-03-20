<template>
    <div class="testimonial-section">
      <!-- Fondo hexagonal (opcional) -->
      <div class="hex-background"></div>
  
      <div class="testimonial-content">
        <p class="intro-text">Testimonials</p>
        <h2 class="title">What Our Client Says</h2>
  
        <div class="testimonial-wrapper">
          <div class="testimonial-avatar">
            <v-avatar size="192">
              <img src="/placeholder.svg" alt="Client" />
            </v-avatar>
          </div>
          <div class="testimonial-text">
            <blockquote>{{ testimonials[0].quote }}</blockquote>
            <div class="testimonial-author">
              <p class="author-name">{{ testimonials[0].name }}</p>
              <p class="author-location">{{ testimonials[0].location }}</p>
            </div>
  
            <div class="testimonial-nav">
              <v-btn icon variant="outlined" class="nav-btn">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn icon variant="outlined" class="nav-btn">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    name: "TestimonialSection",
    setup() {
      const testimonials = ref([
        {
          image: "/placeholder.svg",
          name: "Andrew Denner",
          location: "Nevada",
          quote:
            "As a busy professional, I don't have time to wait on hold or play phone tag to schedule appointments. Thanks to ZenSpace, booking appointments has never been easier! ...",
        },
      ]);
  
      return {
        testimonials,
      };
    },
  };
  </script>
  
  <style scoped>
  .testimonial-section {
    position: relative;
    padding: 40px 0;
  }
  
  .hex-background {
    position: absolute;
    inset: 0;
    opacity: 0.1;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-rule='evenodd' stroke='%230F766E' fill='none'/%3E%3C/svg%3E");
    background-size: 60px 60px;
    pointer-events: none;
  }
  
  .testimonial-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    text-align: left;
    padding: 0 16px;
  }
  
  .intro-text {
    color: #009688;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .title {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 24px;
  }
  
  .testimonial-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
  }
  
  .testimonial-avatar {
    flex: 1 1 100%;
    max-width: 240px;
    display: flex;
    justify-content: center;
    margin-bottom: 16px;
  }
  
  @media (min-width: 992px) {
    .testimonial-avatar {
      flex: 0 0 33%;
      margin-bottom: 0;
      justify-content: start;
    }
  }
  
  .testimonial-text {
    flex: 1 1 100%;
    max-width: 600px;
  }
  
  @media (min-width: 992px) {
    .testimonial-text {
      flex: 0 0 66%;
    }
  }
  
  blockquote {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #555;
    margin: 0 0 16px 0;
  }
  
  .testimonial-author {
    margin-bottom: 16px;
  }
  
  .author-name {
    font-weight: 600;
    color: #333;
    margin: 0;
  }
  
  .author-location {
    color: #777;
    margin: 0;
  }
  
  .testimonial-nav {
    display: flex;
    gap: 8px;
  }
  
  .nav-btn {
    border-radius: 9999px;
  }
  </style>
  