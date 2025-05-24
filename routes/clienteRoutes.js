import express from 'express'
import {
  registerCliente,
  getClientes,
  updateCliente,
  deleteCliente,
  getCliente,
  getTotalCompras,
} from '../controllers/clienteController.js'

const router = express.Router()

router.post('/', registerCliente) // Crear cliente
router.get('/', getClientes) // Obtener todos los clientes
router.get('/:id_cliente', getCliente) // Obtener cliente por ID
router.get('/:id_cliente/total_compras/', getTotalCompras) // Obtener total de compras por cliente
router.put('/:id_cliente', updateCliente) // Actualizar cliente
router.delete('/:id_cliente', deleteCliente) // Eliminar cliente

export default router
