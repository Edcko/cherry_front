<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-overlay"></div>
        <div class="floating-elements">
          <div class="floating-circle circle-1"></div>
          <div class="floating-circle circle-2"></div>
          <div class="floating-circle circle-3"></div>
        </div>
      </div>
      
      <v-container class="hero-content">
        <v-row align="center" class="fill-height">
          <v-col cols="12" md="6" class="hero-text">
            <h1 class="hero-title">
              Bienvenido a
              <span class="highlight">Tanya De Icaza</span>
              Wellness Center
            </h1>
            <p class="hero-subtitle">
              Descubre el equilibrio perfecto entre belleza y bienestar. 
              Nuestros tratamientos especializados te ayudarán a alcanzar 
              tu mejor versión.
            </p>
            <div class="hero-buttons">
              <v-btn
                x-large
                color="primary"
                class="cta-button"
                elevation="8"
                @click="scrollToServices"
              >
                <v-icon left>mdi-spa</v-icon>
                Nuestros Servicios
              </v-btn>
              <v-btn
                x-large
                outlined
                color="white"
                class="secondary-button"
                @click="scrollToTestimonials"
              >
                <v-icon left>mdi-star</v-icon>
                Ver Testimonios
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="hero-carousel">
            <v-carousel 
              cycle 
              height="400" 
              hide-delimiter-background
              show-arrows="hover"
              class="hero-carousel-component"
            >
              <v-carousel-item 
                v-for="(item, index) in heroItems" 
                :key="index"
                class="carousel-item"
              >
                <div class="carousel-content">
                  <v-img 
                    :src="item.src" 
                    :alt="item.alt"
                    class="carousel-image"
                  ></v-img>
                  <div class="carousel-overlay">
                    <h3 class="carousel-title">{{ item.title }}</h3>
                    <p class="carousel-description">{{ item.description }}</p>
                  </div>
                </div>
              </v-carousel-item>
            </v-carousel>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Services Section -->
    <section id="services" class="services-section">
      <v-container>
        <div class="section-header">
          <h2 class="section-title">Nuestros Servicios</h2>
          <p class="section-subtitle">
            Descubre nuestra amplia gama de tratamientos especializados 
            para tu bienestar y belleza
          </p>
        </div>
        
        <v-row>
          <v-col 
            cols="12" 
            md="4" 
            v-for="(service, index) in services" 
            :key="index"
            class="service-col"
          >
            <div class="service-card" :class="`service-${index + 1}`">
              <div class="service-image-container">
                <v-img 
                  :src="service.image" 
                  class="service-image"
                  :alt="service.title"
                ></v-img>
                <div class="service-overlay">
                  <v-icon size="48" color="white">mdi-spa</v-icon>
                </div>
              </div>
              
              <div class="service-content">
                <div class="service-icon">
                  <v-icon :color="service.color" size="32">{{ service.icon }}</v-icon>
                </div>
                <h3 class="service-title">{{ service.title }}</h3>
                <p class="service-description">{{ service.description }}</p>
                
                <div class="service-features">
                  <div 
                    v-for="(feature, fIndex) in service.features" 
                    :key="fIndex"
                    class="feature-item"
                  >
                    <v-icon size="16" color="success">mdi-check-circle</v-icon>
                    <span>{{ feature }}</span>
                  </div>
                </div>
                
                <v-btn
                  color="primary"
                  class="service-button"
                  elevation="4"
                  @click="goToService(service)"
                >
                  <v-icon left>mdi-arrow-right</v-icon>
                  Más Información
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section">
      <v-container>
        <v-row>
          <v-col 
            cols="12" 
            sm="6" 
            md="3" 
            v-for="(stat, index) in statistics" 
            :key="index"
            class="stat-col"
          >
            <div class="stat-card">
              <div class="stat-icon">
                <v-icon :color="stat.color" size="48">{{ stat.icon }}</v-icon>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ stat.number }}</h3>
                <p class="stat-label">{{ stat.label }}</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="testimonials-section">
      <v-container>
        <div class="section-header">
          <h2 class="section-title">Lo que dicen nuestros clientes</h2>
          <p class="section-subtitle">
            Experiencias reales de clientes satisfechos con nuestros servicios
          </p>
        </div>
        
        <v-row>
          <v-col 
            cols="12" 
            md="4" 
            v-for="(testimonial, index) in testimonials" 
            :key="index"
            class="testimonial-col"
          >
            <div class="testimonial-card" :class="`testimonial-${index + 1}`">
              <div class="testimonial-header">
                <div class="testimonial-avatar">
                  <v-avatar size="60" color="primary">
                    <v-icon size="32" color="white">mdi-account</v-icon>
                  </v-avatar>
                </div>
                <div class="testimonial-rating">
                  <v-icon 
                    v-for="star in 5" 
                    :key="star"
                    size="20" 
                    color="amber"
                  >
                    mdi-star
                  </v-icon>
                </div>
              </div>
              
              <div class="testimonial-content">
                <p class="testimonial-text">"{{ testimonial.text }}"</p>
              </div>
              
              <div class="testimonial-footer">
                <h4 class="testimonial-author">{{ testimonial.author }}</h4>
                <p class="testimonial-service">{{ testimonial.service }}</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <v-container>
        <div class="cta-content">
          <h2 class="cta-title">¿Listo para tu transformación?</h2>
          <p class="cta-subtitle">
            Agenda tu cita hoy y descubre el poder de nuestros tratamientos especializados
          </p>
          <div class="cta-buttons">
            <v-btn
              x-large
              color="primary"
              class="cta-primary-button"
              elevation="8"
              @click="goToContact"
            >
              <v-icon left>mdi-calendar</v-icon>
              Agendar Cita
            </v-btn>
            <v-btn
              x-large
              outlined
              color="white"
              class="cta-secondary-button"
              @click="goToServices"
            >
              <v-icon left>mdi-information</v-icon>
              Más Información
            </v-btn>
          </div>
        </div>
      </v-container>
    </section>

    <!-- Footer -->
    <v-footer class="footer-section">
      <v-container>
        <v-row>
          <v-col cols="12" md="4" class="footer-col">
            <div class="footer-brand">
              <h3 class="footer-title">Tanya De Icaza</h3>
              <p class="footer-subtitle">Wellness Center</p>
              <p class="footer-description">
                Tu centro de bienestar y belleza donde encontrarás 
                los mejores tratamientos para cuidar tu cuerpo y mente.
              </p>
            </div>
          </v-col>

          <v-col cols="12" md="4" class="footer-col">
            <h4 class="footer-section-title">Contáctanos</h4>
            <div class="contact-info">
              <div class="contact-item">
                <v-icon color="primary" class="mr-3">mdi-map-marker</v-icon>
                <span>Dirección del centro</span>
              </div>
              <div class="contact-item">
                <v-icon color="primary" class="mr-3">mdi-phone</v-icon>
                <span>+1 234 567 8910</span>
              </div>
              <div class="contact-item">
                <v-icon color="primary" class="mr-3">mdi-email</v-icon>
                <span>info@tanyadeicaza.com</span>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="4" class="footer-col">
            <h4 class="footer-section-title">Síguenos</h4>
            <div class="social-links">
              <v-btn icon color="primary" class="social-button">
                <v-icon>mdi-facebook</v-icon>
              </v-btn>
              <v-btn icon color="primary" class="social-button">
                <v-icon>mdi-instagram</v-icon>
              </v-btn>
              <v-btn icon color="primary" class="social-button">
                <v-icon>mdi-twitter</v-icon>
              </v-btn>
              <v-btn icon color="primary" class="social-button">
                <v-icon>mdi-linkedin</v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
        
        <v-divider class="footer-divider"></v-divider>
        
        <div class="footer-bottom">
          <p class="footer-copyright">
            &copy; {{ new Date().getFullYear() }} Tanya De Icaza Wellness Center. 
            Hecho con ♥ por <a href="http://gpocherry.com" target="_blank">Gpo Cherry</a>
          </p>
        </div>
      </v-container>
    </v-footer>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Home_view',

  setup() {
    const heroItems = ref([
      { 
        src: require("../assets/img/slider1.png"), 
        alt: "Tratamiento facial",
        title: "Tratamientos Faciales",
        description: "Rejuvenece tu piel con nuestros tratamientos especializados"
      },
      { 
        src: require("../assets/img/slider2.png"), 
        alt: "Masajes relajantes",
        title: "Masajes Terapéuticos",
        description: "Relájate y renueva tu energía con nuestros masajes"
      },
      { 
        src: require("../assets/img/slider3.png"), 
        alt: "Aparatología",
        title: "Aparatología Avanzada",
        description: "Tecnología de vanguardia para tu bienestar"
      },
    ]);

    const services = ref([
      {
        title: "Aparatología",
        description: "Utilizamos tecnología de vanguardia para eliminar grasa localizada, reducir celulitis y tonificar tu cuerpo de manera efectiva y segura.",
        image: require("../assets/img/service1.png"),
        icon: "mdi-flash",
        color: "success",
        features: [
          "Eliminación de grasa localizada",
          "Reducción de celulitis",
          "Tonificación muscular",
          "Resultados visibles"
        ]
      },
      {
        title: "Facial",
        description: "Tratamientos faciales personalizados para todo tipo de piel, desde hidratación profunda hasta anti-envejecimiento con productos de alta calidad.",
        image: require("../assets/img/service2.png"),
        icon: "mdi-face",
        color: "info",
        features: [
          "Hidratación profunda",
          "Anti-envejecimiento",
          "Limpieza profunda",
          "Productos premium"
        ]
      },
      {
        title: "Masajes",
        description: "Relájate completamente con nuestros masajes relajantes y terapéuticos, diseñados para aliviar tensiones y promover el bienestar integral.",
        image: require("../assets/img/service3.png"),
        icon: "mdi-hand-back-right",
        color: "warning",
        features: [
          "Masajes relajantes",
          "Terapia manual",
          "Alivio de tensiones",
          "Bienestar integral"
        ]
      },
    ]);

    const statistics = ref([
      {
        number: "500+",
        label: "Clientes Satisfechos",
        icon: "mdi-account-group",
        color: "primary"
      },
      {
        number: "50+",
        label: "Tratamientos Especializados",
        icon: "mdi-spa",
        color: "success"
      },
      {
        number: "5",
        label: "Años de Experiencia",
        icon: "mdi-calendar-star",
        color: "info"
      },
      {
        number: "98%",
        label: "Satisfacción Garantizada",
        icon: "mdi-star",
        color: "warning"
      }
    ]);

    const testimonials = ref([
      {
        text: "Excelente servicio, me encantó el masaje relajante y también la aparatología. Definitivamente volveré.",
        author: "María Pérez",
        service: "Cliente Regular"
      },
      {
        text: "Increíble experiencia, el tratamiento facial me dejó la piel suave y radiante. Lo recomiendo totalmente.",
        author: "Juan González",
        service: "Tratamiento Facial"
      },
      {
        text: "Me gustó mucho la atención recibida, los masajes terapéuticos me ayudaron a aliviar el dolor de espalda. Volveré pronto.",
        author: "Lucía Rodríguez",
        service: "Masaje Terapéutico"
      },
    ]);

    const scrollToServices = () => {
      document.getElementById('services').scrollIntoView({ 
        behavior: 'smooth' 
      });
    };

    const scrollToTestimonials = () => {
      document.getElementById('testimonials').scrollIntoView({ 
        behavior: 'smooth' 
      });
    };

    const goToService = (service) => {
      // Navegar al servicio específico
      console.log('Ir a servicio:', service.title);
    };

    const goToContact = () => {
      // Navegar a contacto
      console.log('Ir a contacto');
    };

    const goToServices = () => {
      // Navegar a servicios
      console.log('Ir a servicios');
    };

    return {
      heroItems,
      services,
      statistics,
      testimonials,
      scrollToServices,
      scrollToTestimonials,
      goToService,
      goToContact,
      goToServices
    };
  }
};
</script>

<style scoped>
/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('../assets/img/slider1.png') center/cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.floating-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.circle-3 {
  width: 80px;
  height: 80px;
  top: 40%;
  right: 10%;
  animation-delay: 4s;
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100vh;
}

.hero-text {
  color: white;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.highlight {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-button {
  font-weight: 600;
  text-transform: none;
  padding: 0 2rem;
}

.secondary-button {
  font-weight: 600;
  text-transform: none;
  padding: 0 2rem;
}

.hero-carousel {
  display: flex;
  align-items: center;
}

.hero-carousel-component {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.carousel-item {
  position: relative;
}

.carousel-content {
  position: relative;
  height: 100%;
}

.carousel-image {
  height: 100%;
  object-fit: cover;
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: white;
  padding: 2rem;
}

.carousel-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.carousel-description {
  font-size: 1rem;
  opacity: 0.9;
}

/* Services Section */
.services-section {
  padding: 100px 0;
  background: #f8f9fa;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto;
}

.service-col {
  margin-bottom: 2rem;
}

.service-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  height: 100%;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.service-image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.service-image {
  height: 100%;
  transition: transform 0.4s ease;
}

.service-card:hover .service-image {
  transform: scale(1.1);
}

.service-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.service-card:hover .service-overlay {
  opacity: 1;
}

.service-content {
  padding: 2rem;
}

.service-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.service-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.service-description {
  color: #6c757d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.service-features {
  margin-bottom: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: #6c757d;
  font-size: 0.9rem;
}

.service-button {
  width: 100%;
  font-weight: 600;
  text-transform: none;
}

/* Statistics Section */
.stats-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-col {
  margin-bottom: 2rem;
}

.stat-card {
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 15px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  background: rgba(255,255,255,0.15);
}

.stat-icon {
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.9;
}

/* Testimonials Section */
.testimonials-section {
  padding: 100px 0;
  background: white;
}

.testimonial-col {
  margin-bottom: 2rem;
}

.testimonial-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  height: 100%;
  border: 1px solid rgba(0,0,0,0.05);
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}

.testimonial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.testimonial-rating {
  display: flex;
  gap: 0.25rem;
}

.testimonial-content {
  margin-bottom: 1.5rem;
}

.testimonial-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #6c757d;
  font-style: italic;
}

.testimonial-footer {
  border-top: 1px solid rgba(0,0,0,0.1);
  padding-top: 1rem;
}

.testimonial-author {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.testimonial-service {
  font-size: 0.9rem;
  color: #6c757d;
}

/* CTA Section */
.cta-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-primary-button {
  font-weight: 600;
  text-transform: none;
  padding: 0 2rem;
}

.cta-secondary-button {
  font-weight: 600;
  text-transform: none;
  padding: 0 2rem;
}

/* Footer */
.footer-section {
  background: #2c3e50;
  color: white;
  padding: 60px 0 20px;
}

.footer-col {
  margin-bottom: 2rem;
}

.footer-brand {
  margin-bottom: 1rem;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #667eea;
}

.footer-subtitle {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #bdc3c7;
}

.footer-description {
  line-height: 1.6;
  color: #95a5a6;
}

.footer-section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #667eea;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  color: #bdc3c7;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-button {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
}

.social-button:hover {
  background: rgba(255,255,255,0.2);
}

.footer-divider {
  margin: 2rem 0;
  border-color: rgba(255,255,255,0.1);
}

.footer-bottom {
  text-align: center;
}

.footer-copyright {
  color: #95a5a6;
  font-size: 0.9rem;
}

.footer-copyright a {
  color: #667eea;
  text-decoration: none;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Responsive Design */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-buttons {
    flex-direction: column;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  .hero-section {
    min-height: 80vh;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .service-content {
    padding: 1.5rem;
  }
  
  .testimonial-card {
    padding: 1.5rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
}
</style>