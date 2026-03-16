const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar las rutas que crearemos en el siguiente paso
const estudianteRoutes = require('./src/routes/estudianteRoutes');

const app = express();

// Middlewares requeridos por el examen [cite: 26]
app.use(cors()); // Habilita comunicación con Angular [cite: 26]
app.use(express.json()); // Permite leer datos JSON en el cuerpo de las peticiones

// Rutas de la API 
app.use('/api/estudiantes', estudianteRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor del Examen funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});