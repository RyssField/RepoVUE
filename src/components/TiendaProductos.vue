<template>
    <div class="row my-3">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <input type="radio" class="btn-check me-2" name="options" id="option1" value="" v-model="categoriaFiltrada" autocomplete="off" checked>
            <label class="btn btn-success me-2" for="option1">Todos</label>

            <template v-for="categoria in categorias" :key="categoria">
                <input type="radio" class="btn-check" name="options" :id="'option-' + categoria" v-model="categoriaFiltrada" :value="categoria" autocomplete="off">
                <label class="btn btn-success me-2" :for="'option-' + categoria">{{ categoria }}</label>
            </template>

            <table class="table">
                <tbody>
                    <tr v-for="articulo in articulosFiltrados" :key="articulo._id">
                        <td class="text-center">{{ articulo._id.substring(0, 5) }}</td>
                        <td class="text-center"><img :src="`http://localhost:5000/uploads/img/${articulo._id}.${articulo.extImagen}`" /></td>
                        <td class="text-center">{{ articulo.nombre }}</td>
                        <td class="text-center">{{ articulo.categoria }}</td>
                        <td class="text-center">{{ articulo.descripcion }}</td>
                        <td class="text-center">{{ articulo.precio }}€</td>
                        <td class="text-center">{{ articulo.stock }} en stock</td>
                        <td class="text-center">
                            <div>
                                <button class="btn btn-success m-2" @click="data.addToCart(articulo)" :disabled="!isLoggedIn">
                                    Añadir al carrito
                                    <i class="bi bi-cart-fill"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { obtenerArticulos } from "@/js/articuloServicios";
import { useShoppingStore } from '@/store';

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
