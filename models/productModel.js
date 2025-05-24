import { pool } from '../config/db.js'

// Obtener todos los productos
export const getAllProducts = async () => {
  const [rows] = await pool.execute('SELECT * FROM productos')
  return rows
}

// Obtener un producto por ID
export const getProductById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM productos WHERE id_producto = ?',
    [id]
  )
  return rows[0]
}

// Crear un nuevo producto
export const createProduct = async ({
  name,
  code,
  category,
  quantity,
  precio_compra,
  precio_venta,
}) => {
  const [result] = await pool.execute(
    'INSERT INTO productos (name, code, category, quantity, precio_compra, precio_venta) VALUES (?, ?, ?, ?, ?, ?)',
    [name, code, category, quantity, precio_compra, precio_venta]
  )
  return {
    id: result.insertId,
    name,
    code,
    category,
    quantity,
    precio_compra,
    precio_venta,
  }
}

// Actualizar un producto
export const updateProduct = async (
  id,
  { name, code, category, quantity, precio_compra, precio_venta }
) => {
  await pool.execute(
    'UPDATE productos SET name = ?, code = ?, category = ?, quantity = ?, precio_compra = ?, precio_venta = ? WHERE id_producto = ?',
    [name, code, category, quantity, precio_compra, precio_venta, id]
  )
  return {
    id,
    name,
    code,
    category,
    quantity,
    precio_compra,
    precio_venta,
  }
}

export const insertHistorialStock = async ({
  id_producto,
  cantidad_anterior,
  cantidad_nueva,
}) => {
  await pool.execute(
    'INSERT INTO historial_stock (id_producto, cantidad_anterior, cantidad_nueva) VALUES (?, ?, ?)',
    [id_producto, cantidad_anterior, cantidad_nueva]
  )
}

// Eliminar un producto
export const deleteProduct = async (id) => {
  await pool.execute(
    'DELETE FROM historial_stock WHERE id_producto = ?',
    [id]
  )

  await pool.execute('DELETE FROM productos WHERE id_producto = ?', [
    id,
  ])
}

export const getHistorialStockByProductId = async (id_producto) => {
  const [rows] = await pool.execute(
    'SELECT * FROM historial_stock WHERE id_producto = ? ORDER BY fecha DESC',
    [id_producto]
  )
  return rows
}
