// console.log('Ejecutado con Nodemon'); --> Funciona con exito


/* ===> Archivo para leventar servidor <=== */ 

import express, { response } from 'express';
import bodyParser from 'body-parser'; // Para el manejo de informacion que mandamos a travez de endpoints a traves de JSON
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore'; // Conectarnos a la Base de datos d Firestore

// Archivo almacenamiento de conexion del servidor:
import serviceAccount from './config/firebaseServiceAccount.json' with {type: 'json'};

/* ==> Levantar el servidor: <=== */
const app = express();
const PORT = process.env.PORT || 3010; // If comparativo para puerto. 

/* Configuración de Firabase para enlazamiento */
initializeApp({
   credential: cert(serviceAccount)
});

// Obtencion de DB y trabajo con la coleccion (tabla en DB relacionales), si no existe la crea, si existe obtiene la informacion
const db = getFirestore();
const usuariosCollection = db.collection('usuarios');

app.use(bodyParser.json()); 

/* ==========> Operaciones CRUD <========== */

// 1.- insertar usuarios nuevos 
app.post('/usuarios', async (req, res) => {
   try {
      const newUser = req.body; // Almacenamos todo el objeto que llegue mediante el body
      const userRef = await usuariosCollection.add(newUser);
      res.status(201).json({
         id: userRef.id,
         ...newUser
      })
   } catch (err) {
      res.status(400).json({
         err: 'No se puede crear el usuario'
      })
   }
});

// 2.- Leer todos los usuarios
app.get('/usuarios', async (req, res) => {
   try {
         // Obtener la coleccion con la que estamos trabajando:
         const coleccionUsuarios = await usuariosCollection.get();
         const usuarios = coleccionUsuarios.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
         }))
         res.status(200).json(usuarios);
      } catch (err) {
         res.status(400).json({
            err: 'No se pueden leer los usuarios'
      })
   }
});

// 3.- Leer usuarios por ID
app.get('/usuarios/:id', async (req, res) => { // se coloca :id porque nosotros vamos a escribir el ID que necesitamos leer
   try { 
      const userId =  req.params.id;
      const userDoc = await usuariosCollection.doc(userId).get();
      if(!userDoc) {
         res.status(404).json({
            err: 'El usuario no fue encontrado'
         })
      } else {
         res.json({
            id: userDoc.id,
            ...userDoc.data() // Retorna el usuario encontrado con el ID
         })
      }
      
   } catch (err) {
      res.status(400).json({
         err: 'No se pueden leer los usuarios'
      })
   }
});

// 4.- Eliminar por ID
app.delete('/usuarios/:id', async(req, res) => {
   try {
      const userId = req.params.id;
      await usuariosCollection.doc(userId).delete();
      res.status(200).json({
         message: 'El usuario fue borrado con éxito'
      })

   } catch (err) {
      res.status(400).json({
         err: 'No se pueden leer los usuarios'
      });
   }
});

// 5.- Modificar usuario por ID
app.put('/usuarios/:id', async (req, res) => {
   // Desde el front se manda el objeto con la informacion actualizada! Para que se sust en la db
   try {
      const userId = req.params.id;
      const updateUser = req.body;
      await usuariosCollection.doc(userId).set(updateUser, {
         merge: true
      })
      res.status(200).json({
         id: userId,
         ...updateUser
      }) // Retornamos el ID y el nuevo usuario
   } catch (err) {
      res.status(400).json({
         err: 'No se puede actualizar el usuario'
      });
   }
});

/* Inicializar servidor para la escucha de peticiones */
app.listen(PORT, () => {
   console.log(`Servidor trabajando en: ${PORT}`);
});