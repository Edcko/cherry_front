<template>
    <v-app>
      <!-- Contenedor principal de la Landing -->
      <div class="landing-page">
        <!-- Video de fondo -->
        <video
          class="video-background"
          autoplay
          muted
          loop
          playsinline
        >
          <source
            src="https://player.vimeo.com/progressive_redirect/playback/404616512/rendition/720p/file.mp4?loc=external&signature=7d0e3a5c7007a9f27c9b7f63b184e5c9c6a34c2d6c3b3d2d6f1c5e2b5c5c5c5c"
            type="video/mp4"
          />
        </video>
        <!-- Overlay para oscurecer el video -->
        <div class="overlay"></div>
  
        <!-- Barra de navegación -->
        <v-app-bar
          flat
          density="comfortable"
          class="navbar"
        >
          <!-- Título / Logo -->
          <v-toolbar-title class="navbar-title">
            ZENSPACE
          </v-toolbar-title>
  
          <v-spacer></v-spacer>
  
          <!-- Menú principal (versión desktop como ejemplo) -->
          <div class="nav-links">
            <a href="#" class="nav-link active">Home</a>
            <a href="#" class="nav-link">Services</a>
            <a href="#" class="nav-link">Therapists</a>
            <a href="#" class="nav-link">Packages</a>
            <a href="#" class="nav-link">About</a>
            <a href="#" class="nav-link">Contact</a>
          </div>
  
          <!-- Acciones (registro, book) -->
          <div class="navbar-actions">
            <v-btn
              text
              class="btn-register"
            >
              Register
            </v-btn>
            <v-btn
              color="teal darken-3"
              dark
              class="btn-book"
            >
              Book Now
            </v-btn>
          </div>
        </v-app-bar>
  
        <!-- HERO SECTION -->
        <v-container fluid class="hero-section">
          <v-row>
            <v-col cols="12" lg="6">
              <div class="hero-text-wrapper">
                <h1 class="hero-title">
                  Experience <span class="teal-text">Pure Relaxation</span> at
                  Your <span class="relative-title">Perfect Sanctuary</span>
                </h1>
                <p class="hero-subtitle">
                  Begin your journey to wellness and tranquility
                </p>
                <v-btn
                  color="teal darken-3"
                  dark
                  class="mt-4"
                >
                  Book Your Session
                </v-btn>
  
                <!-- Tarjetita flotante (buscador) -->
                <div class="floating-card search-card">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="searchTreatments"
                        label="Search treatments, massages..."
                        outlined
                        dense
                      >
                        <template #append-outer>
                          <v-icon>mdi-magnify</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
  
                    <v-col cols="6" md="3">
                      <v-text-field
                        v-model="location"
                        label="Location"
                        outlined
                        dense
                      >
                        <template #append-outer>
                          <v-icon>mdi-map-marker</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
  
                    <v-col cols="6" md="3">
                      <v-text-field
                        v-model="selectedDate"
                        label="Date"
                        outlined
                        dense
                      >
                        <template #append-outer>
                          <v-icon>mdi-calendar</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row>
  
                  <v-btn
                    color="teal darken-3"
                    dark
                    block
                    class="mt-2"
                    @click="findTreatment"
                  >
                    Find Treatment
                  </v-btn>
                </div>
              </div>
            </v-col>
  
            <!-- Imagen o tarjetas flotantes de ejemplo -->
            <v-col cols="12" lg="6" class="relative-col">
              <!-- Card flotante arriba a la izquierda -->
              <div class="floating-card small-card top-left">
                <div class="d-flex align-center">
                  <div class="indicator-circle"></div>
                  <span>Featured Treatment</span>
                </div>
              </div>
  
              <!-- Card flotante abajo a la derecha -->
              <div class="floating-card small-card bottom-right">
                <div class="d-flex align-center justify-space-between">
                  <v-avatar size="48">
                    <img src="/placeholder.svg" alt="Therapist" />
                  </v-avatar>
                  <div>
                    <h3 class="mb-0">Sarah Wilson</h3>
                    <p class="caption m-0">Senior Massage Therapist</p>
                  </div>
                  <v-btn
                    outlined
                    color="teal darken-3"
                    class="ml-4"
                  >
                    Book Now
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
  
        <!-- SERVICES SECTION -->
        <v-container fluid class="section">
          <div class="section-header">
            <h2 class="section-title teal-text">
              Our Services
            </h2>
            <div class="section-controls">
              <v-btn
                icon
                variant="outlined"
              >
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn
                icon
                variant="outlined"
              >
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </div>
  
          <v-row class="mt-4" dense>
            <!-- Ejemplo: repetición de ServiceCard -->
            <v-col
              v-for="(service, i) in services"
              :key="i"
              cols="6"
              sm="4"
              md="2"
              lg="1"
            >
              <ServiceCard
                :icon="service.icon"
                :title="service.title"
                :bgColor="service.bgColor"
              />
            </v-col>
          </v-row>
        </v-container>
  
        <!-- SPECIALTIES SECTION -->
        <v-container fluid class="section">
          <div class="section-header">
            <h2 class="section-title teal-text">
              Specialties <span class="light-teal-text">+</span>
            </h2>
            <div class="section-controls">
              <v-btn icon variant="outlined">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn icon variant="outlined">
                <v-icon>mdi-chevron-right</v-icon>
              </v-btn>
            </div>
          </div>
  
          <v-row class="mt-4" dense>
            <v-col
              v-for="(specialty, i) in specialties"
              :key="i"
              cols="6"
              sm="4"
              md="2"
            >
              <SpecialtyCard
                :icon="specialty.icon"
                :title="specialty.title"
              />
            </v-col>
          </v-row>
  
          <div class="d-flex justify-center mt-6">
            <v-btn variant="outlined" color="teal darken-3">
              See All Specialties
            </v-btn>
          </div>
        </v-container>
  
        <!-- PRICING SECTION -->
        <v-container fluid class="section pricing-section">
          <div class="text-center mb-8">
            <h2 class="section-title teal-text">
              Pricing Plan <span class="light-teal-text">+</span>
            </h2>
          </div>
  
          <v-row dense justify="center">
            <v-col cols="12" md="4">
              <PricingCard
                title="Basic"
                price="$99"
                :features="[
                  'Profile Creation',
                  'Appointment Booking',
                  'Notification Alerts',
                  'Limited Telemedicine Access'
                ]"
                icon-name="mdi-account"
              />
            </v-col>
            <v-col cols="12" md="4">
              <PricingCard
                title="Pro"
                price="$199"
                :features="[
                  'Profile Creation',
                  'Appointment Booking',
                  'Notification Alerts',
                  'Extended Telemedicine Access',
                  'Exclusive Discounts',
                  'Appointment History',
                  'Priority Customer Support'
                ]"
                icon-name="mdi-home"
                :is-popular="true"
              />
            </v-col>
            <v-col cols="12" md="4">
              <PricingCard
                title="Enterprise"
                price="$399"
                :features="[
                  'All Basic Plan Features',
                  'All Premium Plan Features',
                  'Personalized Health Insights',
                  'Family Account Management'
                ]"
                icon-name="mdi-domain"
              />
            </v-col>
          </v-row>
        </v-container>
  
        <!-- TESTIMONIALS SECTION -->
        <v-container fluid class="section">
          <TestimonialSection />
        </v-container>
  
        <!-- FOOTER -->
        <SiteFooter />
  
        <!-- Elementos decorativos flotantes -->
        <div class="floating-deco deco-left"></div>
        <div class="floating-deco deco-right"></div>
      </div>
    </v-app>
  </template>
  
  <script>
  import { ref } from "vue";
  
  // Importamos componentes hijos
  import ServiceCard from "@/components/ServiceCard.vue";
  import SpecialtyCard from "@/components/SpecialtyCard.vue";
  import PricingCard from "@/components/PricingCard.vue";
  import TestimonialSection from "@/components/TestimonialSection.vue";
  import SiteFooter from "@/components/SiteFooter.vue";
  
  export default {
    name: "LandingPage",
    components: {
      ServiceCard,
      SpecialtyCard,
      PricingCard,
      TestimonialSection,
      SiteFooter,
    },
    setup() {
      const searchTreatments = ref("");
      const location = ref("");
      const selectedDate = ref(null);
  
      // Services simulados
      const services = ref([
        { icon: "mdi-calendar", title: "Book Appointment", bgColor: "#BBDEFB" },
        { icon: "mdi-leaf", title: "Massage Services", bgColor: "#C8E6C9" },
        { icon: "mdi-heart", title: "Wellness & Spa", bgColor: "#FFCDD2" },
        { icon: "mdi-home", title: "Home Services", bgColor: "#E1BEE7" },
        { icon: "mdi-account", title: "Expert Therapists", bgColor: "#FFF9C4" },
        { icon: "mdi-package-variant-closed", title: "Special Packages", bgColor: "#F8BBD0" },
        { icon: "mdi-gift", title: "Gift Cards", bgColor: "#FFE0B2" },
      ]);
  
      // Specialties simulados
      const specialties = ref([
        { icon: "mdi-heart", title: "Swedish Massage" },
        { icon: "mdi-run", title: "Deep Tissue" },
        { icon: "mdi-water", title: "Hot Stone" },
        { icon: "mdi-feather", title: "Aromatherapy" },
        { icon: "mdi-baby-face", title: "Prenatal" },
        { icon: "mdi-account-group", title: "Couples" },
      ]);
  
      const findTreatment = () => {
        console.log("Buscando tratamiento:", searchTreatments.value, location.value, selectedDate.value);
        // Lógica de búsqueda...
      };
  
      return {
        searchTreatments,
        location,
        selectedDate,
        services,
        specialties,
        findTreatment,
      };
    },
  };
  </script>
  
  <style scoped>
  /* --------------------------------
     1) Estilos base (fondo, layout)
  ---------------------------------- */
  .landing-page {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background-color: #e0f2f1; /* Aproximación al teal-50 */
  }
  
  .video-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    object-fit: cover;
    opacity: 0.2;
    z-index: -1;
  }
  
  .overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 150, 136, 0.6); /* teal base, ajusta la opacidad */
    mix-blend-mode: multiply;
    z-index: -1;
  }
  
  /* --------------------------------
     2) Navbar
  ---------------------------------- */
  .navbar {
    background-color: transparent;
    box-shadow: none;
  }
  
  .navbar-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #004d40; /* teal dark */
  }
  
  .nav-links {
    display: flex;
    gap: 1rem;
  }
  
  .nav-link {
    text-decoration: none;
    color: white;
    transition: color 0.3s;
  }
  
  .nav-link.active {
    color: #004d40;
    font-weight: 500;
  }
  
  .nav-link:hover {
    color: #004d40;
  }
  
  .navbar-actions {
    display: flex;
    gap: 1rem;
  }
  
  /* --------------------------------
     3) Hero Section
  ---------------------------------- */
  .hero-section {
    padding-top: 80px; /* separa el contenido de la nav */
    padding-bottom: 40px;
  }
  
  .hero-text-wrapper {
    max-width: 600px;
  }
  
  .hero-title {
    font-size: 3rem;
    font-weight: bold;
    line-height: 1.2;
    color: #333;
  }
  
  .teal-text {
    color: #00796b; /* teal darken-2 aprox */
  }
  
  .relative-title {
    position: relative;
  }
  
  /* Subtítulo */
  .hero-subtitle {
    font-size: 1.25rem;
    color: #666;
  }
  
  /* --------------------------------
     4) Floating Cards
  ---------------------------------- */
  .floating-card {
    position: relative;
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    animation: float 6s ease-in-out infinite;
    margin-top: 24px;
  }
  
  /* Búsqueda (hero) */
  .search-card {
    margin-top: 32px;
  }
  
  /* Pequeñas tarjetitas flotantes en la columna derecha */
  .small-card {
    width: 200px;
    animation-delay: 2s; /* Para que floten en distinto ritmo, si quieres */
  }
  
  /* top-left y bottom-right las ubicamos manualmente */
  .top-left {
    position: absolute;
    top: 40px;
    left: 40px;
  }
  
  .bottom-right {
    position: absolute;
    bottom: 40px;
    right: 40px;
  }
  
  .indicator-circle {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #26a69a;
    margin-right: 8px;
  }
  
  /* Animación "float" */
  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  /* --------------------------------
     5) Secciones Generales
  ---------------------------------- */
  .section {
    padding: 60px 0;
  }
  
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .section-title {
    font-size: 2rem;
    font-weight: 700;
  }
  
  .teal-text {
    color: #00796b;
  }
  
  .light-teal-text {
    color: #80cbc4;
  }
  
  .section-controls {
    display: flex;
    gap: 8px;
  }
  
  /* Pricing (opcional) */
  .pricing-section {
    background-color: #fafafa;
    border-radius: 8px;
    padding: 40px;
  }
  
  /* --------------------------------
     6) Elementos decorativos
  ---------------------------------- */
  .floating-deco {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    opacity: 0.3;
  }
  
  .deco-left {
    top: 30%;
    left: 10px;
    width: 80px;
    height: 80px;
    background-color: #80cbc4;
  }
  
  .deco-right {
    bottom: 25%;
    right: 10px;
    width: 120px;
    height: 120px;
    background-color: #4db6ac;
  }
  </style>
  