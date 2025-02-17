<template>

    <br>

    <div class="text-center my-2">
        <h5 class="text-center text-success font-weight-bold">
            <i class="bi bi-tools"></i>
            TRABAJA CON NOSOTROS
            <span class="underline-effect"></span>
            <router-link to="/" class="btn btn-custom"><i class="bi bi-arrow-return-left me-2"></i></router-link>
        </h5>
    </div>
    <br>
    <div class="container-fluid border p-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <form @submit.prevent="grabarusuario" class="form-in-line">
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="apellidos">Apellidos:</label>
                    <input type="text" class="form-control sm w-50 me-2" placeholder="Apellidos" v-model="empleado.apellidos" id="apellidos">
                    <label class="ms-auto me-2" for="nombre">Nombre:</label>
                    <input type="text" class="form-control sm w-50 me-2" placeholder="Nombre" v-model="empleado.nombre" id="nombre">
                </div>
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="email">Email:</label>
                    <input type="text" class="form-control sm me-2  w-75" placeholder="Email" v-model="empleado.email" id="email" @blur="validarEmail(this.empleado.email)">
                    <label class="ms-auto me-2" for="movil">Móvil:</label>
                    <input type="text" class="form-control sm me-2  w-25" placeholder="Móvil" v-model="empleado.movil" id="movil" @blur="validarMovil(this.empleado.movil)">
                </div>
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="departamento">Departamento:</label>
                    <select class="form-select sm w-25 me-2" name="departamento" id="departamento" v-model="empleado.departamento">
                        <option value="">Departamento</option>
                        <option v-for="departamento in departamentos" :key="departamento.id" :value="departamento">{{ departamento.nombre }}</option>
                    </select>
                    <div class="w-75">
                        <label class="ms-auto me-2" for="modalidad">Modalidad:</label>
                        <input class="form-check-input sm me-2" type="radio" name="modalidad" id="remoto" value="remoto" v-model="empleado.modalidad"><label class="ms-auto me-2" for="remoto">Remoto</label>
                        <input class="form-check-input sm me-2" type="radio" name="modalidad" id="hibrido" value="hibrido" v-model="empleado.modalidad"><label class="ms-auto me-2" for="hibrido">Híbrido</label>
                        <input class="form-check-input sm me-2" type="radio" name="modalidad" id="presencial" value="presencial" v-model="empleado.modalidad"><label class="ms-auto me-2" for="presencial">Presencial</label>
                    </div>
                </div>
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="comentarios">Comentarios:</label>
                    <textarea class="form-control" rows="4" maxlength="256" name="comentarios" id="comentarios" placeholder="Comentarios (máximo 256 caracteres)" v-model="empleado.comentarios"></textarea>
                </div>
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="cv">CV:</label>
                    <input type="file" class="custom-file-input form-control sm me-2" placeholder="CV" id="cv" accept=".pdf" @change="handleFileChange" ref="fileInput">
                    <button class="btn btn-outline-secondary m-1" @click="limpiarFormCan()">
                        <i class="bi-arrow-counterclockwise"></i>
                    </button>
                </div>
                <p><input class="form-check-input me-2" type="checkbox" name="privacidad" id="privacidad" v-model="empleado.avisoLegal"><label for="privacidad">He leído y acepto la <router-link to="/privacidad">Política de privacidad</router-link></label></p>
                <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                    <button class="btn btn-success" type="button" @click="altaCandidato()">Enviar</button>
                </div>
            </form>
        </div>
    </div>

    <br>

    <h5 class="text-center text-success font-weight-bold" v-if="isAdmin">
        <i class="bi bi-people-fill"></i>
        GESTIÓN USUARIOS
        <span class="underline-effect"></span>
    </h5>
    
    <br>

    <div class="col-10 col-m-6 col-lg-8 mx-auto" v-if="isAdmin">
        <table class="table">
            <thead class="table-success rounded-header">
                <tr>
                    <th class="text-center" scope="col">Apellidos</th>
                    <th class="text-center" scope="col">Nombre</th>
                    <th class="text-center" scope="col">Móvil</th>
                    <th class="text-center" scope="col">Departamento</th>
                    <th class="text-center" scope="col">Modalidad</th>
                    <th scope="col" class="table-warning text-center">Gestión</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="candidato in candidatosPorPagina" :key="candidato.id">
                    <td class="text-center">{{ candidato.apellidos }}</td>
                    <td class="text-start">{{ candidato.nombre }}</td>
                    <td class="text-start">{{ candidato.movil }}</td>
                    <td class="text-start">{{ candidato.departamento?.nombre }}</td>
                    <td class="text-center">{{ candidato.modalidad }}</td>
                    <td class="text-center table-warning">
                        <div>
                            <button class="btn btn-warning m-2" @click="seleccionaCandidato(candidato)">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                            <button class="btn btn-danger m-2" @click="eliminarCandidato(candidato)">
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
            <button class="btn btn-success" :disabled="currentPage * pageSize >= candidatos.length" @click="siguientePagina">
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
            empleado: {
                apellidos: "",
                nombre: "",
                email: "",
                movil: "",
                departamento: "",
                modalidad: "",
                avisoLegal: "",
                comentarios: "",
            },
            cv: null,
            candidatos: [],
            departamentos: [],
            currentPage: 1,
            pageSize: 6,
            isAdmin: false,
        }
    },

    mounted() {
        this.getCandidatos();
        this.getDepartamentos();
        this.isAdmin = localStorage.getItem('isAdmin') === 'true';
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

        handleFileChange(event) {
            this.cv = event.target.files[0];
            console.log(this.cv);
        },

        async getCandidatos() {
            try {
                const response = await fetch('http://localhost:3000/candidatos');
                if (!response.ok) {
                    throw Error(`Error en la solicitud: ${response.statusText}`)
                }
                this.candidatos = await response.json();
            } catch (error) {
                console.log(error);
            }
        },

        async altaCandidato() {
            if (this.empleado.apellidos && this.empleado.nombre && this.empleado.movil && this.empleado.email && this.empleado.departamento && this.empleado.modalidad && this.empleado.avisoLegal) {
                if (!this.validarEmail(this.empleado.email) || !this.validarMovil(this.empleado.movil)) {
                    return;
                }

                try {
                    const crearResponse = await fetch('http://localhost:3000/candidatos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(this.empleado),
                    });

                    if (!crearResponse.ok) {
                        throw new Error(`Error al dar de alta al empleado ${crearResponse.statusText}`);
                    }

                    if (this.cv) {
                        const formdata = new FormData;
                        const candidatoId = this.empleado.movil || 'default';
                        const nuevoArchivo = new File([this.cv], `${candidatoId}.pdf`, { type: this.cv.type })
                        formdata.append("archivo", nuevoArchivo);
                        formdata.append("candidatoId", candidatoId)
                        console.log(nuevoArchivo);
                        const uploadResponse = await fetch('http://localhost:5000/subircv', {
                            method: 'POST',
                            body: formdata,
                            credentials: 'include'
                        });

                        if (!uploadResponse.ok) {
                            throw new Error(`Error al subir el cv ${uploadResponse.statusText}`);
                        } else {
                            console.log('hubo respuesta: ', uploadResponse);
                        }
                    }

                    const nuevoCandidato = await crearResponse.json();
                    this.candidatos.push(nuevoCandidato);
                    this.mostrarAlerta('Aviso', 'Candidato guardado con éxito', 'success');
                    this.getCandidatos();

                } catch(error) {
                    console.error(error);
                    this.mostrarAlerta('Error', 'No se pudo dar de alta al empleado', 'error');
                }
            } else if (!this.empleado.avisoLegal) {
                this.mostrarAlerta('Aviso', 'Debe aceptar las políticas de privacidad', 'info');
            } else {
                this.mostrarAlerta('Error', 'Por favor, completa todos los campos', 'error');
            }
        },

        async getDepartamentos() {
            try {
                const response = await fetch('http://localhost:3000/departamentos');
                if (!response.ok) {
                    throw Error(`Error en la solicitud: ${response.statusText}`)
                }
                this.departamentos = await response.json();
            } catch (error) {
                console.log(error);
            }
        },

        async eliminarCandidato(candidato) {
            const resultado = await Swal.fire({
                title: 'Confirmación',
                html: `Desea eliminar a <strong>${candidato.nombre} ${candidato.apellidos}</strong>.<br><br>Esta acción no se puede deshacer.`,
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
                const response = await fetch('http://localhost:3000/candidatos');
                if (!response.ok) {
                    throw new Error(`Error en la solicitud ${response.statusText}`);
                }

                const candidatos = await response.json();
                const candidatoExistente = candidatos.find(candidatoE => candidatoE.id === candidato.id);
                if (candidatoExistente) {
                    await fetch(`http://localhost:3000/candidatos/${candidatoExistente.id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(candidatoExistente),
                    });

                    this.mostrarAlerta('Aviso', 'Candidato eliminado correctamente', 'success');
                    this.getCandidatos();
                } else {
                    this.mostrarAlerta('Error', 'Candidato no encontrado', 'error');
                }
            } catch (error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo eliminar al candidato.', 'error');
            }
        },

        async seleccionaCandidato(candidato) {
            // Buscar el candidato por Email en el archivo JSON
            try {
                const response = await fetch('http://localhost:3000/candidatos');
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }
                const candidatos = await response.json();

                // Encontrar el usuario por su DNI
                const candidatoEncontrado = candidatos.find(c => c.email === candidato.email);


                if (candidatoEncontrado) {
                    this.empleado = { ...candidatoEncontrado };
                    this.editCandidato = true;
                } else {
                    this.mostrarAlerta('Error', 'Candidato no encontrado en el servidor.', 'error');
                }
            } catch (error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo cargar el candidato desde el servidor.', 'error');
            }
        },

        siguientePagina() {
            if (this.currentPage * this.pageSize < this.candidatos.length) {
                this.currentPage++;
            }
        },

        paginaAnterior() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },

        limpiarFormCan() {
            this.empleado = {
                apellidos: "",
                nombre: "",
                email: "",
                movil: "",
                departamento: "",
                modalidad: "",
                avisoLegal: "",
                comentarios: "",
                cv: null,
            };
            this.editCandidato = false;
            this.$refs.fileInput.value = null;
        },
    },

    computed: {
        candidatosPorPagina() {
            const indiceInicial = (this.currentPage - 1) * this.pageSize;
            return this.candidatos.slice(indiceInicial, indiceInicial + this.pageSize);
        }
    }
}
</script>

<style>
</style>
