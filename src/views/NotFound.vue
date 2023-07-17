<template>
    <v-main>
        <v-container class="fill-height" fluid>
            <v-row align="center" justify="center" class="d-flex flex-column">
                <v-col cols="12" sm="8" md="6">
                    <div class="text-center">
                        <v-img
                            class="mx-auto"
                            max-width="400"
                            src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
                        ></v-img>
                        <h1 class="text-h2 font-weight-bold mb-3">
                            Oh no! Parece que te has perdido...
                        </h1>
                        <p class="mb-5 text-h5">
                            La página que estás buscando no existe o ha ocurrido un error inesperado.
                        </p>
                        <v-btn color="primary" dark large router-link to="/">
                            Regresar al inicio
                        </v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>


<script>
export default {
    name: 'NotFound',
};
</script>

<style scoped>
.v-main {
    background: #f5f5f5;
}
</style>
