<template>
    <div class="text-center py-1">
      <div class="container">
        <h1 class="text-success">¡Pago Completado!</h1>
            <p>Gracias por tu compra. Te hemos enviado un correo con los detalles.</p>
        </div>
        
        <div class="container">
            <p>Descargue su factura en formato PDF:</p>
            <button @click="generarFacturaPDF" class="btn btn-success">
                <i class="bi bi-file-earmark-pdf"></i>Descargar Factura
            </button>
        </div>
        <br>
        <router-link to="/tienda" class="btn btn-success">Volver a la tienda</router-link>
    </div>
</template>
  
<script>
import { useShoppingStore } from '@/store';
import jsPDF from 'jspdf';
import logo from '@/assets/logo.png';
import autoTable from 'jspdf-autotable';

export default {
name: "TablaSuccess",

setup() {
    const data = useShoppingStore();
    return { data };
},

data() {
    return {
        cartItems: [],
        usuarioLogueado: null
    }
},

mounted() {
    this.cartItems = this.data.getCartItems;
    this.data.removeCart();
    this.usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    this.guardarFactura();
},

methods: {
        fetch('http://localhost:5000/facturas', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idcliente: this.usuarioLogueado.id,
                productos: productos,
                fecha: fecha,
                total: total,
            }),
        })
        .catch(error => {
            console.error("Error al guardar la factura: " + error);
        });
    },

    calcularTotal() {
            let total = 0
            this.cartItems.forEach(element => {
                total += element.quantity * element.precio;
            });
            return total;
    },
}
};
</script>

<style scoped>
footer {
width: 100%;
}
</style>