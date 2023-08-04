<template>
  <v-container>
    <v-row class="mb-10">
      <v-col cols="12">
        <v-carousel cycle height="400">
          <v-carousel-item v-for="(item, index) in items" :key="index">
            <v-img :src="item.src" :alt="item.alt"></v-img>
          </v-carousel-item>
        </v-carousel>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center spa-name">Tanya De Icaza Wellness Center</h1>
      </v-col>
    </v-row>
    <v-row class="services-section">
      <v-col cols="12" md="4" v-for="(service, index) in services" :key="index">
        <v-card class="mx-auto service-card" max-width="374">
          <v-img :src="service.image" height="200" class="rounded-lg"></v-img>
          <v-card-title class="text-h5 text-center pt-5 service-title">{{
            service.title
          }}</v-card-title>
          <v-card-text class="text-center service-description">{{
            service.description
          }}</v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              color="primary"
              :to="{ name: 'Paquete' }"
              class="white--text more-info-button"
              >Más información</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="testimonials-section">
      <v-col cols="12">
        <h2 class="text-center">Testimonios de nuestros clientes</h2>
      </v-col>
      <v-col
        cols="12"
        md="4"
        v-for="(testimonial, index) in testimonials"
        :key="index"
      >
        <v-card class="mx-auto testimonial-card" max-width="374">
          <v-card-text>{{ testimonial.text }}</v-card-text>
          <v-card-title class="text-h6 text-right testimonial-author">{{
            testimonial.author
          }}</v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-footer color="white" class="mt-7">
      <v-row justify="center">
        <v-col class="text-center" cols="12">
          <div class="white--text mb-4">Hecho con ♥ por <a class="white--text" href="http://gpocherry.com">TANYA DE ICAZA</a></div>
        </v-col>

        <v-col cols="12" md="4" class="mb-5">
          <h4 class="white--text mb-2">Sobre nosotros</h4>
          <p class="white--text">  información sobre empresa, equipo, misión, etc.</p>
        </v-col>

        <v-col cols="12" md="4" class="mb-5">
          <h4 class="white--text mb-2">Contáctanos</h4>
          <p class="white--text">Dirección empresa<br>Teléfono: +1 234 567 8910<br>Email: info@tuwebsite.com</p>
        </v-col>

        <v-col cols="12" md="4" class="mb-5">
          <h4 class="white--text mb-2">Síguenos</h4>
          <v-btn text icon color="white" href="#"><v-icon>mdi-facebook</v-icon></v-btn>
          <v-btn text icon color="white" href="#"><v-icon>mdi-twitter</v-icon></v-btn>
          <v-btn text icon color="white" href="#"><v-icon>mdi-instagram</v-icon></v-btn>
          <v-btn text icon color="white" href="#"><v-icon>mdi-linkedin</v-icon></v-btn>
        </v-col>

        <v-col class="text-center" cols="12">
          <div class="white--text">&copy;{{ new Date().getFullYear() }} - Gpo Cherry</div>
        </v-col>
      </v-row>
    </v-footer>

</template>

<script>
import { ref } from 'vue';

export default {
  name:'Home_view',

  setup() {
    const items = ref([
      { src: require("../assets/img/slider1.png"), alt: "image 1" },
      { src: require("../assets/img/slider2.png"), alt: "image 2" },
      { src: require("../assets/img/slider3.png"), alt: "image 3" },
    ]);

    const services = ref([
      {
        title: "Aparatología",
        description:
          "Con nuestros tratamientos de aparatología podrás eliminar la grasa localizada y reducir la celulitis.",
        image: require("../assets/img/service1.png"),
      },
      {
        title: "Facial",
        description:
          "Contamos con tratamientos faciales para todo tipo de piel, desde hidratación hasta anti-envejecimiento.",
        image: require("../assets/img/service2.png"),
      },
      {
        title: "Masajes",
        description:
          "Relájate y deja que nuestros expertos te brinden un masaje relajante o terapéutico con el fin de hacerte pasar el mejor rato.",
        image: require("../assets/img/service3.png"),
      },
    ]);

    const testimonials = ref([
      {
        text: "Excelente servicio, me encantó el masaje relajante y trambien la aparatologia. Definitivamente volveré.",
        author: "María Pérez",
      },
      {
        text: "Increíble experiencia, el tratamiento facial me dejó la piel suave y radiante. Lo recomiendo totalmente.",
        author: "Juan González",
      },
      {
        text: "Me gustó mucho la atención recibida, los masajes terapéuticos me ayudaron a aliviar el dolor de espalda. Volveré pronto.",
        author: "Lucía Rodríguez",
      },
    ]);

    return {
      items,
      services,
      testimonials,
    };
  }
};
</script>

<style>
.v-card__actions {
  padding-bottom: 1.5rem;
}

.spa-name {
  font-size: 48px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 48px;
}

.services-section {
  background-color: #f2f2f2;
  padding: 50px 0;
}

.service-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.service-card:hover {
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.service-title {
  font-weight: 600;
}

.service-description {
  color: #666;
}

.testimonials-section {
  background-color: #ffffff;
  padding: 50px 0;
}

.testimonial-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.testimonial-author {
  font-weight: 600;
}

.more-info-button {
  background-color: #fafbfd;
  color: #fff;
  border-radius: 8px;
  padding: 10px 20px;
  text-transform: uppercase;
}

h2 {
  font-size: 36px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 24px;
}
</style>