<template>

    <br>

    <div class="text-center my-2">
        <h5 class="text-center font-weight-bold text-success">
            <i class="bi bi-people-fill"></i>
            REGISTRO DE USUARIOS
            <span class="underline-effect"></span>
            <router-link to="/" class="btn btn-custom"><i class="bi bi-arrow-return-left me-2"></i></router-link>
        </h5>
    </div>
    <br>
    <div class="container-fluid border p-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <form @submit.prevent="grabarusuario" class="d-inline">
                <div class="input-group-text mb-3">
                    <label class="me-2" for="dni">DNI/NIE:</label>
                    <input id="dni" type="text" class="form-control sm w-25 me-2" :class=" {'is-invalid' : dniMismatch} " :disabled="editDni" placeholder="DNI-NIE" v-model="usuario.dni" @blur="validarDNI(this.usuario.dni)">
                </div>
                <div class="input-group-text mb-3">
                    <label class="me-2" for="apellidos">Apellidos:</label>
                    <input id="apellidos" type="text" class="form-control sm w-50 me-2" placeholder="Apellidos" v-model="usuario.apellidos">
                    <label class="ms-auto me-2" for="nombre">Nombre:</label>
                    <input id="nombre" type="text" class="form-control sm w-50 me-2" placeholder="Nombre" v-model="usuario.nombre">
                </div>
                <div class="input-group-text mb-3">
                    <label class="me-2" for="email">Email:</label>
                    <input id="email" type="text" class="form-control sm me-2  w-25" :class=" {'is-invalid' : emailMismatch} " placeholder="Email" v-model="usuario.email" @blur="validarEmail(this.usuario.email)">
                    <label class="ms-auto me-2" for="email2">Repita email:</label>
                    <input id="email2" type="text" class="form-control sm me-2  w-25" :class=" {'is-invalid' : emailRepetidoMismatch} " placeholder="Email" v-model="emailRepetido" @blur="validarRepetido(this.emailRepetido)">
                    <label class="me-2" for="movil">Móvil:</label>
                    <input id="movil" type="text" class="form-control sm w-25 me-2" :class=" {'is-invalid' : movilMismatch} " placeholder="Nº móvil" v-model="usuario.movil" @blur="validarMovil(this.usuario.movil)">
                </div>
                <div class="input-group-text mb-3">
                    <label class="me-2" for="pass">Contraseña:</label>
                    <input id="pass" type="password" class="form-control sm me-2  w-25" :class=" {'is-invalid' : passMismatch} " placeholder="Contraseña" v-model="usuario.pass">
                    <label class="ms-auto me-2" for="pass2">Repita Contraseña:</label>
                    <input id="pass2" type="password" class="form-control sm me-2  w-25" :class=" {'is-invalid' : passRepetidaMismatch} " placeholder="Contraseña" v-model="passRepetida" @blur="validarContrasenaRepetida(this.passRepetida)">
                </div>
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="direccion">Direccion:</label>
                    <input id="direccion" type="text" class="form-control sm me-2" placeholder="Dirección" v-model="usuario.direccion">
                </div>
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="provincia">Provincia:</label>
                    <select id="provincia" class="form-select sm w-50 me-2" v-model="usuario.provincia">
                        <option value="">Provincia</option>
                        <option v-for="provincia in provincias" :key="provincia.id" :value="provincia">{{ provincia.nm }}</option>
                    </select>
                    <label class="ms-auto me-2" for="municipio">Municipio:</label>
                    <select id="municipio" class="form-select sm w-50 me-2" v-model="usuario.municipio">
                        <option value="">Municipio</option>
                        <option v-for="municipio in filtroMunicipios" :key="municipio.id" :value="municipio">{{ municipio.nm }}</option>
                    </select>
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                    <button class="btn btn-success me-md-2" type="button" @click="altaUsuario()">Alta</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2";
import passport from "@/config/passport.mjs";

export default {
    name: "TablaUsuarios",

    data() {
        return {
            usuario: {
                dni: '',
                alta: '',
                apellidos: '',
                nombre: '',
                direccion: '',
                email: '',
                provincia: '',
                municipio: '',
                baja: '',
                movil: '',
                tipo: '',
                pass: '',
            },
            usuarios: [],
            provincias: [],
            municipios: [],
            errores: [],
            tipos: [],
            emailRepetido: '',
            passRepetida: '',
            passMismatch: false,
            emailMismatch: false,
            passRepetidaMismatch: false,
            emailRepetidoMismatch: false,
            movilMismatch: false,
            dniMismatch: false,
        }
    },

    mounted() {
        this.getUsuarios();
        this.getProvincias();
        this.getMunicipios();
        this.getTipos();
    },

    methods: {
        validarDNI(dni) {
            if (dni === '') {
                return true;
            }

            dni = dni.toUpperCase();
            this.usuario.dni = dni;
            const dniRegex = /^[XYZ0-9][0-9]{7}[A-Z]$/;
            
            if (!dniRegex.test(dni)) {
                this.mostrarAlerta('Error', 'El NIE/DNI con formato no válido.', 'error');
                this.dniMismatch = true;
                return false;
            }

            let dniNum = dni.substring(0, 8);
            const letra = dni.charAt(8);
            if (dniNum.charAt(0) == 'X') {
                dniNum = dniNum.substring(1, 8);
                dniNum =  '0' + dniNum;
            } else if (dniNum.charAt(0) == 'Y') {
                dniNum = dniNum.substring(1, 8);
                dniNum =  '1' + dniNum;
            } else if (dniNum.charAt(0) == 'Z') {
                dniNum = dniNum.substring(1, 8);
                dniNum =  '2' + dniNum;
            }

            const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
            const letraCalculada = letras[dniNum % 23];
            if (letra !== letraCalculada) {
                this.mostrarAlerta('Error', 'DNI/NIE Incorrecto.', 'error');
                this.dniMismatch = true;
                return false;
            }

            this.dniMismatch = false;
            return true;            
        },

        validarEmail(email) {
            const emailPattern = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
            if (!emailPattern.test(email)) {
                this.mostrarAlerta('Error', 'Formato de correo electrónico no válido', 'error');
                this.emailMismatch = true;
                return false;
            }
            this.emailMismatch = false;
            return true;
        },

        async getUsuarios() {
            try {
                const response = await fetch('http://localhost:3000/usuarios');
                if (!response.ok) {
                    throw Error('Error en la solicitud: ' + response.statusText);
                }
                this.usuarios = await response.json();
            } catch (error) {
                console.error(error);
            }
        },

        async getProvincias() {
            try {
                const response = await fetch('http://localhost:3000/provincias');
                if (!response.ok) {
                    throw Error('Error en la solicitud: ' + response.statusText);
                }
                this.provincias = await response.json();
            } catch (error) {
                console.error(error);
            }
        },

        async getMunicipios() {
            try {
                const response = await fetch('http://localhost:3000/municipios');
                if (!response.ok) {
                    throw Error('Error en la solicitud: ' + response.statusText);
                }
                this.municipios = await response.json();
                console.log("municipios cargados");
            } catch (error) {
                console.error(error);
            }
        },

        async getTipos() {
            try {
                const response = await fetch('http://localhost:3000/tipoUsuario');
                if (!response.ok) {
                    throw Error('Error en la solicitud: ' + response.statusText);
                }
                this.tipos = await response.json();
                console.log("tipos cargados");
            } catch (error) {
                console.error(error);
            }
        },

        mostrarAlerta(titulo, mensaje, icono) {
            Swal.fire({
                title: titulo,
                text: mensaje,
                icon: icono,
                customClass: {
                    container: 'custom-alert-container',
                    popup: 'custom-alert-popup',
                    modal: 'custom-alert-modal',
                }
            });
        },

        async altaUsuario() {
            if (this.usuario.dni && this.usuario.apellidos && this.usuario.nombre && this.usuario.email && this.usuario.movil) {
                if (!this.validarDNI(this.usuario.dni) || !this.validarEmail(this.usuario.email) || !this.validarMovil(this.usuario.movil) || !this.validarRepetido(this.emailRepetido) || !this.validarContrasenaRepetida(this.passRepetida)) {
                    return;
                }
                
                try {
                    this.usuario.baja = '';
                    this.usuario.tipo = this.tipos[0];
                    this.usuario.alta = new Date().toISOString().split('T')[0];
                    const response = await fetch('http://localhost:3000/usuarios');
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos de los usuarios: ' + response.statusText);
                    }
                    
                    const usuariosExistentes = await response.json();

                    const usuarioExistente = usuariosExistentes.find(usuario => usuario.dni === this.usuario.dni);
                    
                    if (usuarioExistente) {
                        this.mostrarAlerta('Error', 'El DNI ya está registrado.', 'error');
                    } else {
                        this.usuario.pass = await passport.encriptarContrasena(this.usuario.pass);
                        const crearResponse = await fetch('http://localhost:3000/usuarios', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(this.usuario),
                        });

                        if (!crearResponse.ok) {
                            throw new Error(`Error al dar de alta al usuario ${crearResponse.statusText}`);
                        }

                        const nuevoUsuario = await crearResponse.json();
                        this.usuarios.push(nuevoUsuario);
                        this.mostrarAlerta('Aviso', 'Usuario dado de alta', 'success');
                    }
                } catch(error) {
                    console.error(error);
                    this.mostrarAlerta('Error', 'No se pudo dar de alta al usuario','error');
                }
            } else {
                this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
            }
        },

        obtenerFechaHoy() {
            const fecha = new Date();
            const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
            //return fecha.toLocaleDateString('es-ES');  // Formato dd/mm/yyyy
            return fechaFormateada;
        }
    },

    computed: {
        filtroMunicipios() {
            if (this.usuario.provincia.id == null || this.usuario.provincia.id == "") {
                return [];
            }
            return this.municipios.filter(municipio => municipio.id.startsWith(this.usuario.provincia.id));
        }
    }
};
</script>

<style>
</style>
