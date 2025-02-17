<template>

    <br>    

    <div class="text-center my-2">
        <h5 class="text-center text-success font-weight-bold">
            <i class="bi bi-chat-left-text"></i>
            ZONA DE COMENTARIOS
            <span class="underline-effect"></span>
            <router-link to="/" class="btn btn-custom"><i class="bi bi-arrow-return-left me-2"></i></router-link>
        </h5>
    </div>
    <br>
    <div class="container-fluid border p-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <h5 v-if="!isLogueado">Necesitas estar registrado para dejar un comentario</h5>
            <form @submit.prevent="" class="form-in-line">
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="email">Email:</label>
                    <input type="text" class="form-control sm me-2  w-75" placeholder="Email" v-model="comentario.clienteEmail" id="email" @blur="validarEmail(this.comentario.clienteEmail)">
                    <label class="ms-auto me-2" for="movil">Móvil:</label>
                    <input type="text" class="form-control sm me-2  w-25" placeholder="Móvil" v-model="comentario.clienteMovil" id="movil" @blur="validarMovil(this.comentario.clienteMovil)">
                </div>
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="comentario">Comentarios:</label>
                    <textarea class="form-control" rows="3" maxlength="256" name="comentario" id="comentario" placeholder="Comentario (máximo 256 caracteres)" v-model="comentario.clienteMensaje"></textarea>
                </div>
                <div class="input-group-text mb-3">
                    Valoración: 
                    <span v-for="n in 5" :key="n" :class="n <= comentario.clienteValor? 'bi bi-star-fill' : 'bi bi-star'" 
                    @click="setValor(n)"
                    class="star-icon star-valor ms-2"
                    ></span>
                    <button class="btn btn-outline-secondary m-1 ms-auto" @click="limpiarFormCom()">
                        <i class="bi-arrow-counterclockwise"></i>
                    </button>
                </div>
                <p><input class="form-check-input me-2" type="checkbox" name="privacidad" id="privacidad" v-model="comentario.lopd"><label for="privacidad">He leído y acepto la <router-link to="/privacidad">Política de privacidad</router-link></label></p>
                <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                    <button class="btn btn-success" type="button" @click="guardarComentario()" :disabled="!isLogueado">Enviar Comentario</button>
                </div>
            </form>
        </div>
    </div>

    <br>

    <h5 class="text-center text-success font-weight-bold my-2">
        <i class="bi bi-table"></i>
        TABLA DE COMENTARIOS
        <span class="underline-effect"></span>
    </h5>
    
    <br>

    <div class="col-10 col-m-6 col-lg-8 mx-auto">
        <table class="table">
            <thead class="table-success rounded-header">
                <tr>
                    <th class="text-center" scope="col">ID</th>
                    <th class="text-center" scope="col">Fecha</th>
                    <th class="text-center" scope="col">Nombre</th>
                    <th class="text-center" scope="col" v-if="isAdmin">Email</th>
                    <th class="text-center" scope="col">Mensaje</th>
                    <th class="text-center" scope="col">Valoración</th>
                    <th scope="col" class="table-warning text-center" v-if="isAdmin">Gestión</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="comentario in comentariosPorPagina" :key="comentario.id">
                    <td class="text-center">{{ comentario.id }}</td>
                    <td class="text-center">{{ comentario.fechaComentario }}</td>
                    <td class="text-center">{{ comentario.nombre }}</td>
                    <td class="text-center" v-if="isAdmin">{{ comentario.clienteEmail }}</td>
                    <td class="text-center">{{ comentario.clienteMensaje }}</td>
                    <td class="text-center">{{ comentario.clienteValor }}</td>
                    <td class="text-center table-warning" v-if="isAdmin">
                        <div>
                            <button class="btn btn-warning m-2" @click="seleccionarComentario(comentario)">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                            <button class="btn btn-danger m-2" @click="eliminarComentario(comentario)">
                                <i class="fas fa-trash"></i>
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
            <button class="btn btn-success" :disabled="currentPage * pageSize >= comentarios.length" @click="siguientePagina">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>        
    </div>
</template>

<script>
import Swal from "sweetalert2";

export default {
    name: "TablaEmpleo",

    data() {
        return {
            comentario: {
                clienteEmail: "",
                clienteMensaje: "",
                fechaComentario: "",
                clienteMovil: "",
                clienteValor: "",
                lopd: "",
                nombre: "",
            },
            comentarios: [],
            currentPage: 1,
            pageSize: 5,
            isLogueado: false,
            isAdmin: false,
        }
    },

    mounted() {
        this.getComentarios();
        this.isAdmin = localStorage.getItem('isAdmin') === 'true';
        this.isLogueado = localStorage.getItem('isLogueado') === 'true';
    },

    methods: {
        setValor(n) {
            this.comentario.clienteValor = n;
        },

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

        limpiarFormCom() {
            this.comentario = {
                clienteEmail: "",
                clienteMensaje: "",
                fechaComentario: "",
                clienteMovil: "",
                clienteValor: "",
                lopd: "",
                nombre: "",
            }
        },

        async getComentarios() {
            try {
                const response = await fetch('http://localhost:3000/comentarios');
                if (!response.ok) {
                    throw Error(`Error en la solicitud: ${response.statusText}`)
                }
                this.comentarios = await response.json();
                this.comentarios = this.comentarios.reverse();
            } catch (error) {
                console.log(error);
            }
        },

        async guardarComentario() {
            if (!(this.comentario.clienteEmail && this.comentario.clienteMovil && this.comentario.lopd && this.comentario.clienteValor)) {
                this.mostrarAlerta('Error', 'Debes proporcionar un email, un móvil y una valoración, y aceptar la política de privacidad', 'error');
                return;
            }
            
            if (!this.validarEmail(this.comentario.clienteEmail) || !this.validarMovil(this.comentario.clienteMovil)) {
                return;
            }

            const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));
            if (usuario.email !== this.comentario.clienteEmail) {
                this.mostrarAlerta('Error', 'El email no coincide con el usuario logueado', 'error');
                return;
            }

            try {
                const usuariosResponse = await fetch('http://localhost:3000/usuarios');

                if (!usuariosResponse.ok) {
                    throw new Error(`Error al cargar los usuarios ${usuariosResponse.statusText}`);
                }

                const usuarios = await usuariosResponse.json();
                const usuario = usuarios.find(usuario => usuario.email === this.comentario.clienteEmail);

                if (usuario) {
                    this.comentario.nombre = usuario.nombre;
                    this.comentario.fechaComentario = this.obtenerFechaHoy();

                    const crearResponse = await fetch('http://localhost:3000/comentarios', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.comentario),
                    });
    
                    if (!crearResponse.ok) {
                        throw new Error(`Error al guardar el comentario ${crearResponse.statusText}`);
                    }
    
                    const nuevoComentario = await crearResponse.json();
                    this.comentarios.push(nuevoComentario);
                    this.mostrarAlerta('Aviso', 'Comentario enviado con éxito', 'success');
                    this.getComentarios();                    
                } else {
                    this.mostrarAlerta('Error', 'Debes estar registrado para dejar un comentario', 'error');
                }

            } catch(error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo guardar el comentario', 'error');
            }
        },

        async seleccionarComentario(comentario) {
            try {
                this.limpiarFormCom;
                const response = await fetch('http://localhost:3000/comentarios');

                if (!response.ok) {
                    throw new Error(`Error al guardar el comentario ${response.statusText}`);
                }

                const comentariosCargados = await response.json();
                const comentarioCargado = comentariosCargados.find(com => com.id === comentario.id);

                if (comentarioCargado) {
                    this.comentario = this.comentario = {
                        clienteEmail: comentarioCargado.clienteEmail,
                        clienteMensaje: comentarioCargado.clienteMensaje,
                        fechaComentario: comentarioCargado.fechaComentario,
                        clienteMovil: comentarioCargado.clienteMovil,
                        clienteValor: comentarioCargado.clienteValor,
                        lopd: comentarioCargado.lopd,
                    };
                } else {
                    this.mostrarAlerta('Error', 'Comentario no encontrado', 'error');
                }

            } catch(error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo cargar el comentario', 'error');
            }
        },

        async eliminarComentario(comentario) {
            const resultado = await Swal.fire({
                title: 'Confirmación',
                html: `¿Desea eliminar <strong>${comentario.clienteMensaje}</strong>?.<br><br>Esta acción no se puede deshacer.`,
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

            try {
                const crearResponse = await fetch(`http://localhost:3000/comentarios/${comentario.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(comentario),
                });

                if (!crearResponse.ok) {
                    throw new Error(`Error al eliminar el comentario ${crearResponse.statusText}`);
                }

                this.mostrarAlerta('Aviso', 'Comentario eliminado con éxito', 'success');
                this.getComentarios();

            } catch(error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo eliminar el comentario', 'error');
            }
        },

        siguientePagina() {
            if (this.currentPage * this.pageSize < this.comentarios.length) {
                this.currentPage++;
            }
        },

        paginaAnterior() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },

        obtenerFechaHoy() {
            const fecha = new Date();
            const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const fechaFormateada = new Intl.DateTimeFormat('es-ES', opciones).format(fecha);
            return fechaFormateada;
        },
    },

    computed: {
        comentariosPorPagina() {
            const indiceInicial = (this.currentPage - 1) * this.pageSize;
            return this.comentarios.slice(indiceInicial, indiceInicial + this.pageSize);
        }
    }
}
</script>

<style>
.star-valor {
  font-size: 2rem; /* Tamaño de las estrellas */
  color: #ffc107; /* Color dorado */
  cursor: pointer;
}

.star-icon {
  margin-right: 5px;
}
</style>
