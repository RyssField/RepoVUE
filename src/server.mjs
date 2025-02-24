import express from 'express';
import http from 'http';
import morgan from 'morgan';
import mongoose from 'mongoose';
import rutas from './router/rutas.mjs';
import cors from 'cors';
import Stripe from 'stripe';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const server = http.createServer(app);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:5000'],  // Permitir el frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Permitir cookies y autenticación
  }));
app.options('*', cors());  // Habilita CORS para preflight
app.use(express.urlencoded({ extended: true })); // ¡IMPORTANTE!
app.use(express.json());
app.use(morgan('dev'));
app.use(rutas);

app.use('/uploads/img', express.static(path.join(__dirname, '../uploads/img')));
app.use('/uploads/cv', express.static(path.join(__dirname, '../uploads/cv')));

app.get('/', (req, res) =>  {
    res.send("Servidor en Marcha");
});

app.set('port', process.env.PORT || 5000);

server.listen(app.get('port'), () => {
    console.log(`Servidor corriendo en puerto ... ${app.get('port')}`)
});

mongoose.connect('mongodb://admin:abc123@localhost:27017/bbdd?authSource=admin')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(error => console.log(error));