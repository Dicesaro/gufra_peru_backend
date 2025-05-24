import { pool } from '../config/db.js'

// Obtener todos los problemas
export const getAllProblemas = async () => {
  const [rows] = await pool.execute(`
        SELECT problemas.id, problemas.nombre, problemas.producto_id, 
               problemas.descripcion, problemas.cantidad, problemas.fecha_reporte,problemas.fecha_resolucion,
               productos.name AS producto_nombre
        FROM problemas
        JOIN productos ON problemas.producto_id = productos.id_producto
    `)
  return rows
}

// Obtener un problema por ID
export const getProblemaById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM problemas WHERE id = ?',
    [id]
  )
  return rows[0]
}

// Crear un nuevo problema
export const createProblema = async ({
  nombre,
  producto_id,
  descripcion,
  cantidad,
  fecha_reporte,
}) => {
  const [result] = await pool.execute(
    'INSERT INTO problemas (nombre, producto_id, descripcion, cantidad, fecha_reporte) VALUES (?, ?, ?, ?, ?, ?)',
    [
      nombre,
      producto_id,
      descripcion,
      cantidad,
      fecha_reporte,
      fecha_resolucion,
    ]
  )
  return {
    id: result.insertId,
    nombre,
    producto_id,
    descripcion,
    cantidad,
    fecha_reporte,
    fecha_resolucion,
  }
}

// Actualizar un problema
export const updateProblema = async (
  id,
  {
    nombre,
    producto_id,
    descripcion,
    cantidad,
    fecha_reporte,
    fecha_resolucion,
  }
) => {
  await pool.execute(
    'UPDATE problemas SET nombre = ?, producto_id = ?, descripcion = ?, cantidad = ?, fecha_reporte = ?, fecha_resolucion = ? WHERE id = ?',
    [
      nombre,
      producto_id,
      descripcion,
      cantidad,
      fecha_reporte,
      fecha_resolucion,
      id,
    ]
  )
  return {
    id,
    nombre,
    producto_id,
    descripcion,
    cantidad,
    fecha_reporte,
  }
}

// Eliminar un problema
export const deleteProblema = async (id) => {
  await pool.execute('DELETE FROM problemas WHERE id = ?', [id])
}
