import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'
import crypto from 'crypto' // Agrega esto para generar códigos aleatorios
import { sendRecoveryEmail } from '../config/emailService.js'
import {
  updateRecoveryCode,
  getUserByEmail,
  updatePassword,
  createUser,
  getAllUsers,
  deleteUserById,
} from '../models/userModel.js'

// Registrar usuario
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    const userExists = await getUserByEmail(email)
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await createUser(name, email, hashedPassword, role)

    res
      .status(201)
      .json({ message: 'Usuario registrado exitosamente' })
  } catch (error) {
    console.error('❌ Error en registerUser:', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Login usuario
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await getUserByEmail(email)
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Usuario no encontrado' })
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Contraseña incorrecta' })
    }

    // Generar Token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    )

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('❌ Error en loginUser:', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Solicitar restablecimiento de contraseña
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body

  try {
    const user = await getUserByEmail(email)
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Usuario no encontrado' })
    }

    // Generar un código aleatorio de 6 dígitos
    const recoveryCode = crypto.randomInt(100000, 999999).toString()

    // Guardar código en la BD
    await updateRecoveryCode(email, recoveryCode)

    // Enviar email con el código
    await sendRecoveryEmail(email, recoveryCode)

    res.json({ message: 'Código de recuperación enviado al correo' })
  } catch (error) {
    console.error('❌ Error en requestPasswordReset:', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Verificar código de recuperación
export const verifyRecoveryCode = async (req, res) => {
  const { email, code } = req.body

  try {
    const user = await getUserByEmail(email)
    if (!user || user.recovery_code !== code) {
      return res.status(400).json({ message: 'Código inválido' })
    }

    res.json({ message: 'Código verificado correctamente' })
  } catch (error) {
    console.error('❌ Error en verifyRecoveryCode:', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Restablecer contraseña
export const resetPassword = async (req, res) => {
  console.log('Body recibido en resetPassword:', req.body) // 👀 Ver qué datos se envían

  const { email, code, newPassword } = req.body

  try {
    const user = await getUserByEmail(email)
    console.log('Usuario encontrado:', user) // 👀 Ver datos del usuario
    console.log('Código ingresado:', code)
    console.log('Código almacenado en BD:', user?.recovery_code)

    if (!user || user.recovery_code !== code) {
      return res.status(400).json({ message: 'Código inválido' })
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await updatePassword(email, hashedPassword)

    res.json({ message: 'Contraseña restablecida correctamente' })
  } catch (error) {
    console.error('❌ Error en resetPassword:', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios' })
  }
}

// Eliminar usuario por ID
export const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    await deleteUserById(id)
    res.json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    console.error('❌ Error en deleteUser:', error)
    res.status(500).json({ message: 'Error al eliminar usuario' })
  }
}

// Actualizar usuario por ID
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, role } = req.body

    console.log(`🔍 Buscando usuario con ID: ${id}`)

    // Verificar si el usuario existe antes de actualizarlo
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    )
    const user = rows[0]

    if (!user) {
      return res
        .status(404)
        .json({ message: 'Usuario no encontrado' })
    }

    console.log(`✅ Usuario encontrado:`, user)

    // Actualizar el usuario en la base de datos
    await pool.execute(
      'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?',
      [name || user.name, email || user.email, role || user.role, id]
    )

    console.log(`✅ Usuario actualizado correctamente`)

    res.json({
      message: 'Usuario actualizado correctamente',
      user: {
        id,
        name: name || user.name,
        email: email || user.email,
        role: role || user.role,
      },
    })
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error)
    res
      .status(500)
      .json({ message: 'Error al actualizar usuario', error })
  }
}
