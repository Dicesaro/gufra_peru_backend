import { pool } from '../config/db.js'

// Obtener cliente por DNI/RUC
export const getClienteByDniRuc = async (dni_ruc_cliente) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM clientes WHERE dni_ruc_cliente = ?',
      [dni_ruc_cliente]
    )
    return rows[0]
  } catch (error) {
    console.error('❌ Error en getClienteByDniRuc:', error)
    throw error
  }
}

// Obtener todos los clientes
export const getAllClientes = async () => {
  try {
    const [rows] = await pool.execute('SELECT * FROM clientes')
    return rows
  } catch (error) {
    console.error('❌ Error en getAllClientes:', error)
    throw error
  }
}

// Obtener total de compras (monto gastado) por cliente
export const getTotalComprasByCliente = async (id_cliente) => {
  try {
    const [rows] = await pool.execute(
      `
       SELECT SUM(p.precio_venta * dv.cantidad) AS total_compras
       FROM ventas v
       JOIN detalle_venta dv ON v.id_venta = dv.id_venta
       JOIN productos p ON dv.producto_id = p.id_producto
       WHERE v.id_cliente = ?
       `,
      [id_cliente]
    )

    return rows[0]?.total_compras || 0
  } catch (error) {
    console.error('❌ Error en getTotalComprasByCliente:', error)
    throw error
  }
}

// Obtener cliente por ID
export const getClienteById = async (id_cliente) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM clientes WHERE id_cliente = ?',
      [id_cliente]
    )
    return rows[0]
  } catch (error) {
    console.error('❌ Error en getClienteById:', error)
    throw error
  }
}

// Crear cliente
export const createCliente = async (
  dni_ruc_cliente,
  nombre,
  telefono,
  total_compras = 0
) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO clientes (dni_ruc_cliente, nombre, telefono, total_compras) VALUES (?, ?, ?, ?)',
      [dni_ruc_cliente, nombre, telefono, total_compras]
    )
    return result
  } catch (error) {
    console.error('❌ Error en createCliente:', error)
    throw error
  }
}

// Actualizar cliente
export const updateClienteById = async (
  id_cliente,
  nombre,
  telefono,
  total_compras
) => {
  try {
    await pool.execute(
      'UPDATE clientes SET nombre = ?, telefono = ?, total_compras = ? WHERE id_cliente = ?',
      [nombre, telefono, total_compras, id_cliente]
    )
  } catch (error) {
    console.error('❌ Error en updateClienteById:', error)
    throw error
  }
}

// Eliminar cliente
export const deleteClienteById = async (id_cliente) => {
  try {
    await pool.execute('DELETE FROM clientes WHERE id_cliente = ?', [
      id_cliente,
    ])
  } catch (error) {
    console.error('❌ Error en deleteClienteById:', error)
    throw error
  }
}
