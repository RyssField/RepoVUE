<template>
    <div id="navbar" class="container">
        <nav class="navbar navbar-expand-lg navbar-dark bg-success">
            <div class="container-fluid">
                <button class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <router-link to="/" class="nav-link text-white" exact-active-class="active">Inicio</router-link>
                        </li>
                        <li class="nav-item" v-if="isAdmin">
                            <router-link to="/gestion" class="nav-link text-white" exact-active-class="active">Gestión</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/tienda" class="nav-link text-white" exact-active-class="active">Tienda</router-link>
                        </li>
                        <li class="nav-item" v-if="isAdmin">
                            <router-link to="/usuarios" class="nav-link text-white" exact-active-class="active">Usuarios</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/empleo" class="nav-link text-white" exact-active-class="active">Empleo</router-link>
                        </li>
                        <li class="nav-item" v-if="isAdmin">
                            <router-link to="/articulos" class="nav-link text-white" exact-active-class="active">Artículos</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/comentarios" class="nav-link text-white" exact-active-class="active">Comentarios</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/contacto" class="nav-link text-white" exact-active-class="active">Contacto</router-link>
                        </li>
                    </ul>
                    <form class="d-flex" role="search">
                        <input class="form-control me-2" type="search" placeholder="Buscar" aria-label="Search">
                        <button class="btn btn-outline-success bg-light" type="submit"><i class="bi bi-search"></i></button>
                    </form>
                    <router-link class="nav-link text-white mx-2" to="/carrito" v-if="usuarioLogueado">
                        <i class="bi bi-cart-fill"></i> {{ data.countCartItems }}
                    </router-link>
                    <div class="dropdown">
                        <button class="btn btn-success dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-person-circle"></i>
                            <p v-if="usuarioLogueado" class="mb-0 ms-2">{{ usuarioLogueado.nombre }} {{ usuarioLogueado.apellidos }}</p>
                        </button>
                        <ul class="dropdown-menu">
                            <li><router-link class="dropdown-item" to="/login" v-if="!isLoggedIn">Acceso</router-link></li>
                            <li><router-link class="dropdown-item" to="/registro" v-if="!isLoggedIn">Registro</router-link></li>
                            <li><router-link class="dropdown-item" to="#" @click="logout" v-if="isLoggedIn">Cerrar sesión</router-link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import { useShoppingStore } from '@/store';

export default {
    name: "NavBar",
    setup() {
        const data = useShoppingStore();
        return { data };
    },

    data() {
        return {
            isLoggedIn: false,
            isAdmin: false,
            usuarioLogueado: null,
        };
    },

    mounted() {
        this.isLoggedIn = localStorage.getItem('isLogueado') === 'true';
        this.isAdmin = localStorage.getItem('isAdmin') === 'true';
        this.usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    },
    
    methods: {
        logout() {
            localStorage.removeItem('isLogueado');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('usuarioLogueado');

            this.$router.push({ name: 'login' }).then(() => {
                window.location.reload();
            });
        }
    },
}
</script>

<style scoped>
.nav-link.active {
    color: #FAD02E !important;
    font-size: 1.1rem;
    transition: font-size 0.5s ease;
}
</style>
