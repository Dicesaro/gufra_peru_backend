import {
  getAllSales,
  getSaleById,
  createSale,
  deleteSale,
} from '../models/saleModel.js'

// Obtener todas las ventas
export const getSales = async (req, res) => {
  try {
    const sales = await getAllSales()
    res.json(sales)
  } catch (error) {
    console.error('Error al obtener ventas:', error)
    res.status(500).json({
      message: 'Error al obtener ventas',
      error: error.message,
    })
  }
}

// Obtener una venta por ID
export const getSale = async (req, res) => {
  try {
    const { id } = req.params
    const sale = await getSaleById(id)

    if (!sale || sale.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' })
    }

    res.json(sale)
  } catch (error) {
    console.error('Error al obtener venta:', error)
    res.status(500).json({
      message: 'Error al obtener venta',
      error: error.message,
    })
  }
}

// Crear una nueva venta
export const addSale = async (req, res) => {
  try {
    const {
      vendedor,
      id_cliente,
      dni_cliente,
      fecha_venta,
      tipo_comprobante,
      numero_comprobante,
      detalles,
    } = req.body

    if (
      !vendedor ||
      !id_cliente ||
      !dni_cliente ||
      !fecha_venta ||
      !tipo_comprobante ||
      !numero_comprobante ||
      !detalles ||
      !Array.isArray(detalles) ||
      detalles.length === 0
    ) {
      return res.status(400).json({
        message:
          'Todos los campos son obligatorios y detalles debe ser un array',
      })
    }

    const newSale = await createSale(
      {
        vendedor,
        id_cliente,
        dni_cliente,
        fecha_venta,
        tipo_comprobante,
        numero_comprobante,
      },
      detalles
    )

    res.status(201).json(newSale)
  } catch (error) {
    console.error('Error al agregar venta:', error)
    res.status(500).json({
      message: 'Error al agregar venta',
      error: error.message,
    })
  }
}

// Eliminar venta
export const removeSale = async (req, res) => {
  try {
    const { id } = req.params
    const sale = await getSaleById(id)

    if (!sale || sale.length === 0) {
      return res.status(404).json({ message: 'Venta no encontrada' })
    }

    await deleteSale(id)
    res.json({ message: 'Venta eliminada correctamente' })
  } catch (error) {
    console.error('Error al eliminar venta:', error)
    res.status(500).json({
      message: 'Error al eliminar venta',
      error: error.message,
    })
  }
}
