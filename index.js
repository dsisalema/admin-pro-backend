require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

//Crear el servidor de express

const app = express();

//Configurar CORS
app.use(cors());

//Lectura y parceo del body 
app.use( express.json() );

//Base de datos
dbConnection();

//Directorio público
app.use(express.static('public'));

console.log( process.env );
//david1975
//david1975
//mongodb+srv://david1975:david1975@cluster0.gwy9h.mongodb.net/hospitaldb
//Otro usuari
//mean_user
//cF6AfJFh28dQNNkM
//Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/hospitales', require('./routes/hospitales'));
app.use('/api/medicos', require('./routes/medicos'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/upload', require('./routes/uploads'));

app.listen(process.env.PORT, () =>{

    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});