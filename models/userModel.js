import { pool } from '../config/db.js'

// Crear usuario
export const createUser = async (
  name,
  email,
  hashedPassword,
  role
) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'Usuario']
    )
    return result
  } catch (error) {
    console.error('❌ Error en createUser:', error)
    throw error
  }
}
// Buscar usuario por email
export const getUserByEmail = async (email) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )
    return rows[0] // Retorna el primer usuario encontrado
  } catch (error) {
    console.error('❌ Error en getUserByEmail:', error)
    throw error
  }
}

// Guardar código de recuperación en la BD
export const updateRecoveryCode = async (email, recoveryCode) => {
  try {
    await pool.execute(
      'UPDATE users SET recovery_code = ? WHERE email = ?',
      [recoveryCode, email]
    )
  } catch (error) {
    console.error('❌ Error en updateRecoveryCode:', error)
    throw error
  }
}

// Actualizar contraseña después de verificación
export const updatePassword = async (email, newPassword) => {
  try {
    await pool.execute(
      'UPDATE users SET password = ?, recovery_code = NULL WHERE email = ?',
      [newPassword, email]
    )
  } catch (error) {
    console.error('❌ Error en updatePassword:', error)
    throw error
  }
}

// Obtener todos los usuarios
export const getAllUsers = async () => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role FROM users'
    )
    return rows
  } catch (error) {
    console.error('❌ Error en getAllUsers:', error)
    throw error
  }
}

// Eliminar usuario de la base de datos
export const deleteUserById = async (id) => {
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [id])
  } catch (error) {
    console.error('❌ Error en deleteUserById:', error)
    throw error
  }
}
