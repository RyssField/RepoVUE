<template>

    <br>

    <div class="text-center my-2">
        <h5 class="text-center font-weight-bold text-success">
            <i class="bi bi-tools"></i>
            PANEL DE GESTIÓN
            <span class="underline-effect"></span>
        </h5>
    </div>

    <br>

    <div class="container-fluid border p-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <router-link to="/usuarios" class="btn btn-success w-25 me-2 my-2">GESTIÓN USUARIOS</router-link>
            <router-link to="/empleo" class="btn btn-success w-25 my-2">GESTIÓN EMPLEADOS</router-link> <br>
            <router-link to="/comentarios" class="btn btn-success w-25 me-2 my-2">COMENTARIOS</router-link>
            <router-link to="/articulos" class="btn btn-success w-25 my-2">GESTIÓN ARTÍCULOS</router-link> <br>
            <router-link to="/" class="btn btn-secondary w-25 me-2 my-2">En construcción</router-link>
            <router-link to="/" class="btn btn-secondary w-25 my-2">En construcción</router-link> <br>
        </div>
    </div>
</template>

<script>
export default {
    name: "PanelGestion",
}
</script>

<style scoped>
</style>
