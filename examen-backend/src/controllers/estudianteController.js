const db = require('../config/db');

// GET: Obtener todos (Con búsqueda y paginación)
exports.obtenerEstudiantes = async (req, res) => {
    try {
        const { search, page = 1, limit = 5 } = req.query;
        const offset = (page - 1) * parseInt(limit);

        let query = "SELECT * FROM estudiantes";
        let countQuery = "SELECT COUNT(*) as total FROM estudiantes";
        let params = [];
        let countParams = [];

        if (search) {
            const whereClause = " WHERE nombre LIKE ? OR carnet LIKE ? OR email LIKE ?";
            query += whereClause;
            countQuery += whereClause;
            const term = `%${search}%`;
            params = [term, term, term];
            countParams = [term, term, term];
        }

        query += " LIMIT ? OFFSET ?";
        params.push(parseInt(limit), offset);

        const [rows] = await db.query(query, params);
        const [countResult] = await db.query(countQuery, countParams);
        const total = countResult[0].total;

        res.json({ data: rows, total });
    } catch (error) {
        res.status(500).json({ error: "Error en el servidor" });
    }
};

// POST: Crear estudiante con validaciones
exports.crearEstudiante = async (req, res) => {
    const { nombre, carnet, email, carrera, semestre, estado } = req.body;

    if (!nombre || nombre.length < 3) {
        return res.status(400).json({ error: "El nombre debe tener al menos 3 caracteres" });
    }
    if (semestre < 1 || semestre > 12) {
        return res.status(400).json({ error: "El semestre debe estar entre 1 y 12" });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO estudiantes (nombre, carnet, email, carrera, semestre, estado) VALUES (?, ?, ?, ?, ?, ?)",
            [nombre, carnet, email, carrera, semestre, estado || 'Activo']
        );
        res.status(201).json({ mensaje: "Estudiante creado exitosamente", id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: "Error al crear (Carné duplicado)" });
    }
};

// PUT: Actualizar estudiante
exports.actualizarEstudiante = async (req, res) => {
    const { id } = req.params;
    const { nombre, carnet, email, carrera, semestre, estado } = req.body;

    if (!nombre || nombre.length < 3) {
        return res.status(400).json({ error: "El nombre debe tener al menos 3 caracteres" });
    }
    if (semestre < 1 || semestre > 12) {
        return res.status(400).json({ error: "El semestre debe estar entre 1 y 12" });
    }

    try {
        const [result] = await db.query(
            "UPDATE estudiantes SET nombre=?, carnet=?, email=?, carrera=?, semestre=?, estado=? WHERE id=?",
            [nombre, carnet, email, carrera, semestre, estado, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }
        res.json({ mensaje: "Estudiante actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar estudiante" });
    }
};

// DELETE: Eliminar estudiante
exports.eliminarEstudiante = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query("DELETE FROM estudiantes WHERE id=?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Estudiante no encontrado" });
        }
        res.json({ mensaje: "Estudiante eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar estudiante" });
    }
};