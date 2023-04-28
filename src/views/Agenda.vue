<template>
  <div>
    <h1>Calendario de Citas</h1>
    <CitasComponent />
  </div>
</template>

<script>
import CitasComponent from "@/components/Citas.vue";

export default {
  name: 'Agenda_view',

  components: {
    CitasComponent,
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 1rem;
}
</style>
