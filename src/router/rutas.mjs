import express from 'express';
import { Articulo, Factura } from '../modelos/modelos.mjs';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import nodemailer from 'nodemailer';

console.log(Articulo);

const rutas = express.Router();

const createStorage = (folder) => multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, folder); // Define carpeta de destino dinámicamente
    },
    filename: function (req, file, cb) {
        const name = `${file.originalname.split('.')[0]}${path.extname(file.originalname)}`
        cb(null, name); // Nombre único
    }
});

const imageFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    console.log(ext);
    console.log(file.originalname);
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos PNG o JPG'), false);
    }
};

const cvFileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    if (ext === '.pdf') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos PDF'), false);
    }
};

const uploadImage = multer({
    storage: createStorage('uploads/img'),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadCV = multer({
    storage: createStorage('uploads/cv'),
    fileFilter: cvFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

rutas.post('/subirimg', uploadImage.single('image'), (req, res) => {
    res.status(200).json({ message: 'Imagen subida correctamente', file: req.file })
});

rutas.post('/subircv', uploadCV.single('archivo'), (req, res) => {
    console.log('Archivo recibido: ', req.file);
    console.log('Candidato ID: ', req.body.candidatoId);
    if (!req.file) {
        return res.status(400).json({ message: 'No se subió ningún archivo' });
    }
    res.status(200).json({
        message: 'Archivo subido con éxito',
        file: req.file,
    });
});

rutas.get('/articulos', async (req, res) => {
    try {
        const articulos = await Articulo.find({});
        res.json(articulos);
    } catch(error) {
        res.status(500).json({message: error.message});
        console.log("Error al obtener artículos: ", error);
    }
});

rutas.post('/articulos', async (req, res) => {
    try {
        const articulo = new Articulo(req.body);
        await articulo.save();
        res.status(201).json(articulo);
        console.log("Artículo guardado correctamente");
    } catch (error) {
        res.status(400).json({message: error.message});
        console.log("Error al guardar el artículo: ", error);
    }
});

rutas.put("/articulos/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID recibido: ", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('No hay artículo con ese ID');
        }

        const articulo = await Articulo.findByIdAndUpdate(id, req.body, { new: true});

        if (!articulo) {
            return res.status(404).json({ message: 'Articulo no encontrado' });
        }

        res.json(articulo);
        console.log("Artículo actualizado correctamente");
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log("Error al actualizar artículo: ", error);
    }
});

rutas.delete('/articulos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log("ID recibido: ", id);

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send('No hay artículo con ese ID');
        }

        const articulo = await Articulo.findByIdAndDelete(id);

        if (!articulo) {
            return res.status(404).json({ message: 'Artículo no encontrado' });
        }

        res.json(articulo);
        console.log("Artículo eliminado correctamente");
    } catch (error) {
        res.status(400).json({ message: error.message });
        console.log("Error al eliminar artículo: ", error);
    }
});

rutas.post('/facturas', async (req, res) => {
    try {
        const factura = new Factura(req.body);
        await factura.save();
        res.status(201).json(factura);
        console.log("Factura guardada correctamente");
    } catch (error) {
        res.status(400).json({message: error.message});
        console.log("Error al guardar la factura: ", error);
    }
});

rutas.post('/enviar-correo', (req, res) => {
    const tranporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false,
        }
    });
    
    console.log("Datos Recibidos: ", req.body);

    const { nombre, telefono, email, mensaje } = req.body;

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: 'Mensaje de contacto',
        text: `Nombre: ${nombre}\nTeléfono: ${telefono}\nEmail: ${email}\nMensaje: ${mensaje}`
    };

    tranporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error al enviar el correo: ", error);
            return res.status(500).json({ error: 'Error al enviar el mensaje, por favor inténtelo nuevamente.' });
        } else {
            console.log('Email enviado: ' + info.response);
            return res.status(200).json({ message: 'Mensaje enviado correctamente' });
        }
    })
})

export default rutas;
