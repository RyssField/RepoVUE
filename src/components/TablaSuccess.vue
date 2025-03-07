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
    guardarFactura() {
        const productos = [];
        let total = 0;

        this.cartItems.forEach(producto => {
            productos.push({
                idProducto: producto._id,
                precio: producto.precio,
                cantidad: producto.quantity,
                subtotal: producto.precio * producto.quantity,
            });
            total += producto.precio * producto.quantity;
        });

        let partesFecha = this.obtenerFechaHoy().split('/');
        let fecha = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}`;

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

    generarFacturaPDF() {
        if (this.cartItems.length === 0) {
            console.error("No hay productos en el carrito, no se puede generar la factura.");
            return;
        }

        const doc = new jsPDF();
        const cart = this.cartItems;

        doc.addImage(logo, 'png', 10, 10, 20, 20);

        doc.setFontSize(18);
        doc.text("Factura de Compra", 60, 20);

        doc.setFontSize(9);
        doc.text("Razón Social: Regalos Teis", 110, 50);
        doc.text("Dirección: Avenida Galicia 101, Vigo - 36216", 110, 55);
        doc.text("Tlfo: 986 666 333 - Email: regalos@example.com", 110, 60);
        doc.text("Fecha: " + this.obtenerFechaHoy(), 110, 65);

        const headers = [["ID", "Producto", "Cantidad", "Precio Unitario", "Total"]];
        const data = cart.map((item) => [
            item._id,
            item.nombre,
            item.quantity ,
            `${item.precio.toFixed(2)} €`,
            `${(item.quantity * item.precio).toFixed(2)} €`,
        ]);

        autoTable(doc, {
            startY: 80,
            head: headers,
            body: data,
            columnStyles: {
                0: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'right' },
                4: { halign: 'right' },
            },
            theme: 'striped',
        });

        const totalText = `Total: ${this.calcularTotal()} €`;

        const pageWidth = doc.internal.pageSize.width;

        const totalWidth = doc.getTextWidth(totalText);

        const positionX = pageWidth - totalWidth - 14;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);

        doc.text(totalText, positionX - 9, doc.lastAutoTable.finalY + 10);

        doc.save("factura.pdf");
    },

    obtenerFechaHoy() {
        const fecha = new Date();
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
        //return fecha.toLocaleDateString('es-ES');  // Formato dd/mm/yyyy
        return fechaFormateada;
    },
}
};
</script>

<style scoped>
footer {
width: 100%;
}
</style>