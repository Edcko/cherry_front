<template>
    <div>
        <h2>Editar empleado</h2>
        <form @submit.prevent="saveEmployee">
            <label for="name">Name:</label>
            <input type="text" id="name" v-model="employee.name" required>
            <label for="age">Age:</label>
            <input type="number" id="age" v-model="employee.age" required>
            <label for="position">Position:</label>
            <input type="text" id="position" v-model="employee.position" required>
            <button type="submit">Save</button>
        </form>
    </div>
</template>

<script>
export default {
   
}
</script>

<style scoped>
/* Add custom styles here */
</style>
