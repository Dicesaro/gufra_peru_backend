import express from 'express'
import {
  registerUser,
  loginUser,
  requestPasswordReset,
  verifyRecoveryCode,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
} from '../controllers/userController.js'
import { protectRoute } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/verify', protectRoute, (req, res) => {
  console.log('req.user.id', req.user.id)
  console.log('req.user.role', req.user.role)
  res.json({ id: req.user.id, role: req.user.role })
})

// Rutas de autenticación
router.post('/register', registerUser) // Registrar usuario
router.post('/login', loginUser) // Iniciar sesión

// Rutas de recuperación de contraseña
router.post('/forgot-password', requestPasswordReset) // Enviar código
router.post('/verify-code', verifyRecoveryCode) // Verificar código
router.post('/reset-password', resetPassword) // Cambiar contraseña

// Nueva ruta para obtener usuarios
router.get('/', getUsers)

// Ruta para eliminar usuario
router.delete('/:id', deleteUser)

// Ruta para actualizar usuario
router.put('/:id', updateUser)

export default router
