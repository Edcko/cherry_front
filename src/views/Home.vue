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
              :to="{ name: 'Services' }"
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
</template>

<script>

export default {
  name:'Home_view',

  data() {
    return {
      items: [
        { src: require("../assets/img/slider1.jpg"), alt: "image 1" },
        { src: require("../assets/img/slider2.jpg"), alt: "image 2" },
        { src: require("../assets/img/slider3.jpg"), alt: "image 3" },
      ],
      services: [
        {
          title: "Aparatología",
          description:
            "Con nuestros tratamientos de aparatología podrás eliminar la grasa localizada y reducir la celulitis.",
          image: require("../assets/img/service1.jpg"),
        },
        {
          title: "Facial",
          description:
            "Contamos con tratamientos faciales para todo tipo de piel, desde hidratación hasta anti-envejecimiento.",
          image: require("../assets/img/service2.jpg"),
        },
        {
          title: "Masajes",
          description:
            "Relájate y deja que nuestros expertos te brinden un masaje relajante o terapéutico.",
image: require("../assets/img/service3.jpg"),
},
],
testimonials: [
{
text: "Excelente servicio, me encantó el masaje relajante. Definitivamente volveré.",
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
],
};
},
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