import express from 'express';
import { requestPasswordReset } from '../controllers/email.controller.js';
import { resetPassword } from '../controllers/reset.password.controller.js';


const router = express.Router();

// Ruta para solicitar un correo de recuperación de contraseña
router.post('/forgot-password', requestPasswordReset);

// Ruta para mostrar la página de restablecimiento de contraseña
router.get('/reset-password', (req, res) => {
    const { token } = req.query;
    res.render('resetPassword', { token });
  });
  
  // Renderiza una vista para que el usuario pueda solicitar un nuevo correo para reestablecer la contraseña
  router.get('/request-new-reset-email', (req, res) => {
    
    res.render('requestNewResetEmail');
});

// Ruta para restablecer la contraseña usando un enlace de recuperación
router.post('/reset-password', resetPassword);

export default router;