<template>
    <div class="row my-3">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <table class="table">
                <thead class="table-success rounded-header">
                    <tr>
                        <th class="text-center" scope="col">#</th>
                        <th class="text-center" scope="col">Imágen</th>
                        <th class="text-center" scope="col">Nombre</th>
                        <th class="text-center" scope="col">Categoría</th>
                        <th class="text-center" scope="col">Cantidad</th>
                        <th class="text-center" scope="col">Precio/ud</th>
                        <th class="text-center" scope="col">Subtotal</th>
                        <th class="text-center" scope="col">Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="articulo in data.getCartItems" :key="articulo._id">
                        <td class="text-center">{{ articulo._id.substring(0, 5) }}</td>
                        <td class="text-center"><img :src="`http://localhost:5000/uploads/img/${articulo._id}.${articulo.extImagen}`" /></td>
                        <td class="text-center">{{ articulo.nombre }}</td>
                        <td class="text-center">{{ articulo.categoria }}</td>
                        <td class="text-center">
                            <button class="btn btn-danger m-2" @click="data.decrementQuantity(articulo)">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                            {{ articulo.quantity }}
                            <button class="btn btn-success m-2" @click="data.incrementQuantity(articulo)">
                                <i class="bi bi-plus"></i>
                            </button>
                        </td>
                        <td class="text-center">{{ articulo.precio }}€</td>
                        <td class="text-center">{{ articulo.precio * articulo.quantity }}€</td>
                        <td class="text-center">
                            <div>
                                <button class="btn btn-danger m-2" @click="data.removeFromCart(articulo)">
                                    <i class="bi bi-trash3"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="text-end mt-3">
                <h4>Total: {{ calcularTotal() }}€</h4>
                <button class="btn btn-success" @click="finalizarPago" :disabled="data.countCartItems === 0">
                    Finalizar Compra
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { obtenerArticulos } from "@/js/articuloServicios";
import { useShoppingStore } from '@/store';
import { loadStripe } from "@stripe/stripe-js";

export default {
    setup() {
        const data = useShoppingStore();
        return { data };
    },

    data() {
        return {
            isLoggedIn: false,
            articulos: [],
            categorias: [
                "Electrónica",
                "Hogar",
                "Ofimática",
                "Deporte",
                "Libros",
                "Otros"
            ],
            categoriaFiltrada: '',
        }
    },

    mounted() {
        this.isLoggedIn = localStorage.getItem('isLogueado') === 'true';
        this.getArticulos();
    },

    methods: {

        async getArticulos() {
            try {
                this.articulos = await obtenerArticulos();
                console.log(this.articulos);
            } catch (error) {
                console.log(error);
            }
        },

        async finalizarPago() {
            console.log("init finalizarPago");
            const stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLIC_KEY);
            console.log("enviando al backend:", JSON.stringify({ items: this.data.getCartItems}));

            const response = await fetch("http://localhost:5000/crear-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: this.data.getCartItems, amount: this.calcularTotal() }),
            });

            const session = await response.json();
            console.log("Session response:", session);
            if (!session.id) {
                console.error("No se recibión sessionId de Stripe.");
            }

            const { error } = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (error) {
                console.error("Error en el pago:", error);
            }
        }
    },
    
    computed: {
        articulosFiltrados() {
            if (this.categoriaFiltrada === "") {
                return this.articulos;
            }
            return this.articulos.filter(articulo => articulo.categoria === this.categoriaFiltrada);
        }
    }
}
</script>
