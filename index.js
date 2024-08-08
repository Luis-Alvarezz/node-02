// console.log('Ejecutado con Nodemon'); --> Funciona con exito


/* ===> Archivo para leventar servidor <=== */ 

import express from 'express';
import bodyParser from 'body-parser';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Archivo almacenamiento de conexion del servidor:
import serviceAccount from './config/firebaseServiceAccount.json';

const app = express();
const PORT = process.env.PORT || 3010; // If comparativo para puerto. 

/* Configuración de Firabase para enlazamiento */
initializeApp({
   credential: cert(serviceAccount)
});

const bd = getFirestore();
const usuariosCollection = db.collection('usuarios');

app.use(bodyParser.json); 

/* Operaciones CRUD */


/* Inicializar servidor */
app.listen(PORT, () => {
   console.log(`Servidor trabajando en: ${PORT}`);
});