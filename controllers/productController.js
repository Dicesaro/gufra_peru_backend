import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  insertHistorialStock,
  getHistorialStockByProductId,
} from '../models/productModel.js'

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts()
    res.json(products)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener productos', error })
  }
}

// Obtener un producto por ID
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await getProductById(id)

    if (!product) {
      return res
        .status(404)
        .json({ message: 'Producto no encontrado' })
    }

    res.json(product)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener producto', error })
  }
}

// Crear un producto
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      code,
      category,
      precio_compra,
      precio_venta,
      quantity,
    } = req.body
    const newProduct = await createProduct({
      name,
      code,
      category,
      precio_compra,
      precio_venta,
      quantity,
    })
    res.status(201).json(newProduct)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al agregar producto', error })
  }
}

// Actualizar un producto
export const editProduct = async (req, res) => {
  try {
    const id = req.params.id
    const {
      name,
      code,
      category,
      quantity,
      precio_compra,
      precio_venta,
    } = req.body

    console.log('Intentando actualizar producto con ID:', id)
    console.log('Datos de actualización:', {
      name,
      code,
      category,
      quantity,
      precio_compra,
      precio_venta,
    })

    const product = await getProductById(id)
    if (!product) {
      return res
        .status(404)
        .json({ message: 'Producto no encontrado' })
    }

    // ✅ Guardar historial si cambió la cantidad
    if (product.quantity !== quantity) {
      await insertHistorialStock({
        id_producto: id,
        cantidad_anterior: product.quantity,
        cantidad_nueva: quantity,
      })
    }

    const updatedProduct = await updateProduct(id, {
      name,
      code,
      category,
      quantity,
      precio_compra,
      precio_venta,
    })

    res.json(updatedProduct)
  } catch (error) {
    console.error('Error al actualizar producto:', error)
    res.status(500).json({
      message: 'Error al actualizar producto',
      error: error.message,
    })
  }
}

// Eliminar un producto
export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params

    const product = await getProductById(id)
    if (!product) {
      return res
        .status(404)
        .json({ message: 'Producto no encontrado' })
    }

    await deleteProduct(id)
    res.json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    console.log('Error al eliminar producto:', error)
    res
      .status(500)
      .json({ message: 'Error al eliminar producto', error })
  }
}

export const getProductStockHistory = async (req, res) => {
  try {
    const { id } = req.params

    const product = await getProductById(id)
    if (!product) {
      return res
        .status(404)
        .json({ message: 'Producto no encontrado' })
    }

    const historial = await getHistorialStockByProductId(id)
    res.json(historial)
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al obtener historial de stock', error })
  }
}
