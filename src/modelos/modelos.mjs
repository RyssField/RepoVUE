import mongoose from "mongoose";

const articuloSchema = new mongoose.Schema({
    nombre: {type: String, required: true},
    categoria: {type: String, required: true},
    descripcion: {type: String, maxlength: 256},
    precio: {type: Number, required: true, min: 0},
    stock: {type: Number, required: true, min: 0},
    personalizacion: {type: String, maxlength: 128},
    extImagen: {type: String},
    fechaAlta: {type: Date, required: true},
}, { versionKey: false });

const productoFacturaSchema = new mongoose.Schema({
    idProducto: {type: String, required: true},
    precio: {type: Number, required: true},
    cantidad: {type: Number, required: true},
    subtotal: {type: Number, required: true},
}, { versionKey: false })

const facturaSchema = new mongoose.Schema({
    idcliente: {type: String, required: true},
    productos: {type: [productoFacturaSchema], required: true},
    fecha: {type: Date, required: true},
    total: {type: Number, required: true},
}, { versionKey: false })

const Articulo = mongoose.model('Articulo', articuloSchema);
const Factura = mongoose.model('Factura', facturaSchema);

export { Articulo, Factura };
