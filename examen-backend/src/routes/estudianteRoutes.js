const express = require('express');
const router = express.Router();
const controller = require('../controllers/estudianteController');

router.get('/', controller.obtenerEstudiantes); // Listar, buscar y paginar
router.post('/', controller.crearEstudiante);   // Crear nuevo
router.put('/:id', controller.actualizarEstudiante);   // Actualizar existente
router.delete('/:id', controller.eliminarEstudiante);  // Eliminar

module.exports = router;