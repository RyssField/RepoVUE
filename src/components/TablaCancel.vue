<template>
    <div class="text-center py-1">
      <div class="container">
        <h1 class="text-danger">Pago Cancelado</h1>
        <p>El pago ha sido cancelado o se ha producido un error.</p>
        <router-link to="/tienda" class="btn btn-success">Volver a la tienda</router-link>
      </div>
    </div>
</template>
  
<script>
export default {
name: "TablaCancel"
};
</script>

<style scoped>
footer {
width: 100%;
}
</style>