<template>

    <br>

    <div class="text-center my-2">
        <h5 class="text-center text-success font-weight-bold">
            <i class="bi bi-file-earmark-person"></i>
            FORMULARIO DE CONTACTO
            <span class="underline-effect"></span>
        </h5>
    </div>

    <br>

    <div class="text-center my-2">
        <div class="container-fluid border p-4">
            <div class="col-10 col-m-4 col-lg-4 mx-auto">
                <form @submit.prevent="" class="form-in-line">
                    <div class="input-group-text mb-3">
                        <label class="ms-auto me-2" for="nombre">Nombre:</label>
                        <input type="text" class="form-control sm me-2  w-75" placeholder="Nombre" v-model="contacto.nombre" id="nombre">
                    </div>
                    <div class="input-group-text mb-3">
                        <label class="ms-auto me-2" for="descripcion">Teléfono:</label>
                        <input type="text" class="form-control sm me-2  w-75" placeholder="Teléfono" v-model="contacto.telefono" id="nombre">
                    </div>
                    <div class="input-group-text mb-3">
                        <label class="ms-auto me-2" for="stock">Email</label>
                        <input type="text" class="form-control sm me-2  w-75" placeholder="email" v-model="contacto.email" id="nombre">
                    </div>
                    <div class="input-group-text mb-3">
                        <label class="ms-auto me-2" for="descripcion">Mensaje:</label>
                        <textarea class="form-control" maxlength="128" rows="3" name="personalizacion" id="personalizacion" placeholder="Escribe tu mensaje aquí" v-model="contacto.mensaje"></textarea>
                    </div>
                    <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                        <button class="btn btn-success" type="button" @click="enviarMensaje()">Enviar</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
    name: "TablaContacto",
    data() {
        return {
            contacto: {
                nombre: '',
                telefono: '',
                email: '',
                mensaje: '',
            },
            mensajeExito: '',
            mensajeError: '',
        }
    },
    methods: {
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

        enviarMensaje() {
            if (!this.nombreValido() || !this.emailValido() || !this.telefonoValido()) {
                return;
            }

            fetch('http://localhost:5000/enviar-correo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.contacto),
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    this.mensajeExito = '¡Mensaje enviado con éxito!';
                    this.contacto.nombre = '';
                    this.contacto.telefono = '';
                    this.contacto.email = '';
                    this.contacto.mensaje = '';
                    Swal.fire({
                        icon: 'success',
                        title: 'Mensaje Enviado con Éxito',
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } else {
                    this.mensajeError = 'Hubo un problema al enviar el mensaje. Intenta de nuevo.';
                }
            })
            .catch(error => {
                console.error('Error: ', error);
                this.mensajeError = 'Hubo un error en la conexión con el servidor. Intenta nuevamente.';
            });
        },

        nombreValido() {
            if (this.contacto.nombre.trim() === "") {
                this.mostrarAlerta('Error', 'El nombre no es válido', 'error');
                return false;
            }
            return true;
        },

        telefonoValido() {
            const regexTelf = /^[67]\d{8}$/;
            if (!regexTelf.test(this.contacto.telefono)) {
                this.mostrarAlerta('Error', 'El teléfono no es válido', 'error');
                return false;
            }
            return true;
        },

        emailValido() {
            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!regexEmail.test(this.contacto.email)) {
                this.mostrarAlerta('Error', 'El email no es válido', 'error');
                return false;
            }
            return true;
        },
    }
}
</script>

<style scoped>
</style>