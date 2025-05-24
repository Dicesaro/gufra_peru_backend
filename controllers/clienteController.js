import {
  createCliente,
  getClienteByDniRuc,
  getAllClientes,
  getTotalComprasByCliente,
  getClienteById,
  updateClienteById,
  deleteClienteById,
} from '../models/clienteModel.js'

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const clientes = await getAllClientes()
    res.json(clientes)
  } catch (error) {
    console.error('❌ Error en getClientes:', error)
    res.status(500).json({ message: 'Error al obtener clientes' })
  }
}

// Obtener cliente por ID
export const getCliente = async (req, res) => {
  const { id_cliente } = req.params

  try {
    const cliente = await getClienteById(id_cliente)
    if (!cliente) {
      return res
        .status(404)
        .json({ message: 'Cliente no encontrado' })
    }
    res.json(cliente)
  } catch (error) {
    console.error('❌ Error en getCliente:', error)
    res.status(500).json({ message: 'Error al obtener cliente' })
  }
}

// Obtener total de compras de un cliente
export const getTotalCompras = async (req, res) => {
  const { id_cliente } = req.params

  try {
    const total = await getTotalComprasByCliente(id_cliente)
    res.json({ total_compras: total })
  } catch (error) {
    console.error('❌ Error en getTotalCompras:', error)
    res
      .status(500)
      .json({ message: 'Error al obtener total de compras' })
  }
}

// Crear cliente
export const registerCliente = async (req, res) => {
  const { dni_ruc_cliente, nombre, telefono, total_compras } =
    req.body

  try {
    const clienteExists = await getClienteByDniRuc(dni_ruc_cliente)
    if (clienteExists) {
      return res.status(400).json({ message: 'El cliente ya existe' })
    }

    await createCliente(
      dni_ruc_cliente,
      nombre,
      telefono,
      total_compras
    )
    res
      .status(201)
      .json({ message: 'Cliente registrado exitosamente' })
  } catch (error) {
    console.error('❌ Error en registerCliente:', error)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}

// Actualizar cliente
export const updateCliente = async (req, res) => {
  const { id_cliente } = req.params
  const { nombre, telefono, total_compras } = req.body

  try {
    await updateClienteById(
      id_cliente,
      nombre,
      telefono,
      total_compras
    )
    res.json({ message: 'Cliente actualizado correctamente' })
  } catch (error) {
    console.error('❌ Error en updateCliente:', error)
    res.status(500).json({ message: 'Error al actualizar cliente' })
  }
}

// Eliminar cliente
export const deleteCliente = async (req, res) => {
  const { id_cliente } = req.params

  try {
    await deleteClienteById(id_cliente)
    res.json({ message: 'Cliente eliminado correctamente' })
  } catch (error) {
    console.error('❌ Error en deleteCliente:', error)
    res.status(500).json({ message: 'Error al eliminar cliente' })
  }
}
