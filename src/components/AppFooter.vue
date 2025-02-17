<template>
    <footer class="bg-success text-white text-center py-1">
      <div class="container">
        <p>© 2024 Mi Empresa. Todos los derechos reservados.
          <router-link to="/avisos-legales" class="nav-link d-inline text-white">Aviso Legal</router-link> |
          <router-link to="/privacidad" class="nav-link d-inline text-white">Política de Privacidad</router-link>
        </p>
      </div>
    </footer>
</template>
  
<script>
export default {
name: "AppFooter"
};
</script>

<style scoped>
footer {
width: 100%;
}
</style>