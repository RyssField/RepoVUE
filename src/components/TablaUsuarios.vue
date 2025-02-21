<template>

    <br>

    <div class="text-center my-2">
        <h5 class="text-center font-weight-bold text-success">
            <i class="bi bi-people-fill"></i>
            GESTIÓN USUARIOS
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
                    <input id="dni" type="text" class="form-control sm w-25 me-2" :disabled="editDni" placeholder="DNI-NIE" v-model="usuario.dni" @blur="validarDNI(this.usuario.dni)">
                    <button class="btn btn-outline-secondary m-1" @click="this.buscarPorDni(usuario.dni)">
                        <i class="bi bi-search"></i>
                    </button>
                    <label class="ms-auto me-2" for="fecha-alta">Fecha alta:</label>
                    <input id="fecha-alta" type="date" class="form-control sm w-25 me-2" placeholder="dd/mm/yyyy" v-model="usuario.alta">
                </div>
                <div class="input-group-text mb-3">
                    <label class="me-2" for="apellidos">Apellidos:</label>
                    <input id="apellidos" type="text" class="form-control sm w-50 me-2" placeholder="Apellidos" v-model="usuario.apellidos">
                    <label class="ms-auto me-2" for="nombre">Nombre:</label>
                    <input id="nombre" type="text" class="form-control sm w-50 me-2" placeholder="Nombre" v-model="usuario.nombre">
                </div>
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="direccion">Direccion:</label>
                    <input id="direccion" type="text" class="form-control sm me-2  w-50" placeholder="Dirección" v-model="usuario.direccion">
                    <label class="ms-auto me-2" for="email">Email:</label>
                    <input id="email" type="text" class="form-control sm me-2  w-25" placeholder="Email" v-model="usuario.email" @blur="validarEmail(this.usuario.email)">
                    <label class="me-2" for="movil">Nº Móvil:</label>
                    <input id="movil" type="text" class="form-control sm w-25 me-2" placeholder="Nº móvil" v-model="usuario.movil" @blur="validarMovil(this.usuario.movil)">
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
                    <label class="ms-auto me-2" for="tipoUsuario">Tipo:</label>
                    <select id="tipoUsuario" class="form-select sm w-25 me-2" v-model="usuario.tipo">
                        <option value="">Tipo</option>
                        <option v-for="tipo in tipos" :key="tipo.id" :value="tipo">{{ tipo.tipo }}</option>
                    </select>
                    <input type="checkbox" class="form-check-input me-2" name="historico" id="historico" v-model="isChecked">
                    <label class="ms-auto me-2" for="historico">Histórico</label>
                    <button class="btn btn-outline-secondary m-1" @click="limpiarFormCli()">
                        <i class="bi-arrow-counterclockwise"></i>
                    </button>
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                    <button class="btn btn-success me-md-2" type="button" @click="altaUsuario()">Alta</button>
                    <button class="btn btn-success me-md-2" type="button" @click="modificarUsuarios()">Modificar</button>
                    <button class="btn btn-success" type="button" @click="eliminarUsuario()">Eliminar</button>
                </div>
            </form>
        </div>
    </div>

    <br>

    <!-- tabla -->
    <div class="col-10 col-m-6 col-lg-8 mx-auto">
        <table class="table">
            <thead class="table-success rounded-header">
                <tr>
                    <th class="text-center" scope="col">DNI</th>
                    <th class="text-center" scope="col">Apellidos</th>
                    <th class="text-center" scope="col">Nombre</th>
                    <th class="text-center" scope="col">Email</th>
                    <th class="text-center" scope="col">Móvil</th>
                    <th class="text-center" scope="col">Tipo</th>
                    <th class="text-center" scope="col">Fecha baja</th>
                    <th scope="col" class="table-warning text-center">Editar</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="usuario in usuariosPorPagina" :key="usuario.id">
                    <td class="text-center">{{ usuario.dni }}</td>
                    <td class="text-start">{{ usuario.apellidos }}</td>
                    <td class="text-start">{{ usuario.nombre }}</td>
                    <td class="text-start">{{ usuario.email }}</td>
                    <td class="text-center">{{ usuario.movil }}</td>
                    <td class="text-center">{{ usuario.tipo?.tipo }}</td>
                    <td class="text-center">{{ usuario.baja }}</td>
                    <td class="text-center table-warning">
                        <div>
                            <button class="btn btn-warning m-2" @click="seleccionaUsuario(usuario)">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex justify-content-center my-3">
            <button class="btn btn-success" :disabled="currentPage === 1" @click="paginaAnterior">
                <i class="bi bi-chevron-left"></i>
            </button>
            <span class="mx-3 align-self-center">Página {{ currentPage }}</span>
            <button class="btn btn-success" :disabled="currentPage * pageSize >= filtroUsuarios.length" @click="siguientePagina">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>        
    </div>
</template>

<script>
import Swal from "sweetalert2";

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
            },
            usuarios: [],
            provincias: [],
            municipios: [],
            errores: [],
            tipos: [],
            isChecked: false,
            editDni: false,
            currentPage: 1,
            pageSize: 6,
        }
    },

    mounted() {
        this.getUsuarios();
        this.getProvincias();
        this.getMunicipios();
        this.getTipos();
    },

    methods: {


        validarEmail(email) {
            const emailPattern = /^[a-zA-Z0-9]+([._-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
            if (!emailPattern.test(email)) {
                this.mostrarAlerta('Error', 'Formato de correo electrónico no válido', 'error');
                return false;
            } else {
                return true;
            }
        },

        validarMovil(movil) {
            const movilRegex = /^[67]\d{8}$/;
            if (!movilRegex.test(movil)) {
                this.mostrarAlerta('Error', 'Formato de número de móvil no válido', 'error');
                return false;
            } else {
                return true;
            }
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

        async altaUsuario() {
            if (this.usuario.dni && this.usuario.apellidos && this.usuario.nombre && this.usuario.email && this.usuario.alta && this.usuario.movil) {
                if (!this.validarDNI(this.usuario.dni) || !this.validarEmail(this.usuario.email) || !this.validarMovil(this.usuario.movil)) {
                    return;
                }
                
                try {
                    this.usuario.baja = '';
                    const response = await fetch('http://localhost:3000/usuarios');
                    if (!response.ok) {
                        throw new Error('Error al obtener los datos de los usuarios: ' + response.statusText);
                    }

                    const usuariosExistentes = await response.json();

                    const usuarioExistente = usuariosExistentes.find(usuario => usuario.dni === this.usuario.dni);

                    if (usuarioExistente && usuarioExistente.baja) {
                        const crearResponse = await fetch(`http://localhost:3000/usuarios/${usuarioExistente.id}`, {
                            method: 'PUT',
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
                        this.getUsuarios();
                    } else if (usuarioExistente) {
                        this.mostrarAlerta('Error', 'El DNI ya está registrado.', 'error');
                    } else {
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
                        this.getUsuarios();
                    }
                } catch(error) {
                    console.error(error);
                    this.mostrarAlerta('Error', 'No se pudo dar de alta al usuario','error');
                }
            } else {
                this.mostrarAlerta('Error', 'Por favor, completa todos los campos requeridos.', 'error');
            }
        },

        async seleccionaUsuario(usuario) {
            // Buscar el usuario por DNI en el archivo JSON
            try {
                this.limpiarFormCli();
                const response = await fetch('http://localhost:3000/usuarios');
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }
                const usuarios = await response.json();

                // Encontrar el usuario por su DNI
                const usuarioEncontrado = usuarios.find(c => c.dni === usuario.dni);


                if (usuarioEncontrado) {
                    // Convertir la fecha de alta al formato dd/mm/yyyy
                    // Asignar el objeto completo de provincia y municipio
                    if (this.usuario.provincia) {
                        this.usuario.provincia = this.provincias.find(p => p.nm === this.usuario.provincia).nm;
                        if (this.usuario.provincia) {
                            console.log("Provincia encontrada", this.usuario.provincia);
                        }
                    }

                    this.usuario = { ...usuarioEncontrado };
                    this.editDni = true;
                    console.log("Usuario encontrado", this.usuario.municipio);
                    if (this.usuario.alta) {
                        this.usuario.alta = this.usuario.alta.split('T')[0];  // Para asegurarse de que la fecha esté en formato YYYY-MM-DD
                    }
                } else {
                    this.mostrarAlerta('Error', 'Usuario no encontrado en el servidor.', 'error');
                }
            } catch (error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo cargar el usuario desde el servidor.', 'error');
            }
        },

        async eliminarUsuario() {
            try {
                const response = await fetch('http://localhost:3000/usuarios');
                if (!response.ok) {
                    throw new Error(`Error en la solicitud ${response.statusText}`);
                }

                const usuarios = await response.json();
                const usuarioExistente = usuarios.find(usuario => usuario.dni === this.usuario.dni);
                if (usuarioExistente) {
                    const fechaHoy = this.obtenerFechaHoy();

                    usuarioExistente.baja = fechaHoy;

                    await fetch(`http://localhost:3000/usuarios/${usuarioExistente.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(usuarioExistente),
                    });

                    this.mostrarAlerta('Aviso', 'Usuario dado de baja correctamente', 'success');
                    this.getUsuarios();
                } else {
                    this.mostrarAlerta('Error', 'Usuario no encontrado', 'error');
                }
            } catch (error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo dar de baja al usuario.', 'error');
            }
        },

        async modificarUsuarios() {
            const resultado = await Swal.fire({
                title: 'Confirmación',
                html: `Desea modificar a <strong>${this.usuario.nombre} ${this.usuario.apellidos}</strong>.<br><br>Esta acción no se puede deshacer.`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
            });

            if (!resultado.isConfirmed) {
                return;
            }


            if (!this.validarEmail(this.usuario.email) || !this.validarMovil(this.usuario.movil)) {
                return;
            }

            if (this.usuario.dni) {
                try {
                    const response = await fetch(`http://localhost:3000/usuarios/${this.usuario.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(this.usuario),
                    });

                    if (!response.ok) {
                        throw new Error(`Error al modificar el usuario: ${response.statusText}`);
                    }

                    this.mostrarAlerta('Aviso', 'Usuario modificado con éxito', 'success');
                    this.getUsuarios();
                } catch (error) {
                    console.error(error);
                    this.mostrarAlerta('Error', 'No se pudo modificar el usuario', 'error');
                }
            } else {
                this.mostrarAlerta('Error', 'Debe seleccionar un usuario para modificar.', 'error');
            }
        },

        limpiarFormCli() {
            this.usuario = {
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
            }
            this.editDni = false;
        },

        obtenerFechaHoy() {
            const fecha = new Date();
            const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
            //return fecha.toLocaleDateString('es-ES');  // Formato dd/mm/yyyy
            return fechaFormateada;
        },

        siguientePagina() {
            if (this.currentPage * this.pageSize < this.usuarios.length) {
                this.currentPage++;
            }
        },

        paginaAnterior() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },

        buscarPorDni(dni) {
            if (!dni) {
                this.mostrarAlerta('Error', 'Por favor, introduzca un DNI', 'error');
            }

            const usuarioDNI = this.usuarios.find(usuario => usuario.dni === dni);

            if (!usuarioDNI) {
                this.mostrarAlerta('Aviso', 'DNI no encontrado', 'warning')
            } else {
                this.seleccionaUsuario(usuarioDNI);
            }
        }
    },

    computed: {
        filtroUsuarios() {
            return this.isChecked ? this.usuarios : this.usuarios.filter(usuario => !usuario.baja);
        },

        filtroMunicipios() {
            if (this.usuario.provincia.id == null || this.usuario.provincia.id == "") {
                return [];
            }
            return this.municipios.filter(municipio => municipio.id.startsWith(this.usuario.provincia.id));
        },

        usuariosPorPagina() {
            const usuariosFiltrados = this.filtroUsuarios;
            const indiceInicial = (this.currentPage - 1) * this.pageSize;
            return usuariosFiltrados.slice(indiceInicial, indiceInicial + this.pageSize);
        }
    }
};
</script>

<style>
</style>
