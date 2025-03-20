<template>
  <footer class="site-footer">
    <v-container fluid class="footer-container">
      <v-row>
        <v-col cols="12" md="3" class="mb-6">
          <h3 class="footer-title">ZENSPACE</h3>
          <p class="footer-text">
            Your journey to wellness and tranquility begins here.
          </p>
          <div class="social-icons">
            <v-btn icon variant="text" class="social-btn">
              <v-icon>mdi-facebook</v-icon>
            </v-btn>
            <v-btn icon variant="text" class="social-btn">
              <v-icon>mdi-twitter</v-icon>
            </v-btn>
            <v-btn icon variant="text" class="social-btn">
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
            <v-btn icon variant="text" class="social-btn">
              <v-icon>mdi-youtube</v-icon>
            </v-btn>
          </div>
        </v-col>

        <v-col cols="6" md="3" class="mb-6">
          <h4 class="footer-subtitle">Quick Links</h4>
          <ul class="footer-list">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Booking</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </v-col>

        <v-col cols="6" md="3" class="mb-6">
          <h4 class="footer-subtitle">Services</h4>
          <ul class="footer-list">
            <li><a href="#">Swedish Massage</a></li>
            <li><a href="#">Deep Tissue</a></li>
            <li><a href="#">Hot Stone</a></li>
            <li><a href="#">Aromatherapy</a></li>
            <li><a href="#">Couples Massage</a></li>
          </ul>
        </v-col>

        <v-col cols="12" md="3" class="mb-6">
          <h4 class="footer-subtitle">Contact Info</h4>
          <ul class="footer-list">
            <li>123 Wellness Street</li>
            <li>Relaxation City, RC 12345</li>
            <li>Phone: (555) 123-4567</li>
            <li>Email: info@zenspace.com</li>
          </ul>
        </v-col>
      </v-row>

      <v-divider></v-divider>

      <div class="text-center footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} ZenSpace. All rights reserved.</p>
      </div>
    </v-container>
  </footer>
</template>

<script>
export default {
  name: "SiteFooter",
};
</script>

<style scoped>
.site-footer {
  background-color: #004d40; /* teal dark */
  color: #fff;
  padding-top: 40px;
  padding-bottom: 20px;
  font-size: 0.9rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 12px;
}

.footer-text {
  color: #a7ffeb;
}

.social-icons {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.social-btn {
  color: white;
}

.footer-subtitle {
  font-weight: 600;
  margin-bottom: 12px;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-list li {
  margin-bottom: 6px;
}

.footer-list a {
  color: #b2dfdb;
  text-decoration: none;
}

.footer-list a:hover {
  color: #fff;
}

.footer-bottom {
  margin-top: 20px;
  color: #b2dfdb;
  font-size: 0.8rem;
}
</style>
