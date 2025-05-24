import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'

export const protectRoute = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({ message: 'No autorizado, token faltante' })
  }

  try {
    console.log('Token recibido:', token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Token decodificado', decoded)

    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [decoded.id]
    )
    const user = rows[0]
    console.log('User from DB:', user)
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Usuario no encontrado' })
    }
    req.user = user
    console.log('Usuario autenticado:', req.user)
    next()
  } catch (error) {
    console.log('Error al obtener el usuario de la DB:', error)
    res.status(401).json({ message: 'Token inválido' })
  }
}
