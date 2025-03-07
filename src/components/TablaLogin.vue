<template>
    <div>
      <div class="text-center my-4">
        <h5 class="font-weight-bold text-uppercase text-success position-relative d-inline-block">
          <i class="bi bi-people-fill me-2"></i> <!-- Icono decorativo -->
          Iniciar sesión
          <span class="underline-effect"></span> <!-- Línea decorativa -->
          <router-link to="/" class="btn btn-customb"> <i class="bi bi-arrow-return-left me-2"></i></router-link>
        </h5>
      </div>
      <div class="container-fluid border p-4">
          <div class="col-10 col-m-6 col-lg-4 mx-auto">
              <form @submit.prevent="iniciarSesion" class="d-inline">
                <!-- Campo DNI -->
                <div class="input-group-text mb-3">
                  <label for="dni" class="me-2">DNI: </label>
                  <input
                    type="text"
                    id="dni"
                    class="form-control"
                    v-model="dni"
                    required
                  />
                </div>
          
                <!-- Campo Contraseña -->
                <div class="input-group-text mb-3">
                  <label for="pass" class="me-2">Contraseña: </label>
                  <input
                    type="password"
                    id="pass"
                    class="form-control"
                    v-model="pass"
                    required
                  />
                </div>
          
                <!-- Botón de login -->
                <button type="submit" class="btn btn-success">Iniciar sesión</button>
              </form>
          </div>
      </div>

      <br>

      <div class="col-10 col-m-6 col-lg-8 mx-auto">
        <table class="table">
            <thead class="table-success rounded-header">
                <tr>
                  <th class="text-center" scope="col">Rol</th>
                  <th class="text-center" scope="col">DNI</th>
                  <th class="text-center" scope="col">Contraseña</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-center">Admin</td>
                    <td class="text-center">51708605M</td>
                    <td class="text-center">1234</td>
                </tr>
                <tr>
                    <td class="text-center">Usuario</td>
                    <td class="text-center">49996717F</td>
                    <td class="text-center">1234</td>
                </tr>
            </tbody>
        </table>
      </div>
  
      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </div>
  </template>
  
  <script>
  //import Swal from 'sweetalert2';
  import passport from  '../config/passport.mjs';
  
  export default {
    name: "TablaLogin",
    components: {
      
    },
    data() {
      return {
        dni: "",
        pass: "",
        errorMessage: "",
        usuarios: [] // Aquí se almacenarán los usuarios cargados desde el archivo JSON
      };
    },

    created() {
      // Cargar los usuarios desde el archivo datos.json al crear el componente
      this.getUsuarios();
    },

    methods: {

        async getUsuarios() {
            try {
                const response = await fetch('http://localhost:3000/usuarios');
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }

                // Obtener y ordenar usuarios por apellidos y luego por nombre
                this.usuarios = (await response.json()).sort((a, b) =>
                    a.apellidos.localeCompare(b.apellidos) || a.nombre.localeCompare(b.nombre)
                );

                } catch (error) {
                    console.error(error);
                }
            },
  </script>
  
  <style scoped>
  .container {
    max-width: 400px;
    margin-top: 50px;
  }
  </style>
  