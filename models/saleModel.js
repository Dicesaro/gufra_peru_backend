import { pool } from '../config/db.js'

// Obtener todas las ventas (ahora JOIN con detalle_venta y productos)
export const getAllSales = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        v.id_venta, v.vendedor, c.nombre AS cliente, v.dni_cliente,
        v.fecha_venta, v.tipo_comprobante, v.numero_comprobante,
        dv.producto_id, p.name AS producto, p.precio_venta, dv.cantidad
      FROM ventas v
      JOIN clientes c ON v.id_cliente = c.id_cliente
      JOIN detalle_venta dv ON v.id_venta = dv.id_venta
      JOIN productos p ON dv.producto_id = p.id_producto
    `)
    return rows
  } catch (error) {
    console.error('Error en getAllSales:', error)
    throw error
  }
}

// Obtener una venta por ID (incluyendo sus productos)
export const getSaleById = async (id_venta) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT 
        v.id_venta, v.vendedor, c.nombre AS cliente, v.dni_cliente,
        v.fecha_venta, v.tipo_comprobante, v.numero_comprobante,
        dv.producto_id, p.name AS producto, dv.cantidad
      FROM ventas v
      JOIN clientes c ON v.id_cliente = c.id_cliente
      JOIN detalle_venta dv ON v.id_venta = dv.id_venta
      JOIN productos p ON dv.producto_id = p.id_producto
      WHERE v.id_venta = ?
    `,
      [id_venta]
    )
    return rows
  } catch (error) {
    console.error('Error en getSaleById:', error)
    throw error
  }
}

// Crear una nueva venta (y sus detalles)
export const createSale = async (ventaData, detalles) => {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    // Insertar en ventas
    const [ventaResult] = await connection.execute(
      `
        INSERT INTO ventas (vendedor, id_cliente, dni_cliente, fecha_venta, tipo_comprobante, numero_comprobante)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        ventaData.vendedor ?? null,
        ventaData.id_cliente ?? null,
        ventaData.dni_cliente ?? null,
        ventaData.fecha_venta ?? null,
        ventaData.tipo_comprobante ?? null,
        ventaData.numero_comprobante ?? null,
      ]
    )

    const id_venta = ventaResult.insertId

    // Insertar detalles y actualizar stock
    for (const detalle of detalles) {
      // Insertar detalle de venta
      await connection.execute(
        `
          INSERT INTO detalle_venta (id_venta, producto_id, cantidad)
          VALUES (?, ?, ?)
        `,
        [id_venta, detalle.producto_id, detalle.cantidad]
      )

      // Verificar stock actual
      const [productoResult] = await connection.execute(
        'SELECT quantity FROM productos WHERE id_producto = ?',
        [detalle.producto_id]
      )

      if (productoResult.length === 0) {
        throw new Error(
          `Producto con ID ${detalle.producto_id} no encontrado`
        )
      }

      const stockActual = productoResult[0].quantity

      if (stockActual < detalle.cantidad) {
        throw new Error(
          `Stock insuficiente para el producto ID ${detalle.producto_id}`
        )
      }

      // Actualizar stock
      const stockNuevo = stockActual - detalle.cantidad
      await connection.execute(
        'UPDATE productos SET quantity = quantity - ? WHERE id_producto = ?',
        [detalle.cantidad, detalle.producto_id]
      )

      // Registrar el cambio en historial_stock
      await connection.execute(
        `
         INSERT INTO historial_stock (id_producto, cantidad_anterior, cantidad_nueva, movimiento, fecha)
         VALUES (?, ?, ?, 'Venta', NOW())
         `,
        [detalle.producto_id, stockActual, stockNuevo]
      )
    }

    await connection.commit()
    return { id_venta, ...ventaData, detalles }
  } catch (error) {
    await connection.rollback()
    console.error('Error en createSale:', error)
    throw error
  } finally {
    connection.release()
  }
}

// Eliminar venta (incluyendo detalle_venta por FK ON DELETE CASCADE o manualmente)
export const deleteSale = async (id_venta) => {
  try {
    await pool.execute(
      'DELETE FROM detalle_venta WHERE id_venta = ?',
      [id_venta]
    )
    await pool.execute('DELETE FROM ventas WHERE id_venta = ?', [
      id_venta,
    ])
  } catch (error) {
    console.error('Error en deleteSale:', error)
    throw error
  }
}
