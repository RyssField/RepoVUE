<template>

    <br>

    <div class="text-center my-2">
        <h5 class="text-center text-success font-weight-bold">
            <i class="bi bi-box-seam"></i>
            GESTIÓN DE ARTÍCULOS
            <span class="underline-effect"></span>
            <router-link to="/" class="btn btn-custom"><i class="bi bi-arrow-return-left me-2"></i></router-link>
        </h5>
    </div>
    <br>
    <div class="container-fluid border p-4">
        <div class="col-10 col-m-6 col-lg-8 mx-auto">
            <form @submit.prevent="" class="form-in-line">
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="nombre">Nombre:</label>
                    <input type="text" class="form-control sm me-2  w-75" placeholder="Nombre del artículo" v-model="articulo.nombre" id="nombre">
                    <label class="ms-auto me-2" for="categoria">Categoría:</label>
                    <select name="categoria" id="categoria" class="form-select sm w-25 me-2" v-model="articulo.categoria">
                        <option value="">Seleccionar categoría</option>
                        <option v-for="categoria in categorias" :key="categoria" :value="categoria">{{ categoria }}</option>
                    </select>
                </div>
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="descripcion">Descripción:</label>
                    <textarea class="form-control me-2" maxlength="256" rows="3" name="descripcion" id="descripcion" placeholder="Descripción del artículo" v-model="articulo.descripcion"></textarea>
                    <label class="ms-auto me-2" for="precio">Precio unitario</label>
                    <input type="number" class="form-control sm me-2  w-75" name="precio" id="precio" min="0" v-model="articulo.precio">
                </div>
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="stock">Stock</label>
                    <input type="number" class="form-control sm me-2  w-75" name="stock" id="stock" min="0" v-model="articulo.stock">
                    <label class="ms-auto me-2" for="descripcion">Personalización:</label>
                    <textarea class="form-control" maxlength="128" rows="3" name="personalizacion" id="personalizacion" placeholder="Detalles de personalización" v-model="articulo.personalizacion"></textarea>
                </div>
                <div class="input-group-text mb-3">
                    <label class="ms-auto me-2" for="imagen">Imagen:</label>
                    <input type="file" class="custom-file-input form-control sm me-2" placeholder="CV" id="cv" accept=".png, .jpg, .jpeg" @change="handleFileChange" ref="fileInput">
                    <label class="ms-auto me-2" for="fecha-alta">Fecha de Alta:</label>
                    <input id="fecha-alta" type="date" class="form-control sm w-25 me-2" placeholder="dd/mm/yyyy" v-model="articulo.fechaAlta">
                </div>
                <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                    <button class="btn btn-success" type="button" @click="guardarArticulo()">Grabar</button>
                    <button class="btn btn-success" type="button" @click="limpiarFormArt()">Limpiar</button>
                </div>
            </form>
        </div>
    </div>

    <br>

    <h5 class="text-center text-success font-weight-bold my-2">
        <i class="bi bi-table"></i>
        TABLA DE ARTICULOS
        <span class="underline-effect"></span>
    </h5>
    
    <br>

    <div class="col-10 col-m-6 col-lg-8 mx-auto">
        <table class="table">
            <thead class="table-success rounded-header">
                <tr>
                    <th class="text-center" scope="col">ID</th>
                    <th class="text-center" scope="col">Nombre</th>
                    <th class="text-center" scope="col">Categoría</th>
                    <th class="text-center" scope="col">Descripción</th>
                    <th class="text-center" scope="col">Precio</th>
                    <th class="text-center" scope="col">Stock</th>
                    <th class="text-center" scope="col">Fecha Alta</th>
                    <th scope="col" class="table-warning text-center">Gestión</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="articulo in articulosPorPagina" :key="articulo._id">
                    <td class="text-center">{{ articulo._id.substring(0, 5) }}</td>
                    <td class="text-center">{{ articulo.nombre }}</td>
                    <td class="text-center">{{ articulo.categoria }}</td>
                    <td class="text-center">{{ articulo.descripcion }}</td>
                    <td class="text-center">{{ articulo.precio }}</td>
                    <td class="text-center">{{ articulo.stock }}</td>
                    <td class="text-center">{{ new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(Date.parse(articulo.fechaAlta)) }}</td>
                    <td class="text-center table-warning">
                        <div>
                            <button class="btn btn-warning m-2" @click="seleccionarArticulo(articulo)">
                                <i class="fas fa-pencil-alt"></i>
                            </button>
                            <button class="btn btn-danger m-2" @click="eliminarArticulo(articulo)">
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
            <button class="btn btn-success" :disabled="currentPage * pageSize >= articulos.length" @click="siguientePagina">
                <i class="bi bi-chevron-right"></i>
            </button>
        </div>        
    </div>
</template>

<script>
import Swal from "sweetalert2";
import { agregarArticulo, actualizarArticulo, eliminarArticulo, obtenerArticulos } from "@/js/articuloServicios";

export default {
    name: "TablaEmpleo",

    data() {
        return {
            articulo: {
                nombre: "",
                categoria: "",
                descripcion: "",
                precio: "",
                stock: "",
                personalizacion: "",
                urlImagen: "",
                fechaAlta: "",
            },
            imagen: null,
            articulos: [],
            categorias: [
                "Electrónica",
                "Hogar",
                "Ofimática",
                "Deporte",
                "Libros",
                "Otros"
            ],
            currentPage: 1,
            pageSize: 5,
        }
    },

    mounted() {
        this.getArticulos();
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

        limpiarFormArt() {
            this.articulo = {
                nombre: "",
                categoria: "",
                descripcion: "",
                precio: "",
                stock: "",
                personalizacion: "",
                fechaAlta: "",
            };
            this.imagen = null;
        },

        handleFileChange(event) {
            this.imagen = event.target.files[0];
            console.log(this.imagen);
        },

        async getArticulos() {
            try {                
                this.articulos = await obtenerArticulos();
            } catch (error) {
                console.log(error);
            }
        },

        async guardarArticulo() {
            try {
                if (this.articulo._id) {
                    console.log("Actualizando: " + this.articulo._id);
                    await actualizarArticulo(this.articulo._id, this.articulo);
                    if (this.imagen) {
                        console.log("SUBIENDO IMAGEN")
                        const formdata = new FormData;
                        const productoId = this.articulo._id || 'default';
                        const nuevoArchivo = new File([this.imagen], `${productoId}.${this.imagen.name.split('.')[1]}`, { type: this.imagen.type })
                        formdata.append("image", nuevoArchivo);
                        formdata.append("productoId", productoId)
                        console.log(nuevoArchivo);
                        const uploadResponse = await fetch('http://localhost:5000/subirimg', {
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

                    this.limpiarFormArt();
                    Swal.fire({
                        icon: 'success',
                        title: 'Artículo actualizado',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.getArticulos();
                } else {
                    console.log("SUBIENDO");
                    this.articulo.extImagen = this.imagen.name.split('.')[1];
                    const nuevoArticulo = await agregarArticulo(this.articulo);
                    this.articulos.push(nuevoArticulo);
                    if (this.imagen) {
                        const articulos = await obtenerArticulos();


                        console.log("SUBIENDO IMAGEN")
                        const formdata = new FormData;
                        const productoId = articulos.at(-1)._id || 'default';
                        const nuevoArchivo = new File([this.imagen], `${productoId}.${this.imagen.name.split('.')[1]}`, { type: this.imagen.type })
                        formdata.append("image", nuevoArchivo);
                        formdata.append("productoId", productoId)
                        console.log(nuevoArchivo);
                        const uploadResponse = await fetch('http://localhost:5000/subirimg', {
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
                    this.limpiarFormArt();
                    Swal.fire({
                        icon: 'success',
                        title: 'Artículo grabado',
                        showConfirmButton: false,
                        timer: 1500
                    });

                }
            } catch (error) {
                console.error(`Error al agregar el artículo:, ${error}`);
            }
        },

        async seleccionarArticulo(articulo) {
            try {
                this.limpiarFormArt();
                const response = await fetch('http://localhost:5000/articulos');

                if (!response.ok) {
                    throw new Error(`Error al conectar con la base de datos ${response.statusText}`);
                }

                const articulosCargados = await response.json();
                const articuloCargado = articulosCargados.find(art => art._id === articulo._id);

                if (articuloCargado) {
                    this.articulo = { ...articuloCargado };
                    this.articulo.fechaAlta = this.articulo.fechaAlta.split('T')[0];
                } else {
                    this.mostrarAlerta('Error', 'Artículo no encontrado', 'error');
                }

            } catch(error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo cargar el artículo', 'error');
            }
        },
        
        async eliminarArticulo(articulo) {
            const resultado = await Swal.fire({
                title: 'Confirmación',
                html: `¿Desea eliminar <strong>${articulo.nombre}</strong>?.<br><br>Esta acción no se puede deshacer.`,
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
                await eliminarArticulo(articulo._id);
                this.mostrarAlerta('Aviso', 'Artículo eliminado con éxito', 'success');
                this.getArticulos();

            } catch(error) {
                console.error(error);
                this.mostrarAlerta('Error', 'No se pudo eliminar el artículo', 'error');
            }
        },

        siguientePagina() {
            if (this.currentPage * this.pageSize < this.articulos.length) {
                this.currentPage++;
            }
        },

        paginaAnterior() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        }
    },

    computed: {
        articulosPorPagina() {
            const indiceInicial = (this.currentPage - 1) * this.pageSize;
            return this.articulos.slice(indiceInicial, indiceInicial + this.pageSize);
        }
    }
}
</script>

<style>
</style>
