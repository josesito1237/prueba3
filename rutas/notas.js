const express = require('express');
const db = require('../config/conexion'); // Asegúrate de que la ruta es correcta
const router = express.Router();

// Middleware para verificar si el usuario está autenticado
function verificarSesion(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Ruta para mostrar las notas
router.get('/', verificarSesion, (req, res) => {
    const query = 'SELECT * FROM notas WHERE user_id = ?';
    db.query(query, [req.session.user.id], (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener notas');
        }
        res.render('notas', { notas: results });
    });
});

// Ruta para agregar una nueva nota
router.post('/agregar', verificarSesion, (req, res) => {
    const { titulo, contenido, fecha_entrega } = req.body;
    const query = 'INSERT INTO notas (titulo, contenido, fecha_entrega, user_id) VALUES (?, ?, ?, ?)';
    db.query(query, [titulo, contenido, fecha_entrega, req.session.user.id], (error) => {
        if (error) {
            return res.status(500).send('Error al agregar nota');
        }
        res.redirect('/notas');
    });
});

// Ruta para actualizar una nota
router.post('/editar/:id_notas', verificarSesion, (req, res) => {
    const { id_notas } = req.params;
    const { titulo, contenido, fecha_entrega } = req.body;

    const query = 'UPDATE notas SET titulo = ?, contenido = ?, fecha_entrega = ? WHERE id_notas = ? AND user_id = ?';
    db.query(query, [titulo, contenido, fecha_entrega, id_notas, req.session.user.id], (error) => {
        if (error) {
            return res.status(500).send('Error al actualizar la nota');
        }
        res.redirect('/notas');
    });
});

// Ruta para eliminar una nota
router.post('/eliminar/:id_notas', verificarSesion, (req, res) => {
    const { id_notas } = req.params;
    const query = 'DELETE FROM notas WHERE id_notas = ? AND user_id = ?';
    db.query(query, [id_notas, req.session.user.id], (error) => {
        if (error) {
            return res.status(500).send('Error al eliminar nota');
        }
        res.redirect('/notas');
    });
});

module.exports = router;